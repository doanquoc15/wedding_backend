import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
