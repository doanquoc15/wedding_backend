import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTypeDishDto {
  @IsString()
  @IsNotEmpty()
  typeName: string;

  @IsString()
  @IsOptional()
  description: string;
}
