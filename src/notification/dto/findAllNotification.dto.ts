import { IsNumberString, IsOptional, IsString } from "class-validator";

export class FindAllNotificationDto {
  @IsNumberString()
  @IsOptional()
  pageSize: number | string;

  @IsNumberString()
  @IsOptional()
  pageIndex: number | string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumberString()
  userId: string | number;
}
