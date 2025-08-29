import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { ShortenUrlUseCase } from './use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from './use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from './use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from './use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from './use-cases/update-slug.use-case';
import { UrlRepository } from './url.repository';
import { PgModule } from '../postgres/pg.module';


const shortenUrlUseCaseProvider = {
    provide: ShortenUrlUseCase,
    inject: [UrlRepository],
    useFactory: (urlRepository: UrlRepository) => {
        return new ShortenUrlUseCase(urlRepository.create, urlRepository.findBySlug, urlRepository.getNextSlugSequenceValue);
    }
};

const getUrlBySlugUseCaseProvider = {
    provide: GetUrlBySlugUseCase,
    inject: [UrlRepository],
    useFactory: (urlRepository: UrlRepository) => {
        return new GetUrlBySlugUseCase(urlRepository.findBySlug);
    }
};

const getUrlsByUserUseCaseProvider = {
    provide: GetUrlsByUserUseCase,
    inject: [UrlRepository],
    useFactory: (urlRepository: UrlRepository) => {
        return new GetUrlsByUserUseCase(urlRepository.findByUserId);
    }
};

const deleteUrlUseCaseProvider = {
    provide: DeleteUrlUseCase,
    inject: [UrlRepository],
    useFactory: (urlRepository: UrlRepository) => {
        return new DeleteUrlUseCase(urlRepository.delete);
    }
};

const updateSlugUseCaseProvider = {
    provide: UpdateSlugUseCase,
    inject: [UrlRepository],
    useFactory: (urlRepository: UrlRepository) => {
        return new UpdateSlugUseCase(urlRepository.findById, urlRepository.findBySlug, urlRepository.update);
    }
};

@Module({
    imports: [
        PgModule,
    ],
    controllers: [UrlController],
    providers: [
        UrlRepository,
        shortenUrlUseCaseProvider,
        getUrlBySlugUseCaseProvider,
        getUrlsByUserUseCaseProvider,
        deleteUrlUseCaseProvider,
        updateSlugUseCaseProvider,
    ],
})
export class UrlModule { }
