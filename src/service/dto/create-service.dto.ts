import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
