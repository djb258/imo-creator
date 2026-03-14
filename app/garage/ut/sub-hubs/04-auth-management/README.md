# Sub-Hub 04: Auth Management

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 04-auth-management |
| **Driver** | Puppeteer Cookie Store |
| **Category** | External |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Manages authentication state for protected sites. Stores and rotates cookies/sessions. Handles login flows.

---

## Interface Contract

### Triggers

Auth-required flag from browser-control when accessing protected content.

### Data Arrival

Auth credentials from secure store (Doppler), target site auth config.

### Emissions

Valid session cookies/tokens for browser-control to consume.

---

## Error Table

All errors are recorded in `ut_err.auth_management_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
