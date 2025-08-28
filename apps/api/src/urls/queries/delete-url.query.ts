/**
 * SQL query to soft delete a URL record
 * 
 * Performs a soft delete by setting the deleted_at timestamp to the current time.
 * The record is not physically removed from the database, allowing for potential recovery.
 * Only affects non-deleted URLs (deleted_at IS NULL).
 * 
 * @param id - The ID of the URL to soft delete
 * @returns Object containing the parameterized SQL query and values array
 */
export const deleteUrlQuery = (id: string): { query: string; values: string[] } => ({
  query: `
    UPDATE urls
    SET deleted_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
  `,
  values: [id]
});
