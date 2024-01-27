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
    console.log(query);
    return this.bookService.findAll(query);
  }

  @Get("/percent")
  getPercentBooking(@Query() query: GetAllBookDto) {
    return this.bookService.percentBooking(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookService.findOne(+id);
  }

  @Get("/food/:id")
  findFood(@Param("id") id: string) {
    return this.bookService.findFood(+id);
  }

  @Get("/check-custom/:id")
  checkBookingCustom(@Param("id") id: string) {
    return this.bookService.checkBookingCustom(+id);
  }

  @Get("/month/:year")
  getFinishedOrdersByMonth(@Param("year") year?: string) {
    return this.bookService.getFinishedOrdersByMonth(year);
  }

  @Get("/status-booking/:year")
  getBookingStatusByMonth(@Param("year") year?: string) {
    return this.bookService.getBookingStatusByMonth(year);
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

  @Patch("/payment/:id")
  updatePayment(@Param("id") id: string, @Body() statusPayment) {
    return this.bookService.updatePayment(+id, statusPayment);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookService.remove(+id);
  }
}
