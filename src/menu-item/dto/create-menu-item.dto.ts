import { IsNotEmpty, IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  dishName: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  typeId:number
}