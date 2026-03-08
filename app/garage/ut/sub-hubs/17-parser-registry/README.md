# Sub-Hub 17: Parser Registry

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 17-parser-registry |
| Driver | D1 + KV |
| Category | CF Native (Field Monitor) |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Field Monitor parser configuration. Stores per-domain parser rules (CSS selectors, extraction patterns, field mappings). KV for fast lookup, D1 for versioned registry.

## Interface Contract

### Triggers

Fetch result from 16-fetcher needs domain-specific parsing rules.

### Data Arrival

Domain identifier requesting parser config; admin updates to parser rules.

### Emissions

Parser configuration for the requesting domain, parser version metadata.

## Error Table

All errors are recorded in `ut_err.parser_registry_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
