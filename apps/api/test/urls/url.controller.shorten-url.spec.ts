import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../src/urls/url.controller';
import { ShortenUrlUseCase } from '../../src/urls/use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from '../../src/urls/use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from '../../src/urls/use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from '../../src/urls/use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from '../../src/urls/use-cases/update-slug.use-case';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { User } from '@repo/api/users/user';
import { ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

describe('UrlController - shortenUrl', () => {
    let controller: UrlController;
    let shortenUrlUseCase: jest.Mocked<ShortenUrlUseCase>;

    const mockUrl = new Url();
    mockUrl.id = 'url-123';
    mockUrl.url = 'https://example.com';
    mockUrl.slug = 'test-slug';
    mockUrl.createdAt = new Date();
    mockUrl.updatedAt = new Date();
    mockUrl.deletedAt = null;
    mockUrl.userId = 'user-123';

    const mockUser = new User();
    mockUser.id = 'user-123';
    mockUser.email = 'test@example.com';

    beforeEach(async () => {
        const mockShortenUrlUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                { provide: ShortenUrlUseCase, useValue: mockShortenUrlUseCase },
                { provide: GetUrlBySlugUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlsByUserUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateSlugUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UrlController>(UrlController);
        shortenUrlUseCase = module.get(ShortenUrlUseCase);
    });

    it('should create a shortened URL successfully', async () => {
        const createUrlDto: CreateUrlDto = {
            url: 'https://example.com',
            slug: 'test-slug',
        };

        shortenUrlUseCase.execute.mockResolvedValue(ok(mockUrl));

        const result = await controller.shortenUrl(createUrlDto, mockUser);

        expect(shortenUrlUseCase.execute).toHaveBeenCalledWith(createUrlDto, mockUser.id);
        expect(result).toEqual(mockUrl);
    });

    it('should create a shortened URL without user (public)', async () => {
        const createUrlDto: CreateUrlDto = {
            url: 'https://example.com',
            slug: 'test-slug',
        };

        shortenUrlUseCase.execute.mockResolvedValue(ok(mockUrl));

        const result = await controller.shortenUrl(createUrlDto);

        expect(shortenUrlUseCase.execute).toHaveBeenCalledWith(createUrlDto, undefined);
        expect(result).toEqual(mockUrl);
    });

    it('should throw HttpException when use case returns error', async () => {
        const createUrlDto: CreateUrlDto = {
            url: 'https://example.com',
            slug: 'test-slug',
        };

        const appError = AppError.validation('Invalid URL');
        shortenUrlUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.shortenUrl(createUrlDto, mockUser)).rejects.toThrow();
    });
});
