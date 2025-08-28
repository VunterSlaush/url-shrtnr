import { Result } from 'neverthrow';
import { Url } from '@repo/api/urls/url';
import { FindUrlBySlug } from '../url.interfaces';

export class GetUrlBySlugUseCase {
  constructor(
    private readonly findUrlBySlug: FindUrlBySlug,
  ) {}

  async execute(slug: string): Promise<Result<Url, Error>> {
    return this.findUrlBySlug(slug);
  }
}
