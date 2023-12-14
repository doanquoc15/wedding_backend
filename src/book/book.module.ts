import { Module } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailModule } from "src/mail/mail.module";
import { CustomizedComboModule } from "../customized-combo/customized-combo.module";

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [PrismaModule, MailModule, CustomizedComboModule],
})
export class BookModule {}
