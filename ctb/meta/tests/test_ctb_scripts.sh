#!/bin/bash
# # CTB Metadata
# # Generated: 2025-10-23T14:32:39.269625
# # CTB Version: 1.3.3
# # Division: Configuration & Tests
# # Category: tests
# # Compliance: 90%
# # HEIR ID: HEIR-2025-10-MET-TESTS-01


###############################################################################
# CTB Doctrine v1.3 - Bash Script Testing
# Purpose: Test enforcement and security scripts for compliance
# Usage: bash tests/test_ctb_scripts.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

test_pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
  ((TESTS_PASSED++))
}

test_fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
  ((TESTS_FAILED++))
}

echo "🧪 CTB Script Testing Suite"
echo "================================"
echo ""

# Test 1: CTB enforce script exists and is executable
echo "Test 1: CTB enforce script executable"
if [ -x "global-config/scripts/ctb_enforce.sh" ]; then
  test_pass "ctb_enforce.sh is executable"
else
  test_fail "ctb_enforce.sh not executable"
fi

# Test 2: Security lockdown script exists and is executable
echo "Test 2: Security lockdown script executable"
if [ -x "global-config/scripts/security_lockdown.sh" ]; then
  test_pass "security_lockdown.sh is executable"
else
  test_fail "security_lockdown.sh not executable"
fi

# Test 3: CTB enforce runs without errors (dry run)
echo "Test 3: CTB enforce runs successfully"
if bash global-config/scripts/ctb_enforce.sh > /dev/null 2>&1; then
  test_pass "ctb_enforce.sh runs without errors"
else
  test_fail "ctb_enforce.sh failed to run"
fi

# Test 4: Security lockdown creates log file
echo "Test 4: Security lockdown creates audit log"
if bash global-config/scripts/security_lockdown.sh > /dev/null 2>&1 && [ -f "logs/security_audit.log" ]; then
  test_pass "security_lockdown.sh creates audit log"
else
  test_fail "security_lockdown.sh did not create audit log"
fi

# Test 5: CTB enforce checks required branches
echo "Test 5: CTB enforce validates required branches"
if bash global-config/scripts/ctb_enforce.sh 2>&1 | grep -q "sys/chartdb"; then
  test_pass "ctb_enforce.sh checks for sys/chartdb"
else
  test_fail "ctb_enforce.sh missing sys/chartdb check"
fi

# Test 6: CTB enforce checks doctrine IDs
echo "Test 6: CTB enforce validates doctrine IDs"
if bash global-config/scripts/ctb_enforce.sh 2>&1 | grep -q "04.04.07"; then
  test_pass "ctb_enforce.sh validates doctrine IDs"
else
  test_fail "ctb_enforce.sh missing doctrine ID validation"
fi

# Test 7: Security lockdown detects forbidden files
echo "Test 7: Security lockdown file detection"
if bash global-config/scripts/security_lockdown.sh 2>&1 | grep -q "Scanning for forbidden"; then
  test_pass "security_lockdown.sh scans for forbidden files"
else
  test_fail "security_lockdown.sh missing file scan"
fi

# Test 8: All scripts have proper shebangs
echo "Test 8: Scripts have proper shebangs"
SHEBANG_OK=true
for script in global-config/scripts/*.sh; do
  if [ -f "$script" ]; then
    if ! head -1 "$script" | grep -q "^#!/bin/bash"; then
      SHEBANG_OK=false
      break
    fi
  fi
done
if [ "$SHEBANG_OK" = true ]; then
  test_pass "All scripts have proper shebangs"
else
  test_fail "Some scripts missing proper shebangs"
fi

# Summary
echo ""
echo "================================"
echo "Test Summary:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
