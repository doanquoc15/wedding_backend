import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { AuthDto, SignInDto } from "./dto";
import { JwtPayload, Tokens } from "./types";
import { PrismaService } from "../prisma/prisma.service";
import { httpStatus, MESSAGE } from "src/common/errors";
import { ROLE, STATUS_USER } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<SignInDto> {
    const existsUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existsUser) {
      throw new ConflictException();
    }

    const idRole = await this.prisma.role.findMany({
      where: {
        roleName: ROLE.CUSTOMER,
      },
      select: {
        id: true,
      },
    });

    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
          roleId: idRole[0].id,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === httpStatus.P2002) {
            throw new ForbiddenException(MESSAGE.AUTH.CREDENTIAL_INCORRECT);
          }
        }
        throw error;
      });

    return user;
  }

  async signinLocal(dto: SignInDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        role: true,
      },
    });

    if (user?.status === STATUS_USER.INACTIVE)
      throw new HttpException("Tài khoản đã bị khóa", 403);

    if (!user) throw new ForbiddenException(MESSAGE.AUTH.ACCESS_DENIED);

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches)
      throw new ForbiddenException(MESSAGE.AUTH.ACCESS_DENIED);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roleId,
      user.role.roleName,
    );

    return {
      tokens,
      user,
    };
  }

  async getTokens(
    userId: number,
    email: string,
    roleId: number,
    role: ROLE,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      roleId,
      role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret:
          this.config.get<string>(process.env.AT_SECRET) ||
          process.env.AT_SECRET,
        expiresIn: "1d",
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret:
          this.config.get<string>(process.env.RT_SECRET) ||
          process.env.RT_SECRET,
        expiresIn: "7d",
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
