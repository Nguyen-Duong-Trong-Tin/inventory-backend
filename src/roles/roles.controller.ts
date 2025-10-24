import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleBodyDto } from './dto/create-role.dto';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { FindRolesQueryDto } from './dto/find-roles.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createRole(@Body() body: CreateRoleBodyDto) {
    return this.rolesService.createRole({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateRole(@Param('id') id: string, @Body() body: UpdateRoleBodyDto) {
    return this.rolesService.updateRole({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findRoles(@Query() query: FindRolesQueryDto) {
    return this.rolesService.findRoles({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findRoleById(@Param('id') id: string) {
    return this.rolesService.findOne({ filter: { _id: id } });
  }
}
