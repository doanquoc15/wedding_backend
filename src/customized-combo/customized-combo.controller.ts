import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CustomizedComboService } from "./customized-combo.service";
import { CreateCustomizedComboDto } from "./dto/create-customized-combo.dto";
import { UpdateCustomizedComboDto } from "./dto/update-customized-combo.dto";
import { GetAllCustomizedComboMenuDto } from "./dto/custom-combo-menu";

@Controller("customized-combo")
export class CustomizedComboController {
  constructor(
    private readonly customizedComboService: CustomizedComboService,
  ) {}

  @Post()
  create(@Body() createCustomizedComboDto: CreateCustomizedComboDto) {
    return this.customizedComboService.create(createCustomizedComboDto);
  }

  @Get()
  findAll(@Query() query: GetAllCustomizedComboMenuDto) {
    return this.customizedComboService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customizedComboService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomizedComboDto: UpdateCustomizedComboDto,
  ) {
    return this.customizedComboService.update(+id, updateCustomizedComboDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customizedComboService.remove(+id);
  }
}
