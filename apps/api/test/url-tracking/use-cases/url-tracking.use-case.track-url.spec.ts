import { describe, expect, it, jest, beforeEach } from '@jest/globals';

import { CreateUrlTrackingDto } from '@repo/api/url-tracking/create-tracking.dto';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { AppError } from '@repo/api/error';
import { ok, err } from 'neverthrow';
import { TrackUrlUseCase } from '../../../src/url-tracking/use-cases/track-url.use-case';

describe('TrackUrlUseCase', () => {
    let trackUrlUseCase: TrackUrlUseCase;
    let mockCreateUrlTracking: jest.MockedFunction<any>;

    beforeEach(() => {
        mockCreateUrlTracking = jest.fn();
        trackUrlUseCase = new TrackUrlUseCase(mockCreateUrlTracking);
    });

    describe('execute', () => {
        const urlId = 'url-123';
        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'referer': 'https://example.com/page',
            'accept-language': 'en-US,en;q=0.9',
            'x-forwarded-for': '192.168.1.1, 10.0.0.1',
            'x-real-ip': '192.168.1.2'
        };

        it('should successfully track URL visit with valid data', async () => {
            // Arrange
            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: '192.168.1.1'
            };

            const mockUrlTracking: UrlTracking = {
                id: 'tracking-123',
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockCreateUrlTracking.mockResolvedValue(ok(mockUrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headers);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockUrlTracking);
            }
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should return error when URL ID is empty', async () => {
            // Arrange
            const emptyUrlId = '';
            const testHeaders = {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            // Act
            const result = await trackUrlUseCase.execute(emptyUrlId, testHeaders);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(mockCreateUrlTracking).not.toHaveBeenCalled();
        });

        it('should return error when URL ID is whitespace only', async () => {
            // Arrange
            const whitespaceUrlId = '   ';
            const testHeaders = {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            // Act
            const result = await trackUrlUseCase.execute(whitespaceUrlId, testHeaders);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(mockCreateUrlTracking).not.toHaveBeenCalled();
        });

        it('should return error when URL ID is null', async () => {
            // Arrange
            const nullUrlId = null as any;
            const testHeaders = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            // Act
            const result = await trackUrlUseCase.execute(nullUrlId, testHeaders);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(mockCreateUrlTracking).not.toHaveBeenCalled();
        });

        it('should return error when createUrlTracking fails', async () => {
            // Arrange
            const mockError = AppError.unhandled('Database error');
            const testHeaders = {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };
            mockCreateUrlTracking.mockResolvedValue(err(mockError));

            // Act
            const result = await trackUrlUseCase.execute(urlId, testHeaders);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBe(mockError);
            }
            expect(mockCreateUrlTracking).toHaveBeenCalled();
        });

        it('should return error when createUrlTracking throws exception', async () => {
            // Arrange
            const mockError = new Error('Unexpected error');
            const testHeaders = {
                'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };
            mockCreateUrlTracking.mockRejectedValue(mockError);

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

        it('should handle headers with missing user-agent', async () => {
            // Arrange
            const headersWithoutUserAgent = {
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: undefined,
                operatingSystem: undefined,
                deviceType: 'desktop',
                language: 'en',
                ipAddress: undefined
            };

            const mockUrlTracking: UrlTracking = {
                id: 'tracking-123',
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: undefined,
                operatingSystem: undefined,
                deviceType: 'desktop',
                language: 'en',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockCreateUrlTracking.mockResolvedValue(ok(mockUrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithoutUserAgent);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle headers with missing referer', async () => {
            // Arrange
            const headersWithoutReferer = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/118.0.2088.76 Safari/537.36',
                'accept-language': 'en-US,en;q=0.9'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: undefined,
                browser: 'Edge',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithoutReferer);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle headers with missing accept-language', async () => {
            // Arrange
            const headersWithoutLanguage = {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'referer': 'https://example.com/page'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'macOS',
                deviceType: 'desktop',
                language: undefined,
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithoutLanguage);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle headers with missing IP address headers', async () => {
            // Arrange
            const headersWithoutIP = {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'Linux',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithoutIP);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should prioritize x-forwarded-for over x-real-ip', async () => {
            // Arrange
            const headersWithBothIPs = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9',
                'x-forwarded-for': '192.168.1.1, 10.0.0.1',
                'x-real-ip': '192.168.1.2'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Firefox',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: '192.168.1.1'
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithBothIPs);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should fallback to x-real-ip when x-forwarded-for is missing', async () => {
            // Arrange
            const headersWithOnlyRealIP = {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9',
                'x-real-ip': '192.168.1.2'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Safari',
                operatingSystem: 'macOS',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: '192.168.1.2'
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithOnlyRealIP);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle different user-agent strings', async () => {
            // Arrange
            const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1';
            const headersWithMobileUserAgent = {
                'user-agent': mobileUserAgent,
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Mobile Safari',
                operatingSystem: 'iOS',
                deviceType: 'mobile',
                language: 'en',
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithMobileUserAgent);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle complex referer URLs', async () => {
            // Arrange
            const complexReferer = 'https://www.google.com/search?q=example&source=hp&ei=abc123&oq=example&gs_lcp=abc123';
            const headersWithComplexReferer = {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/101.0.0.0',
                'referer': complexReferer,
                'accept-language': 'en-US,en;q=0.9'
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'www.google.com',
                browser: 'Opera',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithComplexReferer);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });

        it('should handle multiple language preferences', async () => {
            // Arrange
            const multipleLanguages = 'en-US,en;q=0.9,es;q=0.8,fr;q=0.7';
            const headersWithMultipleLanguages = {
                'user-agent': 'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/118.0 Firefox/118.0',
                'referer': 'https://example.com/page',
                'accept-language': multipleLanguages
            };

            const expectedTrackingData: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: 'example.com',
                browser: 'Mobile Firefox',
                operatingSystem: 'Android',
                deviceType: 'mobile',
                language: 'en',
                ipAddress: undefined
            };

            mockCreateUrlTracking.mockResolvedValue(ok({} as UrlTracking));

            // Act
            const result = await trackUrlUseCase.execute(urlId, headersWithMultipleLanguages);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(mockCreateUrlTracking).toHaveBeenCalledWith(expectedTrackingData);
        });
    });
});
