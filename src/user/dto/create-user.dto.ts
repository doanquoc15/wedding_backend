import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { GENDER_ENUM_TYPE } from "@prisma/client";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  roleId: number;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  dateOfBirth: any;

  @IsEnum(GENDER_ENUM_TYPE)
  @IsOptional()
  gender: GENDER_ENUM_TYPE;
}
