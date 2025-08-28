import { Result, err } from 'neverthrow';
import { AppError } from '@repo/api/error';
import { FindUrlTrackingsByUrlIdAndTimeRange, TimestampRange } from '../url-tracking.interfaces';

export class GetUrlAnalyticsUseCase {
    constructor(
        private readonly findUrlTrackingsByUrlIdAndTimeRange: FindUrlTrackingsByUrlIdAndTimeRange
    ) { }


    async execute(urlId: string, timeRange: TimestampRange): Promise<Result<any, AppError>> {
        try {
            if (!urlId || urlId.trim().length === 0) {
                return err(AppError.validation('URL ID is required'));
            }

            if (!this.isValidTimeRange(timeRange)) {
                return err(AppError.validation('Invalid time range'));
            }

            return await this.findUrlTrackingsByUrlIdAndTimeRange(urlId, timeRange);
        } catch (error) {
            return err(AppError.unhandled('Failed to get URL analytics for time range', error));
        }
    }

    private isValidTimeRange(timeRange: TimestampRange): boolean {
        return timeRange.from instanceof Date &&
            timeRange.to instanceof Date &&
            timeRange.from <= timeRange.to;
    }
}
