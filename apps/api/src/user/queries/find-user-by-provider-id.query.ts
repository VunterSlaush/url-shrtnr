/**
 * SQL query to find a user record by provider ID
 * 
 * Retrieves a user record from the database using the provider_id field.
 * Only returns non-deleted users (deleted_at IS NULL).
 * 
 * @param providerId - The unique provider ID for the user
 * @returns Object containing the parameterized SQL query and values array
 */
export const findUserByProviderIdQuery = (providerId: string): { query: string; values: string[] } => ({
  query: `
    SELECT id, email, name, provider_id, avatar_url, created_at, updated_at
    FROM users
    WHERE provider_id = $1
  `,
  values: [providerId]
});
