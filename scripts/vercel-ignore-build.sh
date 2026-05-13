#!/bin/bash

# Vercel Ignored Build Step Script
# This script determines whether Vercel should skip a build.
# - Exit code 1: Proceed with the build
# - Exit code 0: Skip the build

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "features" ]]; then
  # Skip build for the 'features' branch as requested
  echo "🛑 - Build cancelled for 'features' branch (Integration Branch)"
  exit 0;
else
  # Proceed with the build for other branches (main, feature/*, etc.)
  echo "✅ - Build can proceed"
  exit 1;
fi
