import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSummary() {
    let user = await this.prisma.user.findFirst({
      include: {
        rewards: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          totalScore: 0,
        },
        include: {
          rewards: true,
        },
      });
    }

    const rewards = await this.prisma.reward.findMany({
      orderBy: { checkpoint: 'asc' },
    });

    const rewardStatus = rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      checkpoint: reward.checkpoint,
      claimed: user.rewards.some(
        (userReward) => userReward.rewardId === reward.id,
      ),
    }));

    return {
      totalScore: user.totalScore,
      rewards: rewardStatus,
    };
  }
}
