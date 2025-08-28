import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlRepository } from '../../src/urls/url.repository';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { AppError } from '@repo/api/error';

describe('UrlRepository - create', () => {
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

    describe('create', () => {
        const createUrlDto: CreateUrlDto = {
            url: 'https://example.com',
            slug: 'test-slug'
        };
        const userId = 'user-123';

        it('should successfully create a URL', async () => {
            // Arrange
            const mockDbRow = {
                id: 'url-123',
                url: createUrlDto.url,
                slug: createUrlDto.slug,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.create(createUrlDto, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.url).toBe(createUrlDto.url);
                expect(result.value.slug).toBe(createUrlDto.slug);
                expect(result.value.userId).toBe(userId);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.create(createUrlDto, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should return error when database returns no rows', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.create(createUrlDto, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('duplicate key value violates unique constraint "urls_slug_key"');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.create(createUrlDto, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.create(createUrlDto, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });
    });
});
