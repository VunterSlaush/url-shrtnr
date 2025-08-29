import { Injectable } from '@nestjs/common';
import {
    JwtService,
    JwtSignOptions,
} from '@nestjs/jwt';
import {
    ok,
    Result,
} from 'neverthrow';
import { ConfigService } from '@nestjs/config';
import { User } from '@repo/api/users/user';
import { Env } from 'src/config/env';
import { AuthTokenAudience, Issuer, RefreshAudience } from './auth.constants';
import { ACCESS_DURATION, REFRESH_TOKEN_DURATION } from './auth.cookies';
import { AuthResponseDto, AuthToken } from './auth.types';




@Injectable()
export class AuthService {

    private jwtAccessTokenSecret: string;
    private jwtRefreshTokenSecret: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<Env, true>,
    ) {
        this.jwtAccessTokenSecret = this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET');
        this.jwtRefreshTokenSecret = this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET');
    }

    createAccessTokenSecret(userId: string) {
        return `${this.jwtAccessTokenSecret}__${userId}`;
    }

    createRefreshTokenSecret(salt: string) {
        return `${this.jwtRefreshTokenSecret}__${salt}`;
    }

    verifyRefreshToken(token: string) {
        const decoded = this.jwtService.decode(token, { complete: true });
        if (!decoded) return undefined;

        const secret = this.createRefreshTokenSecret(decoded.payload.jti as string);

        return this.jwtService.verify(token, { secret });
    }

    verifyAccessToken(token: string) {
        const decoded = this.jwtService.decode(token, { complete: true });
        if (!decoded) return undefined;

        const secret = this.createAccessTokenSecret(decoded.payload.sub as string);

        return this.jwtService.verify(token, { secret });
    }

    getIssuer() {
        return Issuer;
    }

    getRefreshTokenAudience() {
        return RefreshAudience;
    }

    getAuthTokenAudience() {
        return AuthTokenAudience;
    }

    async createAuthResponse(
        user: User,
        issueRefreshToken = true,
    ): Promise<Result<AuthResponseDto, Error>> {
        const accessToken = await this.createAccessToken(user);
        const refreshToken = issueRefreshToken
            ? await this.createRefreshToken(user)
            : null;


        return ok({
            user,
            accessToken,
            refreshToken,
        });
    }

    private async createAccessToken(user: User): Promise<AuthToken> {

        // The `sub` trait in the token represents the user id.
        const payload: Omit<User, 'id'> = {
            email: user.email,
            name: user.name,
            providerId: user.providerId,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const secret = this.createAccessTokenSecret(user.id);

        const jwtSignOptions = this.createJwtSignOptions(user, {
            secret,
            audience: this.getAuthTokenAudience(),
            expiresInSeconds: ACCESS_DURATION,
        });

        return {
            token: 'Bearer ' + this.jwtService.sign(payload, jwtSignOptions),
            expiresInSeconds: jwtSignOptions.expiresIn as number,
        };
    }

    private async createRefreshToken(user: User): Promise<AuthToken> {

        const jwtSignOptions = this.createJwtSignOptions(user, {
            secret: this.createRefreshTokenSecret(user.providerId),
            audience: this.getRefreshTokenAudience(),
            expiresInSeconds: REFRESH_TOKEN_DURATION,
        });

        return {
            token: 'Bearer ' + this.jwtService.sign({}, jwtSignOptions),
            expiresInSeconds: jwtSignOptions.expiresIn as number,
        };
    }

    private createJwtSignOptions(
        user: User,
        options: Partial<JwtSignOptions> & { secret: string; expiresInSeconds?: number; },
    ): JwtSignOptions {
        const jwtOptions = {
            expiresIn: options.expiresInSeconds,
            issuer: this.getIssuer(),
            jwtid: user.providerId,
            subject: user.id.toString(),
            ...options,
        };

        delete jwtOptions.expiresInSeconds;

        return jwtOptions;
    }
}
