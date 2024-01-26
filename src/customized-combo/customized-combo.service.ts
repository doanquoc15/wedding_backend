import { Injectable } from "@nestjs/common";
import { CreateCustomizedComboDto } from "./dto/create-customized-combo.dto";
import { UpdateCustomizedComboDto } from "./dto/update-customized-combo.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { STATUS_COMBO } from "@prisma/client";

@Injectable()
export class CustomizedComboService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomizedComboDto: CreateCustomizedComboDto) {
    const customComboMenu = await this.prisma.customizedComboMenu.create({
      data: {
        bookingId: +createCustomizedComboDto.bookingId,
        userId: createCustomizedComboDto.userId,
        comboMenuId: createCustomizedComboDto.comboMenuId,
      },
    });

    await this.prisma.comboItem.createMany({
      data: createCustomizedComboDto.comboItems?.map((comboItem) => ({
        menuItemId: +comboItem.menuItemId,
        quantity: +comboItem.quantity,
        comboMenuId: null,
        comboCustomizedMenuId: +customComboMenu.id,
        totalPrice: +comboItem.totalPrice,
        status: STATUS_COMBO.CUSTOMIZED,
      })),
    });

    return customComboMenu;
  }

  async findAll(query) {
    const { pageSize, pageIndex } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize || 5;

    const customComboMenus = await this.prisma.customizedComboMenu.findMany({
      skip: skip || 0,
      take,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        comboItems: true,
      },
    });

    const total = await this.prisma.customizedComboMenu.count();

    return {
      total,
      data: customComboMenus,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} customizedCombo`;
  }

  async update(id: number, updateCustomizedComboDto: UpdateCustomizedComboDto) {
    const customComboMenu = await this.prisma.customizedComboMenu.findUnique({
      where: {
        id: +id,
      },
    });
    await this.prisma.comboItem.deleteMany({
      where: {
        comboCustomizedMenuId: +customComboMenu.id,
      },
    });

    const updated = await this.prisma.comboItem.createMany({
      data: updateCustomizedComboDto.comboItems?.map((comboItem) => ({
        menuItemId: +comboItem.menuItemId,
        quantity: +comboItem.quantity,
        comboMenuId: null,
        comboCustomizedMenuId: +customComboMenu.id,
        totalPrice: +comboItem.totalPrice,
        status: STATUS_COMBO.CUSTOMIZED,
      })),
    });

    return updated;
  }

  async remove(id: number) {
    const deleted = await this.prisma.customizedComboMenu.delete({
      where: {
        id: +id,
      },
    });
    return deleted;
  }
}
