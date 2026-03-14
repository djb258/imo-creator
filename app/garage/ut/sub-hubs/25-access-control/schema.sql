-- Sub-Hub 25: Access Control — Error Table
-- Driver: Workers + D1
-- Category: CF Native

CREATE SCHEMA IF NOT EXISTS ut_err;

CREATE TABLE ut_err.access_control_errors (
    id SERIAL PRIMARY KEY,
    error_code TEXT NOT NULL,
    error_message TEXT,
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
