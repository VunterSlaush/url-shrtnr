import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from '../../src/urls/url.controller';
import { ShortenUrlUseCase } from '../../src/urls/use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from '../../src/urls/use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from '../../src/urls/use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from '../../src/urls/use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from '../../src/urls/use-cases/update-slug.use-case';
import { User } from '@repo/api/users/user';
import { ok, err } from 'neverthrow';
import { AppError } from '@repo/api/error';

describe('UrlController - deleteUrl', () => {
    let controller: UrlController;
    let deleteUrlUseCase: jest.Mocked<DeleteUrlUseCase>;

    const mockUser = new User();
    mockUser.id = 'user-123';
    mockUser.email = 'test@example.com';

    beforeEach(async () => {
        const mockDeleteUrlUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                { provide: ShortenUrlUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlBySlugUseCase, useValue: { execute: jest.fn() } },
                { provide: GetUrlsByUserUseCase, useValue: { execute: jest.fn() } },
                { provide: DeleteUrlUseCase, useValue: mockDeleteUrlUseCase },
                { provide: UpdateSlugUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile();

        controller = module.get<UrlController>(UrlController);
        deleteUrlUseCase = module.get(DeleteUrlUseCase);
    });

    it('should delete URL successfully', async () => {
        const urlId = 'url-123';

        deleteUrlUseCase.execute.mockResolvedValue(ok(true));

        const result = await controller.deleteUrl(urlId, mockUser);

        expect(deleteUrlUseCase.execute).toHaveBeenCalledWith(urlId, mockUser.id);
        expect(result).toEqual({ success: true });
    });

    it('should return success false when deletion fails', async () => {
        const urlId = 'url-123';

        deleteUrlUseCase.execute.mockResolvedValue(ok(false));

        const result = await controller.deleteUrl(urlId, mockUser);

        expect(deleteUrlUseCase.execute).toHaveBeenCalledWith(urlId, mockUser.id);
        expect(result).toEqual({ success: false });
    });

    it('should throw HttpException when use case returns error', async () => {
        const urlId = 'url-123';

        const appError = AppError.notFound('URL not found');
        deleteUrlUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.deleteUrl(urlId, mockUser)).rejects.toThrow();
    });

    it('should throw HttpException when user is not authorized', async () => {
        const urlId = 'url-123';

        const appError = AppError.unauthorized('Not authorized to delete this URL');
        deleteUrlUseCase.execute.mockResolvedValue(err(appError));

        await expect(controller.deleteUrl(urlId, mockUser)).rejects.toThrow();
    });
});
