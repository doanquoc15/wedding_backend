import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllUsers {
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
