import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE } from "src/common/errors";
import { ChangePasswordDto } from "./dto/change-password.dto";
import * as argon from "argon2";

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

  async getMe(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...user,
        ...updateUserDto,
        dateOfBirth: updateUserDto?.dateOfBirth
          ? new Date(updateUserDto?.dateOfBirth)
          : undefined,
      },
    });
    return updateUser;
  }

  async changePass(id: number, passwordUpdate: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    const isMatch = await argon.verify(
      user.password,
      passwordUpdate.oldPassword,
    );

    if (!isMatch) {
      throw new ConflictException(MESSAGE.USER.NOT_MATCH_PASS);
    } else {
      const newPass = await argon.hash(passwordUpdate.newPassword);
      const updateUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...user,
          password: newPass,
        },
      });
      return updateUser;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
