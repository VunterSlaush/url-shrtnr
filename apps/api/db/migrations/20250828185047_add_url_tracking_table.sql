-- migrate:up


CREATE TABLE IF NOT EXISTS url_trackings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID REFERENCES urls(id),
  referrer_domain VARCHAR,
  browser VARCHAR,
  operating_system VARCHAR,
  device_type VARCHAR,
  language VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS url_trackings_url_id_idx ON url_trackings(url_id);



-- migrate:down
DROP INDEX IF EXISTS url_trackings_url_id_idx;

DROP TABLE IF EXISTS url_trackings;