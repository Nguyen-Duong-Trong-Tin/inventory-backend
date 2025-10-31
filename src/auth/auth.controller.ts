import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import IEmployee from 'src/employees/interfaces/employee.interface';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/employee')
  @UseGuards(LocalAuthGuard)
  loginEmployee(@Request() req) {
    const employee = req.user as IEmployee;
    return this.authService.loginEmployee({ employee });
  }

  @Get('/verify-access-token/employee')
  @UseGuards(JwtAuthGuard)
  verifyAccessTokenEmployee() {
    return {};
  }
}
