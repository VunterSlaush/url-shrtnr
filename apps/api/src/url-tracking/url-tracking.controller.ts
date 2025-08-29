import { Controller, Post, Get, Param, Req, Query, HttpException } from '@nestjs/common';
import { TrackUrlUseCase } from './use-cases/track-url.use-case';
import { GetUrlAnalyticsUseCase } from './use-cases/get-url-analytics.use-case';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '@repo/api/users/user';
import { IncomingHttpHeaders } from 'http';
import { ApiOkResponse } from '@nestjs/swagger';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { Public } from '../public.decorator';
import { mapAppErrorToHttpErrorInfo } from '@repo/api/error';


@Controller('urls/trackings')
export class UrlTrackingController {
    constructor(
        private readonly trackUrlUseCase: TrackUrlUseCase,
        private readonly getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase,
    ) { }

    @Post(':urlId')
    @ApiOkResponse({
        type: UrlTracking,
        description: 'The URL tracking was created',
    })
    @Public()
    async trackUrl(@Param('urlId') urlId: string, @Req() req: Request) {
        const headers = this.parseHeaders(req.headers);

        setImmediate(async () => {
            try {
                await this.trackUrlUseCase.execute(urlId, headers);
            } catch {
                // ignore error
            }
        });

        return {
            success: true,
        };
    }

    @Get(':urlId')
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true,
                },
                data: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/UrlTracking',
                    },
                },
            },
        },
        description: 'The URL tracking visits for the given time range',
    })
    async getUrlAnalytics(
        @Param('urlId') urlId: string,
        @AuthUser() authUser: User,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {

        const timeRange = {
            from: new Date(from ?? Date.now() - 1000 * 60 * 60 * 24),
            to: new Date(to ?? Date.now())
        };
        const result = await this.getUrlAnalyticsUseCase.execute(urlId, timeRange);


        if (result.isErr()) {
            const errorInfo = mapAppErrorToHttpErrorInfo(result.error);
            throw new HttpException(errorInfo.message, errorInfo.statusCode);
        }

        return {
            success: true,
            data: result.value,
        };
    }


    parseHeaders(headers: IncomingHttpHeaders) {
        const result: Record<string, string> = {};
        Object.entries(headers).forEach(([key, value]) => {
            if (typeof value === 'string') {
                result[key] = value;
            } else if (Array.isArray(value)) {
                result[key] = value.join(', ');
            }
        });

        return result;
    }
}
