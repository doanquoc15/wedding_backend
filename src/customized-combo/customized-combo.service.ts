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
        userId: createCustomizedComboDto.userId,
        comboMenuId: createCustomizedComboDto.comboMenuId,
      },
    });

    await this.prisma.comboItem.createMany({
      data: createCustomizedComboDto.comboItems?.map((comboItem) => ({
        ...comboItem,
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

  update(id: number, updateCustomizedComboDto: UpdateCustomizedComboDto) {
    return `This action updates a #${id} customizedCombo`;
  }

  remove(id: number) {
    return `This action removes a #${id} customizedCombo`;
  }
}
