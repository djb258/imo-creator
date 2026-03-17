# Anvil Integration — Doctrine Record

| Field | Value |
|-------|-------|
| Tool ID | TOOL-023 |
| BAR | BAR-149 |
| ADR | ADR-038 (pending) |
| Vendor | Anvil (useanvil.com) |
| Category | Document/Legal |
| Auth | Basic (API key as username, no password) |
| Base URL | `https://app.useanvil.com/api/v1` |
| Secrets Provider | Doppler (`imo-creator/dev`) |

## Secrets

| Doppler Key | Description |
|-------------|-------------|
| `ANVIL_API_KEY` | API key (Basic auth username) |
| `ANVIL_API_BASE_URL` | `https://app.useanvil.com/api/v1` |

## Capabilities

| Action | Method | Path |
|--------|--------|------|
| Fill PDF template | POST | `/fill/{pdfTemplateEid}.pdf` |
| Generate PDF | POST | `/generate-pdf` |
| E-signature (Etch) | POST | `/graphql` |
| Current user | GET | `/current-user` |

## Auth Pattern

```bash
# Basic auth: API key as username, empty password
# Append colon, base64 encode
AUTH=$(echo -n "cTc5vOb8EmSZvzgHwPJh5LeKV1ghlXNf:" | base64)
curl -H "Authorization: Basic $AUTH" https://app.useanvil.com/api/v1/current-user
```

## Notes

- Dev keys return watermarked PDFs (free requests)
- Production keys require paid plan
- GraphQL endpoint used for Etch e-signatures and complex queries
- REST endpoints for PDF fill/generate operations
- Optional RSA keypair encryption for sensitive data
