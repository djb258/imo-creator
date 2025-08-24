#!/usr/bin/env bash
set -euo pipefail
TRACE="${BMAD_TRACE_ID:-}"
if [[ -z "$TRACE" ]]; then TRACE=$(ls -t logs/bmad/*.json 2>/dev/null | head -n1 | xargs -I{} basename {} .json || true); fi
if [[ -z "$TRACE" ]]; then echo "[BMAD] No traces found."; exit 1; fi
JSON="logs/bmad/${TRACE}.json"
OUT="logs/bmad/${TRACE}.out"; ERR="logs/bmad/${TRACE}.err"
echo "===== BMAD ANALYZE ($TRACE) ====="
test -f "$JSON" && cat "$JSON" || echo "No JSON."
echo "----- recent stderr (tail -80) -----"; test -f "$ERR" && tail -80 "$ERR" || echo "(none)"
echo "----- recent stdout (tail -80) -----"; test -f "$OUT" && tail -80 "$OUT" || echo "(none)"
# simple pattern surfacing
echo "----- error summary -----"; (grep -nE 'ERROR|Error|Exception|Traceback' "$ERR" "$OUT" || true) | tail -50
exit 0