import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GetAllService } from "./dto/service.dto";

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const createService = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        image: createServiceDto.image || undefined,
        price: +createServiceDto.price,
      },
    });

    return createService;
  }

  async findAll(query: GetAllService) {
    const { pageSize, pageIndex, search } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize || 5;

    const services = await this.prisma.service.findMany({
      where: {
        serviceName: search
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
      throw new NotFoundException("Không ồn tại dịch vụ này!");
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
        ...existsService,
        ...updateServiceDto,
      },
    });
  }

  async remove(id: number) {
    const deleteService = await this.prisma.service.delete({
      where: { id },
    });

    return deleteService;
  }
}
