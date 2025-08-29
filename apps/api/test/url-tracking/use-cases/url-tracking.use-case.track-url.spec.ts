import { describe, expect, it } from '@jest/globals';

import { CreateUrlTrackingDto } from '@repo/api/url-tracking/create-tracking.dto';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { AppError } from '@repo/api/error';
import { ok, err } from 'neverthrow';
import { TrackUrlUseCase } from '../../../src/url-tracking/use-cases/track-url.use-case';
import { CreateUrlTracking } from 'src/url-tracking/url-tracking.interfaces';

describe('TrackUrlUseCase', () => {
    describe('execute', () => {
        const urlId = 'url-123';

        describe('validation error scenarios', () => {
            const validationTestCases = [
                {
                    name: 'should return error when URL ID is empty',
                    urlId: '',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedError: 'URL ID is required'
                },
                {
                    name: 'should return error when URL ID is whitespace only',
                    urlId: '   ',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedError: 'URL ID is required'
                },
                {
                    name: 'should return error when URL ID is null',
                    urlId: null as string | null,
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedError: 'URL ID is required'
                }
            ];

            validationTestCases.forEach(({ name, urlId, headers, expectedError }) => {
                it(name, async () => {
                    // Arrange
                    const mockCreateUrlTracking: CreateUrlTracking = async () => {
                        return ok({} as UrlTracking);
                    };
                    const trackUrlUseCase = new TrackUrlUseCase(mockCreateUrlTracking);

                    // Act
                    const result = await trackUrlUseCase.execute(urlId, headers);

                    // Assert
                    expect(result.isErr()).toBe(true);
                    if (result.isErr()) {
                        expect(result.error).toBeInstanceOf(AppError);
                        expect(result.error.message).toBe(expectedError);
                        expect(result.error.isValidation()).toBe(true);
                    }
                });
            });
        });

        describe('successful tracking scenarios', () => {
            const successTestCases = [
                {
                    name: 'should successfully track URL visit with valid data',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9',
                        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
                        'x-real-ip': '192.168.1.2'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Chrome',
                        operatingSystem: 'Windows',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: '192.168.1.1'
                    }
                },
                {
                    name: 'should handle headers with missing user-agent',
                    headers: {
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: undefined,
                        operatingSystem: undefined,
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should handle headers with missing referer',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/118.0.2088.76 Safari/537.36',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: undefined,
                        browser: 'Edge',
                        operatingSystem: 'Windows',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should handle headers with missing accept-language',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                        'referer': 'https://example.com/page'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Chrome',
                        operatingSystem: 'macOS',
                        deviceType: 'desktop',
                        language: undefined,
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should handle headers with missing IP address headers',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Chrome',
                        operatingSystem: 'Linux',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should prioritize x-forwarded-for over x-real-ip',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9',
                        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
                        'x-real-ip': '192.168.1.2'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Firefox',
                        operatingSystem: 'Windows',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: '192.168.1.1'
                    }
                },
                {
                    name: 'should fallback to x-real-ip when x-forwarded-for is missing',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9',
                        'x-real-ip': '192.168.1.2'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Safari',
                        operatingSystem: 'macOS',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: '192.168.1.2'
                    }
                },
                {
                    name: 'should handle different user-agent strings',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Mobile Safari',
                        operatingSystem: 'iOS',
                        deviceType: 'mobile',
                        language: 'en',
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should handle complex referer URLs',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/101.0.0.0',
                        'referer': 'https://www.google.com/search?q=example&source=hp&ei=abc123&oq=example&gs_lcp=abc123',
                        'accept-language': 'en-US,en;q=0.9'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'www.google.com',
                        browser: 'Opera',
                        operatingSystem: 'Windows',
                        deviceType: 'desktop',
                        language: 'en',
                        ipAddress: undefined
                    }
                },
                {
                    name: 'should handle multiple language preferences',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/118.0 Firefox/118.0',
                        'referer': 'https://example.com/page',
                        'accept-language': 'en-US,en;q=0.9,es;q=0.8,fr;q=0.7'
                    },
                    expectedTrackingData: {
                        urlId: 'url-123',
                        referrerDomain: 'example.com',
                        browser: 'Mobile Firefox',
                        operatingSystem: 'Android',
                        deviceType: 'mobile',
                        language: 'en',
                        ipAddress: undefined
                    }
                }
            ];

            successTestCases.forEach(({ name, headers, expectedTrackingData }) => {
                it(name, async () => {
                    // Arrange
                    let calledWith: CreateUrlTrackingDto | undefined;
                    const mockUrlTracking: UrlTracking = {
                        id: 'tracking-123',
                        urlId: urlId,
                        referrerDomain: expectedTrackingData.referrerDomain,
                        browser: expectedTrackingData.browser,
                        operatingSystem: expectedTrackingData.operatingSystem,
                        deviceType: expectedTrackingData.deviceType,
                        language: expectedTrackingData.language,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    const mockCreateUrlTracking: CreateUrlTracking = async (data: CreateUrlTrackingDto) => {
                        calledWith = data;
                        return ok(mockUrlTracking);
                    };

                    const trackUrlUseCase = new TrackUrlUseCase(mockCreateUrlTracking);

                    // Act
                    const result = await trackUrlUseCase.execute(urlId, headers);

                    // Assert
                    expect(result.isOk()).toBe(true);
                    expect(calledWith).toEqual(expectedTrackingData);
                });
            });
        });

        describe('error scenarios', () => {
            it('should return error when createUrlTracking fails', async () => {
                // Arrange
                const mockError = AppError.unhandled('Database error');
                const testHeaders = {
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                    'referer': 'https://example.com/page',
                    'accept-language': 'en-US,en;q=0.9'
                };

                let wasCalled = false;
                const mockCreateUrlTracking: CreateUrlTracking = async () => {
                    wasCalled = true;
                    return err(mockError);
                };
                const trackUrlUseCase = new TrackUrlUseCase(mockCreateUrlTracking);

                // Act
                const result = await trackUrlUseCase.execute(urlId, testHeaders);

                // Assert
                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error).toBe(mockError);
                }
                expect(wasCalled).toBe(true);
            });

            it('should return error when createUrlTracking throws exception', async () => {
                // Arrange
                const mockError = new Error('Unexpected error');
                const testHeaders = {
                    'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
                    'referer': 'https://example.com/page',
                    'accept-language': 'en-US,en;q=0.9'
                };

                const mockCreateUrlTracking: CreateUrlTracking = async () => {
                    return err(AppError.unhandled('Failed to track URL visit', mockError));
                };
                const trackUrlUseCase = new TrackUrlUseCase(mockCreateUrlTracking);

                // Act
                const result = await trackUrlUseCase.execute(urlId, testHeaders);

                // Assert
                expect(result.isErr()).toBe(true);
                if (result.isErr()) {
                    expect(result.error).toBeInstanceOf(AppError);
                    expect(result.error.message).toBe('Failed to track URL visit');
                    expect(result.error.isUnhandled()).toBe(true);
                }
            });
        });
    });
});
