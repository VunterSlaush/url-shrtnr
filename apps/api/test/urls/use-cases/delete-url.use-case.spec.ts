import { describe, expect, it } from '@jest/globals';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { DeleteUrlUseCase } from '../../../src/urls/use-cases/delete-url.user-case';
import { AppError } from '@repo/api/error';
import { DeleteUrl } from '../../../src/urls/url.interfaces';

describe('DeleteUrlUseCase', () => {

    describe('execute', () => {
        const testCases = [
            {
                name: 'should successfully delete URL when deletion succeeds',
                id: 'url-123',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should return error when URL not found',
                id: 'non-existent-url',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.notFound('URL not found')),
                shouldSucceed: false,
                errorMessage: 'URL not found'
            },
            {
                name: 'should return error when database operation fails',
                id: 'url-123',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.unhandled('Database connection error')),
                shouldSucceed: false,
                errorMessage: 'Database connection error'
            },
            {
                name: 'should handle empty ID',
                id: '',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.validation('Invalid URL ID')),
                shouldSucceed: false,
                errorMessage: 'Invalid URL ID'
            },
            {
                name: 'should handle very long ID',
                id: 'a'.repeat(1000),
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should handle ID with special characters',
                id: 'url-123_456@example.com',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should return error when repository throws unexpected error',
                id: 'url-999',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.unhandled('Unexpected repository error')),
                shouldSucceed: false,
                errorMessage: 'Unexpected repository error'
            },
            {
                name: 'should handle ID with unicode characters',
                id: 'url-ñáéíóú-123',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should handle case sensitive ID',
                id: 'Url-123',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should handle numeric ID',
                id: '123456',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should handle UUID format ID',
                id: '550e8400-e29b-41d4-a716-446655440000',
                userId: 'user-123',
                deleteUrlMock: async () => ok(true),
                shouldSucceed: true,
                expectedValue: true
            },
            {
                name: 'should return error when deletion fails due to foreign key constraint',
                id: 'url-123',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.conflict('Cannot delete URL due to existing references')),
                shouldSucceed: false,
                errorMessage: 'Cannot delete URL due to existing references'
            },
            {
                name: 'should return error when deletion fails due to permission issues',
                id: 'url-123',
                userId: 'user-123',
                deleteUrlMock: async () => err(AppError.validation('Insufficient permissions to delete this URL')),
                shouldSucceed: false,
                errorMessage: 'Insufficient permissions to delete this URL'
            }
        ];

        testCases.forEach(({ name, id, userId, deleteUrlMock, shouldSucceed, expectedValue, errorMessage }) => {
            it(name, async () => {
                const deleteUrlUseCase = new DeleteUrlUseCase(deleteUrlMock);

                const result = await deleteUrlUseCase.execute(id, userId);

                if (shouldSucceed && result.isOk()) {
                    expect(result.isOk()).toBe(true);
                    expect(result.value).toBe(expectedValue);
                } else if (!shouldSucceed && result.isErr()) {
                    expect(result.isErr()).toBe(true);
                    expect(result.error.message).toBe(errorMessage);
                } else {
                    fail(`Test case "${name}" did not produce expected result. Expected success: ${shouldSucceed}`);
                }
            });
        });

        it('should call deleteUrl with correct ID and userId', async () => {
            let deleteUrlCallCount = 0;
            let idCaptured = '';
            let userIdCaptured = '';
            const mockDeleteUrl: DeleteUrl = async (id: string, userId: string) => {
                deleteUrlCallCount++;
                idCaptured = id;
                userIdCaptured = userId;
                return ok(true);
            };
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);
            const testId = 'test-url-123';
            const testUserId = 'test-user-123';

            await deleteUrlUseCase.execute(testId, testUserId);

            expect(deleteUrlCallCount).toBe(1);
            expect(idCaptured).toBe(testId);
            expect(userIdCaptured).toBe(testUserId);
        });

        it('should handle false return value correctly', async () => {
            const mockDeleteUrl: DeleteUrl = async (id, userId) => ok(false);
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);

            const result = await deleteUrlUseCase.execute('url-123', 'user-123');

            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toBe(false);
            }
        });

        it('should handle large number of deletions correctly', async () => {
            let deleteUrlCallCount = 0;
            const mockDeleteUrl: DeleteUrl = async (id, userId) => {
                deleteUrlCallCount++;
                return ok(true);
            };
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);
            const ids = Array.from({ length: 1000 }, (_, index) => `url-${index}`);
            const userId = 'user-123';

            // Simulate deleting many URLs
            for (const id of ids) {
                const result = await deleteUrlUseCase.execute(id, userId);
                expect(result.isOk()).toBe(true);
                if (result.isOk()) {
                    expect(result.value).toBe(true);
                }
            }

            expect(deleteUrlCallCount).toBe(1000);
        });

        it('should handle concurrent deletion requests', async () => {
            let deleteUrlCallCount = 0;
            const mockDeleteUrl: DeleteUrl = async (id, userId) => {
                deleteUrlCallCount++;
                return ok(true);
            };
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);
            const testId = 'url-123';
            const testUserId = 'user-123';

            // Simulate concurrent deletion requests
            const promises = [
                deleteUrlUseCase.execute(testId, testUserId),
                deleteUrlUseCase.execute(testId, testUserId),
                deleteUrlUseCase.execute(testId, testUserId)
            ];

            const results = await Promise.all(promises);

            results.forEach(result => {
                expect(result.isOk()).toBe(true);
                if (result.isOk()) {
                    expect(result.value).toBe(true);
                }
            });

            expect(deleteUrlCallCount).toBe(3);
        });

        it('should handle deletion of already deleted URL', async () => {
            let deleteUrlCallCount = 0;
            const mockDeleteUrl: DeleteUrl = async (id, userId) => {
                deleteUrlCallCount++;
                return ok(true);
            };
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);
            const testUserId = 'user-123';

            // First deletion
            const firstResult = await deleteUrlUseCase.execute('url-123', testUserId);
            expect(firstResult.isOk()).toBe(true);

            // Second deletion of the same URL (should still succeed if soft delete)
            const secondResult = await deleteUrlUseCase.execute('url-123', testUserId);
            expect(secondResult.isOk()).toBe(true);

            expect(deleteUrlCallCount).toBe(2);
        });

        it('should handle deletion with different ID formats', async () => {
            let deleteUrlCallCount = 0;
            const mockDeleteUrl: DeleteUrl = async (id, userId) => {
                deleteUrlCallCount++;
                return ok(true);
            };
            const deleteUrlUseCase = new DeleteUrlUseCase(mockDeleteUrl);
            const testUserId = 'user-123';

            const differentFormats = [
                'url-123',
                'URL_456',
                'url.789',
                'url@123',
                'url#456',
                'url$789',
                'url%123',
                'url^456',
                'url&789'
            ];

            for (const id of differentFormats) {
                const result = await deleteUrlUseCase.execute(id, testUserId);
                expect(result.isOk()).toBe(true);
                if (result.isOk()) {
                    expect(result.value).toBe(true);
                }
            }

            expect(deleteUrlCallCount).toBe(differentFormats.length);
        });
    });
});
