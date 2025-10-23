# API Reference

## Base URL
```
{{BASE_URL}}/api/v1
```

## Authentication
```http
Authorization: Bearer {{API_KEY}}
X-IMO-Key: {{IMO_ERROR_API_KEY}}
```

## Core Endpoints

### Health Check
```http
GET /health
```
Response:
```json
{
  "ok": true,
  "app": "{{APP_NAME}}",
  "timestamp": "2024-01-01T00:00:00Z",
  "compliance": {
    "monitoring": true,
    "database": true,
    "firebase": true
  }
}
```

### Version
```http
GET /version
```
Response:
```json
{
  "version": "1.0.0",
  "imo_creator": "2.0.0",
  "compliance_score": 100,
  "heir_altitude": 30000
}
```

### HEIR Status
```http
GET /heir/status
```
Response:
```json
{
  "altitude": 30000,
  "process_id": "HEIR-2024-001",
  "orchestration": "active",
  "subagents": ["analyzer", "compliance", "deploy"]
}
```

## Input Endpoints [[../10-input/api.md|→]]
- `POST /input/validate`
- `POST /input/process`
- `GET /input/schema`

## Middle Processing [[../20-middle/api.md|→]]
- `POST /process/transform`
- `GET /process/status/{id}`
- `POST /process/batch`

## Output Delivery [[../30-output/api.md|→]]
- `GET /output/retrieve/{id}`
- `POST /output/webhook`
- `GET /output/stream`

## Error Codes
See [[../70-troubleshooting/error-codes.md|Error Reference]]

## Rate Limits
- Standard: 100 req/min
- Authenticated: 1000 req/min
- Batch: 10 req/min