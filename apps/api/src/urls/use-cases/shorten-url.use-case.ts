import { URL_VALIDATION_REGEX } from '@repo/api/urls/constants';
import { Result, err } from 'neverthrow';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { AppError, AppErrorType } from '@repo/api/error';
import { CreateUrl, FindUrlBySlug } from '../url.interfaces';


export class ShortenUrlUseCase {
    constructor(
        private readonly createUrl: CreateUrl,
        private readonly findUrlBySlug: FindUrlBySlug,
    ) { }

    async execute(createUrlDto: CreateUrlDto, userId?: string): Promise<Result<Url, AppError>> {
        try {

            if (createUrlDto.url === undefined || createUrlDto.url === null || createUrlDto.url.length === 0) {
                return err(AppError.validation('Url is required'));
            }

            if (!this.isValidUrl(createUrlDto.url)) {
                return err(AppError.validation('Invalid Url format'));
            }

            if (createUrlDto.slug) {
                const existingUrlResult = await this.findUrlBySlug(createUrlDto.slug);
                if (existingUrlResult.isOk()) {
                    return err(AppError.conflict('Slug already exists'));
                } else if (existingUrlResult.isErr() && existingUrlResult.error.type !== AppErrorType.NOT_FOUND) {
                    return existingUrlResult;
                }
            } else {
                createUrlDto.slug = this.generateSlug();
            }

            return await this.createUrl(createUrlDto, userId);
        } catch (error) {
            return err(AppError.unhandled('Failed to shorten URL', error));
        }
    }


    isValidUrl(url: string): boolean {
        return URL_VALIDATION_REGEX.test(url);
    }


    generateSlug(): string {

        // TODO: Replace with a more robust slug generator
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let slug = '';
        for (let i = 0; i < 8; i++) {
            slug += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return slug;
    }


}
