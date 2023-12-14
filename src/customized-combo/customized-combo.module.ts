import { Module } from "@nestjs/common";
import { CustomizedComboService } from "./customized-combo.service";
import { CustomizedComboController } from "./customized-combo.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CustomizedComboController],
  providers: [CustomizedComboService],
  exports: [CustomizedComboService],
})
export class CustomizedComboModule {}
