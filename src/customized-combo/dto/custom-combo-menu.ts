import { IsNumberString, IsOptional } from "class-validator";

export class GetAllCustomizedComboMenuDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;
}
