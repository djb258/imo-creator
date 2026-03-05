# Output Patterns — Reference

Load this file during Phase 4 (Build) when defining the Egress format.

---

## Pattern 1: Single File Output

Skill produces one artifact.

```
Egress: A single <file_type> at <path>.
```

Validation: File exists, is non-empty, passes format check.

**When to use:** Most skills. Default pattern.

---

## Pattern 2: Directory Package

Skill produces a structured directory.

```
Egress: A directory at <path>/ containing:
  - <file_1> — <purpose>
  - <file_2> — <purpose>
  - <subdir>/ — <purpose>
```

Validation: All declared files exist. No undeclared files present.

**When to use:** Skills that produce multi-file outputs (e.g., skill-creator itself).

---

## Pattern 3: Structured Data

Skill produces JSON, YAML, or tabular output.

```
Egress: A JSON object with the following schema:
  {
    "field_1": "<type> — <purpose>",
    "field_2": "<type> — <purpose>"
  }
```

Validation: Schema validation passes. All required fields present. No extra fields.

**When to use:** Skills that feed downstream automation.

---

## Pattern 4: Mutation + Report

Skill modifies existing files and reports what changed.

```
Egress:
  - Modified files: <list>
  - Change report: <summary of what changed and why>
```

Validation: All declared files modified. No undeclared files touched. Report matches actual changes.

**When to use:** Refactoring skills, migration skills.

---

## Output Hygiene Rules

| Rule | Rationale |
|------|-----------|
| Declare output format in IMO before workflow | LLM knows what it is building toward |
| Output path is a Variable, output structure is a Constant | Path changes per invocation; structure does not |
| Every output has a validation step | Unvalidated output is not output — it is a draft |
| Never produce output that requires human interpretation to use | If a human must read it to know if it worked, the validation step is missing |
