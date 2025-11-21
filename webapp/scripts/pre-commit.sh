#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Run lint and type-check in parallel
npm run lint &
LINT_PID=$!

npm run type-check &
TYPE_CHECK_PID=$!

# Wait for both processes and capture their exit codes
wait $LINT_PID
LINT_EXIT=$?

wait $TYPE_CHECK_PID
TYPE_CHECK_EXIT=$?

# Check if any process failed
if [ $LINT_EXIT -ne 0 ] || [ $TYPE_CHECK_EXIT -ne 0 ]; then
  echo "❌ Pre-commit checks failed!"
  exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
