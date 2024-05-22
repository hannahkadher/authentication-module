import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ControllerRoute } from '../../constants/controller-route';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../services';
import { CreateUserDto, LoginDto } from '../dto';

@ApiTags('Authentication Controller')
@Controller(ControllerRoute.AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.LOGIN_SUMMARY,
    description: ControllerRoute.ACTIONS.LOGIN_DESCRIPTION,
  })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.SIGNUP_SUMMARY,
    description: ControllerRoute.ACTIONS.SIGNUP_DESCRIPTION,
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh')
  async refreshToken(@Body('token') token: string) {
    return await this.authService.refresh(token);
  }
}
