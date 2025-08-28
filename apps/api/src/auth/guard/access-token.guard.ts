import type {
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    firstValueFrom,
    Observable,
} from 'rxjs';

import { AuthenticateWithRefreshTokenUseCase } from '../use-case/authenticate-with-refresh-token.use-case';
import { AuthService } from '../auth.service';
import { setAuthCookies } from '../auth.cookies';

/**
 * Guard that handles access token authentication and automatic token refresh.
 * Extends Passport's AuthGuard for access token strategy.
 *
 * This guard:
 * 1. Checks if endpoint is marked as public
 * 2. Attempts to refresh auth tokens if needed
 * 3. Validates the access token
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('accessToken') implements CanActivate {
    private readonly logger = new Logger(AccessTokenGuard.name);

    constructor(
        private readonly authService: AuthService,
        private readonly authenticateWithRefreshTokenUseCase: AuthenticateWithRefreshTokenUseCase,
    ) {
        super();
    }

    /**
     * Gets the request object from the context
     */
    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }


    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        return this.refreshAuthIfNeeded(context).then(() => {
            const result = super.canActivate(context);

            if (result instanceof Observable) {
                return firstValueFrom(result).then(r => r);
            }

            return result;
        }).catch(err => {
            throw err;
        });
    }

    private async refreshAuthIfNeeded(context: ExecutionContext) {
        const request = this.getRequest(context);
        const response = context.switchToHttp().getResponse();

        const refreshToken = request.cookies.refresh_token ?? '';
        const accessToken = request.cookies.access_token ?? '';

        // Verify both tokens
        const decodedRefreshToken = this.authService.verifyRefreshToken(refreshToken.replace('Bearer ', '') as string);
        const decodedAccessToken = this.authService.verifyAccessToken(accessToken.replace('Bearer ', '') as string);

        if (decodedRefreshToken && !decodedAccessToken) {
            const result = await this.authenticateWithRefreshTokenUseCase.execute(
                decodedRefreshToken.sub as string,
            );

            if (result.isOk()) {
                request.cookies.access_token = result.value.accessToken.token;
                setAuthCookies(response, result.value);
            }
        }
    }
}
