/**
 * SQL query to find a URL record by its ID
 * 
 * Retrieves a URL record from the database using the primary key (id).
 * Only returns non-deleted URLs (deleted_at IS NULL).
 * 
 * @param id - The unique identifier of the URL
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUrlByIdQuery = (id: string): { query: string; values: string[] } => ({
  query: `
    SELECT id, url, slug, created_at, updated_at, deleted_at, user_id
    FROM urls
    WHERE id = $1 AND deleted_at IS NULL
  `,
  values: [id]
});
