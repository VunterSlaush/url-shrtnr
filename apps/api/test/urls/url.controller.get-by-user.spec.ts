import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../src/urls/url.controller';
import { ShortenUrlUseCase } from '../../src/urls/use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from '../../src/urls/use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from '../../src/urls/use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from '../../src/urls/use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from '../../src/urls/use-cases/update-slug.use-case';
import { Url } from '@repo/api/urls/url';
import { User } from '@repo/api/users/user';
import { ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

describe('UrlController - getUrlsByUser', () => {
    let controller: UrlController;
    let getUrlsByUserUseCase: jest.Mocked<GetUrlsByUserUseCase>;

    const mockUrl1 = new Url();
    mockUrl1.id = 'url-123';
    mockUrl1.url = 'https://example.com';
    mockUrl1.slug = 'test-slug-1';
    mockUrl1.createdAt = new Date();
    mockUrl1.updatedAt = new Date();
    mockUrl1.deletedAt = null;
    mockUrl1.userId = 'user-123';

    const mockUrl2 = new Url();
    mockUrl2.id = 'url-456';
    mockUrl2.url = 'https://example2.com';
    mockUrl2.slug = 'test-slug-2';
    mockUrl2.createdAt = new Date();
    mockUrl2.updatedAt = new Date();
    mockUrl2.deletedAt = null;
    mockUrl2.userId = 'user-123';

    const mockUser = new User();
    mockUser.id = 'user-123';
    mockUser.email = 'test@example.com';

    beforeEach(async () => {
        const mockGetUrlsByUserUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                { provide: ShortenUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlBySlugUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlsByUserUseCase, useValue: mockGetUrlsByUserUseCase },
                { provide: DeleteUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: UpdateSlugUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UrlController>(UrlController);
        getUrlsByUserUseCase = module.get(GetUrlsByUserUseCase);
    });

    it('should return URLs for authenticated user', async () => {
        const mockUrls = [mockUrl1, mockUrl2];

        getUrlsByUserUseCase.execute.mockResolvedValue(ok(mockUrls));

        const result = await controller.getUrlsByUser(mockUser);

        expect(getUrlsByUserUseCase.execute).toHaveBeenCalledWith(mockUser.id);
        expect(result).toEqual(mockUrls);
    });

    it('should return empty array when user has no URLs', async () => {
        getUrlsByUserUseCase.execute.mockResolvedValue(ok([]));

        const result = await controller.getUrlsByUser(mockUser);

        expect(getUrlsByUserUseCase.execute).toHaveBeenCalledWith(mockUser.id);
        expect(result).toEqual([]);
    });

    it('should throw HttpException when use case returns error', async () => {
        const appError = AppError.unhandled('Database error');
        getUrlsByUserUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.getUrlsByUser(mockUser)).rejects.toThrow();
    });
});
