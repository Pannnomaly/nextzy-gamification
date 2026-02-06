import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly DEMO_USER_ID = 'demo-user';

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('reset')
  async resetGame() {
    await this.prisma.$transaction([
      this.prisma.playHistory.deleteMany({
        where: { userId: this.DEMO_USER_ID },
      }),

      this.prisma.userReward.deleteMany({
        where: { userId: this.DEMO_USER_ID },
      }),

      this.prisma.user.update({
        where: { id: this.DEMO_USER_ID },
        data: { totalScore: 0 },
      }),
    ]);

    return {
      message: 'Game reset successfully!',
    };
  }
}
