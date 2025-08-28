import { Result } from 'neverthrow';
import { DeleteUrl } from '../url.interfaces';

export class DeleteUrlUseCase {
  constructor(
    private readonly deleteUrl: DeleteUrl,
  ) {}

  async execute(id: string): Promise<Result<boolean, Error>> {
    return this.deleteUrl(id);
  }
}
