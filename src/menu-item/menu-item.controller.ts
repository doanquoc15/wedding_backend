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
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { GetAllMenuItem } from "./dto/menu-item.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Public } from "../common/decorators";
import { RolesGuard } from "../common/guards/role.guard";

@Controller("menu-item")
@ApiBearerAuth()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  @Public()
  @UseGuards(RolesGuard)
  findAll(@Query() query: GetAllMenuItem) {
    return this.menuItemService.findAll(query);
  }

  @Get(":id")
  @Public()
  @UseGuards(RolesGuard)
  findOne(@Param("id") id?: string) {
    return this.menuItemService.findOne(+id);
  }

  @Get("/top/:top")
  @Public()
  @UseGuards(RolesGuard)
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
