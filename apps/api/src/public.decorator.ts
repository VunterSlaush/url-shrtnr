import {
    applyDecorators,
    SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Use the decorator `@Public()` on controllers/resolvers methods
 * to skip any authentication strategy applied by guards.
 */
export function Public() {
    return applyDecorators(
        SetMetadata(IS_PUBLIC_KEY, true),
        SetMetadata('swagger/apiSecurity', ['public']),
    );
}
