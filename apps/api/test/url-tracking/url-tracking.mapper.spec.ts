import { describe, expect, it } from '@jest/globals';
import { UrlTrackingMapper } from '../../src/url-tracking/url-tracking.mapper';


describe('UrlTrackingMapper', () => {
    describe('mapRowToUrlTracking', () => {
        it('should map database row to UrlTracking object with all fields', () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: 'Chrome',
                operating_system: 'Windows',
                device_type: 'desktop',
                language: 'en',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            // Act
            const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);

            // Assert
            expect(result).toEqual({
                id: 'tracking-123',
                urlId: 'url-456',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-01-15T10:00:00Z')
            });
        });

        it('should map database row with null values', () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: 'url-456',
                referrer_domain: null,
                browser: null,
                operating_system: null,
                device_type: null,
                language: null,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            // Act
            const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);

            // Assert
            expect(result).toEqual({
                id: 'tracking-123',
                urlId: 'url-456',
                referrerDomain: null,
                browser: null,
                operatingSystem: null,
                deviceType: null,
                language: null,
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-01-15T10:00:00Z')
            });
        });

        it('should map database row with undefined values', () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: 'url-456',
                referrer_domain: undefined,
                browser: undefined,
                operating_system: undefined,
                device_type: undefined,
                language: undefined,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            // Act
            const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);

            // Assert
            expect(result).toEqual({
                id: 'tracking-123',
                urlId: 'url-456',
                referrerDomain: undefined,
                browser: undefined,
                operatingSystem: undefined,
                deviceType: undefined,
                language: undefined,
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-01-15T10:00:00Z')
            });
        });

        it('should handle different date formats', () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: 'Chrome',
                operating_system: 'Windows',
                device_type: 'desktop',
                language: 'en',
                created_at: '2024-01-15',
                updated_at: '2024-01-15T10:00:00.000Z'
            };

            // Act
            const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);

            // Assert
            expect(result.createdAt).toEqual(new Date('2024-01-15'));
            expect(result.updatedAt).toEqual(new Date('2024-01-15T10:00:00.000Z'));
        });

        it('should handle empty string values', () => {
            // Arrange
            const mockDbRow = {
                id: 'tracking-123',
                url_id: 'url-456',
                referrer_domain: '',
                browser: '',
                operating_system: '',
                device_type: '',
                language: '',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            };

            // Act
            const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);

            // Assert
            expect(result).toEqual({
                id: 'tracking-123',
                urlId: 'url-456',
                referrerDomain: '',
                browser: '',
                operatingSystem: '',
                deviceType: '',
                language: '',
                createdAt: new Date('2024-01-15T10:00:00Z'),
                updatedAt: new Date('2024-01-15T10:00:00Z')
            });
        });

        it('should handle different device types', () => {
            // Arrange
            const deviceTypes = ['mobile', 'tablet', 'desktop', 'smarttv'];
            const mockDbRows = deviceTypes.map((deviceType, index) => ({
                id: `tracking-${index}`,
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: 'Chrome',
                operating_system: 'Windows',
                device_type: deviceType,
                language: 'en',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            }));

            // Act & Assert
            mockDbRows.forEach((mockDbRow, index) => {
                const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);
                expect(result.deviceType).toBe(deviceTypes[index]);
            });
        });

        it('should handle different browsers', () => {
            // Arrange
            const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
            const mockDbRows = browsers.map((browser, index) => ({
                id: `tracking-${index}`,
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: browser,
                operating_system: 'Windows',
                device_type: 'desktop',
                language: 'en',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            }));

            // Act & Assert
            mockDbRows.forEach((mockDbRow, index) => {
                const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);
                expect(result.browser).toBe(browsers[index]);
            });
        });

        it('should handle different operating systems', () => {
            // Arrange
            const operatingSystems = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
            const mockDbRows = operatingSystems.map((os, index) => ({
                id: `tracking-${index}`,
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: 'Chrome',
                operating_system: os,
                device_type: 'desktop',
                language: 'en',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            }));

            // Act & Assert
            mockDbRows.forEach((mockDbRow, index) => {
                const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);
                expect(result.operatingSystem).toBe(operatingSystems[index]);
            });
        });

        it('should handle different languages', () => {
            // Arrange
            const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
            const mockDbRows = languages.map((language, index) => ({
                id: `tracking-${index}`,
                url_id: 'url-456',
                referrer_domain: 'example.com',
                browser: 'Chrome',
                operating_system: 'Windows',
                device_type: 'desktop',
                language: language,
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            }));

            // Act & Assert
            mockDbRows.forEach((mockDbRow, index) => {
                const result = UrlTrackingMapper.mapRowToUrlTracking(mockDbRow);
                expect(result.language).toBe(languages[index]);
            });
        });
    });

    describe('mapRowsToUrlTrackings', () => {
        it('should map multiple database rows to UrlTracking array', () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-1',
                    url_id: 'url-456',
                    referrer_domain: 'example.com',
                    browser: 'Chrome',
                    operating_system: 'Windows',
                    device_type: 'desktop',
                    language: 'en',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 'tracking-2',
                    url_id: 'url-456',
                    referrer_domain: 'google.com',
                    browser: 'Firefox',
                    operating_system: 'macOS',
                    device_type: 'mobile',
                    language: 'es',
                    created_at: '2024-01-16T15:30:00Z',
                    updated_at: '2024-01-16T15:30:00Z'
                }
            ];

            // Act
            const result = UrlTrackingMapper.mapRowsToUrlTrackings(mockDbRows);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('tracking-1');
            expect(result[0].browser).toBe('Chrome');
            expect(result[0].operatingSystem).toBe('Windows');
            expect(result[1].id).toBe('tracking-2');
            expect(result[1].browser).toBe('Firefox');
            expect(result[1].operatingSystem).toBe('macOS');
        });

        it('should return empty array when no rows provided', () => {
            // Arrange
            const mockDbRows: any[] = [];

            // Act
            const result = UrlTrackingMapper.mapRowsToUrlTrackings(mockDbRows);

            // Assert
            expect(result).toHaveLength(0);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle single row array', () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-1',
                    url_id: 'url-456',
                    referrer_domain: 'example.com',
                    browser: 'Chrome',
                    operating_system: 'Windows',
                    device_type: 'desktop',
                    language: 'en',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                }
            ];

            // Act
            const result = UrlTrackingMapper.mapRowsToUrlTrackings(mockDbRows);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('tracking-1');
            expect(result[0].browser).toBe('Chrome');
        });

        it('should handle rows with mixed null and non-null values', () => {
            // Arrange
            const mockDbRows = [
                {
                    id: 'tracking-1',
                    url_id: 'url-456',
                    referrer_domain: 'example.com',
                    browser: 'Chrome',
                    operating_system: 'Windows',
                    device_type: 'desktop',
                    language: 'en',
                    created_at: '2024-01-15T10:00:00Z',
                    updated_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: 'tracking-2',
                    url_id: 'url-456',
                    referrer_domain: null,
                    browser: null,
                    operating_system: null,
                    device_type: null,
                    language: null,
                    created_at: '2024-01-16T15:30:00Z',
                    updated_at: '2024-01-16T15:30:00Z'
                }
            ];

            // Act
            const result = UrlTrackingMapper.mapRowsToUrlTrackings(mockDbRows);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].referrerDomain).toBe('example.com');
            expect(result[0].browser).toBe('Chrome');
            expect(result[1].referrerDomain).toBeNull();
            expect(result[1].browser).toBeNull();
        });
    });
});
