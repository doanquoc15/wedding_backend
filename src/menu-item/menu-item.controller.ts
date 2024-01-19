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
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { GetAllMenuItem } from "./dto/menu-item.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("menu-item")
@ApiBearerAuth()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  findAll(@Query() query: GetAllMenuItem) {
    return this.menuItemService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id?: string) {
    return this.menuItemService.findOne(+id);
  }

  @Get("/top/:top")
  getTop(@Param("top") top: string) {
    return this.menuItemService.getTop(+top);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemService.update(+id, updateMenuItemDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.remove(+id);
  }
}
