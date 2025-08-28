import { UrlTracking } from "@repo/api/url-tracking/url-tracking";


export class UrlTrackingMapper {
  static mapRowToUrlTracking(row: any): UrlTracking {
    return {
      id: row.id,
      urlId: row.url_id,
      referrerDomain: row.referrer_domain,
      browser: row.browser,
      operatingSystem: row.operating_system,
      deviceType: row.device_type,
      language: row.language,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  static mapRowsToUrlTrackings(rows: any[]): UrlTracking[] {
    return rows.map(row => this.mapRowToUrlTracking(row));
  }
}
