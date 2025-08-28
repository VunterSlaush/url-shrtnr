import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { User } from '@repo/api/users/user';

/**
 * Parameter decorator that provides access to the authenticated user.
 *
 * When used in controllers or resolvers, injects the current authenticated user.
 * The user object is extracted from the request object where it was previously
 * attached by the authentication middleware.
 *
 * @example
 * async findOne(@AuthUser() user: User) {
 *   return this.service.find(user.id);
 * }
 */
export function AuthUser() {
    return createParamDecorator<User>(
        (_data: unknown, context: ExecutionContext) => {
            const request = context.switchToHttp().getRequest()
            const user = request.user as User;
            return user;
        },
    )();
}