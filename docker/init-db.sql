-- Initialize multiple databases for MCP system
CREATE DATABASE marketing_db;
CREATE DATABASE realestate_db;
CREATE DATABASE commandops_db;
CREATE DATABASE audit_db;

-- Create users with specific permissions
CREATE USER marketing_app WITH PASSWORD 'dev_password';
CREATE USER realestate_app WITH PASSWORD 'dev_password';
CREATE USER commandops_app WITH PASSWORD 'dev_password';
CREATE USER audit_app WITH PASSWORD 'dev_password';

-- Grant database permissions
GRANT ALL PRIVILEGES ON DATABASE marketing_db TO marketing_app;
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate_app;
GRANT ALL PRIVILEGES ON DATABASE commandops_db TO commandops_app;
GRANT ALL PRIVILEGES ON DATABASE audit_db TO audit_app;

-- Connect to each database and create initial tables
\c marketing_db;

CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id),
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW()
);

\c realestate_db;

CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    price DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'available',
    listing_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS viewings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    client_name VARCHAR(255),
    viewing_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

\c commandops_db;

CREATE TABLE IF NOT EXISTS operations (
    id SERIAL PRIMARY KEY,
    operation_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    parameters JSONB,
    result JSONB,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    definition JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

\c audit_db;

CREATE TABLE IF NOT EXISTS mantis_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    unique_id VARCHAR(255) NOT NULL,
    process_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    structured_data JSONB,
    level VARCHAR(20) DEFAULT 'info',
    source VARCHAR(100)
);

CREATE INDEX idx_mantis_logs_timestamp ON mantis_logs(timestamp);
CREATE INDEX idx_mantis_logs_unique_id ON mantis_logs(unique_id);
CREATE INDEX idx_mantis_logs_process_id ON mantis_logs(process_id);