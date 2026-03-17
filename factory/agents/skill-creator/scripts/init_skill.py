#!/usr/bin/env python3
"""
init_skill.py — Scaffold a new skill directory with proper structure.

Usage:
    python init_skill.py <skill-name>

Creates:
    skills/<skill-name>/
    ├── SKILL.md          (frontmatter + placeholder body)
    ├── scripts/          (executable code)
    ├── references/       (context docs loaded as needed)
    └── templates/        (output assets not loaded into context)
"""

import sys
import os
from pathlib import Path
from datetime import datetime, timezone


SKILLS_ROOT = Path(__file__).resolve().parent.parent.parent  # skills/


SKILL_MD_TEMPLATE = """---
name: {skill_name}
description: >
  [TRIGGER: What causes this skill to activate]
  [OUTPUT: What this skill produces]
---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** [What triggers this skill]

**Middle (Processing):**
- [Step 1]
- [Step 2]

**Egress (Output):** [What this skill produces]

**Go/No-Go Gate:** [What must be true before delivery]

---

## Constants — What Is Fixed About This Skill

1. [Structural truth that never changes]

---

## Variables — What Changes Per Invocation

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| | | |

---

## Hub-and-Spoke Configuration

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| | | | |

---

## Rules — What This Skill Never Does

- Never [hard constraint]

---

## Workflow

### Phase 1 — [Name]

**Constants for this phase:**
- [Fixed truth]

**Variables for this phase:**
- [What changes]

**Execute:**
[Instructions]

**Go/No-Go:** [Gate condition]

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| | | |
"""


def validate_name(name: str) -> bool:
    """Skill name must be lowercase, alphanumeric, hyphens only."""
    if not name:
        return False
    allowed = set("abcdefghijklmnopqrstuvwxyz0123456789-")
    return all(c in allowed for c in name) and not name.startswith("-") and not name.endswith("-")


def init_skill(skill_name: str) -> None:
    skill_dir = SKILLS_ROOT / skill_name

    if skill_dir.exists():
        print(f"FAIL: skills/{skill_name}/ already exists. Use edit workflow, not init.")
        sys.exit(1)

    if not validate_name(skill_name):
        print(f"FAIL: '{skill_name}' is not a valid skill name.")
        print("  Rules: lowercase, alphanumeric, hyphens only, no leading/trailing hyphens.")
        sys.exit(1)

    # Create directory structure
    (skill_dir / "scripts").mkdir(parents=True, exist_ok=True)
    (skill_dir / "references").mkdir(parents=True, exist_ok=True)
    (skill_dir / "templates").mkdir(parents=True, exist_ok=True)

    # Write SKILL.md with placeholder content
    skill_md = skill_dir / "SKILL.md"
    skill_md.write_text(SKILL_MD_TEMPLATE.format(skill_name=skill_name))

    # Write .gitkeep files for empty dirs
    for subdir in ["scripts", "references", "templates"]:
        gitkeep = skill_dir / subdir / ".gitkeep"
        if not any((skill_dir / subdir).iterdir()):
            gitkeep.write_text("")

    print(f"PASS: skills/{skill_name}/ initialized.")
    print(f"  SKILL.md:    skills/{skill_name}/SKILL.md")
    print(f"  scripts/:    skills/{skill_name}/scripts/")
    print(f"  references/: skills/{skill_name}/references/")
    print(f"  templates/:  skills/{skill_name}/templates/")
    print()
    print("Next: Open SKILL.md and replace all [PLACEHOLDER] values.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python init_skill.py <skill-name>")
        print("  Example: python init_skill.py pdf-converter")
        sys.exit(1)

    init_skill(sys.argv[1])
