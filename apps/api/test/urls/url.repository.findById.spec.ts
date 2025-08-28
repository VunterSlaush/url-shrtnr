import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';

import { AppError } from '@repo/api/error';
import { UrlRepository } from '../../src/urls/url.repository';

describe('UrlRepository - findById', () => {
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

    describe('findById', () => {
        const urlId = 'url-123';

        it('should successfully find a URL by ID', async () => {
            // Arrange
            const mockDbRow = {
                id: urlId,
                url: 'https://example.com',
                slug: 'test-slug',
                user_id: 'user-123',
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.findById(urlId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.id).toBe(urlId);
                expect(result.value.url).toBe('https://example.com');
                expect(result.value.slug).toBe('test-slug');
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return not found error when URL does not exist', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.findById(urlId);

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
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findById(urlId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('invalid input syntax for type uuid');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findById(urlId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findById(urlId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL by ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });
    });
});
