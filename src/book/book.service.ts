import { Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number) {
    const booking = this.prisma.booking.create({
      data: {
        numberTable: createBookDto.numberTable,
        numberOfGuest: createBookDto.numberOfGuest,
        comboMenuId: createBookDto.comboMenuId,
        serviceId: createBookDto.serviceId,
        zoneId: createBookDto.zoneId,
        statusBooking: "PENDING",
        userId,
        toTime: new Date(createBookDto.toTime),
        depositMoney: new Prisma.Decimal(createBookDto.depositMoney),
        totalMoney: new Prisma.Decimal(createBookDto.totalMoney),
      },
    });

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
          time: createBookDto.time,
          toTime: createBookDto.toTime,
          depositMoney: createBookDto.depositMoney,
          totalMoney: createBookDto.totalMoney,
          statusBooking: "PENDING",
          numberTable: createBookDto.numberTable,
          numberOfGuest: createBookDto.numberOfGuest,
        },
        from: admin.email,
      });

      //send mail to admin
      // await this.mail.sendMail({
      //   to: admin.email,
      //   subject: 'Yêu cầu xác nhận đơn hàng',
      //   template: 'approved_booking',
      //   context: {
      //     name: createBookDto.fullName,
      //     time: createBookDto.time,
      //     toTime: createBookDto.toTime,
      //     depositMoney: createBookDto.depositMoney,
      //     totalMoney: createBookDto.totalMoney,
      //     numberTable: createBookDto.numberTable,
      //     numberOfGuest: createBookDto.numberOfGuest,
      //   },
      //   from: createBookDto.email
      // });
    }

    return booking;
  }

  findAll() {
    return `This action returns all book`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
