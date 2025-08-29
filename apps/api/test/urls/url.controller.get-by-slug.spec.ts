import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../src/urls/url.controller';
import { ShortenUrlUseCase } from '../../src/urls/use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from '../../src/urls/use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from '../../src/urls/use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from '../../src/urls/use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from '../../src/urls/use-cases/update-slug.use-case';
import { Url } from '@repo/api/urls/url';
import { ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

describe('UrlController - getUrlBySlug', () => {
    let controller: UrlController;
    let getUrlBySlugUseCase: jest.Mocked<GetUrlBySlugUseCase>;

    const mockUrl = new Url();
    mockUrl.id = 'url-123';
    mockUrl.url = 'https://example.com';
    mockUrl.slug = 'test-slug';
    mockUrl.createdAt = new Date();
    mockUrl.updatedAt = new Date();
    mockUrl.deletedAt = null;
    mockUrl.userId = 'user-123';

    beforeEach(async () => {
        const mockGetUrlBySlugUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                { provide: ShortenUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlBySlugUseCase, useValue: mockGetUrlBySlugUseCase },
                { provide: GetUrlsByUserUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateSlugUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UrlController>(UrlController);
        getUrlBySlugUseCase = module.get(GetUrlBySlugUseCase);
    });

    it('should return URL when slug exists', async () => {
        const slug = 'test-slug';

        getUrlBySlugUseCase.execute.mockResolvedValue(ok(mockUrl));

        const result = await controller.getUrlBySlug(slug);

        expect(getUrlBySlugUseCase.execute).toHaveBeenCalledWith(slug);
        expect(result).toEqual(mockUrl);
    });

    it('should throw HttpException when slug not found', async () => {
        const slug = 'non-existent-slug';

        const appError = AppError.notFound('Slug not found');
        getUrlBySlugUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.getUrlBySlug(slug)).rejects.toThrow();
    });
});
