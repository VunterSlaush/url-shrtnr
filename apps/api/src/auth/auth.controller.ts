import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { AccessTokenGuard } from './guard/access-token.guard';
import { User } from '@repo/api/users/user';
import { AuthUser } from './auth-user.decorator';
import { COOKIE_CONFIG, setAuthCookies } from './auth.cookies';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { AuthResponseDto } from './auth.types';
import { Public } from 'src/public.decorator';
import { ApiTags } from '@nestjs/swagger';



@Controller("auth")
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
  ) { }


  /////////////////////////////////////
  // OAuth: Google
  /////////////////////////////////////

  @Get("oauth/google")
  @UseGuards(GoogleAuthGuard)
  @Public()
  googleAuth(): HttpStatus {
    return HttpStatus.OK;
  }

  @Get("oauth/google/callback")
  @UseGuards(GoogleAuthGuard)
  @Public()
  async googleAuthCallback(
    @Req() req: Request & { user: AuthResponseDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    setAuthCookies(res, req.user);
    res.redirect(process.env.APP_URL!);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async authenticateWithRefreshToken(
    @Req() req: Request & { user: AuthResponseDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    setAuthCookies(res, req.user);
  }


  @UseGuards(AccessTokenGuard)
  @Post("signout")
  @HttpCode(HttpStatus.OK)
  async signout(
    @Req() _req: Request & { user: AuthResponseDto },
    @Res({ passthrough: true }) res: Response,
    @AuthUser() authUser: User,
  ): Promise<HttpStatus> {

    const IS_DEV = this.configService.get<boolean>('IS_DEV');
    const IS_TEST = this.configService.get<boolean>('IS_TEST');

    const secure = !IS_DEV && !IS_TEST;
    const domain = _req.hostname.replace('localhost', '');

    // Clean cookies
    Object.entries(COOKIE_CONFIG).forEach(([key, _]) => {
      res.cookie(key, '', {
        maxAge: 0,
        secure,
        domain,
      });
    });

    return HttpStatus.OK;

  }


}
