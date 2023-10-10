import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    //get all food by id in array
    const bookingFoodList = await this.prisma.bookingFood.findMany({
      where:{
        id:{
          in: createMenuDto.bookingFoods
        },
      },
      include:{
        menuItem : true
      }
    })
    
    const totalPrice = bookingFoodList.reduce(
      (total, item) => total + Number(item.menuItem.price) * item.quantity,
      0,
    );

    const menu = await this.prisma.menu.create({
      data:{
        comboName: createMenuDto.comboName,
        description: createMenuDto.description,
        totalPrice: new Prisma.Decimal(totalPrice),
        serviceId:createMenuDto.serviceId,
        bookingId: createMenuDto.bookingId,
        bookingFoods: {
          createMany: {
            data: bookingFoodList,
          },
        },
      }
    })

    return menu;
  }

  async findAll(page: number, itemsPerPage: number) {
    const skip = (page - 1) * itemsPerPage;
    const menus = await this.prisma.menu.findMany({
      skip,
      take: itemsPerPage,
    });
    return menus;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
