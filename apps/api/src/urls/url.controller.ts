import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus, Query, Patch } from '@nestjs/common';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { UpdateSlugDto } from '@repo/api/urls/update-slug.dto';
import { Url } from '@repo/api/urls/url';
import { ShortenUrlUseCase } from './use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from './use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from './use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from './use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from './use-cases/update-slug.use-case';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from '@repo/api/users/user';

@Controller('urls')
export class UrlController {
    constructor(
        private readonly shortenUrlUseCase: ShortenUrlUseCase,
        private readonly getUrlBySlugUseCase: GetUrlBySlugUseCase,
        private readonly getUrlsByUserUseCase: GetUrlsByUserUseCase,
        private readonly deleteUrlUseCase: DeleteUrlUseCase,
        private readonly updateSlugUseCase: UpdateSlugUseCase,
    ) { }

    @Post()
    async createUrl(@Body() createUrlDto: CreateUrlDto, @AuthUser() authUser?: User): Promise<Url> {
        const result = await this.shortenUrlUseCase.execute(createUrlDto, authUser?.id);

        if (result.isErr()) {
            console.log(result.error);
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST); // TODO: Add Typification
        }

        return result.value;
    }

    @Get(':slug')
    async getUrlBySlug(@Param('slug') slug: string): Promise<Url> {
        const result = await this.getUrlBySlugUseCase.execute(slug);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND); //TODO: Add typification
        }

        return result.value;
    }


    @Get()
    async getUrlsByUser(@AuthUser() authUser: User): Promise<Url[]> {
        const result = await this.getUrlsByUserUseCase.execute(authUser?.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Delete(':id')
    async deleteUrl(@Param('id') id: string, @AuthUser() authUser: User): Promise<{ success: boolean }> {
        const result = await this.deleteUrlUseCase.execute(id, authUser.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { success: result.value };
    }

    @Patch(':id/slug')
    async updateSlug(
        @Param('id') id: string,
        @Body() body: UpdateSlugDto,
        @AuthUser() authUser: User,
    ): Promise<Url> {
        const result = await this.updateSlugUseCase.execute(id, body.slug, authUser.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }

        return result.value;
    }
}
