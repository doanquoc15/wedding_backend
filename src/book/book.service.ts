import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { STATUS_PAYMENT } from "@prisma/client";
import { MailService } from "src/mail/mail.service";
import { MESSAGE } from "../common/errors";
import { GetAllBookDto } from "./dto/get-all-book.dto";
import { CustomizedComboService } from "../customized-combo/customized-combo.service";

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly comboCustomized: CustomizedComboService,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number) {
    const [booking, customizedCombo] = await Promise.all([
      this.prisma.booking.create({
        data: {
          numberTable: createBookDto.numberTable,
          numberOfGuest: createBookDto.numberOfGuest,
          comboMenuId: createBookDto.comboMenuId,
          serviceId: createBookDto.serviceId,
          zoneId: createBookDto.zoneId,
          statusBooking: "PENDING",
          userId,
          toTime: new Date(createBookDto.toTime),
          comeInAt: new Date(createBookDto.comeInAt),
          comeOutAt: new Date(createBookDto.comeOutAt),
          depositMoney: createBookDto.depositMoney,
          totalMoney: createBookDto.totalMoney,
        },
      }),
      await this.comboCustomized.create({
        userId,
        comboMenuId: createBookDto.comboMenuId,
        comboItems: createBookDto.comboItems,
      }),
    ]);

    const admin = await this.prisma.user.findFirst({
      where: {
        roleId: 1,
      },
    });

    //send mail to user
    if (booking) {
      await this.mail.sendMail({
        to: createBookDto.email,
        subject: "Xác nhận đơn hàng",
        template: "request_booking",
        context: {
          name: createBookDto.fullName,
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
    const { pageSize, pageIndex } = query;
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 5) || 0;
    const take = +pageSize || 5;

    const [booking, total] = await Promise.all([
      this.prisma.booking.findMany({
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
    return `This action returns a #${id} book`;
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

  async update(id: number, updateBookDto: UpdateBookDto) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
      },
    });

    const data =
      !updateBookDto.toTime &&
      !updateBookDto.comeInAt &&
      !updateBookDto.comeOutAt
        ? {
            ...updateBookDto,
            ...booking,
            statusBooking: updateBookDto.statusBooking || "PENDING",
            statusPayment: updateBookDto.statusPayment || STATUS_PAYMENT.UNPAID,
          }
        : {
            ...updateBookDto,
            ...booking,
            toTime: new Date(updateBookDto.toTime),
            comeInAt: new Date(updateBookDto.comeInAt),
            comeOutAt: new Date(updateBookDto.comeOutAt),
            statusBooking: updateBookDto.statusBooking || "PENDING",
            statusPayment: updateBookDto.statusPayment || STATUS_PAYMENT.UNPAID,
          };

    const updatedBooking = this.prisma.booking.update({
      where: {
        id,
      },
      data: {
        ...updateBookDto,
        ...booking,
        ...data,
      },
    });

    if (!updatedBooking) {
      throw new NotFoundException(MESSAGE.BOOKING.NOT_FOUND);
    }

    return updatedBooking;
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
