import { Result, err } from 'neverthrow';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { FindUrlById, FindUrlBySlug, UpdateUrl } from '../url.interfaces';

export class UpdateSlugUseCase {
  constructor(
    private readonly findUrlById: FindUrlById,
    private readonly findUrlBySlug: FindUrlBySlug,
    private readonly updateUrl: UpdateUrl,
  ) {}

  async execute(id: string, newSlug: string, userId?: string): Promise<Result<Url, Error>> {
    try {
      // Check if the URL exists
      const existingUrlResult = await this.findUrlById(id);
      if (existingUrlResult.isErr()) {
        return err(new Error('URL not found')); // TODO: Add Typification
      }

      const existingUrl = existingUrlResult.value;

      // If userId is provided, verify ownership
      if (userId && existingUrl.userId !== userId) {
        return err(new Error('Unauthorized to update this URL'));
      }

      // Check if the new slug is different from the current one
      if (existingUrl.slug === newSlug) {
        return err(new Error('New slug is the same as current slug'));
      }

      // Check if the new slug already exists
      const slugExistsResult = await this.findUrlBySlug(newSlug);
      if (slugExistsResult.isOk()) {
        return err(new Error('Slug already exists'));
      }

      // Update the URL with the new slug
      const updateData: Partial<CreateUrlDto> = { slug: newSlug };
      return this.updateUrl(id, updateData);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to update slug'));
    }
  }
}
