/**
 * SQL query to soft delete a user record
 * 
 * Sets the deleted_at timestamp to the current time instead of actually removing the record.
 * This allows for data recovery and maintains referential integrity.
 * 
 * @param id - The unique identifier of the user to delete
 * @returns Object containing the parameterized SQL query and values array
 */
export const deleteUserQuery = (id: string): { query: string; values: string[] } => ({
    query: `
    UPDATE users 
    SET deleted_at = NOW()
    WHERE id = $1 AND deleted_at IS NULL
  `,
    values: [id]
});
