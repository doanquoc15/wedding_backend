import { IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive, IsOptional } from 'class-validator';
export class CreateMenuDto {
  @IsNotEmpty()
  comboName: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  serviceId : number;

  @IsNotEmpty()
  @IsNumber()
  bookingId : number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalPrice: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  bookingFoods: number[];
}