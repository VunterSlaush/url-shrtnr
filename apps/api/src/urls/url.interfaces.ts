import { Result } from "neverthrow";
import { CreateUrlDto } from "@repo/api/urls/create-url.dto";
import { Url } from "@repo/api/urls/url";

export type CreateUrl = (createUrlDto: CreateUrlDto, userId?: string) => Promise<Result<Url, Error>>;
export type FindUrlBySlug = (slug: string) => Promise<Result<Url, Error>>;
export type FindUrlById = (id: string) => Promise<Result<Url, Error>>;
export type FindUrlsByUserId = (userId: string) => Promise<Result<Url[], Error>>;
export type UpdateUrl = (id: string, updateData: Partial<CreateUrlDto>) => Promise<Result<Url, Error>>;
export type DeleteUrl = (id: string) => Promise<Result<boolean, Error>>;