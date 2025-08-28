import { Result } from "neverthrow";
import { AppError } from "@repo/api/error";
import { CreateUrlTrackingDto } from "@repo/api/url-tracking/create-tracking.dto";
import { UrlTracking } from "@repo/api/url-tracking/url-tracking";


export interface TimestampRange {
    from: Date;
    to: Date;
}

export type CreateUrlTracking = (trackingData: CreateUrlTrackingDto) => Promise<Result<UrlTracking, AppError>>;
export type FindUrlTrackingsByUrlIdAndTimeRange = (urlId: string, timeRange: TimestampRange) => Promise<Result<UrlTracking[], AppError>>;
export type FindUrlTrackingsByUrlId = (urlId: string) => Promise<Result<UrlTracking[], AppError>>;