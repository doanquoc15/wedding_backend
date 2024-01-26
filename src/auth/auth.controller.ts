import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { Public } from "../common/decorators";
import { AuthService } from "./auth.service";
import { AuthDto, SignInDto } from "./dto";
import { Tokens } from "./types";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, description: "Signup successfully!" })
  @ApiResponse({ status: 401, description: "Signup failed!" })
  @Public()
  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<any> {
    return this.authService.signupLocal(dto);
  }

  @ApiResponse({ status: 201, description: "Signin successfully!" })
  @ApiResponse({ status: 401, description: "Signin failed!" })
  @Public()
  @Post("/signin")
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }
}
