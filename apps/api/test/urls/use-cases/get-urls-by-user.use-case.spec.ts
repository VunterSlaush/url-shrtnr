import { describe, expect, it } from '@jest/globals';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { GetUrlsByUserUseCase } from '../../../src/urls/use-cases/get-urls-by-user.use-case';
import { createMockUrl } from './common';
import { AppError } from '@repo/api/error';


describe('GetUrlsByUserUseCase', () => {

    describe('execute', () => {
        const testCases = [
            {
                name: 'should successfully return URLs when user has URLs',
                userId: 'user-123',
                findUrlsByUserIdMock: async (userId: string) => ok([
                    createMockUrl({ userId, id: 'url-1', slug: 'slug-1' }),
                    createMockUrl({ userId, id: 'url-2', slug: 'slug-2' }),
                    createMockUrl({ userId, id: 'url-3', slug: 'slug-3' })
                ]),
                shouldSucceed: true,
                expectedCount: 3
            },
            {
                name: 'should return empty array when user has no URLs',
                userId: 'user-456',
                findUrlsByUserIdMock: async () => ok([]),
                shouldSucceed: true,
                expectedCount: 0
            },
            {
                name: 'should return error when database operation fails',
                userId: 'user-789',
                findUrlsByUserIdMock: async () => err(AppError.unhandled('Database connection error')),
                shouldSucceed: false,
                errorMessage: 'Database connection error'
            },
            {
                name: 'should handle empty userId',
                userId: '',
                findUrlsByUserIdMock: async () => err(AppError.validation('Invalid user ID')),
                shouldSucceed: false,
                errorMessage: 'Invalid user ID'
            },
            {
                name: 'should handle very long userId',
                userId: 'a'.repeat(1000),
                findUrlsByUserIdMock: async (userId: string) => ok([
                    createMockUrl({ userId, id: 'url-1', slug: 'slug-1' })
                ]),
                shouldSucceed: true,
                expectedCount: 1
            },
            {
                name: 'should handle userId with special characters',
                userId: 'user-123_456@example.com',
                findUrlsByUserIdMock: async (userId: string) => ok([
                    createMockUrl({ userId, id: 'url-1', slug: 'slug-1' })
                ]),
                shouldSucceed: true,
                expectedCount: 1
            },
            {
                name: 'should return error when repository throws unexpected error',
                userId: 'user-999',
                findUrlsByUserIdMock: async () => err(AppError.unhandled('Unexpected repository error')),
                shouldSucceed: false,
                errorMessage: 'Unexpected repository error'
            },
            {
                name: 'should handle userId with unicode characters',
                userId: 'user-ñáéíóú-123',
                findUrlsByUserIdMock: async (userId: string) => ok([
                    createMockUrl({ userId, id: 'url-1', slug: 'slug-1' })
                ]),
                shouldSucceed: true,
                expectedCount: 1
            },
            {
                name: 'should return error when user not found',
                userId: 'non-existent-user',
                findUrlsByUserIdMock: async () => err(AppError.notFound('User not found')),
                shouldSucceed: false,
                errorMessage: 'User not found'
            },
            {
                name: 'should handle case sensitive userId',
                userId: 'User-123',
                findUrlsByUserIdMock: async (userId: string) => ok([
                    createMockUrl({ userId, id: 'url-1', slug: 'slug-1' })
                ]),
                shouldSucceed: true,
                expectedCount: 1
            }
        ];

        testCases.forEach(({ name, userId, findUrlsByUserIdMock, shouldSucceed, expectedCount, errorMessage }) => {
            it(name, async () => {
                const getUrlsByUserUseCase = new GetUrlsByUserUseCase(findUrlsByUserIdMock);

                const result = await getUrlsByUserUseCase.execute(userId);

                if (shouldSucceed && result.isOk()) {
                    expect(result.isOk()).toBe(true);
                    expect(result.value).toBeDefined();
                    expect(Array.isArray(result.value)).toBe(true);
                    expect(result.value.length).toBe(expectedCount);

                    // Verify all URLs belong to the correct user
                    result.value.forEach(url => {
                        expect(url.userId).toBe(userId);
                    });
                } else if (!shouldSucceed && result.isErr()) {
                    expect(result.isErr()).toBe(true);
                    expect(result.error.message).toBe(errorMessage);
                } else {
                    fail(`Test case "${name}" did not produce expected result. Expected success: ${shouldSucceed}`);
                }
            });
        });

        it('should call findUrlsByUserId with correct userId', async () => {
            let capturedUserId: string | undefined;
            let callCount = 0;
            const mockFindUrlsByUserId = async (userId: string) => {
                capturedUserId = userId;
                callCount++;
                return ok([]);
            };
            const getUrlsByUserUseCase = new GetUrlsByUserUseCase(mockFindUrlsByUserId);
            const testUserId = 'test-user-123';


            await getUrlsByUserUseCase.execute(testUserId);
            expect(callCount).toBe(1);
            expect(capturedUserId).toBe(testUserId);


        });

        it('should handle single URL result correctly', async () => {
            const singleUrl = createMockUrl({ userId: 'user-123', id: 'url-1', slug: 'single-slug' });
            const findUrlsByUserIdMock = async () => ok([singleUrl]);
            const getUrlsByUserUseCase = new GetUrlsByUserUseCase(findUrlsByUserIdMock);

            const result = await getUrlsByUserUseCase.execute('user-123');

            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0]).toEqual(singleUrl);
            }
        });

        it('should handle large number of URLs correctly', async () => {
            const largeUrlArray = Array.from({ length: 1000 }, (_, index) =>
                createMockUrl({
                    userId: 'user-123',
                    id: `url-${index}`,
                    slug: `slug-${index}`
                })
            );
            const findUrlsByUserIdMock = async () => ok(largeUrlArray);
            const getUrlsByUserUseCase = new GetUrlsByUserUseCase(findUrlsByUserIdMock);

            const result = await getUrlsByUserUseCase.execute('user-123');

            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1000);
                expect(result.value[0].userId).toBe('user-123');
                expect(result.value[999].userId).toBe('user-123');
            }
        });
    });
});
