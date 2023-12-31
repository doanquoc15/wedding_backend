import { POSITION_ENUM } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class EmployeeDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsNumber()
  @IsOptional()
  @IsEnum(POSITION_ENUM)
  position: number;

  @IsString()
  @IsOptional()
  search: string;
}
