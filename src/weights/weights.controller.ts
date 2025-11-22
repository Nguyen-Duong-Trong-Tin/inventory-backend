import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { WeightsService } from './weights.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'weights',
  version: '1',
})
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async find() {
    return await this.weightsService.find({
      filter: {},
    });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async activeWeight(@Param('id') id: string) {
    return this.weightsService.activeWeight({ id });
  }
}
