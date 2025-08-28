-- migrate:up


CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  deleted_at TIMESTAMPTZ,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS urls_slug_idx ON urls(slug);
CREATE INDEX IF NOT EXISTS urls_user_id_idx ON urls(user_id);


-- migrate:down
DROP INDEX IF EXISTS urls_slug_idx;
DROP TABLE IF EXISTS urls;
