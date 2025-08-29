-- migrate:up
CREATE SEQUENCE slug_sequence AS BIGINT START WITH 4567 INCREMENT BY 1;

-- migrate:down
DROP SEQUENCE IF EXISTS slug_sequence;
