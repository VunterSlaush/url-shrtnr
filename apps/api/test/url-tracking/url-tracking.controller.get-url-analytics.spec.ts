import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { UrlTrackingController } from '../../src/url-tracking/url-tracking.controller';
import { TrackUrlUseCase } from '../../src/url-tracking/use-cases/track-url.use-case';
import { GetUrlAnalyticsUseCase } from '../../src/url-tracking/use-cases/get-url-analytics.use-case';
import { User } from '@repo/api/users/user';
import { ok, err } from 'neverthrow';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { AppError } from '@repo/api/error';
import { HttpException } from '@nestjs/common';
import { TimestampRange } from '../../src/url-tracking/url-tracking.interfaces';

describe('UrlTrackingController - getUrlAnalytics', () => {
    let controller: UrlTrackingController;
    let getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlTrackingController],
            providers: [
                {
                    provide: TrackUrlUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: GetUrlAnalyticsUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UrlTrackingController>(UrlTrackingController);
    });

    it('should return URL analytics successfully', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockTrackings: UrlTracking[] = [
            {
                id: 'tracking-1',
                urlId: 'test-url-123',
                referrerDomain: 'example.com',
                browser: 'Chrome',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                language: 'en',
                ipAddress: '192.168.1.1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(ok(mockTrackings));

        // Act
        const result = await controller.getUrlAnalytics(urlId, mockUser);

        // Assert
        expect(result).toEqual({
            success: true,
            data: mockTrackings,
        });
        expect(getUrlAnalyticsUseCase.execute).toHaveBeenCalledWith(urlId, {
            from: expect.any(Date),
            to: expect.any(Date),
        });
    });

    it('should use provided time range when from and to parameters are given', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const from = '2024-01-01T00:00:00Z';
        const to = '2024-01-31T23:59:59Z';
        const mockTrackings: UrlTracking[] = [];

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(ok(mockTrackings));

        // Act
        await controller.getUrlAnalytics(urlId, mockUser, from, to);

        // Assert
        expect(getUrlAnalyticsUseCase.execute).toHaveBeenCalledWith(urlId, {
            from: new Date(from),
            to: new Date(to),
        });
    });

    it('should use default time range when no parameters are provided', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockTrackings: UrlTracking[] = [];

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(ok(mockTrackings));

        // Act
        await controller.getUrlAnalytics(urlId, mockUser);

        // Assert
        const callArgs = (getUrlAnalyticsUseCase.execute as jest.Mock).mock.calls[0];
        const timeRange = callArgs[1] as TimestampRange;

        expect(timeRange.from).toBeInstanceOf(Date);
        expect(timeRange.to).toBeInstanceOf(Date);
        expect(timeRange.from.getTime()).toBeLessThanOrEqual(timeRange.to.getTime());

        // Default should be roughly 24 hours ago to now
        const now = Date.now();
        const oneDayAgo = now - 1000 * 60 * 60 * 24;
        expect(timeRange.from.getTime()).toBeGreaterThan(oneDayAgo - 1000); // Allow 1 second tolerance
        expect(timeRange.to.getTime()).toBeLessThanOrEqual(now + 1000); // Allow 1 second tolerance
    });

    it('should throw HTTP error when use case returns error', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockError = AppError.validation('Invalid URL ID');

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(err(mockError));

        // Act & Assert
        await expect(controller.getUrlAnalytics(urlId, mockUser)).rejects.toThrow(HttpException);
    });

    it('should handle validation errors from use case', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockError = AppError.validation('URL ID is required');

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(err(mockError));

        // Act & Assert
        await expect(controller.getUrlAnalytics(urlId, mockUser)).rejects.toThrow(HttpException);
    });

    it('should handle unhandled errors from use case', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            providerId: 'provider-123',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockError = AppError.unhandled('Database connection failed');

        jest.spyOn(getUrlAnalyticsUseCase, 'execute').mockResolvedValue(err(mockError));

        // Act & Assert
        await expect(controller.getUrlAnalytics(urlId, mockUser)).rejects.toThrow(HttpException);
    });
});
