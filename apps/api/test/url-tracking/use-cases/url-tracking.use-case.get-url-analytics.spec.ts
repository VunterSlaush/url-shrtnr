import { describe, expect, it } from '@jest/globals';

import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { AppError } from '@repo/api/error';
import { ok, err } from 'neverthrow';
import { GetUrlAnalyticsUseCase } from '../../../src/url-tracking/use-cases/get-url-analytics.use-case';
import { FindUrlTrackingsByUrlIdAndTimeRange, TimestampRange } from '../../../src/url-tracking/url-tracking.interfaces';

describe('GetUrlAnalyticsUseCase', () => {
    describe('execute', () => {
        const urlId = 'url-123';
        const timeRange: TimestampRange = {
            from: new Date('2024-01-01T00:00:00Z'),
            to: new Date('2024-01-31T23:59:59Z')
        };

        it('should successfully get URL analytics with valid data', async () => {
            // Arrange
            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-1',
                    urlId: 'url-123',
                    referrerDomain: 'example.com',
                    browser: 'Chrome',
                    operatingSystem: 'Windows',
                    deviceType: 'desktop',
                    language: 'en',
                    createdAt: new Date('2024-01-15T10:00:00Z'),
                    updatedAt: new Date('2024-01-15T10:00:00Z')
                },
                {
                    id: 'tracking-2',
                    urlId: 'url-123',
                    referrerDomain: 'google.com',
                    browser: 'Firefox',
                    operatingSystem: 'macOS',
                    deviceType: 'mobile',
                    language: 'es',
                    createdAt: new Date('2024-01-20T15:30:00Z'),
                    updatedAt: new Date('2024-01-20T15:30:00Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(timeRange);
        });

        it('should return error when URL ID is empty', async () => {
            // Arrange
            const emptyUrlId = '';
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(emptyUrlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when URL ID is whitespace only', async () => {
            // Arrange
            const whitespaceUrlId = '   ';
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(whitespaceUrlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when URL ID is null', async () => {
            // Arrange
            const nullUrlId = null as string | null;
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(nullUrlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('URL ID is required');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when time range is invalid - from date is not a Date', async () => {
            // Arrange
            const invalidTimeRange: TimestampRange = {
                from: '2024-01-01' as any,
                to: new Date('2024-01-31T23:59:59Z')
            };
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, invalidTimeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Invalid time range');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when time range is invalid - to date is not a Date', async () => {
            // Arrange
            const invalidTimeRange: TimestampRange = {
                from: new Date('2024-01-01T00:00:00Z'),
                to: '2024-01-31' as any
            };
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, invalidTimeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Invalid time range');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when time range is invalid - from date is after to date', async () => {
            // Arrange
            const invalidTimeRange: TimestampRange = {
                from: new Date('2024-01-31T23:59:59Z'),
                to: new Date('2024-01-01T00:00:00Z')
            };
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, invalidTimeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Invalid time range');
                expect(result.error.isValidation()).toBe(true);
            }
            expect(calls).toBe(0);
        });

        it('should return error when time range is invalid - from date equals to date', async () => {
            // Arrange
            const sameDate = new Date('2024-01-15T12:00:00Z');
            const validTimeRange: TimestampRange = {
                from: sameDate,
                to: sameDate
            };
            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok([]);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, validTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(validTimeRange);
        });

        it('should return error when findUrlTrackingsByUrlIdAndTimeRange fails', async () => {
            // Arrange
            const mockError = AppError.unhandled('Database error');
            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return err(mockError);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBe(mockError);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(timeRange);
        });

        it('should return error when findUrlTrackingsByUrlIdAndTimeRange throws exception', async () => {
            // Arrange
            const mockError = new Error('Unexpected error');
            let calls = 0;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async () => {
                calls++;
                throw mockError;
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to get URL analytics for time range');
                expect(result.error.isUnhandled()).toBe(true);
            }
            expect(calls).toBe(1);
        });

        it('should handle empty tracking results', async () => {
            // Arrange
            const emptyTrackings: UrlTracking[] = [];
            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(emptyTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(emptyTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(timeRange);
        });

        it('should handle different time ranges', async () => {
            // Arrange
            const differentTimeRange: TimestampRange = {
                from: new Date('2024-02-01T00:00:00Z'),
                to: new Date('2024-02-28T23:59:59Z')
            };

            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-3',
                    urlId: 'url-123',
                    referrerDomain: 'bing.com',
                    browser: 'Safari',
                    operatingSystem: 'iOS',
                    deviceType: 'tablet',
                    language: 'fr',
                    createdAt: new Date('2024-02-15T12:00:00Z'),
                    updatedAt: new Date('2024-02-15T12:00:00Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, differentTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(differentTimeRange);
        });

        it('should handle edge case time ranges', async () => {
            // Arrange
            const edgeTimeRange: TimestampRange = {
                from: new Date('2024-01-01T00:00:00Z'),
                to: new Date('2024-01-01T00:00:00Z')
            };

            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-4',
                    urlId: 'url-123',
                    referrerDomain: 'direct',
                    browser: 'Edge',
                    operatingSystem: 'Windows',
                    deviceType: 'desktop',
                    language: 'en',
                    createdAt: new Date('2024-01-01T00:00:00Z'),
                    updatedAt: new Date('2024-01-01T00:00:00Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, edgeTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(edgeTimeRange);
        });

        it('should handle different URL IDs', async () => {
            // Arrange
            const differentUrlId = 'url-456';
            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-5',
                    urlId: 'url-456',
                    referrerDomain: 'yahoo.com',
                    browser: 'Opera',
                    operatingSystem: 'Linux',
                    deviceType: 'desktop',
                    language: 'de',
                    createdAt: new Date('2024-01-25T14:00:00Z'),
                    updatedAt: new Date('2024-01-25T14:00:00Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(differentUrlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(differentUrlId);
            expect(capturedTimeRange).toBe(timeRange);
        });

        it('should handle time ranges with milliseconds precision', async () => {
            // Arrange
            const preciseTimeRange: TimestampRange = {
                from: new Date('2024-01-15T10:30:45.123Z'),
                to: new Date('2024-01-15T10:30:45.999Z')
            };

            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-6',
                    urlId: 'url-123',
                    referrerDomain: 'example.com',
                    browser: 'Chrome',
                    operatingSystem: 'Windows',
                    deviceType: 'desktop',
                    language: 'en',
                    createdAt: new Date('2024-01-15T10:30:45.500Z'),
                    updatedAt: new Date('2024-01-15T10:30:45.500Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, preciseTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(preciseTimeRange);
        });

        it('should handle time ranges spanning multiple months', async () => {
            // Arrange
            const longTimeRange: TimestampRange = {
                from: new Date('2024-01-01T00:00:00Z'),
                to: new Date('2024-03-31T23:59:59Z')
            };

            const mockTrackings: UrlTracking[] = [
                {
                    id: 'tracking-7',
                    urlId: 'url-123',
                    referrerDomain: 'example.com',
                    browser: 'Chrome',
                    operatingSystem: 'Windows',
                    deviceType: 'desktop',
                    language: 'en',
                    createdAt: new Date('2024-02-15T12:00:00Z'),
                    updatedAt: new Date('2024-02-15T12:00:00Z')
                }
            ];

            let calls = 0;
            let capturedUrlId: string;
            let capturedTimeRange: TimestampRange;

            const mockFindUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange) => {
                capturedUrlId = urlId;
                capturedTimeRange = timeRange;
                calls++;
                return ok(mockTrackings);
            }

            const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(mockFindUrlTrackingsByUrlIdAndTimeRange);

            // Act
            const result = await getUrlAnalyticsUseCase.execute(urlId, longTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toEqual(mockTrackings);
            }
            expect(calls).toBe(1);
            expect(capturedUrlId).toBe(urlId);
            expect(capturedTimeRange).toBe(longTimeRange);
        });
    });
});
