import { STATUS_BOOKING, STATUS_PAYMENT } from "@prisma/client";
import {
  IsEmail,
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
  @IsOptional()
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

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName: string;

  @IsEnum(STATUS_PAYMENT)
  @IsOptional()
  @IsNotEmpty()
  statusPayment: STATUS_PAYMENT;

  @IsNotEmpty()
  comboItems: any;
}
