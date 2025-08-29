import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../src/urls/url.controller';
import { ShortenUrlUseCase } from '../../src/urls/use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from '../../src/urls/use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from '../../src/urls/use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from '../../src/urls/use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from '../../src/urls/use-cases/update-slug.use-case';
import { UpdateSlugDto } from '@repo/api/urls/update-slug.dto';
import { Url } from '@repo/api/urls/url';
import { User } from '@repo/api/users/user';
import { ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

describe('UrlController - updateSlug', () => {
    let controller: UrlController;
    let updateSlugUseCase: jest.Mocked<UpdateSlugUseCase>;

    const mockUrl = new Url();
    mockUrl.id = 'url-123';
    mockUrl.url = 'https://example.com';
    mockUrl.slug = 'new-slug';
    mockUrl.createdAt = new Date();
    mockUrl.updatedAt = new Date();
    mockUrl.deletedAt = null;
    mockUrl.userId = 'user-123';

    const mockUser = new User();
    mockUser.id = 'user-123';
    mockUser.email = 'test@example.com';

    beforeEach(async () => {
        const mockUpdateSlugUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                { provide: ShortenUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlBySlugUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlsByUserUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateSlugUseCase, useValue: mockUpdateSlugUseCase },
            ],
        }).compile();

        controller = module.get<UrlController>(UrlController);
        updateSlugUseCase = module.get(UpdateSlugUseCase);
    });

    it('should update slug successfully', async () => {
        const urlId = 'url-123';
        const updateSlugDto: UpdateSlugDto = {
            slug: 'new-slug',
        };

        updateSlugUseCase.execute.mockResolvedValue(ok(mockUrl));

        const result = await controller.updateSlug(urlId, updateSlugDto, mockUser);

        expect(updateSlugUseCase.execute).toHaveBeenCalledWith(urlId, updateSlugDto.slug, mockUser.id);
        expect(result).toEqual(mockUrl);
    });

    it('should throw HttpException when use case returns error', async () => {
        const urlId = 'url-123';
        const updateSlugDto: UpdateSlugDto = {
            slug: 'new-slug',
        };

        const appError = AppError.notFound('URL not found');
        updateSlugUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.updateSlug(urlId, updateSlugDto, mockUser)).rejects.toThrow();
    });

    it('should throw HttpException when slug is already taken', async () => {
        const urlId = 'url-123';
        const updateSlugDto: UpdateSlugDto = {
            slug: 'existing-slug',
        };

        const appError = AppError.conflict('Slug already exists');
        updateSlugUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.updateSlug(urlId, updateSlugDto, mockUser)).rejects.toThrow();
    });

    it('should throw HttpException when user is not authorized', async () => {
        const urlId = 'url-123';
        const updateSlugDto: UpdateSlugDto = {
            slug: 'new-slug',
        };

        const appError = AppError.unauthorized('Not authorized to update this URL');
        updateSlugUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.updateSlug(urlId, updateSlugDto, mockUser)).rejects.toThrow();
    });
});
