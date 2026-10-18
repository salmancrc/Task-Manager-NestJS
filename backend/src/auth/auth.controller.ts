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
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create.auth.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import type { Request, Response } from 'express';

const ACCESS_COOKIE = 'taskify_token';
const REFRESH_COOKIE = 'taskify_refresh';

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
    const { accessToken, refreshToken } =
      await this.authService.signin(signinDto);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return { message: 'Logged in successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;

    if (!rawRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { accessToken, refreshToken } =
      await this.authService.refresh(rawRefreshToken);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return { message: 'Token refreshed successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return { isAuthenticated: true, user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;

    if (rawRefreshToken) {
      await this.authService.logout(rawRefreshToken);
    }

    res.clearCookie(ACCESS_COOKIE);
    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });

    return { message: 'Logged out successfully' };
  }
}
