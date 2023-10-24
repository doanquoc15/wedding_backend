import { Module } from "@nestjs/common";
import { ComboMenuService } from "./combo-menu.service";
import { ComboMenuController } from "./combo-menu.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ComboMenuController],
  providers: [ComboMenuService],
})
export class ComboMenuModule {}
