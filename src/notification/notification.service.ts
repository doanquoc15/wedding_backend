import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notifi = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        userId: createNotificationDto.userId,
        title: createNotificationDto.title,
        description: createNotificationDto.description,
        isRead: false,
        image: createNotificationDto.image,
        type: createNotificationDto.type,
      },
    });

    return notifi;
  }

  async findAllByUser(userId: number) {
    if (!userId) throw new Error("userId is required");

    return await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: {
        id: +id,
      },
    });
  }

  async updatedRead(id: number) {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.notification.delete({
      where: {
        id: +id,
      },
    });
  }
}
