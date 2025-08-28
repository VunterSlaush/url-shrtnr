import { describe, expect, it } from '@jest/globals';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { UpdateSlugUseCase } from '../../../src/urls/use-cases/update-slug.use-case';
import { createMockUrl } from './common';
import { AppError } from '@repo/api/error';
import { FindUrlById, FindUrlBySlug, UpdateUrl } from '../../../src/urls/url.interfaces';

describe('UpdateSlugUseCase', () => {

    describe('execute', () => {
        const testCases = [
            {
                name: 'should successfully update slug when all conditions are met',
                id: 'url-123',
                newSlug: 'new-slug',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: true
            },
            {
                name: 'should return error when URL not found by ID',
                id: 'non-existent-url',
                newSlug: 'new-slug',
                userId: 'user-123',
                findUrlByIdMock: async () => err(AppError.notFound('URL not found')),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: false,
                errorMessage: 'URL not found',
                errorType: 'NOT_FOUND'
            },
            {
                name: 'should return error when user is not authorized',
                id: 'url-123',
                newSlug: 'new-slug',
                userId: 'user-456',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: false,
                errorMessage: 'Unauthorized to update this URL',
                errorType: 'UNAUTHORIZED'
            },
            {
                name: 'should return error when new slug is the same as current slug',
                id: 'url-123',
                newSlug: 'same-slug',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'same-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: false,
                errorMessage: 'New slug is the same as current slug',
                errorType: 'VALIDATION'
            },
            {
                name: 'should return error when new slug already exists',
                id: 'url-123',
                newSlug: 'existing-slug',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => ok(createMockUrl({ id: 'url-456', userId: 'user-456', slug: 'existing-slug' })),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: false,
                errorMessage: 'Slug already exists',
                errorType: 'CONFLICT'
            },
            {
                name: 'should allow update when no userId provided (admin update)',
                id: 'url-123',
                newSlug: 'new-slug',
                userId: undefined,
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' })),
                shouldSucceed: true
            },
            {
                name: 'should handle empty new slug',
                id: 'url-123',
                newSlug: '',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: '' })),
                shouldSucceed: true
            },
            {
                name: 'should handle very long new slug',
                id: 'url-123',
                newSlug: 'a'.repeat(1000),
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'a'.repeat(1000) })),
                shouldSucceed: true
            },
            {
                name: 'should handle special characters in new slug',
                id: 'url-123',
                newSlug: 'new-slug-123_456@special',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug-123_456@special' })),
                shouldSucceed: true
            },
            {
                name: 'should handle unicode characters in new slug',
                id: 'url-123',
                newSlug: 'new-slug-ñáéíóú',
                userId: 'user-123',
                findUrlByIdMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' })),
                findUrlBySlugMock: async () => err(AppError.notFound('Slug not found')),
                updateUrlMock: async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug-ñáéíóú' })),
                shouldSucceed: true
            }
        ];

        testCases.forEach(({ name, id, newSlug, userId, findUrlByIdMock, findUrlBySlugMock, updateUrlMock, shouldSucceed, errorMessage, errorType }) => {
            it(name, async () => {
                const updateSlugUseCase = new UpdateSlugUseCase(
                    findUrlByIdMock,
                    findUrlBySlugMock,
                    updateUrlMock
                );

                const result = await updateSlugUseCase.execute(id, newSlug, userId);

                if (shouldSucceed && result.isOk()) {
                    expect(result.isOk()).toBe(true);
                    expect(result.value).toBeDefined();
                    expect(result.value.slug).toBe(newSlug);
                } else if (!shouldSucceed && result.isErr()) {
                    expect(result.isErr()).toBe(true);
                    expect(result.error.message).toBe(errorMessage);
                    expect(result.error.type).toBe(errorType);
                } else {
                    fail(`Test case "${name}" did not produce expected result. Expected success: ${shouldSucceed}`);
                }
            });
        });

        it('should call findUrlById with correct ID', async () => {
            let findUrlByIdCallCount = 0;
            let findUrlBySlugCallCount = 0;
            let idCaptured = '';
            const mockFindUrlById: FindUrlById = async (id: string) => {
                findUrlByIdCallCount++;
                idCaptured = id;
                return ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
            };
            const mockFindUrlBySlug: FindUrlBySlug = async () => {
                findUrlBySlugCallCount++;
                return err(AppError.notFound('Slug not found'));
            };
            const mockUpdateUrl: UpdateUrl = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));

            const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);
            const testId = 'test-url-123';

            await updateSlugUseCase.execute(testId, 'new-slug', 'user-123');

            expect(findUrlByIdCallCount).toBe(1);
            expect(findUrlBySlugCallCount).toBe(1);
            expect(idCaptured).toBe(testId);
        });

        it('should call findUrlBySlug with correct new slug when slug is different', async () => {
            let findUrlBySlugCallCount = 0;
            let slugCaptured = '';
            const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
            const mockFindUrlBySlug: FindUrlBySlug = async (slug: string) => {
                findUrlBySlugCallCount++;
                slugCaptured = slug;
                return err(AppError.notFound('Slug not found'));
            };
            const mockUpdateUrl: UpdateUrl = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));

            const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);
            const testNewSlug = 'test-new-slug';

            await updateSlugUseCase.execute('url-123', testNewSlug, 'user-123');

            expect(findUrlBySlugCallCount).toBe(1);
            expect(slugCaptured).toBe(testNewSlug);
        });

        it('should call updateUrl with correct parameters when all validations pass', async () => {
            let updateUrlCallCount = 0;
            let idCaptured = '';
            let updateDataCaptured: any = {};
            const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
            const mockFindUrlBySlug: FindUrlBySlug = async () => err(AppError.notFound('Slug not found'));
            const mockUpdateUrl: UpdateUrl = async (id: string, updateData: any) => {
                updateUrlCallCount++;
                idCaptured = id;
                updateDataCaptured = updateData;
                return ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));
            };

            const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);
            const testId = 'test-url-123';
            const testNewSlug = 'test-new-slug';

            await updateSlugUseCase.execute(testId, testNewSlug, 'user-123');

            expect(updateUrlCallCount).toBe(1);
            expect(idCaptured).toBe(testId);
            expect(updateDataCaptured).toEqual({ slug: testNewSlug });
        });

        it('should not call findUrlBySlug when new slug is the same as current slug', async () => {
            let findUrlBySlugCallCount = 0;
            let updateUrlCallCount = 0;
            const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'same-slug' }));
            const mockFindUrlBySlug: FindUrlBySlug = async () => {
                findUrlBySlugCallCount++;
                return err(AppError.notFound('Slug not found'));
            };
            const mockUpdateUrl: UpdateUrl = async () => {
                updateUrlCallCount++;
                return ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));
            };

            const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);

            await updateSlugUseCase.execute('url-123', 'same-slug', 'user-123');

            expect(findUrlBySlugCallCount).toBe(0);
            expect(updateUrlCallCount).toBe(0);
        });

        it('should not call updateUrl when slug already exists', async () => {
            let updateUrlCallCount = 0;
            const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
            const mockFindUrlBySlug: FindUrlBySlug = async () => ok(createMockUrl({ id: 'url-456', userId: 'user-456', slug: 'existing-slug' }));
            const mockUpdateUrl: UpdateUrl = async () => {
                updateUrlCallCount++;
                return ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));
            };

            const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);

            await updateSlugUseCase.execute('url-123', 'existing-slug', 'user-123');

            expect(updateUrlCallCount).toBe(0);
        });

        describe('Errors handling', () => {

            it('on findUrlById throw unhandled error, should return unhandled error', async () => {
                const mockFindUrlById: FindUrlById = async () => { throw new Error('Database error') };
                const mockFindUrlBySlug: FindUrlBySlug = async () => err(AppError.notFound('Slug not found'));
                const mockUpdateUrl: UpdateUrl = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));

                const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);

                const result = await updateSlugUseCase.execute('url-123', 'new-slug', 'user-123');

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Failed to update slug');
                }
            });

            it('on findUrlBySlug throw unhandled error, should return unhandled error', async () => {
                const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
                const mockFindUrlBySlug: FindUrlBySlug = async () => { throw new Error('Database error') };
                const mockUpdateUrl: UpdateUrl = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'new-slug' }));

                const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);

                const result = await updateSlugUseCase.execute('url-123', 'new-slug', 'user-123');

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Failed to update slug');
                }
            });

            it('on updateUrl throw unhandled error, should return unhandled error', async () => {
                const mockFindUrlById: FindUrlById = async () => ok(createMockUrl({ id: 'url-123', userId: 'user-123', slug: 'old-slug' }));
                const mockFindUrlBySlug: FindUrlBySlug = async () => err(AppError.notFound('Slug not found'));
                const mockUpdateUrl: UpdateUrl = async () => { throw new Error('Update failed') };

                const updateSlugUseCase = new UpdateSlugUseCase(mockFindUrlById, mockFindUrlBySlug, mockUpdateUrl);

                const result = await updateSlugUseCase.execute('url-123', 'new-slug', 'user-123');

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Failed to update slug');
                }
            });
        });


    });
});
