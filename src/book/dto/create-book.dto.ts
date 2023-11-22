import { STATUS_BOOKING } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateBookDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    numberOfGuest

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    numberTable

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    depositMoney: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    totalMoney: number;

    @IsNotEmpty()
    @IsString()
    toTime : string

    @IsArray()
    @IsNotEmpty()
    time : string[]

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    userId : number

    @IsNumber()
    @IsNotEmpty()
    serviceId: number

    @IsEnum(STATUS_BOOKING)
    @IsOptional()
    statusBooking: STATUS_BOOKING

    @IsNumber()
    @IsNotEmpty()
    zoneId: number

    @IsNumber()
    @IsNotEmpty()
    comboMenuId: number

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    fullName: string
}
