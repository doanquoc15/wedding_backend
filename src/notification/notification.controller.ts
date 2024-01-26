import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { FindAllNotificationDto } from "./dto/findAllNotification.dto";
import { RolesGuard } from "../common/guards/role.guard";
import { Public } from "../common/decorators";

@Controller("notification")
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notification: NotificationService) {}

  @Post()
  create(@Body() createNotification: CreateNotificationDto) {
    return this.notification.create(createNotification);
  }

  @Get()
  @Public()
  @UseGuards(RolesGuard)
  findAll(@Query() query: FindAllNotificationDto) {
    return this.notification.findAll(query);
  }

  @Get(":id")
  @Public()
  @UseGuards(RolesGuard)
  findOne(@Param("id") id: string) {
    return this.notification.findOne(id);
  }

  @Get("/user/:id")
  @Get(":id")
  @Public()
  findAllByUserId(@Param("id") id: string) {
    return this.notification.findAllByUser(+id);
  }

  @Get("/unread/:id")
  findAllUnReadByUserId(@Param("id") id: string) {
    return this.notification.findUnReadByUser(+id);
  }

  @Patch("/read-all/:id")
  updateReadAll(@Param("id") id: string, @Body() isRead) {
    return this.notification.updateReadAll(+id, isRead);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNotification: UpdateNotificationDto,
  ) {
    return this.notification.updated(+id, updateNotification);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.notification.remove(+id);
  }
}
