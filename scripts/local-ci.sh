#!/bin/bash

# Local CI Test Script
# Runs the same checks that GitHub Actions runs in the CI pipeline
# Usage: ./scripts/local-ci.sh

set -e

echo "🚀 Running local CI checks..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any step failed
FAILED=0

# Function to run a check
run_check() {
  local name=$1
  local command=$2
  local dir=$3
  
  echo -e "${YELLOW}▶ $name${NC}"
  
  if [ -n "$dir" ]; then
    (cd "$dir" && eval "$command")
  else
    eval "$command"
  fi
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $name passed${NC}\n"
  else
    echo -e "${RED}✗ $name failed${NC}\n"
    FAILED=1
  fi
}

# Backend checks
echo -e "${YELLOW}=== Backend Checks ===${NC}\n"

run_check "Backend: Install dependencies" "npm ci" "./backend"
run_check "Backend: Lint code" "npm run lint" "./backend"
run_check "Backend: TypeScript build" "npm run build" "./backend"

# Frontend checks
echo -e "${YELLOW}=== Frontend Checks ===${NC}\n"

run_check "Frontend: Install dependencies" "npm ci" "./frontend"
run_check "Frontend: Lint code" "npm run lint --if-present" "./frontend"
run_check "Frontend: TypeScript build" "npm run build" "./frontend"
run_check "Frontend: Tests" "npm test -- --watchAll=false --passWithNoTests --coverage" "./frontend"

# Docker checks (optional - requires Docker)
echo -e "${YELLOW}=== Docker Checks (Optional) ===${NC}\n"

if command -v docker &> /dev/null; then
  run_check "Docker: Build backend image" "docker build -t nom-nom-backend:test ." "./backend"
  run_check "Docker: Build frontend image" "docker build -t nom-nom-frontend:test ." "./frontend"
else
  echo -e "${YELLOW}⊘ Docker not installed, skipping Docker checks${NC}\n"
fi

# Final summary
echo -e "${YELLOW}=== Summary ===${NC}\n"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo "Ready to push to GitHub! 🎉"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please fix the errors above.${NC}"
  echo ""
  echo "Tips:"
  echo "  • Backend lint issues: cd backend && npm run lint:fix"
  echo "  • Frontend lint issues: cd frontend && npm run lint --if-present"
  echo ""
  exit 1
fi
