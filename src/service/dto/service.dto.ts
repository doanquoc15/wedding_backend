import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllService {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsString()
  @IsOptional()
  search: string;
}
