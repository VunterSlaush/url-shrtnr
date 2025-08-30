import {
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type {
  Profile,
  VerifiedCallback,
} from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { Env } from 'src/config/env'
import { User } from '@repo/api/users/user';
import { AuthenticateWithOauthUseCase } from '../use-case/authenticate-with-oauth.use-case';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    configService: ConfigService<Env, true>,
    private readonly authenticateWithOauthUseCase: AuthenticateWithOauthUseCase,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow('SELF_DOMAIN')}/auth/oauth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<void> {

    const oauthDto = this.toOauthDto(profile);

    const result = await this.authenticateWithOauthUseCase.execute(oauthDto);

    if (result.isOk()) {
      done(undefined, { ...result.value });
    }
    else {
      done(result.error, undefined);
    }

  }

  private toOauthDto(profile: Profile): User {
    return {
      id: profile.id,
      providerId: profile.id,
      avatarUrl: this.resizeProfileImage(profile.photos[0].value as string),
      name: profile.displayName ||
        [profile.name.givenName, profile.name.familyName]
          .map(s => (s || '').trim())
          .join(' ') || '',
      email: profile.emails[0].value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private resizeProfileImage(url: string): string {
    // https://developers.google.com/people/image-sizing
    return url.replace('s=s96-c', 's=s256');
  }
}
