# 01-browser-control

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | ut-sh-01 |
| **Driver** | Puppeteer |
| **Category** | EXTERNAL (browser layer, cannot run inside Cloudflare) |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT (Universal Toolkit) |

---

## Responsibility

Launches and controls headless browser instances. Navigates to URLs, executes page interactions, captures rendered DOM.

---

## Interface Contract

### Triggers

Ingress request from Middle layer with target URL and action spec.

### Data Arrival

JSON payload via internal queue with URL, selectors, action type.

### Emissions

Rendered HTML/DOM snapshot, screenshots, action completion status.

---

## Error Table

Error table: `ut_err.browser_control_errors`

See `schema.sql` for table definition.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
