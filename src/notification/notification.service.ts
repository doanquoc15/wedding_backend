import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notifi = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        userId: +createNotificationDto.userId,
        title: createNotificationDto.title,
        description: createNotificationDto.description,
        isRead: false,
        type: createNotificationDto.type,
      },
    });

    return notifi;
  }

  async findAllByUser(userId: number) {
    if (!userId) throw new Error("userId is required");

    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  }

  async findUnReadByUser(userId: number) {
    if (!userId) throw new Error("userId is required");

    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  }

  async updateReadAll(id: number, isRead) {
    const updateReadAll = await this.prisma.notification.updateMany({
      where: {
        userId: id,
      },
      data: {
        isRead: isRead.isRead || true,
      },
    });

    return updateReadAll;
  }

  async findAll(query) {
    const { pageSize, pageIndex, search, userId } = query;
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 5) || 0;
    const take = +pageSize || 5;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: {
          userId: userId ? +userId : undefined,
          title: search ? { contains: search, mode: "insensitive" } : undefined,
        },
        skip,
        take,
      }),
      await this.prisma.notification.count(),
    ]);

    return { notifications, total };
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: {
        id: +id,
      },
    });
  }

  async updated(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        ...updateNotificationDto,
        isRead: updateNotificationDto.isRead || false,
      },
    });
  }

  remove(id: number) {
    return this.prisma.notification.delete({
      where: {
        id: +id,
      },
    });
  }
}
