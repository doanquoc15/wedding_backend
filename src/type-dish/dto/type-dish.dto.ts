import { IsNumberString, IsOptional } from "class-validator";

export class GetAllTypeDish {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;
}
