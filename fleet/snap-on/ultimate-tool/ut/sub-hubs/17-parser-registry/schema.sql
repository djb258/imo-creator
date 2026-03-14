CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE ut_err.parser_registry_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
