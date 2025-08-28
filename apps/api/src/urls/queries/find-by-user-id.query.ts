/**
 * SQL query to find all URLs created by a specific user
 * 
 * Retrieves all URL records associated with a given user ID.
 * Only returns non-deleted URLs (deleted_at IS NULL).
 * Results are ordered by creation date (newest first) for better UX.
 * 
 * @param userId - The ID of the user whose URLs to retrieve
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUrlsByUserIdQuery = (userId: string): { query: string; values: string[] } => ({
  query: `
    SELECT id, url, slug, created_at, updated_at, deleted_at, user_id
    FROM urls
    WHERE user_id = $1 AND deleted_at IS NULL
    ORDER BY created_at DESC
  `,
  values: [userId]
});
