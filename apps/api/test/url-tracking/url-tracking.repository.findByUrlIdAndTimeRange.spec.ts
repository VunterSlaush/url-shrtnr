import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlTrackingRepository } from '../../src/url-tracking/url-tracking.repository';
import { AppError } from '@repo/api/error';
import { TimestampRange } from '../../src/url-tracking/url-tracking.interfaces';

describe('UrlTrackingRepository - findByUrlIdAndTimeRange', () => {
    let urlTrackingRepository: UrlTrackingRepository;
    let mockPool: jest.Mocked<Pool>;

    beforeEach(() => {
        mockPool = {
            query: jest.fn()
        } as any;

        urlTrackingRepository = new UrlTrackingRepository(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findByUrlIdAndTimeRange', () => {
        const urlId = 'url-123';
        const timeRange: TimestampRange = {
            from: new Date('2024-01-01T00:00:00Z'),
            to: new Date('2024-01-31T23:59:59Z')
        };

        it('should successfully find URL trackings by URL ID and time range', async () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-1',
                    url_id: urlId,
                    referrer_domain: 'example.com',
                    browser: 'Chrome',
                    operating_system: 'Windows',
                    device_type: 'desktop',
                    language: 'en',
                    created_at: new Date('2024-01-15T10:00:00Z'),
                    updated_at: new Date('2024-01-15T10:00:00Z')
                },
                {
                    id: 'tracking-2',
                    url_id: urlId,
                    referrer_domain: 'google.com',
                    browser: 'Firefox',
                    operating_system: 'macOS',
                    device_type: 'mobile',
                    language: 'es',
                    created_at: new Date('2024-01-20T15:30:00Z'),
                    updated_at: new Date('2024-01-20T15:30:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].id).toBe('tracking-1');
                expect(result.value[0].urlId).toBe(urlId);
                expect(result.value[0].createdAt).toEqual(new Date('2024-01-15T10:00:00Z'));
                expect(result.value[1].id).toBe('tracking-2');
                expect(result.value[1].urlId).toBe(urlId);
                expect(result.value[1].createdAt).toEqual(new Date('2024-01-20T15:30:00Z'));
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM url_trackings'),
                [urlId, timeRange.from, timeRange.to]
            );
        });

        it('should return empty array when no trackings found in time range', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(0);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL trackings by URL ID and time range');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database timeout errors', async () => {
            // Arrange
            const mockError = new Error('Query timeout');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, timeRange);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL trackings by URL ID and time range');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle different time ranges', async () => {
            // Arrange
            const differentTimeRange: TimestampRange = {
                from: new Date('2024-02-01T00:00:00Z'),
                to: new Date('2024-02-28T23:59:59Z')
            };

            const mockDbRows = [
                {
                    id: 'tracking-3',
                    url_id: urlId,
                    referrer_domain: 'bing.com',
                    browser: 'Safari',
                    operating_system: 'iOS',
                    device_type: 'tablet',
                    language: 'fr',
                    created_at: new Date('2024-02-15T12:00:00Z'),
                    updated_at: new Date('2024-02-15T12:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, differentTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].createdAt).toEqual(new Date('2024-02-15T12:00:00Z'));
            }
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM url_trackings'),
                [urlId, differentTimeRange.from, differentTimeRange.to]
            );
        });

        it('should handle edge case time ranges', async () => {
            // Arrange
            const edgeTimeRange: TimestampRange = {
                from: new Date('2024-01-01T00:00:00Z'),
                to: new Date('2024-01-01T00:00:00Z')
            };

            const mockDbRows = [
                {
                    id: 'tracking-4',
                    url_id: urlId,
                    referrer_domain: 'direct',
                    browser: 'Edge',
                    operating_system: 'Windows',
                    device_type: 'desktop',
                    language: 'en',
                    created_at: new Date('2024-01-01T00:00:00Z'),
                    updated_at: new Date('2024-01-01T00:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, edgeTimeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
            }
        });

        it('should handle trackings with null values in time range', async () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-5',
                    url_id: urlId,
                    referrer_domain: null,
                    browser: null,
                    operating_system: null,
                    device_type: null,
                    language: null,
                    created_at: new Date('2024-01-10T09:00:00Z'),
                    updated_at: new Date('2024-01-10T09:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(urlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].referrerDomain).toBeNull();
                expect(result.value[0].browser).toBeNull();
                expect(result.value[0].operatingSystem).toBeNull();
                expect(result.value[0].deviceType).toBeNull();
                expect(result.value[0].language).toBeNull();
            }
        });

        it('should handle different URL IDs with same time range', async () => {
            // Arrange
            const differentUrlId = 'url-456';
            const mockDbRows = [
                {
                    id: 'tracking-6',
                    url_id: differentUrlId,
                    referrer_domain: 'yahoo.com',
                    browser: 'Opera',
                    operating_system: 'Linux',
                    device_type: 'desktop',
                    language: 'de',
                    created_at: new Date('2024-01-25T14:00:00Z'),
                    updated_at: new Date('2024-01-25T14:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlIdAndTimeRange(differentUrlId, timeRange);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].urlId).toBe(differentUrlId);
                expect(result.value[0].referrerDomain).toBe('yahoo.com');
                expect(result.value[0].browser).toBe('Opera');
                expect(result.value[0].operatingSystem).toBe('Linux');
                expect(result.value[0].deviceType).toBe('desktop');
                expect(result.value[0].language).toBe('de');
            }
        });
    });
});
