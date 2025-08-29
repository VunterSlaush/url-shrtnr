
import {
    Global,
    Module,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';

import { AuthTokenAudience, Issuer, RefreshAudience } from './auth.constants';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AuthController } from './auth.controller';
import { AuthenticateWithOauthUseCase } from './use-case/authenticate-with-oauth.use-case';
import { GetUserProfileUseCase } from 'src/user/use-cases/get-user-profile.use-case';
import { CreateUserUseCase } from 'src/user/use-cases/create-user.use-case';
import { AuthenticateWithRefreshTokenUseCase } from './use-case/authenticate-with-refresh-token.use-case';


const authenticateWithOauthUseCaseProvider = {
    provide: AuthenticateWithOauthUseCase,
    inject: [GetUserProfileUseCase, CreateUserUseCase, AuthService],
    useFactory: (getProfileUseCase: GetUserProfileUseCase, createUserUseCase: CreateUserUseCase, authService: AuthService) => {
        return new AuthenticateWithOauthUseCase(
            getProfileUseCase,
            createUserUseCase,
            authService,
        );
    }
};


const authenticateWithRefreshTokenUseCaseProvider = {
    provide: AuthenticateWithRefreshTokenUseCase,
    inject: [GetUserProfileUseCase, AuthService],
    useFactory: (getUser: GetUserProfileUseCase, authService: AuthService) => {
        return new AuthenticateWithRefreshTokenUseCase(getUser, authService);
    }
};

@Global()
@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'accessToken' }),
        JwtModule.register({
            verifyOptions: {
                audience: [RefreshAudience, AuthTokenAudience],
                issuer: Issuer,
                ignoreExpiration: false,
                ignoreNotBefore: false,
            },
        }),
    ],
    providers: [
        AuthService,
        AccessTokenStrategy,
        GoogleStrategy,
        RefreshTokenStrategy,
        authenticateWithOauthUseCaseProvider,
        authenticateWithRefreshTokenUseCaseProvider,
    ],
    controllers: [AuthController],
    exports: [AuthService, authenticateWithRefreshTokenUseCaseProvider],
})
export class AuthModule { }
