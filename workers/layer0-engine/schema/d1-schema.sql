-- Layer 0 Engine — D1 Schema
-- Gate results, locked constants, isolated variables, sessions, back-propagation, errors

-- Sessions — one per domain analysis
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    domain_name TEXT NOT NULL,
    domain_description TEXT,
    status TEXT DEFAULT 'IN_PROGRESS', -- IN_PROGRESS / COMPLETE / FAILED
    total_gates INTEGER DEFAULT 0,
    total_constants INTEGER DEFAULT 0,
    total_variables INTEGER DEFAULT 0,
    final_sigma REAL,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
);

-- Gate results — one row per gate per session
CREATE TABLE gate_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    gate_number INTEGER NOT NULL,
    altitude_ft INTEGER,
    candidate_constant TEXT NOT NULL,
    imo_validation TEXT,        -- PASS/FAIL + reason
    ctb_validation TEXT,        -- PASS/FAIL + reason
    circle_validation TEXT,     -- PASS/FAIL + reason
    monte_carlo_sigma REAL,     -- Standard deviation (NULL for qualitative gates)
    prior_gate_sigma REAL,      -- Previous gate sigma for comparison
    sigma_direction TEXT,       -- TIGHTENED / UNCHANGED / EXPANDED
    verdict TEXT NOT NULL,      -- CONSTANT_LOCKED / VARIABLE / PHANTOM / BACK_PROPAGATE
    back_propagation_target INTEGER, -- Gate number to re-run if back-propagation needed
    created_at TEXT DEFAULT (datetime('now'))
);

-- Locked constants — the canonical table
CREATE TABLE locked_constants (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    gate_number INTEGER NOT NULL,
    constant_name TEXT NOT NULL,
    constant_definition TEXT NOT NULL,
    validation_evidence TEXT,    -- JSON: which tests it passed
    created_at TEXT DEFAULT (datetime('now'))
);

-- Isolated variables — what's left after extraction
CREATE TABLE isolated_variables (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    variable_name TEXT NOT NULL,
    variable_type TEXT,          -- QUALITATIVE / QUANTITATIVE
    range_min REAL,
    range_max REAL,
    distribution TEXT,           -- For Monte Carlo parameterization
    created_at TEXT DEFAULT (datetime('now'))
);

-- Back-propagation log
CREATE TABLE back_propagation_log (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    trigger_gate INTEGER NOT NULL,  -- Gate that triggered back-propagation
    target_gate INTEGER NOT NULL,   -- Gate being re-evaluated
    original_verdict TEXT,
    new_verdict TEXT,
    reason TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Error table
CREATE TABLE errors (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    gate_number INTEGER,
    error_type TEXT,             -- VALIDATION_FAILURE / LLM_ERROR / MONTE_CARLO_ERROR / UNKNOWN
    error_detail TEXT,
    raw_output TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for common queries
CREATE INDEX idx_gate_results_session ON gate_results(session_id);
CREATE INDEX idx_locked_constants_session ON locked_constants(session_id);
CREATE INDEX idx_isolated_variables_session ON isolated_variables(session_id);
CREATE INDEX idx_back_propagation_session ON back_propagation_log(session_id);
CREATE INDEX idx_errors_session ON errors(session_id);
