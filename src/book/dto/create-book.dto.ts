import { STATUS_BOOKING, STATUS_PAYMENT } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class CreateBookDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  numberOfGuest;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  numberTable;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  depositMoney: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalMoney: any;

  @IsNotEmpty()
  @IsString()
  toTime: string;

  @IsString()
  @IsNotEmpty()
  comeInAt: string;

  @IsString()
  @IsNotEmpty()
  comeOutAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsEnum(STATUS_BOOKING)
  @IsOptional()
  statusBooking: STATUS_BOOKING;

  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @IsNumber()
  @IsNotEmpty()
  comboMenuId: number;

  @IsEnum(STATUS_PAYMENT)
  @IsOptional()
  @IsNotEmpty()
  statusPayment: STATUS_PAYMENT;

  @IsOptional()
  comboItems: any;
}
