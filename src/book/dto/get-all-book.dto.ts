import { IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";
import { STATUS_BOOKING } from "@prisma/client";

export class GetAllBookDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(STATUS_BOOKING)
  @IsOptional()
  statusBooking: STATUS_BOOKING;

  @IsString()
  @IsOptional()
  toTime: string;
}
