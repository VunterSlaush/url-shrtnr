import { Result } from 'neverthrow';
import { AppError } from '@repo/api/error';
import { DeleteUrl } from '../url.interfaces';

export class DeleteUrlUseCase {
    constructor(
        private readonly deleteUrl: DeleteUrl,
    ) { }

    async execute(id: string): Promise<Result<boolean, AppError>> {
        return this.deleteUrl(id);
    }
}
