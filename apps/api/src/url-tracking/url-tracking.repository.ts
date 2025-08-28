import { Pool } from 'pg';
import { Result, ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

import { UrlTrackingMapper } from './url-tracking.mapper';
import { Inject, Injectable } from '@nestjs/common';
import {
    CreateUrlTracking,
    FindUrlTrackingsByUrlId,
    FindUrlTrackingsByUrlIdAndTimeRange,
    TimestampRange,
} from './url-tracking.interfaces';
import { UrlTracking } from '@repo/api/url-tracking/url-tracking';
import { CreateUrlTrackingDto } from '@repo/api/url-tracking/create-tracking.dto';
import { findUrlTrackingsByUrlIdQuery } from './queries/find-url-trackings-by-url-id.query';
import { findUrlTrackingsByUrlIdAndTimeRangeQuery } from './queries/find-url-trackings-by-url-id-and-time-range.query';
import { createUrlTrackingQuery } from './queries/create-url-tracking.query';


@Injectable()
export class UrlTrackingRepository {
    constructor(
        @Inject('PG_POOL')
        private readonly pool: Pool
    ) { }

    create: CreateUrlTracking = async (trackingData: CreateUrlTrackingDto): Promise<Result<UrlTracking, AppError>> => {
        try {
            const { query, values } = createUrlTrackingQuery(trackingData);
            const result = await this.pool.query(query, values);
            const tracking = UrlTrackingMapper.mapRowToUrlTracking(result.rows[0]);
            return ok(tracking);
        } catch (error) {
            return err(AppError.unhandled('Failed to create URL tracking', error));
        }
    };


    findByUrlId: FindUrlTrackingsByUrlId = async (urlId: string): Promise<Result<UrlTracking[], AppError>> => {
        try {
            const { query, values } = findUrlTrackingsByUrlIdQuery(urlId);
            const result = await this.pool.query(query, values);
            const trackings = UrlTrackingMapper.mapRowsToUrlTrackings(result.rows);
            return ok(trackings);
        } catch (error) {
            return err(AppError.unhandled('Failed to find URL trackings by URL ID', error));
        }
    };

    findByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange = async (urlId: string, timeRange: TimestampRange): Promise<Result<UrlTracking[], AppError>> => {
        try {
            const { query, values } = findUrlTrackingsByUrlIdAndTimeRangeQuery(urlId, timeRange);
            const result = await this.pool.query(query, values);
            const trackings = UrlTrackingMapper.mapRowsToUrlTrackings(result.rows);
            return ok(trackings);
        } catch (error) {
            return err(AppError.unhandled('Failed to find URL trackings by URL ID and time range', error));
        }
    };

}
