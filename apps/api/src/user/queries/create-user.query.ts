import { UserDto } from "@repo/api/users/user.dto";

/**
 * SQL query to create a new user record
 * 
 * Inserts a new user with the provided email, name, provider_id, and avatar_url,
 * setting created_at and updated_at to the current timestamp.
 * Returns the complete user record including generated ID and timestamps.
 * 
 * @param userData - The user data containing email, name, and avatarUrl
 * @param providerId - The unique provider ID for the user
 * @returns Object containing the parameterized SQL query and values array
 */
export const createUserQuery = (userData: Partial<UserDto>, providerId: string): { query: string; values: (string | null)[] } => ({
    query: `
    INSERT INTO users (email, name, provider_id, avatar_url, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, email, name, provider_id, avatar_url, created_at, updated_at
  `,
    values: [userData.email, userData.name, providerId, userData.avatarUrl]
});
