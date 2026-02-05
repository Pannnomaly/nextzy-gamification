import { Controller, Param, Post } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('claim/:rewardId')
  claimReward(@Param('rewardId') rewardId: string) {
    return this.rewardService.claimReward(rewardId);
  }
}
