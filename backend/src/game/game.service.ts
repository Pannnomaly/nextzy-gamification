import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly scoreOptions = [300, 500, 1000, 3000];
  private readonly DEMO_USER_ID = 'demo-user';

  async playGame() {
    const MAX_SCORE = 10000;

    const randomIndex = Math.floor(Math.random() * this.scoreOptions.length);
    const earnedScore = this.scoreOptions[randomIndex];

    let user = await this.prisma.user.findUnique({
      where: { id: this.DEMO_USER_ID },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: this.DEMO_USER_ID,
          totalScore: 0,
        },
      });
    }

    const newTotalScore = Math.min(user.totalScore + earnedScore, MAX_SCORE);

    await this.prisma.playHistory.create({
      data: {
        score: earnedScore,
        userId: user.id,
      },
    });

    const updatedScore = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totalScore: newTotalScore,
      },
    });

    return {
      earnedScore,
      totalScore: updatedScore.totalScore,
      isMaxScoreReached: updatedScore.totalScore === MAX_SCORE,
    };
  }

  async getPlayHistory() {
    const histories = await this.prisma.playHistory.findMany({
      where: {
        userId: this.DEMO_USER_ID,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return {
      items: histories.map((h) => ({
        id: h.id,
        score: h.score,
        playedAt: h.createdAt,
      })),
    };
  }
}
