import { Result } from "neverthrow";
import { UserDto } from "@repo/api/users/user.dto";
import { User } from "@repo/api/users/user";
import { AppError } from "@repo/api/error";

export type CreateUser = (userData: Partial<UserDto>, providerId: string) => Promise<Result<User, AppError>>;
export type FindUserById = (id: string) => Promise<Result<User, AppError>>;
export type FindUserByEmail = (email: string) => Promise<Result<User, AppError>>;
export type FindUserByProviderId = (providerId: string) => Promise<Result<User, AppError>>;
export type UpdateUser = (id: string, updateData: Partial<UserDto>) => Promise<Result<User, AppError>>;
export type DeleteUser = (id: string) => Promise<Result<boolean, AppError>>;
