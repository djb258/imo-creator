export interface UrlRegistryRow {
  url_id: string;
  domain: string;
  path: string;
  check_interval_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FieldStateRow {
  field_id: string;
  url_id: string;
  field_name: string;
  current_value: string | null;
  previous_value: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  status: string;
  promotion_status: string;
  created_at: string;
  updated_at: string;
}

export interface CheckLogRow {
  log_id: string;
  url_id: string;
  field_name: string;
  checked_at: string;
  old_value: string | null;
  new_value: string | null;
  changed: boolean;
  fetch_duration_ms: number;
  parse_duration_ms: number;
}

export interface ErrorLogRow {
  error_id: string;
  url_id: string;
  field_name: string | null;
  error_type: string;
  error_message: string;
  occurred_at: string;
  resolved_at: string | null;
}

export interface RateStateRow {
  rate_id: string;
  domain: string;
  window_start: string;
  window_end: string;
  request_count: number;
  max_requests: number;
  created_at: string;
  updated_at: string;
}
