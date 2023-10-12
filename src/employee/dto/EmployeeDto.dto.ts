import { POSITION_ENUM } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class EmployeeDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageIndex: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageSize: number;

  @IsNumber()
  @IsOptional()
  @IsEnum(POSITION_ENUM)
  position: number;

  @IsString()
  @IsOptional()
  search: string;
}