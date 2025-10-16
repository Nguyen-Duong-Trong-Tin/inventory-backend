import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permisstion: string[];
}
