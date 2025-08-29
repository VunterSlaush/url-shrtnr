import { Controller, Get } from '@nestjs/common';
import { User } from '@repo/api/users/user';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '@repo/api/users/user.dto';
import { mapAppErrorToHttpErrorInfo } from '@repo/api/error';

@Controller('users')
@ApiTags('Users')
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
            throw mapAppErrorToHttpErrorInfo(result.error);
        }

        return result.value;
    }

}
