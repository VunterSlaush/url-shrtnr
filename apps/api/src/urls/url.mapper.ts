import { Url } from '@repo/api/urls/url';

export class UrlMapper {
  static mapRowToUrl(row: any): Url {
    const url = new Url();
    url.id = row.id;
    url.url = row.url;
    url.slug = row.slug;
    url.createdAt = row.created_at;
    url.updatedAt = row.updated_at;
    url.deletedAt = row.deleted_at;
    url.userId = row.user_id;
    
    return url;
  }

  static mapRowsToUrls(rows: any[]): Url[] {
    return rows.map(row => this.mapRowToUrl(row));
  }
}
