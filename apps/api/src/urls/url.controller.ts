import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus, Patch } from '@nestjs/common';
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
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('URLs')
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
    @ApiOkResponse({
        type: Url,
        description: 'The shortened URL',
    })
    @ApiBody({ type: CreateUrlDto, description: 'The URL to shorten' })
    async shortenUrl(@Body() createUrlDto: CreateUrlDto, @AuthUser() authUser?: User): Promise<Url> {
        const result = await this.shortenUrlUseCase.execute(createUrlDto, authUser?.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST); // TODO: Add Typification
        }

        return result.value;
    }

    @Get(':slug')
    @ApiOkResponse({
        type: Url,
        description: 'The URL properties',
    })
    async getUrlBySlug(@Param('slug') slug: string): Promise<Url> {
        const result = await this.getUrlBySlugUseCase.execute(slug);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND); //TODO: Add typification
        }

        return result.value;
    }


    @Get()
    @ApiOkResponse({
        type: [Url],
        description: 'The URLs from the logged in user',
    })
    async getUrlsByUser(@AuthUser() authUser: User): Promise<Url[]> {
        const result = await this.getUrlsByUserUseCase.execute(authUser?.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result.value;
    }

    @Delete(':id')
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
            },
        },
        description: 'The URL was deleted',
    })
    async deleteUrl(@Param('id') id: string, @AuthUser() authUser: User): Promise<{ success: boolean }> {
        const result = await this.deleteUrlUseCase.execute(id, authUser.id);

        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { success: result.value };
    }

    @Patch(':id/slug')
    @ApiOkResponse({
        type: Url,
        description: 'The URL properties updated',
    })
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
