import type {
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from '@nestjs/passport';
import {
    firstValueFrom,
    Observable,
} from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthenticateWithRefreshTokenUseCase } from '../use-case/authenticate-with-refresh-token.use-case';
import { setAuthCookies } from '../auth.cookies';
import { IS_PUBLIC_KEY } from '../../public.decorator';

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
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly authenticateWithRefreshTokenUseCase: AuthenticateWithRefreshTokenUseCase,
    ) {
        super();
    }

    /**
     * Gets the request object from either REST or GraphQL context
     */
    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }

    /**
     * Main guard method that determines if a request can proceed
     * @param context The execution context
     * @returns A boolean or Promise/Observable of boolean indicating if access is allowed
     */
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // Check if endpoint is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const x = this.refreshAuthIfNeeded(context).then(() => {
            const result = super.canActivate(context);

            // Handle different return types from parent guard
            if (result instanceof Promise) {
                return result.then(r => r || isPublic);
            }

            if (result instanceof Observable) {
                return firstValueFrom(result).then(r => r || isPublic);
            }

            return result || isPublic;
        }).catch(err => {
            if (isPublic) return isPublic;
            throw err;
        });

        return x;
    }

    /**
     * Checks if token refresh is needed and handles the refresh flow
     * @param context The execution context
     */
    private async refreshAuthIfNeeded(context: ExecutionContext) {
        const request = this.getRequest(context);
        const response = context.switchToHttp().getResponse();

        const refreshToken = request.cookies.refresh_token ?? '';
        const accessToken = request.cookies.access_token ?? '';

        // Verify both tokens
        const decodedRefreshToken = this.authService.verifyRefreshToken(refreshToken.replace('Bearer ', ''));
        const decodedAccessToken = this.authService.verifyAccessToken(accessToken.replace('Bearer ', ''));

        // If refresh token is valid but access token is not, attempt refresh
        if (decodedRefreshToken && !decodedAccessToken) {
            const result = await this.authenticateWithRefreshTokenUseCase.execute(
                decodedRefreshToken.sub
            );

            if (result.isOk()) {
                // Update request and response with new tokens
                request.cookies.access_token = result.value.accessToken.token;
                setAuthCookies(response, result.value);
            }
        }
    }
}
