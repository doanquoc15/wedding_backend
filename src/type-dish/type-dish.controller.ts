import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { TypeDishService } from "./type-dish.service";
import { CreateTypeDishDto } from "./dto/create-type-dish.dto";
import { UpdateTypeDishDto } from "./dto/update-type-dish.dto";
import { GetAllTypeDish } from "./dto/type-dish.dto";

@Controller("type-dish")
export class TypeDishController {
  constructor(private readonly typeDishService: TypeDishService) {}

  @Post()
  create(@Body() createTypeDishDto: CreateTypeDishDto) {
    return this.typeDishService.create(createTypeDishDto);
  }

  @Get()
  findAll(@Query() query: GetAllTypeDish) {
    return this.typeDishService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.typeDishService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTypeDishDto: UpdateTypeDishDto,
  ) {
    return this.typeDishService.update(+id, updateTypeDishDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.typeDishService.remove(+id);
  }
}
