import { Module } from '@nestjs/common';
import { UrlTrackingController } from './url-tracking.controller';
import { UrlTrackingRepository } from './url-tracking.repository';
import { TrackUrlUseCase } from './use-cases/track-url.use-case';
import { GetUrlAnalyticsUseCase } from './use-cases/get-url-analytics.use-case';
import { PgModule } from '../postgres/pg.module';

const trackUrlUseCaseProvider = {
    provide: TrackUrlUseCase,
    inject: [UrlTrackingRepository],
    useFactory: (urlTrackingRepository: UrlTrackingRepository) => {
        return new TrackUrlUseCase(
            urlTrackingRepository.create,
        );
    }
};

const getUrlAnalyticsUseCaseProvider = {
    provide: GetUrlAnalyticsUseCase,
    inject: [UrlTrackingRepository],
    useFactory: (urlTrackingRepository: UrlTrackingRepository) => {
        return new GetUrlAnalyticsUseCase(
            urlTrackingRepository.findByUrlIdAndTimeRange,
        );
    }
};

@Module({
    imports: [
        PgModule,
    ],
    controllers: [UrlTrackingController],
    providers: [
        UrlTrackingRepository,
        trackUrlUseCaseProvider,
        getUrlAnalyticsUseCaseProvider,
    ],
    exports: [
        trackUrlUseCaseProvider,
        getUrlAnalyticsUseCaseProvider,
    ],
})
export class UrlTrackingModule { }
