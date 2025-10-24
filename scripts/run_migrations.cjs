/**
 * Database Migration Runner
 * Following Barton Doctrine compliance standards
 *
 * Usage:
 *   node scripts/run_migrations.cjs
 *
 * Environment Variables:
 *   DATABASE_URL or NEON_DATABASE_URL - PostgreSQL connection string
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

// Migration files (add your migration files here in order)
const migrations = [
  // Example: '2025-10-23_initial_schema.sql',
  // Example: '2025-10-23_add_users_table.sql',
  // Example: '2025-10-23_add_heir_tracking.sql',
];

/**
 * Check if migrations directory exists, create if not
 */
function ensureMigrationsDirectory() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log(`📁 Creating migrations directory: ${MIGRATIONS_DIR}`);
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });

    // Create a sample migration file
    const sampleMigration = `-- Sample Migration File
-- Created: ${new Date().toISOString()}

-- Create sample table
CREATE TABLE IF NOT EXISTS sample_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some comments
COMMENT ON TABLE sample_table IS 'Sample table created by migration runner';
`;

    const sampleFile = path.join(MIGRATIONS_DIR, '2025-10-23_sample_migration.sql');
    fs.writeFileSync(sampleFile, sampleMigration);
    console.log(`✅ Created sample migration: ${sampleFile}`);
    console.log(`   Edit this file or create new migration files in: ${MIGRATIONS_DIR}\n`);
  }
}

/**
 * Auto-discover migration files if none are explicitly listed
 */
function discoverMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort alphabetically (assumes YYYY-MM-DD prefix)

  return files;
}

/**
 * Run all migrations in order
 */
async function runMigrations() {
  console.log('🚀 Starting Database Migration Runner\n');
  console.log('=' .repeat(60));

  // Validate environment
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL or NEON_DATABASE_URL environment variable is not set');
    console.error('   Please set one of these environment variables to your PostgreSQL connection string\n');
    process.exit(1);
  }

  // Ensure migrations directory exists
  ensureMigrationsDirectory();

  // Get migration files
  const migrationFiles = migrations.length > 0 ? migrations : discoverMigrations();

  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found');
    console.log(`   Add .sql files to: ${MIGRATIONS_DIR}`);
    console.log(`   Or update the migrations array in: ${__filename}\n`);
    process.exit(0);
  }

  console.log(`📂 Migrations directory: ${MIGRATIONS_DIR}`);
  console.log(`📋 Found ${migrationFiles.length} migration(s):\n`);

  migrationFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  console.log('\n' + '=' .repeat(60) + '\n');

  // Connect to database
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get database info
    const dbName = await client.query('SELECT current_database()');
    const dbVersion = await client.query('SELECT version()');
    console.log(`📊 Database: ${dbName.rows[0].current_database}`);
    console.log(`   Version: ${dbVersion.rows[0].version.split(' ').slice(0, 2).join(' ')}\n`);

    console.log('=' .repeat(60) + '\n');

    // Run each migration
    let successCount = 0;
    let failureCount = 0;

    for (const file of migrationFiles) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const fileName = path.basename(file);

      console.log(`📄 Executing: ${fileName}`);

      try {
        // Read migration file
        const sql = fs.readFileSync(filePath, 'utf8');

        if (!sql.trim()) {
          console.log('⚠️  Warning: File is empty, skipping\n');
          continue;
        }

        // Execute migration
        const startTime = Date.now();
        await client.query(sql);
        const duration = Date.now() - startTime;

        console.log(`✅ Success (${duration}ms)\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(`   File: ${filePath}`);
        console.error(`   Details: ${error.detail || 'N/A'}\n`);
        failureCount++;

        // Ask if we should continue on error
        console.error('⚠️  Migration failed! Stopping execution.\n');
        break;
      }
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('\n📊 Migration Summary:\n');
    console.log(`   Total migrations: ${migrationFiles.length}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failureCount}`);

    if (failureCount === 0) {
      console.log('\n🎉 All migrations completed successfully!\n');
    } else {
      console.log('\n⚠️  Some migrations failed. Please review errors above.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  } finally {
    console.log('🔌 Closing database connection...');
    await client.end();
    console.log('✅ Connection closed\n');
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
