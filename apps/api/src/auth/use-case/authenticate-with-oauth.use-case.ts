
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GetUserProfileUseCase } from 'src/user/use-cases/get-user-profile.use-case';
import { CreateUserUseCase } from 'src/user/use-cases/create-user.use-case';
import { User } from '@repo/api/users/user';

@Injectable()
export class AuthenticateWithOauthUseCase {
    constructor(
        private readonly getProfileUseCase: GetUserProfileUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly authService: AuthService,
    ) { }

    async execute(userDto: Omit<User, 'id'>) {
        const userResult = await this.getProfileUseCase.executeWithProviderId(userDto.providerId);

        if (userResult.isErr() && userResult.error.isNotFound()) {
            return this.onSignUp(userDto);
        }

        if (userResult.isOk()) {
            return this.authService.createAuthResponse(userResult.value, true);
        }

        return userResult;
    }



    async onSignUp(userDto: Omit<User, 'id'>) {
        const createdUserResult = await this.createUserUseCase.execute(userDto, userDto.providerId);

        if (createdUserResult.isErr()) {
            return createdUserResult;
        }

        const authResult = await this.authService.createAuthResponse(createdUserResult.value, true);

        if (authResult.isErr()) {
            return authResult;
        }

        return authResult;
    }
}
