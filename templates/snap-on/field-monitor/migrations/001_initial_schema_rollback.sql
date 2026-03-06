-- Migration 001 ROLLBACK: Field Monitor Initial Schema
-- Direction: ROLLBACK

BEGIN;

DROP TRIGGER IF EXISTS trg_error_log_no_delete ON field_monitor.error_log;
DROP FUNCTION IF EXISTS field_monitor.deny_error_log_delete();

DROP TRIGGER IF EXISTS trg_check_log_no_delete ON field_monitor.check_log;
DROP TRIGGER IF EXISTS trg_check_log_no_update ON field_monitor.check_log;
DROP FUNCTION IF EXISTS field_monitor.deny_check_log_mutation();

DROP TRIGGER IF EXISTS trg_ctb_promotion_enforcement ON field_monitor.field_state;
DROP FUNCTION IF EXISTS field_monitor.enforce_ctb_promotion();

DROP TABLE IF EXISTS field_monitor.rate_state;
DROP TABLE IF EXISTS field_monitor.error_log;
DROP TABLE IF EXISTS field_monitor.check_log;
DROP TABLE IF EXISTS field_monitor.field_state;
DROP TABLE IF EXISTS field_monitor.url_registry;

DROP SCHEMA IF EXISTS field_monitor;

COMMIT;
