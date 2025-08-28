import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlRepository } from '../../src/urls/url.repository';
import { AppError } from '@repo/api/error';

describe('UrlRepository - findByUserId', () => {
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

    describe('findByUserId', () => {
        const userId = 'user-123';

        it('should successfully find URLs by user ID', async () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'url-1',
                    url: 'https://example1.com',
                    slug: 'test-slug-1',
                    user_id: userId,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null
                },
                {
                    id: 'url-2',
                    url: 'https://example2.com',
                    slug: 'test-slug-2',
                    user_id: userId,
                    created_at: new Date(),
                    updated_at: new Date(),
                    deleted_at: null
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].id).toBe('url-1');
                expect(result.value[1].id).toBe('url-2');
                expect(result.value[0].userId).toBe(userId);
                expect(result.value[1].userId).toBe(userId);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when user has no URLs', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(0);
            }
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URLs by user ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('invalid input syntax for type uuid');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URLs by user ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URLs by user ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle single URL result', async () => {
            // Arrange
            const mockDbRow = {
                id: 'url-1',
                url: 'https://example1.com',
                slug: 'test-slug-1',
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].id).toBe('url-1');
                expect(result.value[0].userId).toBe(userId);
            }
        });

        it('should handle large number of URLs', async () => {
            // Arrange
            const mockDbRows = Array.from({ length: 100 }, (_, i) => ({
                id: `url-${i}`,
                url: `https://example${i}.com`,
                slug: `test-slug-${i}`,
                user_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null
            }));

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlRepository.findByUserId(userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(100);
                expect(result.value[0].id).toBe('url-0');
                expect(result.value[99].id).toBe('url-99');
            }
        });
    });
});
