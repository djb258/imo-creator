#!/usr/bin/env bash
set -euo pipefail
yq() { python3 - <<'PY' "$1" "$2"; PY
import sys, yaml, json
doc=yaml.safe_load(open(sys.argv[1]))
keys=sys.argv[2].split('.')
for k in keys: doc=doc[k]
print(json.dumps(doc))
PY
}
SC="bmad/scenarios.yaml"
COUNT=$(python3 - <<PY
import yaml,sys; print(len(yaml.safe_load(open("bmad/scenarios.yaml"))["scenarios"]))
PY
)
for i in $(seq 0 $((COUNT-1))); do
  name=$(python3 - <<PY
import yaml; d=yaml.safe_load(open("bmad/scenarios.yaml")); print(d["scenarios"][${i}]["name"])
PY
)
  runs=$(python3 - <<PY
import yaml; d=yaml.safe_load(open("bmad/scenarios.yaml")); print(d["scenarios"][${i}]["runs"])
PY
)
  cmd=$(python3 - <<PY
import yaml; d=yaml.safe_load(open("bmad/scenarios.yaml")); print(d["scenarios"][${i}]["cmd"])
PY
)
  for n in $(seq 1 $runs); do
    echo "[BMAD] scenario=$name run=$n"
    BMAD_TRACE_ID="BMAD-${name}-$(date +%s)-$RANDOM" ./bmad/measure.sh bash -lc "$cmd"
  done
done