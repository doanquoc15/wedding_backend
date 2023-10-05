import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    return 'This action adds a new menuItem';
  }

  async findAll(page: number,itemsPerPage: number ) {
    const skip = (page - 1) * itemsPerPage;
    const menus = await this.prisma.menu.findMany({
      skip,
      take: itemsPerPage,
    });
    return menus;
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
