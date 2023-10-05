import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ default: "tuan@gmail.com" })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: "1234567" })
  @IsString()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ default: "Tuan Minh" })
  @IsString()
  name: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ default: "tuan@gmail.com" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: "1234567" })
  password: string;
}
