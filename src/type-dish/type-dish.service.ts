import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTypeDishDto } from "./dto/create-type-dish.dto";
import { UpdateTypeDishDto } from "./dto/update-type-dish.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TypeDishService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTypeDishDto: CreateTypeDishDto) {
    return this.prisma.typeDish.create({
      data: {
        ...createTypeDishDto,
      },
    });
  }

  async findAll(query) {
    const { pageIndex, pageSize, search } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize || 5;

    const typeDishes = await this.prisma.typeDish.findMany({
      where: {
        typeName: search
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
        menuItems: true,
      },
    });

    const total = await this.prisma.typeDish.count();

    return {
      total,
      typeDishes,
    };
  }

  async findOne(id: number) {
    const typeDish = await this.prisma.typeDish.findUnique({
      where: { id },
    });

    if (!typeDish) {
      throw new NotFoundException("Không tìm thấy dữ liệu!");
    }

    return typeDish;
  }

  async update(id: number, updateTypeDishDto: UpdateTypeDishDto) {
    const existsTypeDish = await this.prisma.typeDish.findUnique({
      where: { id },
    });

    if (!existsTypeDish) {
      throw new NotFoundException();
    }

    const updated = await this.prisma.typeDish.update({
      where: { id },
      data: {
        ...updateTypeDishDto,
      },
    });
    return updated;
  }

  async remove(id: number) {
    return await this.prisma.typeDish.delete({
      where: { id },
    });
  }
}
