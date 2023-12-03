import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateComboMenuDto } from "./dto/create-combo-menu.dto";
import { UpdateComboMenuDto } from "./dto/update-combo-menu.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {  STATUS_COMBO } from "@prisma/client";

@Injectable()
export class ComboMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createComboMenuDto: CreateComboMenuDto) {
    const totalPrice = createComboMenuDto.comboItems.reduce(
      (total, comboItem) => (total += comboItem.totalPrice),
      0,
    );
    const comboMenu = await this.prisma.comboMenu.create({
      data: {
        comboName: createComboMenuDto.comboName,
        totalPrice: +totalPrice,
        description: createComboMenuDto.description,
        serviceId: +createComboMenuDto.serviceId,
      },
    });

    await this.prisma.comboItem.createMany({
      data: createComboMenuDto.comboItems?.map((comboItem) => ({
        ...comboItem,
        comboMenuId: +comboMenu.id,
        totalPrice: +comboItem.totalPrice,
        status: STATUS_COMBO.AVAILABLE,
      })),
    });

    return comboMenu;
  }

  async findAll(query) {
    const { pageSize, pageIndex } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize || 5;

    const comboMenus = await this.prisma.comboMenu.findMany({
      skip: skip || 0,
      take,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        comboItems: true,
        bookings: true,
      },
    });

    const total = await this.prisma.comboMenu.count();

    return {
      total,
      data: comboMenus,
    };
  }

  async findOne(id: number) {
    const comboMenu = await this.prisma.comboMenu.findUnique({
      where: { id: +id },
      include: {
        comboItems: {
          include: {
            menuItem: {
              include: {
                typeDish: true,
              },
            },
          },
        },
      },
    });

    if (!comboMenu) {
      throw new NotFoundException("Không tìm thấy menu của combo này!");
    }

    return comboMenu;
  }

  async findOneComboByService(serviceId: number) {
    const comboMenu = await this.prisma.comboMenu.findMany({
      where: { serviceId: +serviceId },
      include: {
        comboItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return comboMenu;
  }

  update(id: number, updateComboMenuDto: UpdateComboMenuDto) {
    return `This action updates a #${id} comboMenu`;
  }

  remove(id: number) {
    return `This action removes a #${id} comboMenu`;
  }
}
