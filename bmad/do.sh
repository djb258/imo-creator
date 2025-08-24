#!/usr/bin/env bash
set -euo pipefail
ACTION="${1:-help}"; shift || true
TRACE="${BMAD_TRACE_ID:-BMAD-$(date +%s)-$RANDOM}"
SNAPDIR=".bmad_snapshot"; mkdir -p "$SNAPDIR"
case "$ACTION" in
  snapshot)
    git rev-parse HEAD > "$SNAPDIR/$TRACE.sha"
    echo "snapshot_sha=$(cat $SNAPDIR/$TRACE.sha) trace=$TRACE"
    ;;
  rollback)
    # Roll back to latest snapshot (or specific trace via ARGS=TRACE_ID)
    TARGET="${1:-}"
    if [[ -z "$TARGET" ]]; then TARGET=$(ls -t $SNAPDIR/*.sha | head -n1 | xargs -I{} basename {} .sha); fi
    test -f "$SNAPDIR/$TARGET.sha" || { echo "No snapshot for $TARGET"; exit 1; }
    SHA=$(cat "$SNAPDIR/$TARGET.sha")
    git reset --hard "$SHA"
    echo "Rolled back to $SHA (trace=$TARGET)"
    ;;
  apply)
    # reserved hook: apply fix scripts or codegen patches if present
    echo "[BMAD] apply step placeholder; run your patch command here."
    ;;
  *) echo "Usage: ./bmad/do.sh [snapshot|rollback|apply]"; exit 2 ;;
esac