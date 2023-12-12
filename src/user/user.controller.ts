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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { GetAllUsers } from "./dto/user.dto";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: GetAllUsers) {
    return this.userService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles("CUSTOMER", "ADMIN")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  //@Public()
  //@UseGuards(RtGuard)
  @Get("/me/my-account")
  getMe(@GetCurrentUserId() userId) {
    return this.userService.getMe(+userId);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateUserDto: any) {
    console.log(updateUserDto);
    return this.userService.update(+id, updateUserDto);
  }

  @Patch("change-password/:id")
  changePassword(
    @Param("id") id: string,
    @Body() passwordUpdate: ChangePasswordDto,
  ) {
    return this.userService.changePass(+id, passwordUpdate);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
