# Rosetta Stone — Domain 2: Programming

## Layer 0 Reference: docs/LAYER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS programming?

**Candidate Constant:** Giving precise, ordered instructions to a machine to transform input into output.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what the program does, it receives input, processes it, and produces output. |
| CTB | PASS | From assembly to Python to visual flow builders — the definition holds at every level. |
| Circle | PASS | Program output reveals bugs → fix instructions → better output. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**18 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Variable | A named container whose value can change during execution | PASS | PASS | PASS | LOCKED |
| 2 | Constant | A named value that does not change during execution | PASS | PASS | PASS | LOCKED |
| 3 | Assignment | Binding a value to a named container | PASS | PASS | PASS | LOCKED |
| 4 | Condition | A test that determines which path execution takes | PASS | PASS | PASS | LOCKED |
| 5 | Loop | Repeating a block of instructions until a condition is met | PASS | PASS | PASS | LOCKED |
| 6 | Function | A reusable, named block of instructions with defined inputs and outputs | PASS | PASS | PASS | LOCKED |
| 7 | Input | Data entering the program from an external source | PASS | PASS | PASS | LOCKED |
| 8 | Output | Data leaving the program to an external destination | PASS | PASS | PASS | LOCKED |
| 9 | Sequence | Instructions executed in order, one after another | PASS | PASS | PASS | LOCKED |
| 10 | Operator | A symbol or keyword that performs an operation on values | PASS | PASS | PASS | LOCKED |
| 11 | Data Type | A classification that determines what operations are valid on a value | PASS | PASS | PASS | LOCKED |
| 12 | Array/List | An ordered collection of values accessible by position | PASS | PASS | PASS | LOCKED |
| 13 | Object/Record | A structured collection of named fields | PASS | PASS | PASS | LOCKED |
| 14 | Error Handling | A mechanism for detecting and responding to unexpected conditions | PASS | PASS | PASS | LOCKED |
| 15 | Scope | The region of code where a name binding is valid | PASS | PASS | PASS | LOCKED |
| 16 | Comment | Human-readable annotation ignored by the machine | PASS | PASS | PASS | LOCKED |
| 17 | Import/Library | Reusing code defined elsewhere | PASS | PASS | PASS | LOCKED |
| 18 | Iteration | Processing each element in a collection one at a time | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean. No constant invalidates another.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every program follows IMO:
- **Input:** Data enters (user input, file, API, sensor)
- **Middle:** Instructions process (transform, decide, loop, call functions)
- **Output:** Result produced (display, file, API response, side effect)

**Verdict:** CONSTANT_LOCKED — the three-part structure holds from a one-liner to a distributed system.

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every program organizes as CTB:
- **Trunk:** The program/application
- **Branches:** Modules / packages / files
- **Leaves:** Functions → statements → expressions

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | Python | JavaScript | SQL | n8n (Visual) | CF Workers (TS) |
|-------------|--------|-----------|-----|-------------|----------------|
| Variable | `x = 5` | `let x = 5` | `DECLARE @x INT = 5` | Set node / field mapping | `let x = 5` |
| Constant | `X = 5` (convention) | `const X = 5` | N/A (literals) | Static value in config | `const X = 5` |
| Assignment | `x = value` | `x = value` | `SET @x = value` | Drag connection / expression | `x = value` |
| Condition | `if/elif/else` | `if/else if/else` | `CASE WHEN / WHERE` | IF node | `if/else if/else` |
| Loop | `for/while` | `for/while` | Cursor / recursive CTE | SplitInBatches node | `for/while` |
| Function | `def name():` | `function name()` / `() =>` | Stored procedure / function | Sub-workflow | `function name()` / `() =>` |
| Input | `input()` / `sys.argv` / file read | `prompt()` / fetch / fs | Query parameters / INSERT data | Trigger node (webhook, cron, manual) | `request` object |
| Output | `print()` / `return` / file write | `console.log()` / `return` / DOM | SELECT result set | Response node / output pin | `return new Response()` |
| Sequence | Top-to-bottom execution | Top-to-bottom execution | Statement order / query plan | Node-to-node flow (left to right) | Top-to-bottom execution |
| Operator | `+ - * / == != and or` | `+ - * / === !== && \|\|` | `+ - * / = <> AND OR` | Expression: `{{ $json.field + 1 }}` | `+ - * / === !== && \|\|` |
| Data Type | `int, str, float, bool, list, dict` | `number, string, boolean, array, object` | `INT, VARCHAR, BOOLEAN, JSON` | Auto-typed (JSON-native) | `number, string, boolean, array, object` |
| Array/List | `[1, 2, 3]` | `[1, 2, 3]` | `ARRAY` / result set rows | Item list (each item = array element) | `[1, 2, 3]` |
| Object/Record | `dict` / `class` | `{}` / `class` | Row (column: value pairs) | JSON item `$json` | `{}` / `interface` |
| Error Handling | `try/except/finally` | `try/catch/finally` | `BEGIN TRY...CATCH` / transaction rollback | Error output pin / Stop and Error node | `try/catch/finally` |
| Scope | Indentation / function / module | `{}` block / function / module | Procedure / batch / session | Node scope (each node isolated) | `{}` block / function / module |
| Comment | `# comment` | `// comment` / `/* */` | `-- comment` / `/* */` | Sticky note / node description | `// comment` / `/* */` |
| Import/Library | `import` / `from x import y` | `import` / `require()` | N/A (built-in functions) | Community nodes / npm packages | `import` / `require()` |
| Iteration | `for item in list` | `for...of` / `.forEach()` / `.map()` | Cursor / set-based ops | SplitInBatches + loop back | `for...of` / `.forEach()` / `.map()` |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Debug Circle | Bug found → read error → fix code → re-run | YES — every language, every environment |
| Refactor Circle | Code works but messy → restructure → same output, cleaner code | YES — applies universally |
| Test Circle | Write test → run → fail → fix → pass | YES — from unittest to manual QA |
| Performance Circle | Slow execution → profile → optimize → faster | YES — from Python profiler to SQL EXPLAIN |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Syntax | `def` vs `function` vs `CREATE PROCEDURE` vs visual node |
| Runtime | CPython vs V8 vs SQL engine vs n8n runtime vs Workers V8 isolate |
| Package manager | pip vs npm vs N/A vs npm (n8n) vs npm (wrangler) |
| Type system | Dynamic (Python) vs dynamic (JS) vs static (SQL) vs none (n8n) vs static (TS) |
| Execution model | Synchronous / async / set-based / flow-based / event-driven |
| Deployment target | Local / server / browser / self-hosted / edge |

**Variable count:** 6 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 18 root concepts + 3 structural + 4 circles = 25 |
| Variables isolated | 6 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from visual flow builders to assembly |