import { IsNumberString, IsOptional } from "class-validator";

export class GetAllBookDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;
}
