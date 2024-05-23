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

  /**
   * Handles user login
   * @param loginDto - Data transfer object containing login credentials
   * @param req - Request object containing user information
   * @returns JWT token for authenticated user
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.LOGIN_SUMMARY,
    description: ControllerRoute.ACTIONS.LOGIN_DESCRIPTION,
  })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Handles user signup
   * @param createUserDto - Data transfer object containing user registration information
   * @returns The created user information
   */
  @Post('signup')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.SIGNUP_SUMMARY,
    description: ControllerRoute.ACTIONS.SIGNUP_DESCRIPTION,
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  /**
   * Refreshes the authentication token
   * @param token - The old JWT token that needs to be refreshed
   * @returns A new JWT token
   */
  @Post('refresh')
  @ApiOperation({
    summary: ControllerRoute.ACTIONS.REFRESH_SUMMARY,
    description: ControllerRoute.ACTIONS.REFRESH_DESCRIPTION,
  })
  async refreshToken(@Body('token') token: string) {
    return await this.authService.refresh(token);
  }
}
