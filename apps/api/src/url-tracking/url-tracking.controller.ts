import { Controller, Post, Get, Param, Req, Query } from '@nestjs/common';
import { TrackUrlUseCase } from './use-cases/track-url.use-case';
import { GetUrlAnalyticsUseCase } from './use-cases/get-url-analytics.use-case';
import { Request } from 'express';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from '@repo/api/users/user';
import { IncomingHttpHeaders } from 'http';


@Controller('urls/trackings')
export class UrlTrackingController {
    constructor(
        private readonly trackUrlUseCase: TrackUrlUseCase,
        private readonly getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase,
    ) { }

    @Post(':urlId')
    async trackUrl(@Param('urlId') urlId: string, @Req() req: Request) {
        const headers = this.parseHeaders(req.headers);

        // Queue the tracking operation to ensure it executes even if HTTP connection dies
        setImmediate(async () => {
            try {
                await this.trackUrlUseCase.execute(urlId, headers);
            } catch (error) {
                console.error('Background URL tracking failed:', error);
            }
        });

        return {
            success: true,
        };
    }

    @Get(':urlId')
    async getUrlAnalytics(
        @Param('urlId') urlId: string,
        @AuthUser() authUser: User,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        let result;


        const timeRange = {
            from: new Date(from ?? Date.now() - 1000 * 60 * 60 * 24),
            to: new Date(to ?? Date.now())
        };
        result = await this.getUrlAnalyticsUseCase.execute(urlId, timeRange);


        if (result.isErr()) {
            throw result.error;
        }

        return {
            success: true,
            data: result.value,
        };
    }


    parseHeaders(headers: IncomingHttpHeaders) {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(headers)) {

            if (typeof value === 'string') {
                result[key] = value;
            } else if (Array.isArray(value)) {
                result[key] = value.join(', ');
            }

            return result;
        }
    }
}
