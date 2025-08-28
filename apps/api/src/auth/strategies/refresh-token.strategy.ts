import { AuthService } from '../auth.service';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { AuthenticateWithRefreshTokenUseCase } from '../use-case/authenticate-with-refresh-token.use-case';

import { User } from '@repo/api/users/user';
import { cookieExtractor, refreshCookieExtractor } from '../auth.cookies';

type RefreshTokenPayload = {
  exp: number;
  iat: number;
  sub: string;
  jti: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly authenticateWithRefreshTokenUseCase: AuthenticateWithRefreshTokenUseCase,
  ) {
    /**
     * @see {@link https://github.com/mikenicholson/passport-jwt#configure-strategy}
     */
    super({
      issuer: authService.getIssuer(),
      audience: authService.getRefreshTokenAudience(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        refreshCookieExtractor,
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKeyProvider: (_, jwtToken: string, done) => {
        const decodedToken = jwtService.decode(jwtToken, { complete: true });

        if (!decodedToken || !this.isARefreshToken(decodedToken)) {
          throw new UnauthorizedException('Refresh token is malformed.');
        }

        // The `jti` was previously set by `authService.createJwtSignOptions()` as jwtid
        const secret = authService.createRefreshTokenSecret(
          decodedToken.payload.jti as string,
        );

        done(null, secret);
      },
    });
  }

  /**
   * @see {@link https://docs.nestjs.com/recipes/passport#implementing-passport-jwt}
   */
  async validate(payload: RefreshTokenPayload, done): Promise<User> {
    const result = await this.authenticateWithRefreshTokenUseCase.execute(
      payload.sub
    );

    if (result.isErr()) {
      throw result.error;
    }

    return done(null, result.value);
  }

  isARefreshToken(decodedToken: any) {
    return decodedToken.payload.aud === this.authService.getRefreshTokenAudience();
  }
}
