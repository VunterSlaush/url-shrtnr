import { Result } from "neverthrow";
import { CreateUrlDto } from "@repo/api/urls/create-url.dto";
import { Url } from "@repo/api/urls/url";
import { AppError } from "@repo/api/error";

export type CreateUrl = (createUrlDto: CreateUrlDto, userId?: string) => Promise<Result<Url, AppError>>;
export type FindUrlBySlug = (slug: string) => Promise<Result<Url, AppError>>;
export type FindUrlById = (id: string) => Promise<Result<Url, AppError>>;
export type FindUrlsByUserId = (userId: string) => Promise<Result<Url[], AppError>>;
export type UpdateUrl = (id: string, updateData: Partial<CreateUrlDto>) => Promise<Result<Url, AppError>>;
export type DeleteUrl = (id: string, userId: string) => Promise<Result<boolean, AppError>>;