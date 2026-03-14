# Sub-Hub 05: Fallback Scraping

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 05-fallback-scraping |
| **Driver** | ScraperAPI |
| **Category** | External |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Fallback scraping when Puppeteer/Crawlee encounters anti-bot protection. Proxy rotation, CAPTCHA bypass, residential IP pools.

---

## Interface Contract

### Triggers

Retry event from browser-control or crawl-orchestration after primary scraping fails.

### Data Arrival

Failed URL with error context and retry policy.

### Emissions

Raw HTML content from successfully scraped page, or terminal failure event.

---

## Error Table

All errors are recorded in `ut_err.fallback_scraping_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
