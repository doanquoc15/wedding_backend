import { IsNotEmpty, IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  comboName: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDecimal()
  totalPrice: number;


  @IsNotEmpty()
  @IsNumber()
  serviceId :number
}