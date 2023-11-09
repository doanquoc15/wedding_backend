import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto, userId : number) {
    const booking = this.prisma.booking.create({ 
      data:{
        ...createBookDto,
        statusBooking: 'PENDING',
        userId,
        depositMoney : new Prisma.Decimal(createBookDto.depositMoney),
        totalMoney : new Prisma.Decimal(createBookDto.totalMoney),
      }
    })

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
