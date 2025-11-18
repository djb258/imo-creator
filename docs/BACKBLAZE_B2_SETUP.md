# Backblaze B2 Setup Guide

Complete guide for connecting Backblaze B2 cloud storage to the Workbench module.

## Overview

The Workbench system uses **Backblaze B2** as cloud storage for DuckDB files, enabling:
- Persistent storage of enriched datasets
- Cross-repository data sharing
- Automatic backup and versioning
- Low-cost cloud storage ($6/TB/month)

## Architecture

```
Backblaze B2 Cloud Storage
        ↓
Native B2 API (v2)
        ↓
workbench/b2_client.py
        ↓
DuckDB Local Processing
```

**Note**: We use the **native B2 API**, not the S3-compatible API, to support Master Application Keys.

---

## Step-by-Step Setup

### 1. Create a Backblaze B2 Account

If you don't have one already:
1. Go to https://www.backblaze.com/b2/sign-up.html
2. Create account (10GB free storage)
3. Verify your email

### 2. Create a B2 Bucket

1. Log into Backblaze B2: https://secure.backblaze.com/b2_buckets.htm
2. Click **"Create a Bucket"**
3. Configure:
   - **Bucket Name**: `svg-enrichment` (or your choice)
   - **Files in Bucket**: Private
   - **Default Encryption**: Disabled (or enabled for extra security)
   - **Object Lock**: Disabled
4. Click **Create a Bucket**
5. **Save the bucket name** - you'll need it for `.env`

### 3. Get Application Key Credentials

1. Navigate to **App Keys**: https://secure.backblaze.com/app_keys.htm
2. You have two options:

#### Option A: Use Master Application Key (Recommended for testing)
- The Master Key is already created by default
- Click **"Show"** next to the Master Application Key
- You'll see:
  ```
  keyID: a98b56408dc7 (example)
  applicationKey: K005xyz... (long string)
  ```
- **⚠️ Important**: Save the `applicationKey` immediately - it's only shown once!

#### Option B: Create New Application Key (Recommended for production)
- Click **"Add a New Application Key"**
- Configure:
  - **Name**: `workbench-production` (or your choice)
  - **Allow access to Bucket(s)**: Select your bucket (e.g., `svg-enrichment`)
  - **Type of Access**: Read and Write
  - **Allow List All Bucket Names**: ✓ Checked
  - **File name prefix**: (leave empty)
  - **Duration**: (leave empty for no expiration)
- Click **Create New Key**
- **Immediately copy both values**:
  ```
  keyID: 005abc... (25+ characters)
  applicationKey: K005xyz... (40+ characters)
  ```
- **⚠️ Critical**: The `applicationKey` is shown ONLY ONCE. Save it securely!

### 4. Configure Environment Variables

1. **Copy the template**:
   ```bash
   cp .env.template .env
   ```

2. **Edit `.env`** and add your credentials:
   ```bash
   # Backblaze B2 Configuration
   B2_KEY_ID=a98b56408dc7                                    # Your keyID
   B2_APPLICATION_KEY=005ebcc57e978d63d2ae82c5721366e41591ca30e2  # Your applicationKey
   B2_BUCKET=svg-enrichment                                  # Your bucket name

   # Neon PostgreSQL (optional)
   POSTGRES_URL=

   # Validator Endpoint (optional)
   VALIDATOR_ENDPOINT=
   ```

3. **Verify `.env` is gitignored**:
   ```bash
   grep "\.env" .gitignore
   ```
   You should see `.env` listed. If not, add it!

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

Required packages for Workbench:
- `python-dotenv` - Environment variable management
- `requests` - HTTP library for B2 API
- `duckdb` - DuckDB database engine

### 6. Test the Connection

Run the bootstrap script to validate everything:

```bash
python workbench/bootstrap.py
```

**Expected output**:
```
============================================================
Workbench Bootstrap
============================================================

[1/4] Loading environment variables...
Environment variables loaded successfully

[2/4] Validating Backblaze B2 connectivity...
Successfully connected to Backblaze B2 bucket: svg-enrichment
Bucket contains 0 files (showing max 5)

[3/4] Downloading workbench.duckdb from Backblaze B2...
Warning: workbench.duckdb not found in B2 bucket
Creating new DuckDB file at C:\Users\...\Temp\workbench.duckdb
DuckDB loaded at: C:\Users\...\Temp\workbench.duckdb

[4/4] Testing DuckDB connection...
DuckDB test query successful: [(1,)]

============================================================
Workbench ready
============================================================

All systems operational. You can now use the Workbench module.
```

---

## API Reference

### B2 Client Methods

```python
from workbench import get_b2_client

# Create authenticated client
b2_client = get_b2_client()

# List files in bucket
files = b2_client.list_files(max_files=10)

# Download a file
b2_client.download_file('workbench.duckdb', '/local/path/workbench.duckdb')

# Upload a file
b2_client.upload_file('/local/path/workbench.duckdb', 'workbench.duckdb')
```

### Workbench Helper Functions

```python
from workbench import load_workbench, save_workbench

# Load DuckDB from B2 (or create new if not found)
db, db_path = load_workbench()

# Perform operations
db.execute("CREATE TABLE test AS SELECT 1 as id")

# Save back to B2
save_workbench(db_path)
```

---

## Troubleshooting

### Issue: "Authorization failed"

**Symptoms**:
```
ERROR: Failed to connect to Backblaze B2: B2 Authorization failed: 401
```

**Solutions**:
1. Verify `B2_KEY_ID` is correct (copy from B2 console)
2. Verify `B2_APPLICATION_KEY` is correct
3. Check that the Application Key has not expired
4. If you lost the `applicationKey`, create a new Application Key

### Issue: "Bucket not found"

**Symptoms**:
```
ERROR: Bucket 'svg-enrichment' not found
```

**Solutions**:
1. Verify `B2_BUCKET` name matches exactly (case-sensitive!)
2. Check that the Application Key has access to this bucket
3. Verify bucket exists in B2 console

### Issue: "File not found"

**Symptoms**:
```
Warning: workbench.duckdb not found in B2 bucket
Creating new DuckDB file...
```

**This is NORMAL** for first-time setup! The system will create a new DuckDB file locally and upload it on first save.

### Issue: "Missing required B2 environment variables"

**Symptoms**:
```
ValueError: Missing required B2 environment variables
```

**Solutions**:
1. Verify `.env` file exists in project root
2. Check that all three variables are set:
   - `B2_KEY_ID`
   - `B2_APPLICATION_KEY`
   - `B2_BUCKET`
3. Ensure no extra spaces around `=` signs
4. Restart your terminal/IDE to reload environment

---

## Security Best Practices

### ✅ DO:
- Store credentials in `.env` file (gitignored)
- Use Application Keys with limited bucket access
- Set expiration dates on Application Keys
- Rotate keys regularly (every 90 days)
- Use separate keys for dev/staging/production
- Delete unused Application Keys

### ❌ DON'T:
- Never commit `.env` to source control
- Never hardcode credentials in code
- Never share Application Keys in chat/email
- Never use Master Key in production (use bucket-specific keys)
- Never commit `.env.backup` or similar files

---

## B2 Pricing

Backblaze B2 is extremely cost-effective:

| Item | Cost |
|------|------|
| Storage | $6/TB/month |
| Download | $0.01/GB |
| Upload | **FREE** |
| API Calls | **FREE** |
| First 10GB | **FREE** |

**Example**: Storing 100GB costs only **$0.60/month**

Compare to AWS S3: ~$2.30/month for 100GB

---

## Advanced Configuration

### Using Different Buckets Per Environment

```bash
# .env.development
B2_BUCKET=workbench-dev

# .env.staging
B2_BUCKET=workbench-staging

# .env.production
B2_BUCKET=workbench-prod
```

### Bucket-Specific Application Keys

For production, create separate Application Keys per environment:

1. Create key: `workbench-production-key`
   - Access: `workbench-prod` bucket only
   - Permissions: Read/Write

2. Create key: `workbench-staging-key`
   - Access: `workbench-staging` bucket only
   - Permissions: Read/Write/Delete

### File Versioning

Enable file versioning in B2 bucket settings for automatic backup:

1. Go to bucket settings
2. Enable **"Keep all versions of all files"**
3. Set lifecycle rules for old version cleanup

---

## Integration with Child Repositories

When child repositories inherit the Workbench module:

1. **Auto-copied files**:
   - `workbench/` directory (all modules)
   - `.env.template` (template for credentials)

2. **Setup steps for child repo**:
   ```bash
   # In child repository
   cp .env.template .env
   # Add your B2 credentials to .env
   python workbench/bootstrap.py
   ```

3. **Shared vs. Separate buckets**:
   - **Shared bucket**: All repos use same B2 bucket (data sharing)
   - **Separate buckets**: Each repo has its own bucket (isolation)

---

## Support & Resources

- **B2 Documentation**: https://www.backblaze.com/docs/cloud-storage
- **B2 API Reference**: https://www.backblaze.com/docs/cloud-storage-native-api-reference
- **Pricing Calculator**: https://www.backblaze.com/b2/cloud-storage-pricing.html
- **Community Forum**: https://help.backblaze.com/hc/en-us/community/topics

---

## Quick Reference

| Configuration | Location |
|--------------|----------|
| Global config | `imo-creator/global-config.yaml` |
| Environment variables | `.env` (create from `.env.template`) |
| B2 client code | `workbench/b2_client.py` |
| Bootstrap test | `python workbench/bootstrap.py` |
| B2 console | https://secure.backblaze.com/b2_buckets.htm |
| App keys | https://secure.backblaze.com/app_keys.htm |

---

*Last updated: 2025-11-18*
*Module version: 1.0*
*B2 API version: v2*
