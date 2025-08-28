import { Pool } from 'pg';
import { Result, ok, err } from 'neverthrow';
import { User } from '@repo/api/users/user';
import { UserDto } from '@repo/api/users/user.dto';
import { AppError } from '@repo/api/error';
import {
    createUserQuery,
    findUserByIdQuery,
    findUserByEmailQuery,
    findUserByProviderIdQuery,
    updateUserQuery,
    deleteUserQuery
} from './queries';
import { UserMapper } from './user.mapper';
import { Inject, Injectable } from '@nestjs/common';
import {
    CreateUser,
    FindUserById,
    FindUserByEmail,
    FindUserByProviderId,
    UpdateUser,
    DeleteUser
} from './user.interfaces';

@Injectable()
export class UserRepository {
    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }

    create: CreateUser = async (userData: Partial<UserDto>, providerId: string): Promise<Result<User, AppError>> => {
        try {
            const { query, values } = createUserQuery(userData, providerId);
            const result = await this.pool.query(query, values);
            const user = UserMapper.mapRowToUser(result.rows[0]);
            return ok(user);
        } catch (error) {
            return err(AppError.unhandled('Failed to create user', error));
        }
    };

    findById: FindUserById = async (id: string): Promise<Result<User, AppError>> => {
        try {
            const { query, values } = findUserByIdQuery(id);
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return err(AppError.notFound('User not found'));
            }

            const user = UserMapper.mapRowToUser(result.rows[0]);
            return ok(user);
        } catch (error) {
            return err(AppError.unhandled('Failed to find user by ID', error));
        }
    };

    findByEmail: FindUserByEmail = async (email: string): Promise<Result<User, AppError>> => {
        try {
            const { query, values } = findUserByEmailQuery(email);
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return err(AppError.notFound('User not found'));
            }

            const user = UserMapper.mapRowToUser(result.rows[0]);
            return ok(user);
        } catch (error) {
            return err(AppError.unhandled('Failed to find user by email', error));
        }
    };

    findByProviderId: FindUserByProviderId = async (providerId: string): Promise<Result<User, AppError>> => {
        try {
            const { query, values } = findUserByProviderIdQuery(providerId);
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return err(AppError.notFound('User not found'));
            }

            const user = UserMapper.mapRowToUser(result.rows[0]);
            return ok(user);
        } catch (error) {
            return err(AppError.unhandled('Failed to find user by provider ID', error));
        }
    };

    update: UpdateUser = async (id: string, updateData: Partial<UserDto>): Promise<Result<User, AppError>> => {
        try {
            if (updateData.email === undefined && updateData.name === undefined && updateData.avatarUrl === undefined) {
                return this.findById(id);
            }

            const { query, values } = updateUserQuery(updateData, id);
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                return err(AppError.notFound('User not found'));
            }

            const user = UserMapper.mapRowToUser(result.rows[0]);
            return ok(user);
        } catch (error) {
            if (error instanceof AppError) {
                return err(error);
            }
            return err(AppError.unhandled('Failed to update user', error));
        }
    };

    delete: DeleteUser = async (id: string): Promise<Result<boolean, AppError>> => {
        try {
            const { query, values } = deleteUserQuery(id);
            const result = await this.pool.query(query, values);
            return ok(result.rowCount > 0);
        } catch (error) {
            return err(AppError.unhandled('Failed to delete user', error));
        }
    };
}
