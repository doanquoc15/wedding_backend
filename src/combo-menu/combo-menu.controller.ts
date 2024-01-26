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
import { ComboMenuService } from "./combo-menu.service";
import { CreateComboMenuDto } from "./dto/create-combo-menu.dto";
import { UpdateComboMenuDto } from "./dto/update-combo-menu.dto";
import { GetAllComboMenuDto } from "./dto/combo-menu.dto";
import { Public } from "../common/decorators";
import { RolesGuard } from "../common/guards/role.guard";

@Controller("combo-menu")
export class ComboMenuController {
  constructor(private readonly comboMenuService: ComboMenuService) {}

  @Post()
  create(@Body() createComboMenuDto: CreateComboMenuDto) {
    return this.comboMenuService.create(createComboMenuDto);
  }

  @Get()
  @Public()
  @UseGuards(RolesGuard)
  findAll(@Query() query: GetAllComboMenuDto) {
    return this.comboMenuService.findAll(query);
  }

  @Get(":id")
  @Public()
  @UseGuards(RolesGuard)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.comboMenuService.findOne(+id);
  }

  @Get("/service/:serviceId")
  @Public()
  @UseGuards(RolesGuard)
  findComboByService(@Param("serviceId", ParseIntPipe) serviceId: number) {
    return this.comboMenuService.findOneComboByService(+serviceId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateComboMenuDto: UpdateComboMenuDto,
  ) {
    return this.comboMenuService.update(+id, updateComboMenuDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.comboMenuService.remove(+id);
  }
}
