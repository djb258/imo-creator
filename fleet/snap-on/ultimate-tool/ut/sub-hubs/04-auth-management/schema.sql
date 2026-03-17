CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE ut_err.auth_management_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    target_domain TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
