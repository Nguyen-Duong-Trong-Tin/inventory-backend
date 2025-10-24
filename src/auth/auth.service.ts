import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmployeesService } from 'src/employees/employees.service';
import IEmployee from 'src/employees/interfaces/employee.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateEmployee({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    return await this.employeesService.login({
      email,
      password,
    });
  }

  // POST /v1/employees/login/employee
  loginEmployee({ employee }: { employee: IEmployee }) {
    const payload = { email: employee.email, sub: employee._id.toString() };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
