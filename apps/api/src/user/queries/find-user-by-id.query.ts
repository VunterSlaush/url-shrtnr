/**
 * SQL query to find a user record by its ID
 * 
 * Retrieves a user record from the database using the primary key (id).
 * Only returns non-deleted users (deleted_at IS NULL).
 * 
 * @param id - The unique identifier of the user
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUserByIdQuery = (id: string): { query: string; values: string[] } => ({
    query: `
    SELECT id, email, name, provider_id, avatar_url, created_at, updated_at
    FROM users
    WHERE id = $1 AND deleted_at IS NULL
  `,
    values: [id]
});
