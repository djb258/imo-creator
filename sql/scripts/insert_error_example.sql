-- Example: Insert error into ORBT error log
-- Purpose: Demonstrate how agents, tests, or manual debugging can log errors
-- Usage: Can be called from n8n, Composio, or directly via SQL

-- Example 1: Client intake validation error
INSERT INTO shq.orbt_error_log (
  repo_name,
  process_id,
  unique_id,
  agent_id,
  blueprint_id,
  error_layer,
  altitude,
  file_path,
  error_summary,
  error_detail
) VALUES (
  'client-intake',
  'PROC-42-20251105',
  'UID-REPO-2025-11-05-002',
  'agent_parser',
  'blueprint_intake_v3',
  'Operation',
  30000,
  'src/modules/intake/validate.ts',
  'Validation failed during client import',
  'Expected field `employee_email`, got `undefined` at row 14'
);

-- Example 2: System-level error at 40k altitude
INSERT INTO shq.orbt_error_log (
  repo_name,
  process_id,
  unique_id,
  agent_id,
  blueprint_id,
  error_layer,
  altitude,
  file_path,
  error_summary,
  error_detail
) VALUES (
  'imo-creator',
  'PROC-SYS-1728153600',
  'HEIR-2025-11-IMO-SYSTEM-01',
  'global_engineer',
  'blueprint_doctrine_enforcement',
  'System',
  40000,
  'ctb/sys/server/main.py',
  'Doctrine enforcement failed during CI check',
  'CTB branch map validation failed: missing required branch sys/chartdb'
);

-- Example 3: Build layer error at 20k altitude
INSERT INTO shq.orbt_error_log (
  repo_name,
  process_id,
  unique_id,
  agent_id,
  blueprint_id,
  error_layer,
  altitude,
  file_path,
  error_summary,
  error_detail
) VALUES (
  'blueprint-engine',
  'PROC-BUILD-1728153700',
  'HEIR-2025-11-BLUEPRINT-BUILD-01',
  'local_builder',
  'blueprint_workflow_v2',
  'Build',
  20000,
  'src/workflows/generate_blueprint.js',
  'Build process failed during blueprint generation',
  'TypeError: Cannot read property "stages" of undefined at line 42'
);

-- Example 4: Training layer error at 10k altitude
INSERT INTO shq.orbt_error_log (
  repo_name,
  process_id,
  unique_id,
  agent_id,
  blueprint_id,
  error_layer,
  altitude,
  file_path,
  error_summary,
  error_detail
) VALUES (
  'outreach-core',
  'PROC-TRAIN-1728153800',
  'HEIR-2025-11-OUTREACH-TRAIN-01',
  'agent_trainer',
  'blueprint_training_v1',
  'Training',
  10000,
  'src/agents/training/module.py',
  'Training data validation failed',
  'Missing required training dataset: customer_intake_samples.csv'
);

-- Query examples for retrieving errors
-- Get all unresolved errors for a specific repo
-- SELECT * FROM shq.orbt_error_log 
-- WHERE repo_name = 'client-intake' AND resolution_status = 'unresolved'
-- ORDER BY timestamp_created DESC;

-- Get errors by altitude
-- SELECT * FROM shq.orbt_error_log 
-- WHERE altitude = 30000 AND resolution_status = 'unresolved'
-- ORDER BY timestamp_created DESC;

-- Get errors by ORBT layer
-- SELECT * FROM shq.orbt_error_log 
-- WHERE error_layer = 'Operation' AND resolution_status = 'unresolved'
-- ORDER BY timestamp_created DESC;

