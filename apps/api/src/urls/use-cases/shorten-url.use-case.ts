import { Result, err } from 'neverthrow';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { CreateUrl, FindUrlBySlug } from '../url.interfaces';


export class ShortenUrlUseCase {
    constructor(
        private readonly createUrl: CreateUrl,
        private readonly findUrlBySlug: FindUrlBySlug,
    ) { }

    async execute(createUrlDto: CreateUrlDto, userId?: string): Promise<Result<Url, Error>> {
        try {

            if (createUrlDto.url === undefined || createUrlDto.url === null || createUrlDto.url.length === 0) {
                return err(new Error('Url is required')); // TODO: Add Typification
            }

            if (!this.isValidUrl(createUrlDto.url)) {
                return err(new Error('Invalid Url format')); // TODO: Add Typification
            }

            if (createUrlDto.slug) {
                const existingUrlResult = await this.findUrlBySlug(createUrlDto.slug);
                if (existingUrlResult.isOk()) {
                    return err(new Error('Slug already exists')); // TODO: Add Typification
                }
            } else {
                createUrlDto.slug = this.generateSlug();

            }

            // Create the new URL
            return this.createUrl(createUrlDto, userId);
        } catch (error) {
            return err(error instanceof Error ? error : new Error('Failed to shorten URL'));
        }
    }


    isValidUrl(url: string): boolean {
        try {
            // If URL doesn't start with a protocol, prepend https://
            const urlToValidate = url.match(/^https?:\/\//) ? url : `https://${url}`;
            new URL(urlToValidate);
            return true;
        } catch {
            return false;
        }
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
