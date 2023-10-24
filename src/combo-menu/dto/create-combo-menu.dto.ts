import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateComboMenuDto {
  @IsString()
  @IsNotEmpty()
  comboName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  comboItems: ComboItem[];

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;
}

export class ComboItem {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  menuItemId: number;

  @IsNotEmpty()
  @IsNumber()
  comboMenuId: number;
}
