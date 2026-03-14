-- 01-browser-control error table stub
CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE IF NOT EXISTS ut_err.browser_control_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
