import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { UrlTrackingController } from '../../src/url-tracking/url-tracking.controller';
import { TrackUrlUseCase } from '../../src/url-tracking/use-cases/track-url.use-case';
import { GetUrlAnalyticsUseCase } from '../../src/url-tracking/use-cases/get-url-analytics.use-case';
import { Request } from 'express';


describe('UrlTrackingController - trackUrl', () => {
    let controller: UrlTrackingController;


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

    it('should return success immediately when tracking URL', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockRequest = {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'referer': 'https://example.com/page',
                'accept-language': 'en-US,en;q=0.9',
            },
        } as unknown as Request;

        // Act
        const result = await controller.trackUrl(urlId, mockRequest);

        // Assert
        expect(result).toEqual({ success: true });
    });

    it('should handle missing headers gracefully', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockRequest = {
            headers: {},
        } as unknown as Request;

        // Act
        const result = await controller.trackUrl(urlId, mockRequest);

        // Assert
        expect(result).toEqual({ success: true });
    });

    it('should handle various header types', async () => {
        // Arrange
        const urlId = 'test-url-123';
        const mockRequest = {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'accept-language': ['en-US', 'en;q=0.9', 'es;q=0.8'],
                'x-forwarded-for': '192.168.1.1',
                'content-length': 1234,
                'x-custom': null,
            },
        } as unknown as Request;

        // Act
        const result = await controller.trackUrl(urlId, mockRequest);

        // Assert
        expect(result).toEqual({ success: true });
    });
});
