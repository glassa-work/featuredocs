#!/bin/bash
set -euo pipefail

echo "=== Building Next.js static export ==="
npm run build

echo "=== Deploying to Firebase Hosting ==="
firebase deploy --only hosting

echo "=== Building and deploying Go API to Cloud Run ==="
cd api
gcloud builds submit --config=cloudbuild.yaml

echo "=== Done ==="
echo "Frontend: https://docs.tinykite.co"
echo "API: https://featuredocs-api-xxxxx.run.app"
