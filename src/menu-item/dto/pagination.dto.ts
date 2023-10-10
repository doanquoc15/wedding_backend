import {  IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  readonly pageIndex: number = 1;

  @IsNumber()
  readonly pageSize: number = 10;
}