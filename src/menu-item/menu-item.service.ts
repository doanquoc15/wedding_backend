import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { PrismaService } from "src/prisma/prisma.service";

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

    const type = await this.prisma.menuItem.create({
      data: {
        ...createMenuItemDto,
        price: +createMenuItemDto.price,
        image: createMenuItemDto.image,
      },
    });

    return type;
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

  async findOne(id: number) {
    const dish = await this.prisma.menuItem.findUnique({
      where: {
        id,
      },
      include: {
        typeDish: true,
      },
    });

    return dish;
  }

  async getTop(top?: number) {
    const topNewestDishes = await this.prisma.menuItem.findMany({
      take: top || 5, // Convert topN to a number
      orderBy: { createdAt: "desc" },
      include: {
        typeDish: true,
      },
    });

    return topNewestDishes;
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const existsDish = await this.prisma.menuItem.findUnique({
      where: {
        id,
      },
    });

    if (!existsDish) {
      throw new HttpException("Không tìm thâý", HttpStatus.BAD_REQUEST);
    }

    const updatedDish = await this.prisma.menuItem.update({
      where: {
        id,
      },
      data: {
        ...existsDish,
        ...updateMenuItemDto,
      },
    });

    return updatedDish;
  }

  async remove(id: number) {
    const deletedDish = await this.prisma.menuItem.delete({
      where: {
        id,
      },
    });
    return deletedDish;
  }
}
