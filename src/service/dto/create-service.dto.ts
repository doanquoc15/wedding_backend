import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}