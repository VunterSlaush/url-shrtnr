import { UserDto } from "@repo/api/users/user.dto";

/**
 * SQL query to update a user record
 * 
 * Updates specific fields of a user record and sets updated_at to the current timestamp.
 * Only updates non-deleted users (deleted_at IS NULL).
 * Returns the complete updated user record.
 * 
 * @param updateData - The user data to update
 * @param id - The unique identifier of the user to update
 * @returns Object containing the parameterized SQL query and values array
 */
export const updateUserQuery = (updateData: Partial<UserDto>, id: string): { query: string; values: any[] } => {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.email !== undefined) {
        setClauses.push(`email = $${paramIndex++}`);
        values.push(updateData.email);
    }
    if (updateData.name !== undefined) {
        setClauses.push(`name = $${paramIndex++}`);
        values.push(updateData.name);
    }
    if (updateData.avatarUrl !== undefined) {
        setClauses.push(`avatar_url = $${paramIndex++}`);
        values.push(updateData.avatarUrl);
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    return {
        query: `
      UPDATE users 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, email, name, provider_id, avatar_url, created_at, updated_at
    `,
        values
    };
};
