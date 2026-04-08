#!/bin/sh
# Pre-Commit Hook — NFSMIS
# Runs quality gates before every commit

echo "🔍 Running type-check..."
yarn typecheck
if [ $? -ne 0 ]; then
  echo "❌ BLOCKED: TypeScript errors found. Fix before committing."
  exit 1
fi

echo "🔍 Running lint..."
yarn lint
if [ $? -ne 0 ]; then
  echo "❌ BLOCKED: ESLint errors found. Fix before committing."
  exit 1
fi

# Block .env files from being committed
if git diff --cached --name-only | grep -qE "^\.env(\.local)?$"; then
  echo "❌ BLOCKED: .env or .env.local is staged. Remove from staging."
  exit 1
fi

# Warn on potential hardcoded secrets
if git diff --cached -U0 | grep -qiE "(password|secret|token|api_key)\s*[:=]\s*['\"][^'\"]+['\"]"; then
  echo "⚠️  WARNING: Possible hardcoded secret detected. Please review staged changes."
fi

echo "✅ All pre-commit checks passed."
exit 0
