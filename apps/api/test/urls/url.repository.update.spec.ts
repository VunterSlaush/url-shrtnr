import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { AppError } from '@repo/api/error';
import { UrlRepository } from '../../src/urls/url.repository';

describe('UrlRepository - update', () => {
    let urlRepository: UrlRepository;
    let mockPool: jest.Mocked<Pool>;

    beforeEach(() => {
        mockPool = {
            query: jest.fn()
        } as any;

        urlRepository = new UrlRepository(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('update', () => {
        const urlId = 'url-123';
        const userId = 'user-123';

        it('should successfully update URL with new data', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: 'https://updated-example.com',
                slug: 'updated-slug'
            };

            const mockDbRow = {
                id: urlId,
                url: updateData.url,
                slug: updateData.slug,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.url).toBe(updateData.url);
                expect(result.value.slug).toBe(updateData.slug);
                expect(result.value.id).toBe(urlId);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should successfully update only URL', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: 'https://updated-example.com'
            };

            const mockDbRow = {
                id: urlId,
                url: updateData.url,
                slug: 'original-slug',
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.url).toBe(updateData.url);
                expect(result.value.slug).toBe('original-slug');
            }
        });

        it('should successfully update only slug', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                slug: 'updated-slug'
            };

            const mockDbRow = {
                id: urlId,
                url: 'https://original-example.com',
                slug: updateData.slug,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.url).toBe('https://original-example.com');
                expect(result.value.slug).toBe(updateData.slug);
            }
        });

        it('should return existing URL when no update data provided', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {};
            const existingUrl = {
                id: urlId,
                url: 'https://original-example.com',
                slug: 'original-slug',
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [existingUrl] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.id).toBe(urlId);
                expect(result.value.url).toBe('https://original-example.com');
                expect(result.value.slug).toBe('original-slug');
            }
        });

        it('should return not found error when URL does not exist', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: 'https://updated-example.com'
            };

            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL not found');
                expect(result.error.isNotFound()).toBe(true);
            }
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: 'https://updated-example.com'
            };

            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to update URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                slug: 'duplicate-slug'
            };

            const mockError = new Error('duplicate key value violates unique constraint "urls_slug_key"');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to update URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: 'https://updated-example.com'
            };

            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to update URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle partial updates with undefined values', async () => {
            // Arrange
            const updateData: Partial<CreateUrlDto> = {
                url: undefined,
                slug: undefined
            };

            const existingUrl = {
                id: urlId,
                url: 'https://original-example.com',
                slug: 'original-slug',
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [existingUrl] });

            // Act
            const result = await urlRepository.update(urlId, updateData);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.id).toBe(urlId);
                expect(result.value.url).toBe('https://original-example.com');
                expect(result.value.slug).toBe('original-slug');
            }
        });
    });
});
