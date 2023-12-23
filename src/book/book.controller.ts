import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { GetAllBookDto } from "./dto/get-all-book.dto";

@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(
    @Body() createBookDto: CreateBookDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.bookService.create(createBookDto, userId);
  }

  @Get()
  findAll(@Query() query: GetAllBookDto) {
    return this.bookService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookService.findOne(+id);
  }

  @Get("/user/:id")
  findBookingByUserId(@Param("id") id: string) {
    return this.bookService.findBookingByUserId(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Patch("/status/:id")
  updateStatus(@Param("id") id: string, @Body() statusBooking) {
    return this.bookService.updateStatus(+id, statusBooking);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookService.remove(+id);
  }
}
