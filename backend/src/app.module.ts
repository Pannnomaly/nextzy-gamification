import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { RewardModule } from './reward/reward.module';

@Module({
  imports: [PrismaModule, UserModule, GameModule, RewardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
