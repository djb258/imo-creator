export interface ParseRequest {
  domain: string;
  field_name: string;
  raw_html: string;
}

export interface ParseResponse {
  success: boolean;
  extracted_value: string | null;
  confidence_score: number;
  result_type: 'EXTRACTED' | 'FIELD_ABSENT' | 'EXTRACTION_FAILED';
  parse_duration_ms: number;
  error: string | null;
}
