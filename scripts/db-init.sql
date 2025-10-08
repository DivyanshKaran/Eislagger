-- EisLager Database Initialization Script

-- Create databases for each service
CREATE DATABASE eislagger_auth;
CREATE DATABASE eislagger_sales;
CREATE DATABASE eislagger_inventory;
CREATE DATABASE eislagger_admin;
CREATE DATABASE eislagger_communications;
CREATE DATABASE eislagger_analytics;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE eislagger_auth TO eislagger_user;
GRANT ALL PRIVILEGES ON DATABASE eislagger_sales TO eislagger_user;
GRANT ALL PRIVILEGES ON DATABASE eislagger_inventory TO eislagger_user;
GRANT ALL PRIVILEGES ON DATABASE eislagger_admin TO eislagger_user;
GRANT ALL PRIVILEGES ON DATABASE eislagger_communications TO eislagger_user;
GRANT ALL PRIVILEGES ON DATABASE eislagger_analytics TO eislagger_user;

-- Create main application database
CREATE DATABASE eislagger_main;
GRANT ALL PRIVILEGES ON DATABASE eislagger_main TO eislagger_user;

-- Performance tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Initial users table for cross-service user management
CREATE TABLE IF NOT EXISTS global_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Executive', 'Manufacturer', 'Clerk', 'Patron')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create initial admin user
INSERT INTO global_users (email, name, role)
VALUES ('admin@eislagger.com', 'System Administrator', 'Executive')
ON CONFLICT (email) DO NOTHING;

COMMIT;

