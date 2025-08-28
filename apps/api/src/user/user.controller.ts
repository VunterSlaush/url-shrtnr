import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@repo/api/users/user';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Controller('users')
export class UserController {
    constructor(
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
    ) { }


    @Get('/profile')
    async getUserProfile(@AuthUser() authUser: User): Promise<User> {
        const result = await this.getUserProfileUseCase.execute(authUser.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }

        return result.value;
    }

}
