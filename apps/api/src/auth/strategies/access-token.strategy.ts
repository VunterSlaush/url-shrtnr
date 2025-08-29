import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { User } from '@repo/api/users/user';
import { AuthService } from '../auth.service';
import { cookieExtractor } from '../auth.cookies';

export type AccessTokenPayload = {
    exp: number;
    iat: number;
    sub: string;
} & Omit<User, 'id'>;

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    'accessToken',
) {
    constructor(jwtService: JwtService, authService: AuthService) {
        /**
         * @see {@link https://github.com/mikenicholson/passport-jwt#configure-strategy}
         */
        super({
            issuer: authService.getIssuer(),
            audience: authService.getAuthTokenAudience(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKeyProvider: (_, jwtToken, done) => {

                const decodedToken = jwtService.decode<AccessTokenPayload | null>(
                    jwtToken,
                );

                if (!decodedToken) {
                    throw new UnauthorizedException('Access token is malformed. ->' + jwtToken);
                }

                /*
                The `secret` that signs each JWT token is unique per-user,
                adding an extra layer of security — if the secret of one token
                gets compromised, it doesn't automatically compromises all tokens.
                */
                const secret = authService.createAccessTokenSecret(decodedToken.sub);
                done(null, secret);
            },
        });
    }

    /**
     * @see {@link https://docs.nestjs.com/recipes/passport#implementing-passport-jwt}
     */
    validate(payload: AccessTokenPayload, done: VerifiedCallback) {
        const authUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            providerId: payload.providerId,
            avatarUrl: payload.avatarUrl,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        } as User;

        done(null, authUser);
    }
}
