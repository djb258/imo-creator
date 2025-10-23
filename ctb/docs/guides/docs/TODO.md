# TODO

## Factory (New Builds)
- [x] Factory init scaffolds new app with .env.example + logging shim
- [ ] Integrate compliance checks into factory workflow
- [ ] Add garage-MCP orchestration to factory builds
- [ ] Auto-generate blueprint documentation

## Mechanic (Recalls/Repairs)
- [x] Mechanic recall injects .env.example + shim into existing repo (no secrets)
- [x] Compliance heartbeat system for monitoring
- [ ] Integrate HEIR error handling into recall workflow
- [ ] Add subagent delegation for complex repairs

## Environment & Configuration
- [x] Env check warns on missing placeholders or drift from schema
- [ ] Validate against Vercel/Render deployment configs
- [ ] Auto-sync environment requirements across repos

## Monitoring & Health
- [x] Each app exposes /health endpoint
- [x] Master error log endpoint integration
- [ ] Centralized compliance dashboard
- [ ] Auto-update notifications

## Integration Points
- [x] Garage-MCP orchestration system
- [x] HEIR altitude-based coordination
- [x] IMO Creator compliance tools
- [ ] Repo-Lens UI picker integration