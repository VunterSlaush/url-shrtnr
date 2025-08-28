import { CreateUrlTrackingDto } from "@repo/api/url-tracking/create-tracking.dto";


export function createUrlTrackingQuery(trackingData: CreateUrlTrackingDto) {
  const query = `
    INSERT INTO url_trackings (
      url_id,
      referrer_domain,
      browser,
      operating_system,
      device_type,
      language
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    trackingData.urlId,
    trackingData.referrerDomain || null,
    trackingData.browser || null,
    trackingData.operatingSystem || null,
    trackingData.deviceType || null,
    trackingData.language || null,
  ];

  return { query, values };
}
