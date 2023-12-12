import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { TYPE_NOTIFICATION } from "@prisma/client";

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  isRead: boolean;

  @IsEnum(TYPE_NOTIFICATION)
  type: TYPE_NOTIFICATION;

  @IsNumber()
  userId: number;
}
