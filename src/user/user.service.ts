import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE } from "src/common/errors";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        roleId: true,
        role: {
          select: {
            roleName: true,
          },
        },
      },
    });
    if (!users) {
      throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id || undefined,
      },
    });

    if (!user) {
      throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
    }

    return user;
  }

  getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
