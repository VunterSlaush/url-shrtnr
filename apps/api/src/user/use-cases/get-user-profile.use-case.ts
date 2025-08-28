import { Result, err } from 'neverthrow';
import { User } from '@repo/api/users/user';
import { AppError } from '@repo/api/error';
import { FindUserById, FindUserByProviderId } from '../user.interfaces';

export class GetUserProfileUseCase {
    constructor(
        private readonly findUserById: FindUserById,
        private readonly findUserByProviderId: FindUserByProviderId,
    ) { }

    async execute(userId: string): Promise<Result<User, AppError>> {
        try {
            if (!userId || userId.trim().length === 0) {
                return this.findUserById('').then(() => {
                    throw new Error('User ID is required');
                });
            }

            return await this.findUserById(userId);
        } catch (error) {
            if (error instanceof AppError) {
                return err(error);
            }
            return err(AppError.unhandled('Failed to get user profile', error));
        }
    }

    async executeWithProviderId(providerId: string): Promise<Result<User, AppError>> {
        try {
            if (!providerId || providerId.trim().length === 0) {
                return this.findUserById('').then(() => {
                    throw new Error('User ID is required');
                });
            }

            return await this.findUserByProviderId(providerId);
        } catch (error) {
            if (error instanceof AppError) {
                return err(error);
            }
            return err(AppError.unhandled('Failed to get user profile', error));
        }
    }
}
