import { describe, expect, it } from '@jest/globals';
import { ShortenUrlUseCase } from '../../../src/urls/use-cases/shorten-url.use-case';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { ok, err } from 'neverthrow';
import { fail } from 'assert';
import { AppError } from '@repo/api/error';
import { CreateUrl, FindUrlBySlug } from '../../../src/urls/url.interfaces';
import { createMockUrl } from './common';
import { CreateUrlSuccess, NotFoundBySlug, GetRandomNumber } from './common-mocks';


describe('ShortenUrlUseCase', () => {

    describe('execute', () => {
        describe('URL validation', () => {

            const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, NotFoundBySlug, GetRandomNumber);

            const urlValidationTestCases = [
                {
                    name: 'should return error when URL is undefined',
                    input: { url: undefined, slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: false,
                    expectedError: 'Url is required'
                },
                {
                    name: 'should return error when URL is null',
                    input: { url: null as any, slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: false,
                    expectedError: 'Url is required'
                },
                {
                    name: 'should return error when URL is empty string',
                    input: { url: '', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: false,
                    expectedError: 'Url is required'
                },
                {
                    name: 'should return error when URL is invalid format',
                    input: { url: 'not-a-url', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: false,
                    expectedError: 'Invalid Url format'
                },
                {
                    name: 'should accept valid URL with protocol',
                    input: { url: 'https://example.com', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,

                },
                {
                    name: 'should accept valid URL without protocol (adds https://)',
                    input: { url: 'example.com', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid URL with http protocol',
                    input: { url: 'http://example.com', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid URL with query parameters',
                    input: { url: 'https://example.com/search?q=test&sort=asc', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid URL with http protocol, custom port number and path',
                    input: { url: 'http://example.com:3000/user/123', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid IP address',
                    input: { url: '192.168.1.1', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid IP address with protocol',
                    input: { url: 'https://192.168.1.1', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid IP address with port',
                    input: { url: '192.168.1.1:8080', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid IP address with protocol and port',
                    input: { url: 'http://192.168.1.1:3000', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should accept valid IP address with path',
                    input: { url: '192.168.1.1/api/endpoint', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: true,
                },
                {
                    name: 'should reject invalid IP address',
                    input: { url: '999.999.999.999', slug: 'test-slug' } as CreateUrlDto,
                    shouldSucceed: false,
                    expectedError: 'Invalid Url format'
                },
            ];

            urlValidationTestCases.forEach(({ name, input, expectedError, shouldSucceed }) => {
                it(name, async () => {
                    const result = await shortenUrlUseCase.execute(input);

                    if (shouldSucceed) {
                        if (result.isOk()) {
                            expect(result.isOk()).toBe(true);
                        } else {
                            fail(new Error('Expected successful result'));
                        }
                    } else {

                        if (result.isErr() && result.error.isValidation()) {
                            expect(result.error.message).toBe(expectedError);
                        } else {
                            fail(new Error('Expected error result'));
                        }
                    }
                });
            });
        });

        describe('slug validation', () => {
            it('should return error when slug already exists', async () => {
                const existingSlug = 'existing-slug';
                const mockFindUrlBySlug: FindUrlBySlug = async () => ok(createMockUrl({ slug: existingSlug }));
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, mockFindUrlBySlug, GetRandomNumber);

                const input: CreateUrlDto = { url: 'https://example.com', slug: existingSlug };
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Slug already exists');
                }
            });

            it('should return error when finding slug fails', async () => {
                const existingSlug = 'existing-slug';
                const mockFindUrlBySlug: FindUrlBySlug = async () => err(AppError.unhandled('Database error'));
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, mockFindUrlBySlug, GetRandomNumber);

                const input: CreateUrlDto = { url: 'https://example.com', slug: existingSlug };
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Database error');
                }
            });

            it('should use provided slug when valid', async () => {
                const input: CreateUrlDto = { url: 'https://example.com', slug: 'custom-slug' };
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, NotFoundBySlug, GetRandomNumber);
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isOk()).toBe(true);
            });

            it('should generate slug when not provided', async () => {
                const input: CreateUrlDto = { url: 'https://example.com' };
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, NotFoundBySlug, GetRandomNumber);
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isOk()).toBe(true);
                if (result.isOk()) {
                    expect(result.value.slug).toMatch(/^[a-zA-Z0-9]+$/);
                } else {
                    fail(new Error('Expected successful result'));
                }
            });
        });

        describe('URL creation', () => {
            it('should successfully create URL when all validations pass', async () => {
                const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, NotFoundBySlug, GetRandomNumber);
                const result = await shortenUrlUseCase.execute(input);


                expect(result.isOk()).toBe(true);
                if (result.isOk()) {
                    expect(result.value).toBeDefined();
                } else {
                    fail(new Error('Expected successful result'));
                }
            });

            it('should return error when createUrl fails', async () => {
                const mockCreateUrl: CreateUrl = async () => err(AppError.unhandled('Database error'));
                const shortenUrlUseCase = new ShortenUrlUseCase(mockCreateUrl, NotFoundBySlug, GetRandomNumber);

                const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error.message).toBe('Database error');
                } else {
                    fail(new Error('Expected error result'));
                }
            });

        });

        describe('userId handling', () => {
            it('should pass userId to createUrl when provided', async () => {
                const userId = 'user-123';
                let capturedUserId: string | undefined;

                const mockCreateUrl = async (createUrlDto: CreateUrlDto, userId?: string) => {
                    capturedUserId = userId;
                    return ok(createMockUrl({
                        ...createUrlDto,
                        userId
                    }));
                };
                const shortenUrlUseCase = new ShortenUrlUseCase(mockCreateUrl, NotFoundBySlug, GetRandomNumber);


                const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
                await shortenUrlUseCase.execute(input, userId);

                expect(capturedUserId).toBe(userId);
            });

            it('should handle undefined userId', async () => {
                const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, NotFoundBySlug, GetRandomNumber);

                const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
                const result = await shortenUrlUseCase.execute(input);

                expect(result.isOk()).toBe(true);
            });
        });

    });

    describe('Errors handling', () => {

        it('on find by slug throw unhandled error, should return unhandled error', async () => {
            const mockFindUrlBySlug: FindUrlBySlug = async () => { throw new Error('Database error') };

            const shortenUrlUseCase = new ShortenUrlUseCase(CreateUrlSuccess, mockFindUrlBySlug, GetRandomNumber);

            const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
            const result = await shortenUrlUseCase.execute(input);

            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error.message).toBe('Failed to shorten URL');
            }
        });

        it('on createUrl throw unhandled error, should return unhandled error', async () => {
            const mockCreateUrl: CreateUrl = async () => { throw new Error('Creating URL failed') };
            const shortenUrlUseCase = new ShortenUrlUseCase(mockCreateUrl, NotFoundBySlug, GetRandomNumber);

            const input: CreateUrlDto = { url: 'https://example.com', slug: 'test-slug' };
            const result = await shortenUrlUseCase.execute(input);

            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error.message).toBe('Failed to shorten URL');
            }
        });
    });

});
