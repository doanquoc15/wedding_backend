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
import { ServiceService } from "./service.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { GetAllService } from "./dto/service.dto";
import { Public } from "../common/decorators";
import { RolesGuard } from "../common/guards/role.guard";

@Controller("service")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @Public()
  @UseGuards(RolesGuard)
  findAll(@Query() query: GetAllService) {
    return this.serviceService.findAll(query);
  }

  @Get(":id")
  @Public()
  @UseGuards(RolesGuard)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.serviceService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.serviceService.remove(+id);
  }
}
