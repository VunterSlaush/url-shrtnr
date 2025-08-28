import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlRepository } from '../../src/urls/url.repository';
import { AppError } from '@repo/api/error';

describe('UrlRepository - findBySlug', () => {
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

    describe('findBySlug', () => {
        const slug = 'test-slug';

        it('should successfully find a URL by slug', async () => {
            // Arrange
            const mockDbRow = {
                id: 'url-123',
                url: 'https://example.com',
                slug: slug,
                user_id: 'user-123',
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.findBySlug(slug);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.slug).toBe(slug);
                expect(result.value.url).toBe('https://example.com');
                expect(result.value.id).toBe('url-123');
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return not found error when URL with slug does not exist', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.findBySlug(slug);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL not found');
            }
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findBySlug(slug);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by slug');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('invalid input syntax for type text');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findBySlug(slug);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by slug');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findBySlug(slug);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by slug');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle empty slug parameter', async () => {
            // Arrange
            const emptySlug = '';
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.findBySlug(emptySlug);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL not found');
            }
        });
    });
});
