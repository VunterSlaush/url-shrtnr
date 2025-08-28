import { describe, expect, it } from '@jest/globals';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { GetUrlBySlugUseCase } from '../../../src/urls/use-cases/get-url-by-slug.use-case';
import { createMockUrl } from './common';
import { AppError } from '@repo/api/error';


describe('GetUrlBySlugUseCase', () => {

    describe('execute', () => {
        const testCases = [
            {
                name: 'should successfully return URL when slug exists',
                slug: 'existing-slug',
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: 'existing-slug' })

            },
            {
                name: 'should return error when slug does not exist',
                slug: 'non-existent-slug',
                findUrlBySlugMock: async () => err(AppError.notFound('URL not found')),
                shouldSucceed: false,
                errorMessage: 'URL not found'
            },
            {
                name: 'should return error when database operation fails',
                slug: 'test-slug',
                findUrlBySlugMock: async () => err(AppError.unhandled('Database connection error')),
                shouldSucceed: false,
                errorMessage: 'Database connection error'
            },
            {
                name: 'should handle empty slug',
                slug: '',
                findUrlBySlugMock: async () => err(AppError.validation('Invalid slug')),
                shouldSucceed: false,
                errorMessage: 'Invalid slug'
            },
            {
                name: 'should handle special characters in slug',
                slug: 'test-slug-123_special',
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: 'test-slug-123_special' })
            },
            {
                name: 'should handle very long slug',
                slug: 'a'.repeat(100),
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: 'a'.repeat(100) })
            },
            {
                name: 'should handle slug with unicode characters',
                slug: 'test-ñáéíóú-slug',
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: 'test-ñáéíóú-slug' })
            },
            {
                name: 'should handle case sensitive slug',
                slug: 'Test-Slug',
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: 'Test-Slug' })
            },
            {
                name: 'should return error when repository throws unexpected error',
                slug: 'test-slug',
                findUrlBySlugMock: async () => err(AppError.unhandled('Unexpected repository error')),
                shouldSucceed: false,
                errorMessage: 'Unexpected repository error'
            },
            {
                name: 'should handle slug with only numbers',
                slug: '123456',
                findUrlBySlugMock: async (slug: string) => ok(createMockUrl({ slug })),
                shouldSucceed: true,
                returnValue: createMockUrl({ slug: '123456' })
            }
        ];

        testCases.forEach(({ name, slug, findUrlBySlugMock, shouldSucceed, returnValue, errorMessage }) => {
            it(name, async () => {
                const getUrlBySlugUseCase = new GetUrlBySlugUseCase(findUrlBySlugMock);

                const result = await getUrlBySlugUseCase.execute(slug);

                if (shouldSucceed && result.isOk()) {
                    expect(result.isOk()).toBe(true);
                    expect(result.value).toBeDefined();
                    if (returnValue) {
                        expect(result.value.slug).toBe(returnValue.slug);
                    }
                } else if (!shouldSucceed && result.isErr()) {
                    expect(result.isErr()).toBe(true);
                    expect(result.error.message).toBe(errorMessage);
                } else {
                    fail(new Error('Should not happen'));
                }
            });
        });

        it('should pass the correct slug to the findUrlBySlug function', async () => {
            const mockSlug = 'test-slug-param';
            let capturedSlug: string | undefined;

            const findUrlBySlugMock = async (slug: string) => {
                capturedSlug = slug;
                return ok(createMockUrl({ slug }));
            };

            const getUrlBySlugUseCase = new GetUrlBySlugUseCase(findUrlBySlugMock);
            await getUrlBySlugUseCase.execute(mockSlug);

            expect(capturedSlug).toBe(mockSlug);
        });

        it('should return URL with all expected properties', async () => {
            const expectedUrl = createMockUrl({
                id: 'specific-id',
                url: 'https://specific-url.com',
                slug: 'specific-slug',
                userId: 'specific-user-id'
            });

            const findUrlBySlugMock = async () => ok(expectedUrl);
            const getUrlBySlugUseCase = new GetUrlBySlugUseCase(findUrlBySlugMock);

            const result = await getUrlBySlugUseCase.execute('specific-slug');

            if (result.isOk()) {
                expect(result.value.id).toBe(expectedUrl.id);
                expect(result.value.url).toBe(expectedUrl.url);
                expect(result.value.slug).toBe(expectedUrl.slug);
                expect(result.value.userId).toBe(expectedUrl.userId);
                expect(result.value.createdAt).toBe(expectedUrl.createdAt);
                expect(result.value.updatedAt).toBe(expectedUrl.updatedAt);
                expect(result.value.deletedAt).toBe(expectedUrl.deletedAt);
            } else {
                fail(new Error('Expected successful result'));
            }
        });
    });
});
