import { Result, err } from 'neverthrow';
import { CreateUrlDto } from '@repo/api/urls/create-url.dto';
import { Url } from '@repo/api/urls/url';
import { AppError } from '@repo/api/error';
import { FindUrlById, FindUrlBySlug, UpdateUrl } from '../url.interfaces';

export class UpdateSlugUseCase {
  constructor(
    private readonly findUrlById: FindUrlById,
    private readonly findUrlBySlug: FindUrlBySlug,
    private readonly updateUrl: UpdateUrl,
  ) { }

  async execute(id: string, newSlug: string, userId?: string): Promise<Result<Url, AppError>> {
    try {
      // Check if the URL exists
      const existingUrlResult = await this.findUrlById(id);
      if (existingUrlResult.isErr()) {
        return err(AppError.notFound('URL not found'));
      }

      const existingUrl = existingUrlResult.value;

      // If userId is provided, verify ownership
      if (userId && existingUrl.userId !== userId) {
        return err(AppError.unauthorized('Unauthorized to update this URL'));
      }

      // Check if the new slug is different from the current one
      if (existingUrl.slug === newSlug) {
        return err(AppError.validation('New slug is the same as current slug'));
      }

      // Check if the new slug already exists
      const slugExistsResult = await this.findUrlBySlug(newSlug);
      if (slugExistsResult.isOk()) {
        return err(AppError.conflict('Slug already exists'));
      }

      // Update the URL with the new slug
      const updateData: Partial<CreateUrlDto> = { slug: newSlug };
      return await this.updateUrl(id, updateData);
    } catch (error) {
      return err(AppError.unhandled('Failed to update slug', error));
    }
  }
}
