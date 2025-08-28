import { Result, err } from 'neverthrow';
import { UserDto } from '@repo/api/users/user.dto';
import { User } from '@repo/api/users/user';
import { AppError } from '@repo/api/error';
import { CreateUser, FindUserByEmail, FindUserByProviderId } from '../user.interfaces';

export class CreateUserUseCase {
    constructor(
        private readonly createUser: CreateUser,
        private readonly findUserByEmail: FindUserByEmail,
        private readonly findUserByProviderId: FindUserByProviderId,
    ) { }

    async execute(userData: Partial<UserDto>, providerId: string): Promise<Result<User, AppError>> {
        try {
            // Validate required fields
            if (!providerId || providerId.trim().length === 0) {
                return err(AppError.validation('Provider ID is required'));
            }

            if (userData.email && !this.isValidEmail(userData.email)) {
                return err(AppError.validation('Invalid email format'));
            }

            // Check if user already exists with this provider ID
            const existingUserResult = await this.findUserByProviderId(providerId);
            if (existingUserResult.isOk()) {
                return err(AppError.conflict('User already exists with this provider ID'));
            }

            // Check if email is already taken (if email is provided)
            if (userData.email) {
                const existingEmailResult = await this.findUserByEmail(userData.email);
                if (existingEmailResult.isOk()) {
                    return err(AppError.conflict('Email already exists'));
                } else if (existingEmailResult.isErr() && existingEmailResult.error.type !== 'NOT_FOUND') {
                    return existingEmailResult;
                }
            }

            return await this.createUser(userData, providerId);
        } catch (error) {
            return err(AppError.unhandled('Failed to create user', error));
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
