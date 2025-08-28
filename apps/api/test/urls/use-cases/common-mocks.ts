import { err, ok } from 'neverthrow';
import { AppError } from '@repo/api/error';
import { CreateUrl, FindUrlBySlug } from '../../../src/urls/url.interfaces';
import { createMockUrl } from './common';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';

export const NotFoundBySlug: FindUrlBySlug = async () => err(AppError.notFound('Slug not found'));
export const CreateUrlSuccess: CreateUrl = async (createUrlDto: CreateUrlDto, userId?: string) => ok(createMockUrl({
    ...createUrlDto,
    userId
}));