import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { MESSAGE } from "src/common/errors";
import { ChangePasswordDto } from "./dto/change-password.dto";
import * as argon from "argon2";
import { ROLE } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password_default = "12345678";
    const existsUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    const idRole = await this.prisma.role.findMany({
      where: {
        roleName: ROLE.CUSTOMER,
      },
      select: {
        id: true,
      },
    });
    //check exists user by mail
    if (existsUser) {
      throw new ConflictException(MESSAGE.USER.EMAIL_EXISTS);
    }
    const hasPass = await argon.hash(password_default);
    const createdUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hasPass,
        dateOfBirth: createUserDto?.dateOfBirth
          ? new Date(createUserDto?.dateOfBirth)
          : undefined,
        roleId: idRole[0].id,
      },
    });

    return createdUser;
  }

  async findAll(query) {
    const { pageIndex, pageSize, search } = query;
    const skip = (+pageIndex - 1) * +pageSize;
    const take = +pageSize;

    const users = await this.prisma.user.findMany({
      where: {
        name: search
          ? {
              contains: search,
              mode: "insensitive",
            }
          : undefined,
      },
      skip: skip || 0,
      take,
      include: {
        role: true,
      },
    });
    const total = await this.prisma.user.count();

    if (!users) {
      throw new NotFoundException(MESSAGE.USER.NOT_FOUND);
    }

    return { users, total };
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
    const me = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
      include: {
        role: true,
      },
    });

    return me;
  }

  async update(id: number, updateUserDto) {
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

    delete updateUserDto?.province;
    delete updateUserDto?.district;
    delete updateUserDto?.ward;

    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
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

  async remove(id: number) {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return deleteUser;
  }
}
