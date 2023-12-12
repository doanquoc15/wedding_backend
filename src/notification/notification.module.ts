import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationGateway } from "./notification.gateway";
import { NotificationProviders } from "./notification.provider";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [
    NotificationService,
    NotificationGateway,
    ...NotificationProviders,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
