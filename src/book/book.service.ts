import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  STATUS_BOOKING,
  STATUS_PAYMENT,
  TYPE_NOTIFICATION,
} from "@prisma/client";
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
    const userCurrent = await this.prisma.user.findUnique({
      where: {
        id: createBookDto?.userId || userId,
      },
    });

    const admin = await this.prisma.user.findFirst({
      where: {
        roleId: 1,
      },
    });
    const data = {
      numberTable: createBookDto.numberTable,
      numberOfGuest: createBookDto.numberOfGuest,
      comboMenuId: createBookDto.comboMenuId,
      serviceId: createBookDto.serviceId,
      zoneId: createBookDto.zoneId,
      statusBooking: STATUS_BOOKING.NEW,
      userId: createBookDto?.userId || userId,
      toTime: new Date(createBookDto.toTime),
      comeInAt: new Date(createBookDto.comeInAt),
      comeOutAt: new Date(createBookDto.comeOutAt),
      depositMoney: createBookDto.depositMoney,
      totalMoney: createBookDto.totalMoney,
    };

    if (!createBookDto.comboItems || createBookDto.comboItems.length === 0) {
      // Đơn hàng không có comboItems, tạo đơn hàng thông thường
      const booking = await this.prisma.booking.create({
        data: { ...data },
      });

      // Gửi email xác nhận đơn hàng
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
            statusBooking: STATUS_BOOKING.NEW,
            numberTable: createBookDto.numberTable,
            numberOfGuest: createBookDto.numberOfGuest,
          },
          from: admin.email,
        });
      }

      return booking;
    } else {
      const booking = await this.prisma.booking.create({
        data: { ...data },
      });

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
            statusBooking: STATUS_BOOKING.NEW,
            numberTable: createBookDto.numberTable,
            numberOfGuest: createBookDto.numberOfGuest,
          },
          from: admin.email,
        });
      }

      const customizedCombo = this.comboCustomized.create({
        bookingId: booking.id,
        userId: createBookDto?.userId || userId,
        comboMenuId: createBookDto.comboMenuId,
        comboItems: createBookDto.comboItems,
      });

      return { booking, customizedCombo };
    }
  }

  async findAll(query: GetAllBookDto) {
    const { pageSize, pageIndex, search, statusBooking, toTime } = query;
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 5) || 0;
    const take = +pageSize || 5;

    const currentDateTime = new Date();

    const pendingBookings = await this.prisma.booking.findMany({
      where: {
        OR: [
          {
            statusBooking: STATUS_BOOKING.PENDING,
            toTime: {
              lte: currentDateTime.toISOString(),
            },
          },
          {
            statusBooking: STATUS_BOOKING.NEW,
            toTime: {
              lte: currentDateTime.toISOString(),
            },
          },
        ],
      },
    });

    const updatePromises = pendingBookings.map(async (booking) => {
      return this.prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          statusBooking: STATUS_BOOKING.REJECTED,
          statusPayment: STATUS_PAYMENT.UNPAID,
        },
      });
    });
    await Promise.all(updatePromises);

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

  async findOne(id: number) {
    const booking = this.prisma.booking.findUnique({
      where: {
        id: +id,
      },
      include: {
        zone: true,
        comboMenu: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    return booking;
  }

  async percentBooking(query) {
    const allBooking = await this.prisma.booking.findMany({
      select: {
        statusBooking: true,
        totalMoney: true,
        statusPayment: true,
        toTime: true,
        comeInAt: true,
        depositMoney: true,
      },
    });

    const setNewBooking = allBooking.filter(
      (item) => item?.statusBooking === "NEW",
    );

    const setPendingBooking = allBooking.filter(
      (item) => item?.statusBooking === "PENDING",
    );

    const setApprovedBooking = allBooking.filter(
      (item) => item?.statusBooking === "APPROVED",
    );

    const setReceivedBooking = allBooking.filter(
      (item) => item?.statusBooking === "FINISHED",
    );

    const setRejectedBooking = allBooking.filter(
      (item) => item?.statusBooking === "REJECTED",
    );

    const percentNewBooking = (
      (setNewBooking?.length / allBooking.length) *
      100
    ).toFixed(2);
    const percentPendingBooking = (
      (setPendingBooking?.length / allBooking.length) *
      100
    ).toFixed(2);
    const percentApproved = (
      (setApprovedBooking?.length / allBooking.length) *
      100
    ).toFixed(2);
    const percentReceived = (
      (setReceivedBooking?.length / allBooking.length) *
      100
    ).toFixed(2);
    const percentRejected = (
      (setRejectedBooking?.length / allBooking.length) *
      100
    ).toFixed(2);

    return [
      {
        data: setNewBooking,
        percent: percentNewBooking,
        status: "NEW",
      },
      {
        data: setPendingBooking,
        percent: percentPendingBooking,
        status: "PENDING",
      },
      {
        data: setApprovedBooking,
        percent: percentApproved,
        status: "APPROVED",
      },
      {
        data: setReceivedBooking,
        percent: percentReceived,
        status: "RECEIVED",
      },
      {
        data: setRejectedBooking,
        percent: percentRejected,
        status: "REJECTED",
      },
    ];
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
          },
        },
      },
    });

    if (!bookingByUser) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    return bookingByUser;
  }

  async getFinishedOrdersByMonth(
    year?: number | string,
  ): Promise<{ month: number; quantity: number }[]> {
    const currentYear = year || new Date().getFullYear();
    console.log(currentYear);
    const finishedOrders = await this.prisma.booking.findMany({
      where: {
        statusBooking: "FINISHED",
        toTime: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${+currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        toTime: true,
      },
    });

    const result: { [month: number]: number } = {};

    finishedOrders.forEach((order) => {
      const monthNumber = new Date(order.toTime).getMonth() + 1;
      result[monthNumber] = (result[monthNumber] || 0) + 1;
    });

    const sortedResult = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      quantity: result[index + 1] || 0,
    }));

    return sortedResult;
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
      PENDING: "tab=1",
      NEW: "tab=0",
      APPROVED: "tab=2",
      FINISHED: "tab=3",
      REJECTED: "tab=4",
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
      title: `Cập nhật trạng thái đơn hàng thành ${updateStatusBooking.statusBooking}`,
      isRead: false,
      type: TYPE_NOTIFICATION.INFO,
      link: `https://wedding-frontend-seven.vercel.app/tai-khoan/lich-su?${
        STATUS[updateStatusBooking.statusBooking]
      }`,
    });
    await this.notificationGateway.updateBadges(createNotification?.userId);

    return updateStatusBooking;
  }

  async updatePayment(id: number, statusPayment) {
    const updatePaymentBooking = await this.prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        statusPayment: statusPayment.statusPayment,
      },
    });

    return updatePaymentBooking;
  }

  async getBookingStatusByMonth(year: string) {
    const currentYear = +year || new Date().getFullYear();
    console.log(currentYear);
    const bookings = await this.prisma.booking.findMany({
      where: {
        toTime: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        id: true,
        toTime: true,
        statusBooking: true,
      },
    });

    const result: Record<string, Record<string, number>> = {};

    for (let month = 1; month <= 12; month++) {
      result[month] = {
        NEW: 0,
        PENDING: 0,
        APPROVED: 0,
        FINISHED: 0,
        REJECTED: 0,
      };
    }

    bookings.forEach((booking) => {
      const month = booking.toTime.getMonth() + 1; // Months are zero-based
      const status = booking.statusBooking;

      result[month][status]++;
    });

    const formattedResult = Object.keys(result).map((month) => ({
      month: +month,
      ...result[month],
    }));

    return formattedResult;
  }

  // async getBookingStatusByMonth(year?: string): Promise<any[]> {
  //   const statuses = ["NEW", "PENDING", "APPROVED", "FINISHED", "REJECTED"];
  //   const currentYear = +year || new Date().getFullYear();
  //
  //   const bookingsByMonth = await Promise.all(
  //     Array.from({ length: 12 }, (_, i) => i + 1).map(async (month) => {
  //       const bookings = await this.prisma.booking.findMany({
  //         where: {
  //           toTime: {
  //             gte: new Date(`${currentYear}-01-01`),
  //             lt: new Date(`${+currentYear + 1}-01-01`),
  //           },
  //         },
  //       });
  //
  //       const statusCounts = {};
  //       statuses.forEach((status) => {
  //         statusCounts[status.toLowerCase()] = bookings.filter(
  //           (booking) => booking.statusBooking === status,
  //         ).length;
  //       });
  //
  //       return {
  //         month,
  //         ...statusCounts,
  //       };
  //     }),
  //   );
  //
  //   return bookingsByMonth;
  // }

  async findFood(bookingId) {
    const data = await this.prisma.customizedComboMenu.findUnique({
      where: {
        bookingId: bookingId,
      },
      include: {
        comboItems: {
          select: {
            menuItem: {
              select: {
                dishName: true,
              },
            },
            menuItemId: true,
            quantity: true,
            totalPrice: true,
          },
        },
      },
    });

    const dataFood = data?.comboItems.map((item) => ({
      menuItemId: item.menuItemId,
      dishName: item.menuItem.dishName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        comboMenu: {
          include: {
            comboItems: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const foods = booking.comboMenu.comboItems.map((item) => ({
      menuItemId: item.menuItem.id,
      dishName: item.menuItem.dishName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    return dataFood ? dataFood : foods;
  }

  async checkBookingCustom(id: number) {
    const data = await this.prisma.customizedComboMenu.findUnique({
      where: {
        bookingId: id,
      },
    });

    return data ? true : false;
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
