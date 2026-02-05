import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly DEMO_USER_ID = 'demo-user';

  async claimReward(rewardId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: this.DEMO_USER_ID },
    });

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new BadRequestException('Reward not found!');
    }

    if (user.totalScore < reward.checkpoint) {
      throw new BadRequestException('Not enough score to claim this reward');
    }

    const alreadyClaimed = await this.prisma.userReward.findUnique({
      where: {
        userId_rewardId: {
          userId: this.DEMO_USER_ID,
          rewardId,
        },
      },
    });

    if (alreadyClaimed) {
      throw new BadRequestException('Reward already claimed');
    }

    await this.prisma.userReward.create({
      data: {
        userId: this.DEMO_USER_ID,
        rewardId,
      },
    });

    return {
      message: 'Reward claimed successfully',
      reward: {
        id: reward.id,
        name: reward.name,
        checkpoint: reward.checkpoint,
      },
    };
  }

  async getRewardHistory() {
    const histories = await this.prisma.userReward.findMany({
      where: {
        userId: this.DEMO_USER_ID,
      },
      include: {
        reward: true,
      },
      orderBy: {
        claimedAt: 'desc',
      },
    });

    return {
      items: histories.map((h) => ({
        id: h.id,
        rewardName: h.reward.name,
        checkPoint: h.reward.checkpoint,
        claimedAt: h.claimedAt,
      })),
    };
  }
}
