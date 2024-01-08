import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from "class-validator";

export class CreateCustomizedComboDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  comboMenuId: number;

  @IsNumber()
  @IsNotEmpty()
  bookingId: number;

  @IsArray()
  @IsOptional()
  comboItems: ComboItem[];
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
}
