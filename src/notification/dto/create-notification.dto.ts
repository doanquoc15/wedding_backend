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
  @IsOptional()
  link: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isRead: boolean;

  @IsOptional()
  @IsEnum(TYPE_NOTIFICATION)
  type: TYPE_NOTIFICATION;

  @IsNumber()
  userId: number;
}
