import { describe, expect, it } from '@jest/globals';

import { Url } from '@repo/api/urls/url';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { GetUrlBySlugUseCase } from '../../../src/urls/use-cases/get-url-by-slug.use-case';


const createMockUrl = (overrides: Partial<Url> = {}): Url => {
    const url = new Url();
    url.id = 'url-123';
    url.url = 'https://example.com';
    url.slug = 'test-slug';
    url.createdAt = new Date();
    url.updatedAt = new Date();
    url.deletedAt = null;
    url.userId = 'user-123';
    return { ...url, ...overrides };
};

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
                findUrlBySlugMock: async () => err(new Error('URL not found')), // TODO: Add Typification
                shouldSucceed: false,
                errorMessage: 'URL not found'
            },
            {
                name: 'should return error when database operation fails',
                slug: 'test-slug',
                findUrlBySlugMock: async () => err(new Error('Database connection error')), // TODO: Add Typification
                shouldSucceed: false,
                errorMessage: 'Database connection error'
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



    });
});
