import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class GetAllMenuItem {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsNumber()
  @IsOptional()
  typeId: number;

  @IsOptional()
  @IsString()
  search: string;
}
