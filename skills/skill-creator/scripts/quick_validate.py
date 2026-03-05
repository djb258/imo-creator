#!/usr/bin/env python3
"""
quick_validate.py — Validate a skill package before delivery.

Usage:
    python quick_validate.py <skill-name>

Checks:
    1. SKILL.md exists
    2. YAML frontmatter has required fields (name, description)
    3. Required sections present (IMO, Constants, Variables, Rules, Workflow)
    4. No placeholder brackets remain [PLACEHOLDER]
    5. SKILL.md under 500 lines
    6. No duplicate content between SKILL.md and reference files
    7. Description field contains trigger condition
    8. At least one Go/No-Go gate exists
    9. Constants block is not empty
   10. Rules block is not empty

Exit code 0 = all checks passed. Exit code 1 = failures found.
"""

import sys
import re
from pathlib import Path


SKILLS_ROOT = Path(__file__).resolve().parent.parent.parent  # skills/

REQUIRED_SECTIONS = [
    "IMO",
    "Constants",
    "Variables",
    "Rules",
    "Workflow",
]

MAX_LINES = 500


class ValidationResult:
    def __init__(self):
        self.checks = []
        self.passed = 0
        self.failed = 0

    def check(self, name: str, passed: bool, detail: str = ""):
        status = "PASS" if passed else "FAIL"
        self.checks.append((name, status, detail))
        if passed:
            self.passed += 1
        else:
            self.failed += 1

    def report(self) -> str:
        lines = []
        for name, status, detail in self.checks:
            marker = "  PASS" if status == "PASS" else "  FAIL"
            line = f"{marker}: {name}"
            if detail:
                line += f" — {detail}"
            lines.append(line)
        lines.append("")
        lines.append(f"  Result: {self.passed} passed, {self.failed} failed")
        return "\n".join(lines)

    @property
    def all_passed(self) -> bool:
        return self.failed == 0


def parse_frontmatter(content: str) -> dict:
    """Extract YAML frontmatter fields (simple key: value parsing)."""
    fm = {}
    if not content.startswith("---"):
        return fm
    end = content.find("---", 3)
    if end == -1:
        return fm
    block = content[3:end].strip()
    current_key = None
    current_value = []
    for line in block.split("\n"):
        if re.match(r"^[a-z_]+:", line):
            if current_key:
                fm[current_key] = "\n".join(current_value).strip()
            parts = line.split(":", 1)
            current_key = parts[0].strip()
            val = parts[1].strip() if len(parts) > 1 else ""
            current_value = [val] if val and val != ">" else []
        elif current_key:
            current_value.append(line.strip())
    if current_key:
        fm[current_key] = "\n".join(current_value).strip()
    return fm


def validate_skill(skill_name: str) -> ValidationResult:
    result = ValidationResult()
    skill_dir = SKILLS_ROOT / skill_name
    skill_md = skill_dir / "SKILL.md"

    # Check 1: SKILL.md exists
    result.check("SKILL.md exists", skill_md.exists())
    if not skill_md.exists():
        return result  # Cannot continue without file

    content = skill_md.read_text()
    lines = content.split("\n")

    # Check 2: YAML frontmatter
    fm = parse_frontmatter(content)
    has_name = "name" in fm and fm["name"]
    has_desc = "description" in fm and fm["description"]
    result.check("Frontmatter: name field", has_name,
                 f"found: '{fm.get('name', '')}'" if has_name else "missing")
    result.check("Frontmatter: description field", has_desc,
                 "present" if has_desc else "missing")

    # Check 3: Required sections
    for section in REQUIRED_SECTIONS:
        pattern = re.compile(rf"^#+\s+.*{re.escape(section)}", re.MULTILINE | re.IGNORECASE)
        found = bool(pattern.search(content))
        result.check(f"Section: {section}", found,
                     "found" if found else "MISSING — required by skill structure")

    # Check 4: No placeholders remaining
    placeholders = re.findall(r"\[(?:PLACEHOLDER|TRIGGER|OUTPUT|Step \d+|Fixed truth|What changes|"
                              r"Name|hard constraint|Gate condition|Instructions)\]", content)
    result.check("No placeholders remaining", len(placeholders) == 0,
                 f"{len(placeholders)} found" if placeholders else "clean")

    # Check 5: Line count
    line_count = len(lines)
    result.check(f"Line count under {MAX_LINES}", line_count <= MAX_LINES,
                 f"{line_count} lines")

    # Check 6: Description contains trigger language
    desc = fm.get("description", "")
    trigger_words = ["trigger", "when", "user", "request", "activate", "invoke"]
    has_trigger = any(w in desc.lower() for w in trigger_words)
    result.check("Description contains trigger condition", has_trigger,
                 "trigger language found" if has_trigger else "description may not clearly state when to activate")

    # Check 7: At least one Go/No-Go gate
    go_nogo = re.findall(r"Go/No-Go", content, re.IGNORECASE)
    result.check("Go/No-Go gate exists", len(go_nogo) > 0,
                 f"{len(go_nogo)} gates found")

    # Check 8: Constants block not empty
    const_match = re.search(r"## Constants.*?\n(.*?)(?=\n## |\Z)", content, re.DOTALL)
    if const_match:
        const_content = const_match.group(1).strip()
        const_has_items = bool(re.search(r"^\d+\.", const_content, re.MULTILINE))
        result.check("Constants block has entries", const_has_items,
                     "entries found" if const_has_items else "block appears empty")
    else:
        result.check("Constants block has entries", False, "section not found")

    # Check 9: Rules block not empty
    rules_match = re.search(r"## Rules.*?\n(.*?)(?=\n## |\n---|\Z)", content, re.DOTALL)
    if rules_match:
        rules_content = rules_match.group(1).strip()
        rules_has_items = bool(re.search(r"^- Never", rules_content, re.MULTILINE))
        result.check("Rules block has entries", rules_has_items,
                     "boundaries found" if rules_has_items else "block appears empty — must have 'Never' constraints")
    else:
        result.check("Rules block has entries", False, "section not found")

    # Check 10: No reference file content duplicated in SKILL.md
    refs_dir = skill_dir / "references"
    if refs_dir.exists():
        for ref_file in refs_dir.glob("*.md"):
            ref_content = ref_file.read_text().strip()
            if ref_content and len(ref_content) > 100:
                # Check for any 50+ char substring match
                chunk_size = 50
                duplicated = False
                for i in range(0, len(ref_content) - chunk_size, chunk_size):
                    chunk = ref_content[i:i + chunk_size]
                    if chunk in content:
                        duplicated = True
                        break
                result.check(f"No duplication: {ref_file.name}", not duplicated,
                             "content duplicated in SKILL.md" if duplicated else "clean")

    return result


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python quick_validate.py <skill-name>")
        print("  Example: python quick_validate.py pdf-converter")
        sys.exit(1)

    skill_name = sys.argv[1]
    print(f"Validating: skills/{skill_name}/")
    print()

    result = validate_skill(skill_name)
    print(result.report())

    if result.all_passed:
        print("\n  SKILL VALIDATED — ready for delivery.")
        sys.exit(0)
    else:
        print("\n  SKILL NOT READY — fix failures and re-validate.")
        sys.exit(1)
