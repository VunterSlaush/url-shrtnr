import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlTrackingRepository } from '../../src/url-tracking/url-tracking.repository';
import { AppError } from '@repo/api/error';

describe('UrlTrackingRepository - findByUrlId', () => {
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

    describe('findByUrlId', () => {
        const urlId = 'url-123';

        it('should successfully find URL trackings by URL ID', async () => {
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
                    created_at: new Date('2024-01-01T10:00:00Z'),
                    updated_at: new Date('2024-01-01T10:00:00Z')
                },
                {
                    id: 'tracking-2',
                    url_id: urlId,
                    referrer_domain: 'google.com',
                    browser: 'Firefox',
                    operating_system: 'macOS',
                    device_type: 'mobile',
                    language: 'es',
                    created_at: new Date('2024-01-02T15:30:00Z'),
                    updated_at: new Date('2024-01-02T15:30:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlId(urlId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].id).toBe('tracking-1');
                expect(result.value[0].urlId).toBe(urlId);
                expect(result.value[0].referrerDomain).toBe('example.com');
                expect(result.value[0].browser).toBe('Chrome');
                expect(result.value[0].operatingSystem).toBe('Windows');
                expect(result.value[0].deviceType).toBe('desktop');
                expect(result.value[0].language).toBe('en');
                expect(result.value[1].id).toBe('tracking-2');
                expect(result.value[1].urlId).toBe(urlId);
                expect(result.value[1].referrerDomain).toBe('google.com');
                expect(result.value[1].browser).toBe('Firefox');
                expect(result.value[1].operatingSystem).toBe('macOS');
                expect(result.value[1].deviceType).toBe('mobile');
                expect(result.value[1].language).toBe('es');
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no trackings found', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlTrackingRepository.findByUrlId(urlId);

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
            const result = await urlTrackingRepository.findByUrlId(urlId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL trackings by URL ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database timeout errors', async () => {
            // Arrange
            const mockError = new Error('Query timeout');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlTrackingRepository.findByUrlId(urlId);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to find URL trackings by URL ID');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle trackings with null values', async () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-1',
                    url_id: urlId,
                    referrer_domain: null,
                    browser: null,
                    operating_system: null,
                    device_type: null,
                    language: null,
                    created_at: new Date('2024-01-01T10:00:00Z'),
                    updated_at: new Date('2024-01-01T10:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlId(urlId);

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

        it('should handle different URL IDs', async () => {
            // Arrange
            const differentUrlId = 'url-456';
            const mockDbRows = [
                {
                    id: 'tracking-3',
                    url_id: differentUrlId,
                    referrer_domain: 'bing.com',
                    browser: 'Safari',
                    operating_system: 'iOS',
                    device_type: 'tablet',
                    language: 'fr',
                    created_at: new Date('2024-01-03T12:00:00Z'),
                    updated_at: new Date('2024-01-03T12:00:00Z')
                }
            ];

            mockPool.query.mockResolvedValue({ rows: mockDbRows });

            // Act
            const result = await urlTrackingRepository.findByUrlId(differentUrlId);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value).toHaveLength(1);
                expect(result.value[0].urlId).toBe(differentUrlId);
                expect(result.value[0].referrerDomain).toBe('bing.com');
                expect(result.value[0].browser).toBe('Safari');
                expect(result.value[0].operatingSystem).toBe('iOS');
                expect(result.value[0].deviceType).toBe('tablet');
                expect(result.value[0].language).toBe('fr');
            }
        });
    });
});
