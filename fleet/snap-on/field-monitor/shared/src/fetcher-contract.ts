export interface FetchRequest {
  url: string;
  fetch_mode: 'plain' | 'proxied';
  timeout_ms: number;
  byte_limit: number;
}

export interface FetchResponse {
  success: boolean;
  status_code: number | null;
  body: string | null;
  content_type: string | null;
  fetch_duration_ms: number;
  byte_count: number;
  error: string | null;
}
