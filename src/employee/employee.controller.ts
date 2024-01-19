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
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeDto } from "./dto/EmployeeDto.dto";
import { Public } from "../common/decorators";

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: EmployeeDto) {
    return this.employeeService.findAll(query);
  }

  @Get(":id")
  @Public()
  findOne(@Param("id") id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employeeService.remove(+id);
  }
}
