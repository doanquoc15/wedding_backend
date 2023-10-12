import { GENDER_ENUM_TYPE, POSITION_ENUM } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    employeeName : string;

    @IsString()
    @IsOptional()
    phone : string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    regency: string;
    
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    salary : number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    experience: number;

    @IsEnum(GENDER_ENUM_TYPE)
    @IsNotEmpty()
    gender: GENDER_ENUM_TYPE;

    @IsEnum(POSITION_ENUM)
    @IsNotEmpty()
    position: POSITION_ENUM
}
