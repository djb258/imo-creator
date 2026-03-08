CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE ut_err.fallback_scraping_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    failed_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
