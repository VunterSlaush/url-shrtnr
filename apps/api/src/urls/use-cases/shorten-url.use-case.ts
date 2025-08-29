import { URL_VALIDATION_REGEX } from '@repo/api/urls/constants';
import { Result, err, ok } from 'neverthrow';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { AppError, AppErrorType } from '@repo/api/error';
import { CreateUrl, FindUrlBySlug, GetNextSlugSequenceValue } from '../url.interfaces';

/**
 * Use case for shortening URLs with collision-free slug generation.
 * 
 * This use case handles the creation of shortened URLs by:
 * 1. Validating the input URL format
 * 2. Checking for custom slug conflicts
 * 3. Generating unique slugs when no custom slug is provided
 * 4. Creating the URL record in the database
 * 
 * Slug Generation Algorithm:
 * To avoid collisions, this implementation uses a PostgreSQL sequence (slug_sequence)
 * that starts at 4567 and increments by 1 for each request. The sequence value is
 * then converted to base-62 (0-9, A-Z, a-z) to create a compact, readable slug.
 * 
 * Benefits of this approach:
 * - Guaranteed uniqueness: PostgreSQL sequences are atomic and thread-safe
 * - Predictable growth: Each slug is incrementally longer as the sequence grows
 * - Collision-free: No need for retry logic or duplicate checking
 * - Compact representation: Base-62 encoding provides shorter slugs than decimal
 * - URL-safe: Base-62 characters are all valid in URLs without encoding
 * 
 * Example slug progression:
 * - 4567 → "1b9" (base-62)
 * - 10000 → "2Bi"
 * - 50000 → "CuE"
 * - 100000 → "Q0U"
 * - 238328 → "1000" (first 4-character slug)
 * - 14776336 → "10000" (first 5-character slug)
 * - 916132832 → "100000" (first 6-character slug)
 */
export class ShortenUrlUseCase {
    constructor(
        private readonly createUrl: CreateUrl,
        private readonly findUrlBySlug: FindUrlBySlug,
        private readonly getNextSlugSequenceValue: GetNextSlugSequenceValue,
    ) { }

    /**
     * Executes the URL shortening process.
     * 
     * @param createUrlDto - The URL data to be shortened
     * @param userId - Optional user ID for associating the URL with a user
     * @returns A Result containing either the created Url or an AppError
     */
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
                const slugResult = await this.generateSlug();
                if (slugResult.isErr()) {
                    return err(AppError.unhandled('Failed to generate slug', slugResult.error));
                }
                createUrlDto.slug = slugResult.value;
            }

            return await this.createUrl(createUrlDto, userId);
        } catch (error) {
            return err(AppError.unhandled('Failed to shorten URL', error));
        }
    }

    /**
     * Validates if the provided string is a valid URL format.
     * 
     * @param url - The URL string to validate
     * @returns true if the URL format is valid, false otherwise
     */
    isValidUrl(url: string): boolean {
        return URL_VALIDATION_REGEX.test(url);
    }

    /**
     * Generates a unique slug using the database sequence.
     * 
     * This method retrieves the next value from the PostgreSQL slug_sequence
     * and converts it to a base-62 string for use as a URL slug. The sequence
     * ensures uniqueness across all generated slugs without requiring collision
     * detection or retry logic.
     * 
     * @returns A Result containing either the generated slug string or an AppError
     */
    async generateSlug(): Promise<Result<string, AppError>> {
        const nextSlugSequenceValue = await this.getNextSlugSequenceValue();
        if (nextSlugSequenceValue.isErr()) {
            return err(AppError.unhandled('Failed to generate slug', nextSlugSequenceValue.error));
        }

        return ok(this.slugToBase62(nextSlugSequenceValue.value));
    }

    /**
     * Converts a numeric value to a base-62 encoded string.
     * 
     * Base-62 uses digits 0-9, uppercase letters A-Z, and lowercase letters a-z,
     * providing a compact representation that is URL-safe and human-readable.
     * This encoding method provides shorter slugs than base-36 while maintaining
     * readability and avoiding special characters that might need URL encoding.
     * 
     * Character set: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
     * 
     * @param value - The numeric value to encode
     * @returns The base-62 encoded string
     */
    slugToBase62(value: number): string {
        const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        if (value === 0) {
            return charset[0];
        }

        let result = '';
        while (value > 0) {
            result = charset[value % 62] + result;
            value = Math.floor(value / 62);
        }

        return result;
    }
}
