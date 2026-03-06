export interface ProxyRequest {
  domain: string;
  url: string;
}

export interface ProxyResponse {
  allowed: boolean;
  egress_path: string | null;
  rate_state_snapshot: {
    domain: string;
    window_start: string;
    window_end: string;
    request_count: number;
    max_requests: number;
  } | null;
  rate_delta: number;
  error: string | null;
}
