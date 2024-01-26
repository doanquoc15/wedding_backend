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
  UseGuards,
} from "@nestjs/common";
import { TypeDishService } from "./type-dish.service";
import { CreateTypeDishDto } from "./dto/create-type-dish.dto";
import { UpdateTypeDishDto } from "./dto/update-type-dish.dto";
import { GetAllTypeDish } from "./dto/type-dish.dto";
import { Public } from "../common/decorators";
import { RolesGuard } from "../common/guards/role.guard";

@Controller("type-dish")
export class TypeDishController {
  constructor(private readonly typeDishService: TypeDishService) {}

  @Post()
  create(@Body() createTypeDishDto: CreateTypeDishDto) {
    return this.typeDishService.create(createTypeDishDto);
  }

  @Get()
  @Public()
  @UseGuards(RolesGuard)
  findAll(@Query() query: GetAllTypeDish) {
    return this.typeDishService.findAll(query);
  }

  @Get(":id")
  @Public()
  @UseGuards(RolesGuard)
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
