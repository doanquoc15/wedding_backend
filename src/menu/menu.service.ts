import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    return await this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  async findAll(page: number, itemsPerPage: number) {
    console.log(page,itemsPerPage)
    const skip = (page - 1) * itemsPerPage;
    const menus = await this.prisma.menu.findMany({
      skip,
      take: itemsPerPage,
    });
    return menus;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
