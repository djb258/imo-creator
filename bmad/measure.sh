#!/usr/bin/env bash
set -euo pipefail
if [[ "${BMAD_ENABLED:-1}" == "0" ]]; then echo "[BMAD] disabled"; "$@"; exit $?; fi
mkdir -p logs/bmad
TRACE="${BMAD_TRACE_ID:-BMAD-$(date +%s)-$RANDOM}"
PROC="${PROCESS_ID:-unknown}"
BLUE="${BLUEPRINT_ID:-unknown}"
AGENT="${AGENT_ID:-unknown}"
START=$(date +%s)
OUT="logs/bmad/${TRACE}.out"; ERR="logs/bmad/${TRACE}.err"
CHANGE_HASH="$(git diff --staged --quiet || git diff --staged | sha256sum | cut -d' ' -f1)"
"$@" > >(tee -a "$OUT") 2> >(tee -a "$ERR" >&2) || true
EXIT=$?
END=$(date +%s); DUR=$((END-START))
DAYLOG="logs/bmad/$(date +%F).log"
TS="$(date -Is)"
printf '{"stamp":"BMAD","trace_id":"%s","process_id":"%s","blueprint_id":"%s","agent_id":"%s","change_hash":"%s","duration_s":%s,"exit_code":%s,"ts":"%s"}\n' "$TRACE" "$PROC" "$BLUE" "$AGENT" "${CHANGE_HASH:-none}" "$DUR" "$EXIT" "$TS" | tee -a "$DAYLOG" > "logs/bmad/${TRACE}.json"
echo "BMAD_TRACE_ID=$TRACE duration_s=$DUR exit=$EXIT"
# BMAD log forwarder
if [[ -n "${BMAD_LOG_ENDPOINT:-}" && -f "logs/bmad/${TRACE}.json" ]]; then
  (curl -sS -X POST -H "Content-Type: application/json" --data-binary @logs/bmad/${TRACE}.json "$BMAD_LOG_ENDPOINT" || true) &
fi
exit 0