import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { STATUS_PAYMENT, TYPE_NOTIFICATION } from "@prisma/client";
import { MailService } from "src/mail/mail.service";
import { MESSAGE } from "../common/errors";
import { GetAllBookDto } from "./dto/get-all-book.dto";
import { CustomizedComboService } from "../customized-combo/customized-combo.service";
import { NotificationGateway } from "../notification/notification.gateway";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly comboCustomized: CustomizedComboService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notification: NotificationService,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number) {
    if (createBookDto?.comboItems?.length === 0) {
      const customizedCombo = this.prisma.booking.create({
        data: {
          numberTable: createBookDto.numberTable,
          numberOfGuest: createBookDto.numberOfGuest,
          comboMenuId: createBookDto.comboMenuId,
          serviceId: createBookDto.serviceId,
          zoneId: createBookDto.zoneId,
          statusBooking: "PENDING",
          userId: createBookDto?.userId || userId,
          toTime: new Date(createBookDto.toTime),
          comeInAt: new Date(createBookDto.comeInAt),
          comeOutAt: new Date(createBookDto.comeOutAt),
          depositMoney: createBookDto.depositMoney,
          totalMoney: createBookDto.totalMoney,
        },
      });

      return customizedCombo;
    }

    const [booking, customizedCombo] = await Promise.all([
      this.prisma.booking.create({
        data: {
          numberTable: createBookDto.numberTable,
          numberOfGuest: createBookDto.numberOfGuest,
          comboMenuId: createBookDto.comboMenuId,
          serviceId: createBookDto.serviceId,
          zoneId: createBookDto.zoneId,
          statusBooking: "PENDING",
          userId: createBookDto?.userId || userId,
          toTime: new Date(createBookDto.toTime),
          comeInAt: new Date(createBookDto.comeInAt),
          comeOutAt: new Date(createBookDto.comeOutAt),
          depositMoney: createBookDto.depositMoney,
          totalMoney: createBookDto.totalMoney,
        },
      }),
      await this.comboCustomized.create({
        userId: createBookDto?.userId || userId,

        comboMenuId: createBookDto.comboMenuId,
        comboItems: createBookDto.comboItems,
      }),
    ]);
    const admin = await this.prisma.user.findFirst({
      where: {
        roleId: 1,
      },
    });

    const userCurrent = await this.prisma.user.findUnique({
      where: {
        id: createBookDto?.userId || userId,
      },
    });

    //send mail to user
    if (booking) {
      await this.mail.sendMail({
        to: userCurrent.email,
        subject: "Xác nhận đơn hàng",
        template: "request_booking",
        context: {
          name: userCurrent.name,
          comeInAt: createBookDto.comeInAt,
          comeOutAt: createBookDto.comeOutAt,
          toTime: createBookDto.toTime,
          depositMoney: createBookDto.depositMoney,
          totalMoney: createBookDto.totalMoney,
          statusBooking: "PENDING",
          numberTable: createBookDto.numberTable,
          numberOfGuest: createBookDto.numberOfGuest,
        },
        from: admin.email,
      });
    }

    return { booking, customizedCombo };
  }

  async findAll(query: GetAllBookDto) {
    const { pageSize, pageIndex, search, statusBooking, toTime } = query;
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 5) || 0;
    const take = +pageSize || 5;

    const [booking, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          user: {
            name: search
              ? {
                  contains: search,
                  mode: "insensitive",
                }
              : undefined,
          },
          statusBooking: statusBooking ? statusBooking : undefined,
          toTime: toTime
            ? {
                equals: new Date(toTime as string).toISOString(),
              }
            : undefined,
        },
        skip,
        take,
        include: {
          comboMenu: {
            include: {
              service: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          zone: {
            select: {
              zoneName: true,
            },
          },
        },
      }),

      this.prisma.booking.count(),
    ]);
    if (!booking) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }
    return { booking, total };
  }

  findOne(id: number) {
    const booking = this.prisma.booking.findUnique({
      where: {
        id: +id,
      },
      include: {
        zone: true,
        comboMenu: {
          include: {
            service: true,
            feedbacks: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    return booking;
  }

  async findBookingByUserId(id: number) {
    const bookingByUser = await this.prisma.booking.findMany({
      where: {
        userId: id,
      },
      include: {
        zone: true,
        comboMenu: {
          include: {
            service: true,
            feedbacks: true,
          },
        },
      },
    });

    if (!bookingByUser) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    return bookingByUser;
  }

  async update(id: number, updateBookDto) {
    const existingBooking = await this.prisma.booking.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingBooking) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        userId: updateBookDto.userId || existingBooking.userId,
        numberTable: updateBookDto.numberTable || existingBooking.numberTable,
        numberOfGuest:
          updateBookDto.numberOfGuest || existingBooking.numberOfGuest,
        comboMenuId: updateBookDto.comboMenuId || existingBooking.comboMenuId,
        serviceId: updateBookDto.serviceId || existingBooking.serviceId,
        zoneId: updateBookDto.zoneId || existingBooking.zoneId,
        toTime: updateBookDto.toTime
          ? new Date(updateBookDto.toTime)
          : existingBooking.toTime,
        comeInAt: updateBookDto.comeInAt
          ? new Date(updateBookDto.comeInAt)
          : existingBooking.comeInAt,
        comeOutAt: updateBookDto.comeOutAt
          ? new Date(updateBookDto.comeOutAt)
          : existingBooking.comeOutAt,
        depositMoney:
          updateBookDto.depositMoney || existingBooking.depositMoney,
        totalMoney: updateBookDto.totalMoney || existingBooking.totalMoney,
        statusBooking: updateBookDto.statusBooking || "PENDING",
        statusPayment: updateBookDto.statusPayment || STATUS_PAYMENT.UNPAID,
      },
    });
    return updatedBooking;
  }

  async updateStatus(id: number, statusBooking) {
    const STATUS = {
      PENDING: "tab=0",
      APPROVED: "tab=1",
      REJECTED: "tab=3",
    };
    const updateStatusBooking = await this.prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        statusBooking: statusBooking.statusBooking,
      },
    });

    const createNotification = await this.notification.create({
      userId: updateStatusBooking?.userId,
      description: `Đơn hàng ${updateStatusBooking.id} của bạn đã được cập nhật trạng thái thành ${updateStatusBooking.statusBooking}`,
      title: "Cập nhật đơn hàng",
      isRead: false,
      type: TYPE_NOTIFICATION.INFO,
      link: `https://wedding-frontend-seven.vercel.app/tai-khoan/lich-su?${
        STATUS[updateStatusBooking.statusBooking]
      }`,
    });
    await this.notificationGateway.updateBadges(createNotification?.userId);

    return updateStatusBooking;
  }

  async remove(id: number) {
    const deletedBooking = await this.prisma.booking.delete({
      where: {
        id,
      },
    });
    return deletedBooking;
  }
}
