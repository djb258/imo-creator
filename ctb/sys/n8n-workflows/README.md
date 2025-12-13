# n8n Workflows for Composio Integration

## MillionVerifier Email Verification

**API Key**: `7hLlWoR3DCDoDwDllpafUh4U9`
**Credits Available**: 100,171

### Quick Test

```bash
curl "https://api.millionverifier.com/api/v3/?api=7hLlWoR3DCDoDwDllpafUh4U9&email=test@example.com"
```

### Setup Instructions

#### 1. Import the Workflow

1. Open n8n: `https://srv1153077.hstgr.cloud:5678`
2. Go to **Workflows** → **Import from File**
3. Upload `email-verification-workflow.json`
4. **Activate** the workflow

#### 3. Test the Webhook

```bash
curl -X POST https://srv1153077.hstgr.cloud:5678/webhook/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook/verify-email` | POST | Verify single email |
| `/webhook/composio-trigger` | POST | Generic Composio trigger |

### Request Format

```json
{
  "email": "user@example.com"
}
```

### Response Format

**Valid Email:**
```json
{
  "success": true,
  "email": "user@example.com",
  "status": "valid",
  "result": {
    "result": "ok",
    "quality": 0.95,
    "free": false,
    "disposable": false,
    "role": false
  }
}
```

**Invalid Email:**
```json
{
  "success": false,
  "email": "invalid@fake.com",
  "status": "invalid",
  "result": {
    "result": "invalid",
    "reason": "mailbox_not_found"
  }
}
```

## MillionVerifier API Reference

### Single Email Verification
```
GET https://api.millionverifier.com/api/v3/?api={API_KEY}&email={EMAIL}
```

### Bulk Verification
```
POST https://api.millionverifier.com/api/v3/bulkapi/verifyfile
```

### Result Codes

| Code | Meaning |
|------|---------|
| `ok` | Valid, deliverable email |
| `catch_all` | Domain accepts all emails |
| `unknown` | Could not verify |
| `invalid` | Invalid/undeliverable |
| `disposable` | Temporary email address |
| `role` | Role-based email (info@, support@) |

## Integration with Composio

Call this workflow from Composio:

```javascript
// In Composio agent
const verifyEmail = async (email) => {
  const response = await fetch('https://srv1153077.hstgr.cloud:5678/webhook/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};

// Usage
const result = await verifyEmail('user@example.com');
if (result.success) {
  console.log('Email is valid!');
}
```

## Troubleshooting

### Webhook Not Responding
1. Check workflow is **Active** (green toggle)
2. Verify n8n is running: `curl https://srv1153077.hstgr.cloud:5678/healthz`
3. Check n8n logs: `pm2 logs n8n` or `journalctl -u n8n`

### API Key Issues
1. Verify env var is set: In n8n, check Settings → Variables
2. Test API directly:
   ```bash
   curl "https://api.millionverifier.com/api/v3/?api=7hLlWoR3DCDoDwDllpafUh4U9&email=test@gmail.com"
   ```

### SSL Certificate Errors
If using self-signed cert, configure n8n:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```
