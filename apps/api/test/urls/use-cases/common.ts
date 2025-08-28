import { Url } from "@repo/api/urls/url";

export const createMockUrl = (overrides: Partial<Url> = {}): Url => {
    const url = new Url();
    url.id = 'url-123';
    url.url = 'https://example.com';
    url.slug = 'test-slug';
    url.createdAt = new Date();
    url.updatedAt = new Date();
    url.deletedAt = null;
    url.userId = 'user-123';
    return { ...url, ...overrides };
};