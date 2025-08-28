import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { UserRepository } from './user.repository';
import { PgModule } from '../postgres/pg.module';

const createUserUseCaseProvider = {
    provide: CreateUserUseCase,
    inject: [UserRepository],
    useFactory: (userRepository: UserRepository) => {
        return new CreateUserUseCase(
            userRepository.create,
            userRepository.findByEmail,
            userRepository.findByProviderId
        );
    }
};

const getUserProfileUseCaseProvider = {
    provide: GetUserProfileUseCase,
    inject: [UserRepository],
    useFactory: (userRepository: UserRepository) => {
        return new GetUserProfileUseCase(
            userRepository.findById,
            userRepository.findByProviderId,
        );
    }
};

@Module({
    imports: [
        PgModule,
    ],
    controllers: [UserController],
    providers: [
        UserRepository,
        createUserUseCaseProvider,
        getUserProfileUseCaseProvider,
    ],
    exports: [
        createUserUseCaseProvider,
        getUserProfileUseCaseProvider,
    ],
})
export class UserModule { }
