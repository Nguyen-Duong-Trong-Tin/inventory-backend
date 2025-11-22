import { Controller, Get, Param } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';

@Controller({
  path: 'suggestions',
  version: '1',
})
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get('/export-product/:customerId')
  // @UseGuards(JwtAuthGuard)
  async exportProductByCustomerId(@Param('customerId') customerId: string) {
    return this.suggestionsService.exportProductByCustomerId({ customerId });
  }
}
