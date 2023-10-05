import { IsNotEmpty, IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  dishName: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  typeId:number

  @IsNotEmpty()
  @IsNumber()
  menuId:number
}