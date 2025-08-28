import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { AppError } from '@repo/api/error';
import { UrlRepository } from '../../src/urls/url.repository';

describe('UrlRepository - delete', () => {
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

    describe('delete', () => {
        const urlId = 'url-123';
        const userId = 'user-123';

        it('should successfully delete a URL', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rowCount: 1 });

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(true);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return false when URL does not exist', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rowCount: 0 });

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(false);
            }
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to delete URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('update or delete on table "urls" violates foreign key constraint');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to delete URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database connection timeouts', async () => {
            // Arrange
            const mockError = new Error('timeout acquiring a connection from the pool');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to delete URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle invalid UUID format', async () => {
            // Arrange
            const mockError = new Error('invalid input syntax for type uuid');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to delete URL');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle multiple rows affected', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rowCount: 3 });

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(true);
            }
        });

        it('should handle null rowCount', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rowCount: null });

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(false);
            }
        });

        it('should handle undefined rowCount', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rowCount: undefined });

            // Act
            const result = await urlRepository.delete(urlId, userId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(false);
            }
        });
    });
});
