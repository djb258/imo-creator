<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.995931
# CTB Version: 1.3.3
# Division: Documentation
# Category: guides
# Compliance: 70%
# HEIR ID: HEIR-2025-10-DOC-GUIDES-01

-->

# CTB Troubleshooting Guide

Quick reference for resolving common issues with the CTB Doctrine system.

---

## 🚀 Quick Start Issues

### "npm install" or "pnpm install" Fails

**Symptoms:**
- Dependency resolution errors
- Network timeouts
- Permission denied errors

**Solutions:**

1. **Clear package manager cache:**
   ```bash
   # For npm
   npm cache clean --force

   # For pnpm
   pnpm store prune
   ```

2. **Delete lockfiles and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json pnpm-lock.yaml
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Should be >= 18.x
   ```

4. **Use the dev setup script:**
   ```bash
   bash global-config/scripts/dev_setup.sh
   ```

---

### "pip install" Fails (Python Dependencies)

**Symptoms:**
- Package not found errors
- Compilation failures
- Version conflicts

**Solutions:**

1. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

2. **Use virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

3. **Install system dependencies (Ubuntu/Debian):**
   ```bash
   sudo apt-get update
   sudo apt-get install python3-dev build-essential
   ```

---

### Docker Not Running

**Symptoms:**
- "Cannot connect to Docker daemon"
- `docker-compose up` fails
- Container startup errors

**Solutions:**

1. **Start Docker:**
   ```bash
   # Linux
   sudo systemctl start docker

   # Mac/Windows
   # Start Docker Desktop application
   ```

2. **Check Docker status:**
   ```bash
   docker ps
   docker version
   ```

3. **Reset Docker (if corrupted):**
   ```bash
   docker system prune -a
   docker volume prune
   ```

---

## 🔍 CTB Enforcement Issues

### CTB Enforcement Fails: Missing Branches

**Error:**
```
❌ ERROR: Required branch 'sys/chartdb' not found
CTB_ENFORCEMENT_FAILURE
```

**Solutions:**

1. **Run initialization script:**
   ```bash
   bash global-config/scripts/ctb_init.sh
   ```

2. **Manually create missing branches:**
   ```bash
   git checkout -b sys/chartdb
   git push -u origin sys/chartdb

   # Repeat for other missing branches
   ```

3. **Update from imo-creator (if in different repo):**
   ```bash
   bash global-config/scripts/update_from_imo_creator.sh
   ```

---

### CTB Enforcement Fails: MCP Tools Not Registered

**Error:**
```
❌ ERROR: Required tool 'ChartDB' not found in registry
Doctrine ID: 04.04.07 missing
```

**Solutions:**

1. **Check MCP registry:**
   ```bash
   cat config/mcp_registry.json | grep "04.04.07"
   ```

2. **Re-run enforcement to see what's missing:**
   ```bash
   bash global-config/scripts/ctb_enforce.sh
   ```

3. **Manually add tool to registry:**
   - Edit `config/mcp_registry.json`
   - Add missing tool with correct doctrine_id
   - Validate JSON syntax

4. **Pull latest from master:**
   ```bash
   git pull origin master
   ```

---

### CTB Enforcement Fails: Empty Branches

**Error:**
```
⚠️  WARNING: Branch 'sys/activepieces' exists but appears empty
```

**Solutions:**

1. **Checkout branch and verify:**
   ```bash
   git checkout sys/activepieces
   ls -la
   ```

2. **Add required files:**
   - Each sys/* branch should have at least a README.md
   - sys/claude-skills requires claude.skills.md and claude.manifest.json

3. **Re-run enforcement:**
   ```bash
   bash global-config/scripts/ctb_enforce.sh
   ```

---

## 🔒 Security Lockdown Issues

### Security Scan Fails: .env File Detected

**Error:**
```
❌ Security violation: .env detected in repository
SECURITY_LOCKDOWN_TRIGGERED
```

**Solutions:**

1. **Remove .env file:**
   ```bash
   git rm .env .env.local .env.*
   git commit -m "🔒 Security: Remove forbidden .env files"
   ```

2. **Move secrets to MCP vault:**
   ```bash
   # Add secrets via Composio MCP server
   curl -X POST http://localhost:3001/vault/set \
     -H "Content-Type: application/json" \
     -d '{"key": "YOUR_SECRET_KEY", "value": "your-secret-value"}'
   ```

3. **Update code to use MCP variables:**
   ```typescript
   // Replace:
   const apiKey = process.env.API_KEY;

   // With:
   const apiKey = await mcp.getVariable('API_KEY');
   ```

4. **Re-run security scan:**
   ```bash
   bash global-config/scripts/security_lockdown.sh
   ```

---

### Security Scan Fails: Hardcoded Secrets

**Error:**
```
❌ Hardcoded secret detected in: src/config.ts
Line 15: const apiKey = "sk_live_abc123"
```

**Solutions:**

1. **Remove hardcoded value:**
   ```typescript
   // Before:
   const apiKey = "sk_live_abc123";

   // After:
   const apiKey = await mcp.getVariable('STRIPE_SECRET_KEY');
   ```

2. **Add secret to MCP vault:**
   ```bash
   curl -X POST http://localhost:3001/vault/set \
     -H "Content-Type: application/json" \
     -d '{"key": "STRIPE_SECRET_KEY", "value": "sk_live_abc123"}'
   ```

3. **Re-scan:**
   ```bash
   bash global-config/scripts/security_lockdown.sh
   ```

---

## 🌐 MCP Server Issues

### Composio MCP Server Not Running

**Error:**
```
curl: (7) Failed to connect to localhost port 3001: Connection refused
```

**Solutions:**

1. **Start MCP server:**
   ```bash
   cd "path/to/scraping-tool/imo-creator/mcp-servers/composio-mcp"
   npm install
   npm run dev
   ```

2. **Check if port 3001 is available:**
   ```bash
   # Linux/Mac
   lsof -i :3001

   # Windows
   netstat -ano | findstr :3001
   ```

3. **Kill process using port 3001:**
   ```bash
   # Linux/Mac
   kill -9 <PID>

   # Windows
   taskkill /PID <PID> /F
   ```

4. **Verify server health:**
   ```bash
   curl http://localhost:3001/mcp/health
   ```

---

### MCP Tool Call Fails: Invalid Payload

**Error:**
```
400 Bad Request: Missing required field 'unique_id'
```

**Solutions:**

1. **Use correct HEIR/ORBT payload format:**
   ```json
   {
     "tool": "ChartDB",
     "action": "GENERATE_SCHEMA_DIAGRAM",
     "data": { ... },
     "unique_id": "HEIR-2025-10-CHARTDB-001",
     "process_id": "PRC-SCHEMA-001",
     "orbt_layer": 1,
     "blueprint_version": "1.0"
   }
   ```

2. **Check MCP registry for tool name:**
   ```bash
   cat config/mcp_registry.json | jq '.engine_capabilities[].tool'
   ```

3. **Verify endpoint:**
   ```bash
   curl -X POST http://localhost:3001/tool \
     -H "Content-Type: application/json" \
     -d @test_payload.json
   ```

---

## 🧪 Testing Issues

### Pytest Not Found

**Error:**
```
bash: pytest: command not found
```

**Solutions:**

1. **Install pytest:**
   ```bash
   pip install pytest pytest-cov
   ```

2. **Use python -m pytest:**
   ```bash
   python -m pytest tests/
   ```

3. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   pytest
   ```

---

### Tests Fail: Coverage Below Threshold

**Error:**
```
FAILED: coverage: 45.2% is below minimum threshold 60%
```

**Solutions:**

1. **Run coverage report to see gaps:**
   ```bash
   pytest --cov=src --cov-report=html
   open htmlcov/index.html
   ```

2. **Add missing tests:**
   - Focus on uncovered modules first
   - Aim for critical path coverage

3. **Adjust threshold temporarily (not recommended):**
   - Edit `pytest.ini`
   - Change `--cov-fail-under=60` to lower value

---

### Bash Script Tests Fail

**Error:**
```
test_ctb_scripts.sh: line 23: ctb_enforce.sh: Permission denied
```

**Solutions:**

1. **Make scripts executable:**
   ```bash
   chmod +x global-config/scripts/*.sh
   chmod +x tests/*.sh
   ```

2. **Run with bash explicitly:**
   ```bash
   bash tests/test_ctb_scripts.sh
   ```

---

## 🏗️ Integration-Specific Issues

### ChartDB Not Accessible (Port 5173)

**Solutions:**

1. **Start ChartDB:**
   ```bash
   cd chartdb/
   npm install
   npm run dev
   ```

2. **Check if port is in use:**
   ```bash
   lsof -i :5173  # Linux/Mac
   netstat -ano | findstr :5173  # Windows
   ```

3. **Access UI:**
   ```
   http://localhost:5173
   ```

---

### Activepieces Not Starting (Port 80/8080)

**Solutions:**

1. **Use alternative port if 80 is privileged:**
   ```bash
   cd activepieces/
   PORT=8080 npm start
   ```

2. **Run with Docker:**
   ```bash
   cd activepieces/
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker logs activepieces
   ```

---

### Windmill Not Starting (Port 8000)

**Solutions:**

1. **Start Windmill:**
   ```bash
   cd windmill/
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker ps | grep windmill
   ```

3. **View logs:**
   ```bash
   docker logs windmill_server
   ```

---

### Anthropic Claude Skills: API Key Issues

**Error:**
```
401 Unauthorized: Invalid API key
```

**Solutions:**

1. **Set API key in MCP vault:**
   ```bash
   curl -X POST http://localhost:3001/vault/set \
     -H "Content-Type: application/json" \
     -d '{"key": "ANTHROPIC_API_KEY", "value": "sk-ant-your-key-here"}'
   ```

2. **Verify Anthropic is registered in Composio:**
   ```bash
   composio tools list | grep -i anthropic
   ```

3. **Check Composio logs:**
   ```bash
   # In composio-mcp directory
   tail -f logs/composio_mcp.log
   ```

---

## 📁 Git & GitHub Issues

### Branch Not Syncing to Remote

**Error:**
```
error: failed to push some refs to 'origin'
```

**Solutions:**

1. **Pull latest changes first:**
   ```bash
   git pull origin <branch-name>
   ```

2. **Force push (use cautiously):**
   ```bash
   git push -f origin <branch-name>
   ```

3. **Set upstream:**
   ```bash
   git push -u origin <branch-name>
   ```

---

### GitHub Actions Workflow Failing

**Error:**
```
CI: test_coverage.yml failed
```

**Solutions:**

1. **Check workflow logs:**
   - Go to GitHub → Actions tab
   - Click on failed workflow
   - Review job logs

2. **Run tests locally first:**
   ```bash
   pytest
   bash tests/test_ctb_scripts.sh
   ```

3. **Verify GitHub secrets are set:**
   - Settings → Secrets and variables → Actions
   - Ensure required secrets exist

---

## 🔧 Environment-Specific Issues

### Dev Container Won't Start

**Error:**
```
Failed to create dev container
```

**Solutions:**

1. **Rebuild container:**
   - VS Code: Command Palette → "Dev Containers: Rebuild Container"

2. **Check Docker resources:**
   - Ensure Docker has enough memory/CPU allocated
   - Docker Desktop → Settings → Resources

3. **Clear dev container cache:**
   ```bash
   docker system prune -a
   ```

---

### VS Code Extensions Not Installing

**Solutions:**

1. **Manually install recommended extensions:**
   - Open `.vscode/extensions.json`
   - Click "Install All" notification

2. **Install via CLI:**
   ```bash
   code --install-extension ms-python.python
   code --install-extension esbenp.prettier-vscode
   ```

3. **Check extension logs:**
   - View → Output → "Extensions" dropdown

---

## 🆘 Still Stuck?

If none of these solutions work:

1. **Check CTB Doctrine documentation:**
   ```bash
   cat global-config/CTB_DOCTRINE.md
   ```

2. **Review architecture guide:**
   ```bash
   cat docs/ARCHITECTURE.md
   ```

3. **Run full diagnostic:**
   ```bash
   bash global-config/scripts/dev_setup.sh
   bash global-config/scripts/ctb_enforce.sh
   bash global-config/scripts/security_lockdown.sh
   ```

4. **Create a GitHub issue:**
   - Use `.github/ISSUE_TEMPLATE/bug_report.md`
   - Include enforcement status and logs

---

**Last Updated:** 2025-10-18
**CTB Version:** 1.3.2
