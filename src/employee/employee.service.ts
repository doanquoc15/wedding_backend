import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        salary: +createEmployeeDto.salary
      }
    })
  }

  async findAll(query) {
  const {position, pageIndex, pageSize = 10, search} = query;
    const typeCondition = position ? { position } : {};
    const skip = (Number(pageIndex || 1) - 1) * Number(pageSize || 10);
  
    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where: {
          ...typeCondition,
          employeeName: search ? { contains: search, mode: "insensitive" } : undefined
        },
        skip,
        take: Number(pageSize),
      }),
      this.prisma.employee.count({ where: position }),
    ]);
  
    return { employees, total };
  }
  

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
