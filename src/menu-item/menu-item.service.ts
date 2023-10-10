import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class MenuItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const existType = await this.prisma.typeDish.findUnique({
      where: {
        id: createMenuItemDto.typeId,
      },
    });

    if (!existType) {
      throw new NotFoundException("typeDish không tồn tại!");
    }

    return await this.prisma.menuItem.create({
      data: {
        ...createMenuItemDto,
        price: new Prisma.Decimal(createMenuItemDto.price),
        image: createMenuItemDto.image || undefined,
      },
    });
  }
  
  async findAll(pageIndex: number, pageSize: number, typeId: number, search: string) {
    const existType = await this.prisma.typeDish.findUnique({
      where: {
        id: typeId,
        
      },
    });
    if (!existType) {
      typeId = undefined;
    }
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 10);
    const menus = typeId
      ? await this.prisma.menuItem.findMany({
          where: {
            typeId,
            dishName: {
              contains: search ? String(search) : undefined,
              mode: "insensitive",
            },
          },
          skip,
          take: Number(pageSize),
        })
      : await this.prisma.menuItem.findMany({
          skip,
          take: Number(pageSize),
          where : {
            dishName: {
              contains: search ? String(search) : undefined,
              mode: "insensitive",
            },
          }
        });

    const total = await this.prisma.menuItem.count({
      where: {
        typeId,
      },
    });

    return { menus, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
