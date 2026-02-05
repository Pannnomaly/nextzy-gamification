import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly scoreOptions = [300, 500, 1000, 3000];

  async playGame() {
    const randomIndex = Math.floor(Math.random() * this.scoreOptions.length);
    const score = this.scoreOptions[randomIndex];

    let user = await this.prisma.user.findFirst();

    if (!user) {
      user = await this.prisma.user.create({
        data: { totalScore: 0 },
      });
    }

    await this.prisma.playHistory.create({
      data: {
        score,
        userId: user.id,
      },
    });

    const updatedScore = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        totalScore: {
          increment: score,
        },
      },
    });

    return {
      earnedScore: score,
      totalScore: updatedScore.totalScore,
    };
  }
}
