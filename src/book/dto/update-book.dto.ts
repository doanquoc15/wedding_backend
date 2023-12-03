import { PartialType } from "@nestjs/swagger";
import { CreateBookDto } from "./create-book.dto";
import { STATUS_BOOKING, STATUS_PAYMENT } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsEnum(STATUS_PAYMENT)
  @IsOptional()
  statusPayment: STATUS_PAYMENT;

  @IsEnum(STATUS_BOOKING)
  @IsOptional()
  statusBooking: STATUS_BOOKING;
}
