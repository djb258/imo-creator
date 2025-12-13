# MillionVerifier API Integration

## Overview

MillionVerifier provides email verification for the outreach pipeline. API credentials are stored in **Doppler**.

## Doppler Configuration

| Secret | Value | Project |
|--------|-------|---------|
| `MILLIONVERIFIER_API_KEY` | `7hLlWoR3DCDoDwDllpafUh4U9` | example-project |

### Access from Any Repo

```bash
# Install Doppler CLI
# Then run any command with secrets injected:
doppler run -- node your-script.js
doppler run -- python your-script.py
```

---

## API Endpoints

### Single Email Verification

```
GET https://api.millionverifier.com/api/v3/
```

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `api` | Yes | API key from Doppler |
| `email` | Yes | Email to verify |

**Example:**
```bash
curl "https://api.millionverifier.com/api/v3/?api=${MILLIONVERIFIER_API_KEY}&email=test@example.com"
```

**Response:**
```json
{
  "email": "test@example.com",
  "result": "ok",
  "quality": "good",
  "resultcode": 1,
  "subresult": "ok",
  "free": false,
  "role": false,
  "disposable": false,
  "credits": 100170
}
```

### Bulk File Upload

```
POST https://api.millionverifier.com/api/v3/bulkapi/verifyfile
```

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `key` | Yes | API key |
| `file` | Yes | CSV file with emails |

**Example:**
```bash
curl -X POST "https://api.millionverifier.com/api/v3/bulkapi/verifyfile" \
  -F "key=${MILLIONVERIFIER_API_KEY}" \
  -F "file=@emails.csv"
```

**Response:**
```json
{
  "file_id": "abc123",
  "status": "processing"
}
```

### Check Bulk Status

```
GET https://api.millionverifier.com/api/v3/bulkapi/filestatus?key={API_KEY}&file_id={FILE_ID}
```

### Download Results

```
GET https://api.millionverifier.com/api/v3/bulkapi/download?key={API_KEY}&file_id={FILE_ID}
```

---

## Result Codes

| Result | Code | Meaning | Action |
|--------|------|---------|--------|
| `ok` | 1 | Valid, deliverable | ✅ Safe to email |
| `catch_all` | 2 | Domain accepts all | ⚠️ Risky |
| `unknown` | 3 | Could not verify | ⚠️ Retry later |
| `invalid` | 4 | Invalid email | ❌ Remove |
| `disposable` | 5 | Temporary email | ❌ Remove |
| `role` | 6 | Role-based (info@) | ⚠️ Review |

---

## Code Examples

### Node.js

```javascript
const https = require('https');

async function verifyEmail(email) {
  const apiKey = process.env.MILLIONVERIFIER_API_KEY;
  const url = `https://api.millionverifier.com/api/v3/?api=${apiKey}&email=${encodeURIComponent(email)}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// Usage with Doppler
// doppler run -- node script.js
const result = await verifyEmail('user@example.com');
console.log(result.result === 'ok' ? 'Valid' : 'Invalid');
```

### Python

```python
import os
import requests

def verify_email(email: str) -> dict:
    api_key = os.environ['MILLIONVERIFIER_API_KEY']
    url = f"https://api.millionverifier.com/api/v3/?api={api_key}&email={email}"
    response = requests.get(url)
    return response.json()

# Usage with Doppler
# doppler run -- python script.py
result = verify_email('user@example.com')
print('Valid' if result['result'] == 'ok' else 'Invalid')
```

### Bulk Verification (Python)

```python
import os
import requests
import time

API_KEY = os.environ['MILLIONVERIFIER_API_KEY']
BASE_URL = "https://api.millionverifier.com/api/v3/bulkapi"

def upload_file(filepath: str) -> str:
    """Upload CSV file for bulk verification"""
    with open(filepath, 'rb') as f:
        response = requests.post(
            f"{BASE_URL}/verifyfile",
            data={'key': API_KEY},
            files={'file': f}
        )
    return response.json()['file_id']

def check_status(file_id: str) -> dict:
    """Check processing status"""
    response = requests.get(
        f"{BASE_URL}/filestatus",
        params={'key': API_KEY, 'file_id': file_id}
    )
    return response.json()

def download_results(file_id: str, output_path: str):
    """Download verified results"""
    response = requests.get(
        f"{BASE_URL}/download",
        params={'key': API_KEY, 'file_id': file_id}
    )
    with open(output_path, 'wb') as f:
        f.write(response.content)

def verify_bulk(input_csv: str, output_csv: str):
    """Full bulk verification pipeline"""
    print(f"Uploading {input_csv}...")
    file_id = upload_file(input_csv)
    print(f"File ID: {file_id}")

    # Poll for completion
    while True:
        status = check_status(file_id)
        print(f"Status: {status['status']} - {status.get('percent', 0)}%")

        if status['status'] == 'finished':
            break
        time.sleep(30)  # Check every 30 seconds

    print(f"Downloading results to {output_csv}...")
    download_results(file_id, output_csv)
    print("Done!")

# Usage:
# doppler run -- python bulk_verify.py
# verify_bulk('emails.csv', 'verified_emails.csv')
```

---

## Rate Limits

| Type | Limit |
|------|-------|
| Single email | 60 requests/minute |
| Bulk upload | 60 requests/minute |
| File size | 1 million emails max |

---

## Credits

| Info | Value |
|------|-------|
| Current credits | ~100,170 |
| Cost per email | 1 credit |
| Bulk discount | Available for large volumes |

---

## Integration with Outreach Repo

### 1. Setup Doppler in Outreach Repo

```bash
cd outreach-repo
doppler setup --project example-project --config dev
```

### 2. Run Verification Script

```bash
doppler run -- python scripts/verify_emails.py --input leads.csv --output verified_leads.csv
```

### 3. Filter Results

```python
import pandas as pd

df = pd.read_csv('verified_leads.csv')

# Keep only valid emails
valid = df[df['result'] == 'ok']
valid.to_csv('valid_emails.csv', index=False)

# Remove invalid
invalid = df[df['result'].isin(['invalid', 'disposable'])]
print(f"Removed {len(invalid)} invalid emails")
```

---

## Composio Integration

Call via n8n webhook:
```
POST https://srv1153077.hstgr.cloud:5678/webhook/verify-email
Body: { "email": "test@example.com" }
```

Or direct API from Composio action:
```javascript
const result = await fetch(
  `https://api.millionverifier.com/api/v3/?api=${MILLIONVERIFIER_API_KEY}&email=${email}`
).then(r => r.json());
```

---

## Support

- MillionVerifier Docs: https://developer.millionverifier.com/
- Help Center: https://help.millionverifier.com/
