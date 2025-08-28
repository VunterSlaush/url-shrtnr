import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UrlTrackingRepository } from '../../src/url-tracking/url-tracking.repository';
import { CreateUrlTrackingDto } from '@repo/api/url-tracking/create-tracking.dto';
import { AppError } from '@repo/api/error';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';

describe('UrlTrackingRepository - create', () => {
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

    describe('create', () => {
        const createUrlTrackingDto: CreateUrlTrackingDto = {
            urlId: 'url-123',
            referrerDomain: 'example.com',
            browser: 'Chrome',
            operatingSystem: 'Windows',
            deviceType: 'desktop',
            language: 'en',
            ipAddress: '192.168.1.1'
        };

        it('should successfully create a URL tracking', async () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: createUrlTrackingDto.urlId,
                referrer_domain: createUrlTrackingDto.referrerDomain,
                browser: createUrlTrackingDto.browser,
                operating_system: createUrlTrackingDto.operatingSystem,
                device_type: createUrlTrackingDto.deviceType,
                language: createUrlTrackingDto.language,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlTrackingRepository.create(createUrlTrackingDto);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.urlId).toBe(createUrlTrackingDto.urlId);
                expect(result.value.referrerDomain).toBe(createUrlTrackingDto.referrerDomain);
                expect(result.value.browser).toBe(createUrlTrackingDto.browser);
                expect(result.value.operatingSystem).toBe(createUrlTrackingDto.operatingSystem);
                expect(result.value.deviceType).toBe(createUrlTrackingDto.deviceType);
                expect(result.value.language).toBe(createUrlTrackingDto.language);
            }
            expect(mockPool.query).toHaveBeenCalledTimes(1);
        });

        it('should return error when database query fails', async () => {
            // Arrange
            const mockError = new Error('Database connection failed');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlTrackingRepository.create(createUrlTrackingDto);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL tracking');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should return error when database returns no rows', async () => {
            // Arrange
            mockPool.query.mockResolvedValue({ rows: [] });

            // Act
            const result = await urlTrackingRepository.create(createUrlTrackingDto);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL tracking');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle database constraint violations', async () => {
            // Arrange
            const mockError = new Error('duplicate key value violates unique constraint');
            mockPool.query.mockRejectedValue(mockError);

            // Act
            const result = await urlTrackingRepository.create(createUrlTrackingDto);

            // Assert
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
                expect(result.error).toBeInstanceOf(AppError);
                expect(result.error.message).toBe('Failed to create URL tracking');
                expect(result.error.isUnhandled()).toBe(true);
            }
        });

        it('should handle null values in optional fields', async () => {
            // Arrange
            const trackingDataWithNulls: CreateUrlTrackingDto = {
                urlId: 'url-123',
                referrerDomain: undefined,
                browser: null,
                operatingSystem: undefined,
                deviceType: null,
                language: undefined,
                ipAddress: null
            };

            const mockDbRow = {
                id: 'tracking-123',
                url_id: trackingDataWithNulls.urlId,
                referrer_domain: null,
                browser: null,
                operating_system: null,
                device_type: null,
                language: null,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockPool.query.mockResolvedValue({ rows: [mockDbRow] });

            // Act
            const result = await urlTrackingRepository.create(trackingDataWithNulls);

            // Assert
            expect(result.isOk()).toBe(true);
            if (result.isOk()) {
                expect(result.value.urlId).toBe(trackingDataWithNulls.urlId);
                expect(result.value.referrerDomain).toBeNull();
                expect(result.value.browser).toBeNull();
                expect(result.value.operatingSystem).toBeNull();
                expect(result.value.deviceType).toBeNull();
                expect(result.value.language).toBeNull();
            }
        });
    });
});
