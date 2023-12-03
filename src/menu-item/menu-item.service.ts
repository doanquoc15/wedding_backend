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
        price: +createMenuItemDto.price,
        image: createMenuItemDto.image || undefined,
      },
    });
  }

  async findAll(query) {
    const { pageSize, pageIndex, typeId, search } = query;
    const typeCondition = typeId ? { typeId } : {};
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 5) || 0;
    const take = +pageSize || 5;

    const [menus, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where: {
          ...typeCondition,
          dishName: search
            ? { contains: search, mode: "insensitive" }
            : undefined,
        },
        skip,
        take,
        include: {
          typeDish: true,
        },
      }),
      this.prisma.menuItem.count({ where: typeCondition }),
    ]);

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
