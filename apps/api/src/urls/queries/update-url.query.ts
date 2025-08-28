import { AppError } from '@repo/api/error';

/**
 * SQL query to update a URL record
 * 
 * Dynamically builds an UPDATE query based on the fields that need to be updated.
 * Only updates non-deleted URLs (deleted_at IS NULL).
 * Automatically sets updated_at to the current timestamp.
 * 
 * @param updateData - Object containing the fields to update
 * @param id - The ID of the URL to update
 * @returns Object containing the parameterized SQL query and values array
 */
export const updateUrlQuery = (updateData: { url?: string; slug?: string }, id: string): { query: string; values: string[] } => {
  const setClauses: string[] = [];
  let paramCount = 1;

  if (updateData.url !== undefined) {
    setClauses.push(`url = $${paramCount++}`);
  }

  if (updateData.slug !== undefined) {
    setClauses.push(`slug = $${paramCount++}`);
  }

  if (setClauses.length === 0) {
    throw AppError.validation('No fields to update');
  }

  return {
    query: `
      UPDATE urls
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING id, url, slug, created_at, updated_at, deleted_at, user_id
    `,
    values: [
      ...(updateData.url !== undefined ? [updateData.url] : []),
      ...(updateData.slug !== undefined ? [updateData.slug] : []),
      id
    ]
  };
};
