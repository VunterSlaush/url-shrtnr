import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@repo/api/users/user';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from '@repo/api/users/user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
    ) { }


    @Get('/profile')
    @ApiOkResponse({
        type: () => User,
        description: 'The user profile',
    })
    async getUserProfile(@AuthUser() authUser: User): Promise<UserDto> {
        const result = await this.getUserProfileUseCase.execute(authUser.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }

        return result.value;
    }

}
