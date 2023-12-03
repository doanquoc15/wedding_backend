import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    return await this.prisma.service.create({
      data: {
        ...createServiceDto,
        price: +createServiceDto.price,
      },
    });
  }

  async findAll(query) {
    const { pageSize, pageIndex } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize || 5;

    const services = await this.prisma.service.findMany({
      skip: skip || 0,
      take,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        comboMenus: true,
        bookings: true,
      },
    });

    const total = await this.prisma.service.count();

    return {
      total,
      data: services,
    };
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        comboMenus: true,
        bookings: true,
      },
    });

    if (!service) {
      throw new NotFoundException();
    }

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const existsService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existsService) {
      throw new NotFoundException(
        "Không tìm thấy thông tin dữ liệu muốn thay đổi!",
      );
    }
    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        ...updateServiceDto,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.service.delete({
      where: { id },
    });
  }
}
