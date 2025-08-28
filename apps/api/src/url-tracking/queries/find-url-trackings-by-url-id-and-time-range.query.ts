import { TimestampRange } from '../url-tracking.interfaces';

export function findUrlTrackingsByUrlIdAndTimeRangeQuery(urlId: string, timeRange: TimestampRange) {
    const query = `
    SELECT * FROM url_trackings
    WHERE url_id = $1
    AND created_at >= $2
    AND created_at <= $3
    ORDER BY created_at DESC
  `;

    const values = [urlId, timeRange.from, timeRange.to];

    return { query, values };
}
