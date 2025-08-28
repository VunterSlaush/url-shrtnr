import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus, Query, Patch } from '@nestjs/common';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { UpdateSlugDto } from '@repo/api/urls/update-slug.dto';
import { Url } from '@repo/api/urls/url';
import { ShortenUrlUseCase } from './use-cases/shorten-url.use-case';
import { GetUrlBySlugUseCase } from './use-cases/get-url-by-slug.use-case';
import { GetUrlsByUserUseCase } from './use-cases/get-urls-by-user.use-case';
import { DeleteUrlUseCase } from './use-cases/delete-url.user-case';
import { UpdateSlugUseCase } from './use-cases/update-slug.use-case';

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
    async createUrl(@Body() createUrlDto: CreateUrlDto): Promise<Url> {
        console.log(createUrlDto);
        const result = await this.shortenUrlUseCase.execute(createUrlDto); // TODO: Add userId

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


    @Get('user/:userId')
    async getUrlsByUser(@Param('userId') userId: string): Promise<Url[]> {
        const result = await this.getUrlsByUserUseCase.execute(userId);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Delete(':id')
    async deleteUrl(@Param('id') id: string): Promise<{ success: boolean }> {
        const result = await this.deleteUrlUseCase.execute(id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { success: result.value };
    }

    @Patch(':id/slug')
    async updateSlug(
        @Param('id') id: string,
        @Body() body: UpdateSlugDto,

    ): Promise<Url> {
        const result = await this.updateSlugUseCase.execute(id, body.slug); // TODO

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }

        return result.value;
    }
}
