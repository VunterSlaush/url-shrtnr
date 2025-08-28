/**
 * SQL query to find a URL record by its slug
 * 
 * Retrieves a URL record from the database using the unique slug identifier.
 * Only returns non-deleted URLs (deleted_at IS NULL).
 * This query is typically used for redirecting users to the original URL.
 * 
 * @param slug - The unique slug identifier for the URL
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUrlBySlugQuery = (slug: string): { query: string; values: string[] } => ({
  query: `
    SELECT id, url, slug, created_at, updated_at, deleted_at, user_id
    FROM urls
    WHERE slug = $1 AND deleted_at IS NULL
  `,
  values: [slug]
});
