# BMAD (Break / Measure / Analyze / Do) with HEIR/ORBT Integration

## Quick Start

### Measured Runs
- Start a measured run: `BMAD_TRACE_ID=BMAD-<id> make bmad-bench CMD="npm test"`
- Analyze last run: `BMAD_TRACE_ID=BMAD-<id> make bmad-analyze`
- Run with HEIR context:
  ```bash
  PROCESS_ID=IMO-2024-01-SYSTEM-MODE-V1 \
  BLUEPRINT_ID=imo-creator \
  AGENT_ID=claude-code \
  BMAD_TRACE_ID=BMAD-12345 \
  make bmad-bench CMD="npm test"
  ```

### Snapshot & Rollback
- Snapshot before patch: `BMAD_TRACE_ID=BMAD-<id> make bmad-do ACTION=snapshot`
- Rollback to snapshot: `make bmad-do ACTION=rollback`
- Apply fixes: `make bmad-do ACTION=apply`

## HEIR/ORBT Compliance

### Required Fields
All BMAD traces must include (enforced by policy):
- `trace_id` - Unique trace identifier
- `process_id` - Process/VIN identifier (IMO format preferred)
- `blueprint_id` - Blueprint being executed
- `agent_id` - Agent performing the action
- `duration_s` - Execution duration in seconds
- `exit_code` - Process exit code
- `ts` - ISO timestamp

### VIN Format
When using IMO VIN format for process_id:
```
IMO-YYYY-MM-SYSTEM-MODE-VN
```
Example: `IMO-2024-01-FACTORY-PROD-V1`

## Git Hooks (HEIR/ORBT Enforced)

### Commit Message
- Must include `BMAD_TRACE_ID=...` in commit body
- Example: `feat: add feature BMAD_TRACE_ID=BMAD-12345`

### Atomic Fixes
- Maximum 3 files per commit (HEIR atomic fix policy)
- Override with: `BMAD_ALLOW_MULTI=1 git commit`

### Pre-push Validation
- Ensures BMAD trace exists for the commit
- Validates HEIR/ORBT compliance

## Environment Variables

### Core BMAD
- `BMAD_ENABLED=0` - Disable BMAD wrapper
- `BMAD_TRACE_ID` - Current trace ID
- `BMAD_ALLOW_MULTI=1` - Allow >3 files in commit

### HEIR/ORBT Context
- `PROCESS_ID` - Process/VIN identifier
- `BLUEPRINT_ID` - Blueprint being executed
- `AGENT_ID` - Agent performing action
- `HEIR_STRICT=0` - Make policy warn-only

### Factory/Garage Integration
- `FACTORY_HEALTH_REQUIRED=1` - Enforce factory health gate
- `GARAGE_SCAN_ON_PUSH=1` - Run garage scan before push

## CI/CD Integration

### GitHub Actions
The BMAD workflow automatically:
1. Runs Factory health checks (HEIR requirement)
2. Measures baseline performance
3. Compares with head branch
4. Enforces <10% regression limit
5. Validates HEIR/ORBT policy compliance
6. Uploads traces as artifacts

### Performance Regression
- Baseline comparison on every PR
- Maximum 10% regression allowed
- Override with `MAX_REG_PCT` environment variable

## Troubleshooting

### Common Issues

1. **"Missing BMAD_TRACE_ID in commit"**
   - Add `BMAD_TRACE_ID=BMAD-xxxxx` to commit message
   
2. **"Too many files in one fix"**
   - Keep commits atomic (≤3 files)
   - Or use: `BMAD_ALLOW_MULTI=1 git commit`
   
3. **"No BMAD log for trace"**
   - Run: `make bmad-bench CMD="npm test"`
   - This generates the required trace log

4. **"HEIR policy failure"**
   - Check missing fields with: `make bmad-analyze`
   - Ensure all required fields are present
   - Use `HEIR_STRICT=0` for warn-only mode

### Log Locations
- Daily logs: `logs/bmad/YYYY-MM-DD.log`
- Trace JSON: `logs/bmad/BMAD-xxxxx.json`
- Stdout: `logs/bmad/BMAD-xxxxx.out`
- Stderr: `logs/bmad/BMAD-xxxxx.err`

## Advanced Usage

### Custom Breaklist Targets
Edit `bmad/breaklist.yaml` to add custom test targets:
```yaml
targets:
  - name: custom.check
    cmd: "npm run custom:test"
```

### Middleware Integration
For Next.js APIs, wrap handlers with BMAD logger:
```typescript
import { withBmad } from '@/middleware/bmadLogger'

export default withBmad(async (req, res) => {
  // Your API logic
})
```

### Python Integration
```python
import os
os.environ['BMAD_TRACE_ID'] = 'BMAD-12345'
os.environ['PROCESS_ID'] = 'IMO-2024-01-PY-TEST-V1'
os.system('./bmad/measure.sh python script.py')
```

## HEIR/ORBT Policy Files
- Main policy: `heir/policy_bmad.yaml`
- Validation script: `scripts/heir_bmad_check.py`
- Factory integration: `factory/spec.yaml`
- Garage health: `health.json`

## Lanes & thresholds
- `risk:high` label => perf drift max 2%
- `risk:default` (no label) => 5%
- `risk:low` => 10%
## Escape hatches
- `BMAD_MODE=refactor` raises file cap in pre-commit but still requires tests and BMAD trace.
- `BMAD_ALLOW_MULTI=1` explicit override (logged by hooks).
- `BMAD_BYPASS=1` (owners only): CI requires "postmortem" label on PR.
## Commit template
Run once: `git config commit.template .gitmessage`