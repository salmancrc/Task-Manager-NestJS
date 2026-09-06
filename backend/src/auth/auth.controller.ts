import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create.auth.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signin(signinDto);

    // Set the HttpOnly cookie
    res.cookie('taskify_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Logged in successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return { isAuthenticated: true, user: req.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('taskify_token'); // Clear the cookie to log out
    return { message: 'Logged out successfully' };
  }
}
