import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { AuthDto, SignInDto } from "./dto";
import { JwtPayload, Tokens } from "./types";
import { PrismaService } from "../prisma/prisma.service";
import { MESSAGE, httpStatus } from "src/common/errors";
import { ROLE } from "@prisma/client";

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

    console.log(idRole);

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

    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      tokens,
      user,
    };
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });
    if (!user || !user.hashedRt)
      throw new ForbiddenException(MESSAGE.AUTH.ACCESS_DENIED);

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException(MESSAGE.AUTH.ACCESS_DENIED);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roleId,
      user.role.roleName,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
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
