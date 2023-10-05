import { IsInt } from 'class-validator';

export class PaginationDto {
  @IsInt()
  readonly page: number =  1;

  @IsInt()
  readonly itemsPerPage:number = 10;
}