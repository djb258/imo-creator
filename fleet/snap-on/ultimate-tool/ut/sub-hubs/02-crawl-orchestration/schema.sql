-- 02-crawl-orchestration error table stub
CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE IF NOT EXISTS ut_err.crawl_orchestration_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
