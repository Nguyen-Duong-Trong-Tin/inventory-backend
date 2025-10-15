import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permisstion: string[];
}
