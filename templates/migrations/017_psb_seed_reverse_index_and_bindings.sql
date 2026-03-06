-- =====================================================================
-- MIGRATION 017: PSB Reverse Prompt Index + Prompt-Skill Bindings Seed
-- =====================================================================
-- Authority: imo-creator (Constitutional)
-- Purpose: Populate reverse_prompt_index (output→prompt lookup) and
--          prompt_skill_binding (skill→prompt mapping) tables.
-- Doctrine: PROMPT_SKILLS_BAY_CONSTITUTION.md Part XV, ADR-023
-- Depends: 012, 013, 014 (prompt_registry, reverse_prompt_index, skill_registry)
-- Idempotent: YES (uses ON CONFLICT DO NOTHING where applicable)
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- PART 1: REVERSE PROMPT INDEX ENTRIES
-- Maps desired outputs → matching prompts
-- ─────────────────────────────────────────────────────────────────────

-- 1. APPLY_DOCTRINE → audit_certification
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Validate repository against IMO-Creator constitutional doctrine',
    'Compliance check report with pass/fail verdict and violation summary',
    'audit_certification',
    'CC-01', 'operate',
    'd293f709-0b62-4f91-b80e-5aad60ebb87e', '1.0.0',
    'Run before any downstream work. Must pass before planning begins.',
    ARRAY['templates/IMO_SYSTEM_SPEC.md', 'CONSTITUTION.md', 'IMO_CONTROL.json'],
    ARRAY['compliance_report', 'violation_summary'],
    ARRAY['doctrine', 'compliance', 'audit', 'constitutional'],
    ARRAY['validate', 'doctrine', 'compliance', 'apply', 'constitution', 'IMO']
);

-- 1b. APPLY_DOCTRINE in repair mode
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Repair doctrine violations found in downstream repo',
    'Doctrine violation remediation report',
    'audit_certification',
    'CC-01', 'repair',
    'd293f709-0b62-4f91-b80e-5aad60ebb87e', '1.0.0',
    'Use when audit found violations that need correction.',
    ARRAY['templates/IMO_SYSTEM_SPEC.md', 'CONSTITUTION.md', 'IMO_CONTROL.json'],
    ARRAY['remediation_report', 'corrected_artifacts'],
    ARRAY['doctrine', 'repair', 'fix', 'violations'],
    ARRAY['repair', 'fix', 'doctrine', 'violation', 'remediate']
);

-- 2. CLEANUP_EXECUTOR → changeset
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Execute human-approved cleanup actions for repo files and database objects',
    'Cleanup execution log with action status and rollback breadcrumbs',
    'changeset',
    NULL, 'operate',
    '621c1250-2f30-49f9-a745-19e551344c30', '1.0.0',
    'Requires Phase 1 audit report + explicit human approval before execution.',
    ARRAY['hygiene_audit_report', 'human_approval'],
    ARRAY['cleanup_execution_log', 'rollback_breadcrumbs'],
    ARRAY['cleanup', 'housekeeping', 'execute', 'files', 'database'],
    ARRAY['cleanup', 'delete', 'remove', 'housekeeping', 'execute', 'files']
);

-- 3. DBA_ENFORCEMENT → audit_certification
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Enforce DBA compliance gates for structural and non-structural database changes',
    'DBA enforcement check report with proceed/blocked verdict',
    'audit_certification',
    'CC-04', 'operate',
    'fb703335-59be-4a28-8155-4c1bfade53f3', '1.0.0',
    'Runs as a gate before any DB migration. Must produce PROCEED or BLOCKED.',
    ARRAY['DBA_ENFORCEMENT_DOCTRINE.md', 'migration_sql'],
    ARRAY['dba_enforcement_report', 'proceed_blocked_verdict'],
    ARRAY['dba', 'database', 'enforcement', 'gate', 'migration'],
    ARRAY['dba', 'database', 'migration', 'enforce', 'gate', 'structural']
);

-- 3b. DBA_ENFORCEMENT in repair mode
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Repair DBA compliance violations in database migrations',
    'DBA violation remediation with corrected migration SQL',
    'audit_certification',
    'CC-04', 'repair',
    'fb703335-59be-4a28-8155-4c1bfade53f3', '1.0.0',
    'Use when DBA enforcement found violations that need correction.',
    ARRAY['DBA_ENFORCEMENT_DOCTRINE.md', 'violation_report'],
    ARRAY['corrected_migration_sql', 'dba_remediation_report'],
    ARRAY['dba', 'repair', 'fix', 'migration'],
    ARRAY['dba', 'fix', 'repair', 'migration', 'violation']
);

-- 4. DECLARE_DATA_AND_RENDER_ERD → erd
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Declare AI-ready schema metadata and render tree-aligned ERD diagrams',
    'Schema metadata files, erd_tree.mmd, erd_tree.json',
    'erd',
    'CC-03', 'build',
    '0c880c95-d62d-41a0-b7dd-5f8df0c8cc52', '1.0.0',
    'Run after PRD_TO_ERD_WORKFLOW. Produces machine-readable ERD artifacts.',
    ARRAY['prd_to_erd_completed', 'erd_structure_exists'],
    ARRAY['schema_metadata', 'erd_tree.mmd', 'erd_tree.json', 'column_registry'],
    ARRAY['erd', 'schema', 'data', 'metadata', 'mermaid', 'diagram'],
    ARRAY['erd', 'schema', 'declare', 'data', 'render', 'diagram', 'mermaid']
);

-- 5. DECLARE_EXECUTION_WIRING → execution_wiring
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Declare process-to-execution bindings and autonomy controls',
    'execution.yaml, triggers.yaml, schedules.yaml, kill_switches.yaml, observability.yaml',
    'execution_wiring',
    'CC-04', 'build',
    'af253a6d-4e40-4da2-9533-8b6d081946e3', '1.0.0',
    'Run after data declaration phase. Creates execution surface bindings.',
    ARRAY['data_declaration_completed', 'process_declarations'],
    ARRAY['execution.yaml', 'triggers.yaml', 'schedules.yaml', 'kill_switches.yaml', 'observability.yaml'],
    ARRAY['execution', 'wiring', 'triggers', 'schedules', 'autonomy'],
    ARRAY['execution', 'wiring', 'trigger', 'schedule', 'kill_switch', 'observability', 'bind']
);

-- 6. DECLARE_STRUCTURE_AND_RENDER_TREE → hub_definition
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Perform structural instantiation and render Christmas Tree diagram',
    'REGISTRY.yaml files, minted IDs (sovereign/hub/subhub/process), christmas_tree.mmd',
    'hub_definition',
    'CC-02', 'build',
    '4fb608f6-9d21-4e56-b5b1-4f8e9e5d9bd6', '1.0.0',
    'Run after APPLY_DOCTRINE passes. Creates CTB structural identity.',
    ARRAY['apply_doctrine_passed', 'IMO_CONTROL.json'],
    ARRAY['REGISTRY.yaml', 'christmas_tree.mmd', 'minted_ids'],
    ARRAY['structure', 'tree', 'CTB', 'hub', 'registry', 'mermaid'],
    ARRAY['structure', 'tree', 'CTB', 'christmas', 'hub', 'registry', 'render', 'declare']
);

-- 7. DOCUMENTATION_ERD_ENFORCEMENT → audit_certification
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Enforce documentation and ERD compliance for schema changes',
    'Documentation & ERD enforcement check with artifact update status',
    'audit_certification',
    'CC-03', 'operate',
    'd88fde7c-e0e1-46fd-b010-4e42b07789bf', '1.0.0',
    'Gate prompt: runs whenever ERD or schema docs are modified.',
    ARRAY['DOCUMENTATION_ERD_DOCTRINE.md', 'schema_change'],
    ARRAY['enforcement_report', 'artifact_update_status'],
    ARRAY['documentation', 'erd', 'enforcement', 'gate', 'compliance'],
    ARRAY['documentation', 'erd', 'enforce', 'schema', 'compliance', 'gate']
);

-- 7b. DOCUMENTATION_ERD_ENFORCEMENT in repair mode
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Repair documentation and ERD compliance violations',
    'Corrected documentation and ERD artifacts',
    'audit_certification',
    'CC-03', 'repair',
    'd88fde7c-e0e1-46fd-b010-4e42b07789bf', '1.0.0',
    'Use when enforcement found violations needing correction.',
    ARRAY['DOCUMENTATION_ERD_DOCTRINE.md', 'violation_report'],
    ARRAY['corrected_docs', 'corrected_erd'],
    ARRAY['documentation', 'erd', 'repair', 'fix'],
    ARRAY['documentation', 'erd', 'repair', 'fix', 'violation']
);

-- 8. HUB_DESIGN_DECLARATION_INTAKE → work_packet (hub_definition)
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Generate fillable HUB_DESIGN_DECLARATION.yaml and enforce HSS completion',
    'HUB_DESIGN_DECLARATION.yaml (DRAFT) with validated/rejected status',
    'hub_definition',
    'CC-02', 'build',
    '956182c6-1b71-478e-977c-ae85291d0be5', '1.0.0',
    'Entry point for new hub design. Produces the design declaration for planner intake.',
    ARRAY['apply_doctrine_passed'],
    ARRAY['HUB_DESIGN_DECLARATION.yaml'],
    ARRAY['hub', 'design', 'declaration', 'intake', 'HSS', 'yaml'],
    ARRAY['hub', 'design', 'declaration', 'intake', 'HSS', 'spoke', 'status']
);

-- 9. HYGIENE_AUDITOR → audit_certification
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Perform periodic repo and Neon database hygiene audit',
    'Hygiene audit report with cleanup checklist and findings table',
    'audit_certification',
    NULL, 'operate',
    '90234634-9a2a-492a-9784-ffb74c79ddd2', '1.0.0',
    'Read-only audit. No prerequisites. Run periodically or before cleanup.',
    ARRAY[]::TEXT[],
    ARRAY['hygiene_audit_report', 'cleanup_checklist', 'findings_table'],
    ARRAY['hygiene', 'audit', 'cleanup', 'periodic', 'health'],
    ARRAY['hygiene', 'audit', 'cleanup', 'health', 'check', 'periodic', 'repo', 'neon']
);

-- 10. PRD_MIGRATION → prd
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Retrofit existing legacy PRDs with mandatory Hub-Spoke Status section',
    'Updated PRD with HSS section inserted',
    'prd',
    'CC-02', 'build',
    'be14a03e-a170-43be-bc14-691f2645955d', '1.0.0',
    'One-time migration for legacy PRDs lacking HSS. Preserves existing content.',
    ARRAY['existing_prd_without_hss'],
    ARRAY['updated_prd_with_hss'],
    ARRAY['prd', 'migration', 'HSS', 'retrofit', 'legacy'],
    ARRAY['prd', 'migrate', 'retrofit', 'HSS', 'hub', 'spoke', 'legacy', 'status']
);

-- 11a. PRD_TO_ERD_WORKFLOW → prd (validation output)
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Validate PRD and generate clarifying questions for completeness',
    'PRD validation questions report and updated PRD',
    'prd',
    'CC-02', 'build',
    '1d6c2018-ae93-458c-967c-b390cec55751', '1.0.0',
    'Phase 1 of PRD→ERD workflow. Validates PRD, asks clarifying questions.',
    ARRAY['HUB_DESIGN_DECLARATION_CONFIRMED', 'valid_prd'],
    ARRAY['validation_questions', 'updated_prd'],
    ARRAY['prd', 'validate', 'questions', 'workflow'],
    ARRAY['prd', 'validate', 'clarify', 'questions', 'completeness']
);

-- 11b. PRD_TO_ERD_WORKFLOW → erd (creation output)
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Create ERD from validated PRD with entity-relationship linkage',
    'ERD with entity definitions and PRD linkage',
    'erd',
    'CC-03', 'build',
    '1d6c2018-ae93-458c-967c-b390cec55751', '1.0.0',
    'Phase 2 of PRD→ERD workflow. Creates ERD after PRD is validated.',
    ARRAY['validated_prd'],
    ARRAY['erd_document', 'prd_erd_linkage'],
    ARRAY['erd', 'prd', 'workflow', 'create', 'linkage'],
    ARRAY['erd', 'create', 'prd', 'entity', 'relationship', 'linkage']
);

-- 12. SYSTEM_FLOW_PROJECTION → execution_wiring
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Generate read-only derived system flow projection JSON from canonical artifacts',
    'SYSTEM_FLOW_PROJECTION.json with nodes/edges format',
    'execution_wiring',
    NULL, 'operate',
    '43650dfb-576e-4bb3-8408-d6af628a3a97', '1.0.0',
    'Derived artifact. Regenerated from canonical PRDs, ERDs, process declarations.',
    ARRAY['canonical_prds', 'canonical_erds', 'process_declarations', 'REGISTRY.yaml'],
    ARRAY['SYSTEM_FLOW_PROJECTION.json'],
    ARRAY['flow', 'projection', 'system', 'derived', 'json', 'nodes', 'edges'],
    ARRAY['system', 'flow', 'projection', 'nodes', 'edges', 'json', 'derived']
);

-- 13. SYSTEM_MODEL_REGENERATOR → hub_definition
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Compile authoritative system model JSON from canonical doctrine',
    'SYSTEM_MODEL.json with hubs, IMO flows, data ownership, change impact map',
    'hub_definition',
    NULL, 'build',
    '594a9f14-add5-46e1-83c4-02bcc6812489', '1.0.0',
    'Regenerates system model from canonical artifacts. Run when architecture changes.',
    ARRAY['canonical_prds', 'canonical_erds', 'process_declarations'],
    ARRAY['SYSTEM_MODEL.json'],
    ARRAY['system', 'model', 'regenerate', 'hubs', 'IMO', 'json'],
    ARRAY['system', 'model', 'regenerate', 'hub', 'IMO', 'data', 'ownership', 'impact']
);

-- 13b. SYSTEM_MODEL_REGENERATOR in operate mode
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Refresh system model JSON to reflect current canonical state',
    'Updated SYSTEM_MODEL.json synchronized with current doctrine',
    'hub_definition',
    NULL, 'operate',
    '594a9f14-add5-46e1-83c4-02bcc6812489', '1.0.0',
    'Periodic refresh. Ensures system model reflects latest canonical state.',
    ARRAY['canonical_prds', 'canonical_erds', 'process_declarations'],
    ARRAY['SYSTEM_MODEL.json'],
    ARRAY['system', 'model', 'refresh', 'sync'],
    ARRAY['system', 'model', 'refresh', 'sync', 'update', 'current']
);

-- 14. UI_DOCTRINE_GENERATOR → other
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Generate UI governance artifacts (Constitution, PRDs, ERDs) from canonical doctrine',
    'UI_CONSTITUTION.md, UI_PRD_<hub>.md, UI_ERD_<hub>.md',
    'other',
    NULL, 'build',
    '8d134da9-7f0e-4a68-a637-7b226c441d89', '1.0.0',
    'Initial generation. Creates UI governance surface from scratch.',
    ARRAY['UI_CONTROL_CONTRACT.json', 'canonical_prds', 'canonical_erds'],
    ARRAY['UI_CONSTITUTION.md', 'UI_PRD.md', 'UI_ERD.md'],
    ARRAY['ui', 'doctrine', 'generate', 'constitution', 'governance'],
    ARRAY['ui', 'doctrine', 'generate', 'constitution', 'prd', 'erd', 'governance']
);

-- 15. UI_DOCTRINE_REGENERATOR → other
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Regenerate UI governance artifacts to stay synchronized with canonical doctrine',
    'Regenerated UI docs (Constitution, PRDs, ERDs) + regeneration summary',
    'other',
    NULL, 'build',
    '00d64854-834a-4379-983f-10f37cb0d7ba', '1.0.0',
    'Run when canonical doctrine changes. Keeps UI governance in sync.',
    ARRAY['canonical_prds', 'canonical_erds', 'UI_CONTROL_CONTRACT.json'],
    ARRAY['UI_CONSTITUTION.md', 'UI_PRD.md', 'UI_ERD.md', 'regeneration_summary'],
    ARRAY['ui', 'doctrine', 'regenerate', 'sync', 'refresh'],
    ARRAY['ui', 'doctrine', 'regenerate', 'sync', 'refresh', 'update']
);

-- 15b. UI_DOCTRINE_REGENERATOR in operate mode
INSERT INTO psb.reverse_prompt_index (
    desired_output_description, transformation_target, output_category,
    cc_layer_filter, orbt_mode_filter,
    matching_prompt_id, matching_prompt_version,
    usage_notes, prerequisites, produces_artifacts,
    tags, search_keywords
) VALUES (
    'Refresh UI governance artifacts after operational doctrine changes',
    'Updated UI docs synchronized with current canonical state',
    'other',
    NULL, 'operate',
    '00d64854-834a-4379-983f-10f37cb0d7ba', '1.0.0',
    'Operational refresh of UI layer. Run periodically or after doctrine updates.',
    ARRAY['canonical_prds', 'canonical_erds', 'UI_CONTROL_CONTRACT.json'],
    ARRAY['UI_CONSTITUTION.md', 'UI_PRD.md', 'UI_ERD.md'],
    ARRAY['ui', 'doctrine', 'refresh', 'operate'],
    ARRAY['ui', 'refresh', 'operate', 'sync']
);

-- ─────────────────────────────────────────────────────────────────────
-- PART 2: PROMPT-SKILL BINDINGS
-- Maps which skills use which prompts and how
-- ─────────────────────────────────────────────────────────────────────

-- ═══ ORCHESTRATOR (73d53d9d) ═══

-- Orchestrator CONSUMES apply-doctrine (reads compliance state for routing)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd293f709-0b62-4f91-b80e-5aad60ebb87e',
    '73d53d9d-a158-40f6-b5d5-e211be59eb20',
    'CONSUMES',
    'Orchestrator reads doctrine compliance state to determine routing and classify intent'
);

-- Orchestrator PRODUCES hub-design-declaration-intake (routes user intent to planner)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '956182c6-1b71-478e-977c-ae85291d0be5',
    '73d53d9d-a158-40f6-b5d5-e211be59eb20',
    'PRODUCES',
    'Orchestrator routes user intent through design declaration intake for planner'
);

-- ═══ PLANNER (00900325) ═══

-- Planner REQUIRES apply-doctrine
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd293f709-0b62-4f91-b80e-5aad60ebb87e',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'REQUIRES',
    'Planner must verify doctrine compliance before creating work packets'
);

-- Planner CONSUMES hub-design-declaration-intake
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '956182c6-1b71-478e-977c-ae85291d0be5',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'CONSUMES',
    'Planner reads design declaration to plan structural and data work'
);

-- Planner PRODUCES declare-structure-and-render-tree (plans structural work)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '4fb608f6-9d21-4e56-b5b1-4f8e9e5d9bd6',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'PRODUCES',
    'Planner creates work packets that invoke structural declaration'
);

-- Planner PRODUCES prd-to-erd-workflow
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '1d6c2018-ae93-458c-967c-b390cec55751',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'PRODUCES',
    'Planner creates work packets that invoke PRD-to-ERD workflow'
);

-- Planner PRODUCES declare-data-and-render-erd
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '0c880c95-d62d-41a0-b7dd-5f8df0c8cc52',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'PRODUCES',
    'Planner creates work packets that invoke data declaration and ERD rendering'
);

-- Planner PRODUCES declare-execution-wiring
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'af253a6d-4e40-4da2-9533-8b6d081946e3',
    '00900325-86cb-48c6-a6e2-836a941f7983',
    'PRODUCES',
    'Planner creates work packets that invoke execution wiring declaration'
);

-- ═══ WORKER (f9f0c330) ═══

-- Worker REQUIRES declare-structure-and-render-tree
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '4fb608f6-9d21-4e56-b5b1-4f8e9e5d9bd6',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes structural declaration work per work packet'
);

-- Worker REQUIRES declare-data-and-render-erd
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '0c880c95-d62d-41a0-b7dd-5f8df0c8cc52',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes data declaration and ERD rendering per work packet'
);

-- Worker REQUIRES declare-execution-wiring
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'af253a6d-4e40-4da2-9533-8b6d081946e3',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes execution wiring declaration per work packet'
);

-- Worker REQUIRES prd-migration
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'be14a03e-a170-43be-bc14-691f2645955d',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes PRD migration (HSS retrofit) per work packet'
);

-- Worker REQUIRES prd-to-erd-workflow
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '1d6c2018-ae93-458c-967c-b390cec55751',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes PRD-to-ERD workflow per work packet'
);

-- Worker REQUIRES cleanup-executor
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '621c1250-2f30-49f9-a745-19e551344c30',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker executes cleanup actions per work packet (requires human approval)'
);

-- Worker REQUIRES ui-doctrine-generator
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '8d134da9-7f0e-4a68-a637-7b226c441d89',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker generates UI governance artifacts per work packet'
);

-- Worker REQUIRES ui-doctrine-regenerator
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '00d64854-834a-4379-983f-10f37cb0d7ba',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker regenerates UI governance artifacts per work packet'
);

-- Worker REQUIRES system-flow-projection
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '43650dfb-576e-4bb3-8408-d6af628a3a97',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker generates system flow projection per work packet'
);

-- Worker REQUIRES system-model-regenerator
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '594a9f14-add5-46e1-83c4-02bcc6812489',
    'f9f0c330-acf0-4a24-a52d-0a106f8142af',
    'REQUIRES',
    'Worker regenerates system model per work packet'
);

-- ═══ DB AGENT (dbe520d2) ═══

-- DB Agent REQUIRES dba-enforcement
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'fb703335-59be-4a28-8155-4c1bfade53f3',
    'dbe520d2-96b7-4fdc-81cc-a9d9eccd5669',
    'REQUIRES',
    'DB Agent enforces DBA compliance gates before any migration'
);

-- DB Agent REQUIRES documentation-erd-enforcement
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd88fde7c-e0e1-46fd-b010-4e42b07789bf',
    'dbe520d2-96b7-4fdc-81cc-a9d9eccd5669',
    'REQUIRES',
    'DB Agent enforces documentation and ERD compliance for schema changes'
);

-- DB Agent CONSUMES declare-data-and-render-erd (reads ERD for schema work)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '0c880c95-d62d-41a0-b7dd-5f8df0c8cc52',
    'dbe520d2-96b7-4fdc-81cc-a9d9eccd5669',
    'CONSUMES',
    'DB Agent reads ERD to inform database schema decisions'
);

-- ═══ AUDITOR (59028ac9) ═══

-- Auditor REQUIRES apply-doctrine
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd293f709-0b62-4f91-b80e-5aad60ebb87e',
    '59028ac9-2593-4006-acf5-5cfe4bd89e8f',
    'REQUIRES',
    'Auditor runs doctrine compliance verification as part of audit'
);

-- Auditor REQUIRES hygiene-auditor
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '90234634-9a2a-492a-9784-ffb74c79ddd2',
    '59028ac9-2593-4006-acf5-5cfe4bd89e8f',
    'REQUIRES',
    'Auditor runs hygiene audit as part of compliance evaluation'
);

-- Auditor REQUIRES dba-enforcement
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'fb703335-59be-4a28-8155-4c1bfade53f3',
    '59028ac9-2593-4006-acf5-5cfe4bd89e8f',
    'REQUIRES',
    'Auditor runs DBA enforcement checks as part of compliance evaluation'
);

-- Auditor REQUIRES documentation-erd-enforcement
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd88fde7c-e0e1-46fd-b010-4e42b07789bf',
    '59028ac9-2593-4006-acf5-5cfe4bd89e8f',
    'REQUIRES',
    'Auditor runs documentation and ERD enforcement as part of compliance evaluation'
);

-- ═══ GARAGE-WORKER-PARALLEL (1cd37765) ═══

-- Parallel worker REQUIRES same build prompts as worker (subset)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '4fb608f6-9d21-4e56-b5b1-4f8e9e5d9bd6',
    '1cd37765-ae16-4903-8ddb-01f44c4b8112',
    'REQUIRES',
    'Parallel worker executes structural declaration in parallel lane'
);

INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '0c880c95-d62d-41a0-b7dd-5f8df0c8cc52',
    '1cd37765-ae16-4903-8ddb-01f44c4b8112',
    'REQUIRES',
    'Parallel worker executes data declaration in parallel lane'
);

INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'af253a6d-4e40-4da2-9533-8b6d081946e3',
    '1cd37765-ae16-4903-8ddb-01f44c4b8112',
    'REQUIRES',
    'Parallel worker executes execution wiring in parallel lane'
);

-- ═══ GARAGE-AUDITOR-PARALLEL (5f544a5d) ═══

-- Parallel auditor REQUIRES same audit prompts as auditor (subset)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd293f709-0b62-4f91-b80e-5aad60ebb87e',
    '5f544a5d-6366-4290-b8b5-8aaf829bc6fe',
    'REQUIRES',
    'Parallel auditor runs doctrine compliance in parallel lane'
);

INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '90234634-9a2a-492a-9784-ffb74c79ddd2',
    '5f544a5d-6366-4290-b8b5-8aaf829bc6fe',
    'REQUIRES',
    'Parallel auditor runs hygiene audit in parallel lane'
);

-- ═══ GARAGE-REFIT-TEAMMATE (9fb5e359) ═══

-- Refit teammate REQUIRES apply-doctrine (checks child compliance)
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    'd293f709-0b62-4f91-b80e-5aad60ebb87e',
    '9fb5e359-c072-4dac-8196-3d41f2be1c1a',
    'REQUIRES',
    'Refit teammate verifies child repo doctrine compliance before refitting'
);

-- Refit teammate CONSUMES hub-design-declaration-intake
INSERT INTO psb.prompt_skill_binding (prompt_id, skill_id, binding_type, binding_description)
VALUES (
    '956182c6-1b71-478e-977c-ae85291d0be5',
    '9fb5e359-c072-4dac-8196-3d41f2be1c1a',
    'CONSUMES',
    'Refit teammate reads child design declaration for refit planning'
);

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════════════

-- Verify reverse prompt index count
-- SELECT count(*) AS reverse_index_entries FROM psb.reverse_prompt_index;

-- Verify prompt-skill binding count
-- SELECT count(*) AS binding_entries FROM psb.prompt_skill_binding;

-- Verify coverage: every prompt has at least one reverse index entry
-- SELECT pr.slug, count(rpi.reverse_id) AS index_entries
-- FROM psb.prompt_registry pr
-- LEFT JOIN psb.reverse_prompt_index rpi ON pr.prompt_id = rpi.matching_prompt_id
-- GROUP BY pr.slug ORDER BY pr.slug;

-- Verify coverage: every skill has at least one binding
-- SELECT sr.slug, count(psb.binding_id) AS binding_count
-- FROM psb.skill_registry sr
-- LEFT JOIN psb.prompt_skill_binding psb ON sr.skill_id = psb.skill_id
-- GROUP BY sr.slug ORDER BY sr.slug;
