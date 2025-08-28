import { Result } from 'neverthrow';
import { Url } from '@repo/api/urls/url';
import { AppError } from '@repo/api/error';
import { FindUrlsByUserId } from '../url.interfaces';

export class GetUrlsByUserUseCase {
    constructor(
        private readonly findUrlsByUserId: FindUrlsByUserId,
    ) { }

    async execute(userId: string): Promise<Result<Url[], AppError>> {
        return this.findUrlsByUserId(userId);
    }
}
