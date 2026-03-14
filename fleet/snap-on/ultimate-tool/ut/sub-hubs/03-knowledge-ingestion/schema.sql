CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE ut_err.knowledge_ingestion_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    source_document TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
