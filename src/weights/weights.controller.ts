import { Controller, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

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
  async activeWeight(@Param('id') id: string, @Req() req: Request) {
    // req.user được gắn bởi JwtAuthGuard sau khi verify token
    const employee = req.user as { userId: string; email: string };

    return this.weightsService.activeWeight({
      id,
      employee,
    });
  }
}