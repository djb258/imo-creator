#!/bin/bash

set -euo pipefail

# Enforce snake_case and optional doctrine_ prefix for doctrine/global-config docs

fail=0

changed_files=$(git diff --cached --name-only)

for f in $changed_files; do
  base=$(basename "$f")

  # Disallow uppercase letters in filenames
  if [[ "$base" =~ [A-Z] ]]; then
    echo "❌ Naming violation: $f contains uppercase letters. Use snake_case."
    fail=1
  fi

  # Enforce doctrine_ prefix for known doctrine docs
  if [[ "$f" =~ (^|/)ctb/docs/(global-config|doctrine)/ ]] || [[ "$f" =~ (^|/)docs/doctrine/ ]]; then
    if [[ "$base" =~ ^(.*\.(md|yaml|yml))$ ]]; then
      if [[ ! "$base" =~ ^doctrine_ ]]; then
        echo "❌ Naming violation: $f should start with 'doctrine_' (e.g., doctrine_ctb.md)."
        fail=1
      fi
    fi
  fi

  # Block legacy names if encountered
  if [[ "$base" =~ ^(CTB_DOCTRINE\.md|ACRONYMS\.md|SYSTEM_MANIFEST\.yaml|ORBT_GUIDE\.md)$ ]]; then
    echo "❌ Legacy filename detected: $f. Rename to standardized 'doctrine_<topic>.*' format."
    fail=1
  fi
done

if [[ $fail -ne 0 ]]; then
  echo "\n🔒 Commit blocked by file naming policy."
  echo "Rename files to snake_case and use 'doctrine_<topic>.*' where applicable."
  exit 1
fi

exit 0


