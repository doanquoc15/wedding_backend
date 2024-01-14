import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeedbackDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  bookingId: number;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment: string;
}
