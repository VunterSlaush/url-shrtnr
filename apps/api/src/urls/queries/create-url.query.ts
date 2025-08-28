import { CreateUrlDto } from "@repo/api/urls/create-url.dto";

/**
 * SQL query to create a new URL record
 * 
 * Inserts a new URL with the provided url, slug, and user_id,
 * setting created_at and updated_at to the current timestamp.
 * Returns the complete URL record including generated ID and timestamps.
 * 
 * @param createUrlDto - The DTO containing url and slug
 * @param userId - The ID of the user creating the URL
 * @returns Object containing the parameterized SQL query and values array
 */
export const createUrlQuery = (createUrlDto: CreateUrlDto, userId: string): { query: string; values: (string | null)[] } => ({
  query: `
    INSERT INTO urls (url, slug, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id, url, slug, created_at, updated_at, deleted_at, user_id
  `,
  values: [createUrlDto.url, createUrlDto.slug, userId]
});
