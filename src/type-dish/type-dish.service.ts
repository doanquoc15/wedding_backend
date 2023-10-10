import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDishDto } from './dto/create-type-dish.dto';
import { UpdateTypeDishDto } from './dto/update-type-dish.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TypeDishService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTypeDishDto: CreateTypeDishDto) {
    return this.prisma.typeDish.create({
      data:{
        ...createTypeDishDto
      }
    })
  }

  async findAll(page:number, itemsPerPage:number) {
    let typeDishes;
    if(!page && !itemsPerPage){
       typeDishes = await this.prisma.typeDish.findMany({
        include:{
          menuItems: true
        }
       });
      return {
        total: typeDishes?.length,
        data:typeDishes
      }
    }

    const skip = (page  - 1) * itemsPerPage;
    typeDishes = await this.prisma.typeDish.findMany({
      skip: skip || 0,
      take: itemsPerPage || 5,
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    return {
      total : typeDishes?.length,
      data: typeDishes
    };
  }

  async findOne(id: number) {
    const typeDish = await this.prisma.typeDish.findUnique({
      where: { id },
    });

    if (!typeDish) {
      throw new NotFoundException("Không tìm thấy dữ liệu!");
    }

  }

  async update(id: number, updateTypeDishDto: UpdateTypeDishDto) {
    const existsTypeDish = await this.prisma.typeDish.findUnique({
      where:{id}
    })

    if(!existsTypeDish){
      throw new NotFoundException();
    }

    return await this.prisma.typeDish.update({
      where:{id},
      data : {
        ...updateTypeDishDto
      }
    })
  }

  async remove(id: number) {
    return await this.prisma.typeDish.delete({
      where:{id}
    })
  }
}
