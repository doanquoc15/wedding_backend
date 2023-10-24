import { IsNumberString, IsOptional } from "class-validator";

export class GetAllComboMenuDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;
}
