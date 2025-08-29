/**
 * SQL query to find a user record by email
 * 
 * Retrieves a user record from the database using the email field.
 * Only returns non-deleted users (deleted_at IS NULL).
 * 
 * @param email - The email address of the user
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUserByEmailQuery = (email: string): { query: string; values: string[] } => ({
  query: `
    SELECT id, email, name, provider_id, avatar_url, created_at, updated_at
    FROM users
    WHERE email = $1
  `,
  values: [email]
});
