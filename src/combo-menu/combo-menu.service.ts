import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateComboMenuDto } from "./dto/create-combo-menu.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { STATUS_COMBO } from "@prisma/client";

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
    const { pageSize, pageIndex, search, serviceId } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const typeCondition = serviceId ? { serviceId: +serviceId } : {};
    const take = +pageSize || 5;

    const comboMenus = await this.prisma.comboMenu.findMany({
      where: {
        ...typeCondition,
        comboName: search
          ? {
              contains: search,
              mode: "insensitive",
            }
          : undefined,
      },
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
        customizedComboMenus: {
          include: {
            comboItems: true,
            comboMenu: true,
          },
        },
        comboItems: {
          include: {
            menuItem: {
              include: {
                typeDish: true,
              },
            },
          },
        },
        service: {
          select: {
            price: true,
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

  async update(id, updateComboMenuDto) {
    const { comboName, description, serviceId, comboItems } =
      updateComboMenuDto;

    const existingComboMenu = await this.prisma.comboMenu.findUnique({
      where: {
        id: +id,
      },
      include: {
        comboItems: true,
      },
    });

    if (!existingComboMenu) {
      // Xử lý khi không tìm thấy combo trong cơ sở dữ liệu
      throw new Error("Combo not found");
    }

    // Tính tổng giá mới dựa trên comboItems cần cập nhật
    const totalPrice = comboItems.reduce(
      (total, comboItem) => (total += comboItem.totalPrice),
      0,
    );

    // Cập nhật thông tin của combo
    const updatedComboMenu = await this.prisma.comboMenu.update({
      where: {
        id: +id,
      },
      data: {
        comboName,
        totalPrice: +totalPrice,
        description,
        serviceId: +serviceId,
      },
    });

    // Xóa tất cả các comboItem cũ của combo
    await this.prisma.comboItem.deleteMany({
      where: {
        comboMenuId: +id,
      },
    });

    // Tạo lại các comboItem mới
    await this.prisma.comboItem.createMany({
      data: comboItems?.map((comboItem) => ({
        ...comboItem,
        comboMenuId: +id,
        totalPrice: +comboItem.totalPrice,
        status: STATUS_COMBO.AVAILABLE,
      })),
    });

    return updatedComboMenu;
  }

  remove(id: number) {
    const deletedComboMenu = this.prisma.comboMenu.delete({
      where: {
        id: +id,
      },
    });
    return deletedComboMenu;
  }
}
