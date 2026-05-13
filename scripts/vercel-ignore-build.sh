#!/bin/bash

# Vercel Ignored Build Step Script
# This script determines whether Vercel should skip a build.
# - Exit code 1: Proceed with the build
# - Exit code 0: Skip the build

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  # Proceed with the build only for the 'main' branch
  echo "✅ - Build can proceed (Production branch: main)"
  exit 1;
else
  # Skip build for all other branches (features, feature/*, etc.)
  echo "🛑 - Build cancelled for '$VERCEL_GIT_COMMIT_REF' branch"
  exit 0;
fi
