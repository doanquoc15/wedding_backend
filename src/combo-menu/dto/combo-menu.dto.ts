import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllComboMenuDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsOptional()
  @IsString()
  search: string;
}
