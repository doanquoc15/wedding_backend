import { Injectable } from "@nestjs/common";
import { CreateZoneDto } from "./dto/create-zone.dto";
import { UpdateZoneDto } from "./dto/update-zone.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ZoneService {
  constructor(private readonly prisma: PrismaService) {}
  create(createZoneDto: CreateZoneDto) {
    return this.prisma.zone.create({
      data: {
        zoneName: createZoneDto.zoneName,
        numberRoom: createZoneDto.numberRoom,
      },
    });
  }

  findAll() {
    return this.prisma.zone.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} zone`;
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return `This action updates a #${id} zone`;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
