export function findUrlTrackingsByUrlIdQuery(urlId: string) {
  const query = `
    SELECT * FROM url_trackings
    WHERE url_id = $1
    ORDER BY created_at DESC
  `;

  const values = [urlId];

  return { query, values };
}
