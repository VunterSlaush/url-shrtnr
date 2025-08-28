import { Result } from 'neverthrow';
import { Url } from '@repo/api/urls/url';
import { AppError } from '@repo/api/error';
import { FindUrlBySlug } from '../url.interfaces';

export class GetUrlBySlugUseCase {
    constructor(
        private readonly findUrlBySlug: FindUrlBySlug,
    ) { }

    async execute(slug: string): Promise<Result<Url, AppError>> {
        return this.findUrlBySlug(slug);
    }
}
