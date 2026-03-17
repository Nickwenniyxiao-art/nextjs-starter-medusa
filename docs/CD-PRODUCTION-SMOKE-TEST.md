# Production Smoke Test (Frontend)

This document defines the post-deployment smoke checks executed by `.github/workflows/cd-production.yml`.

## Purpose

- Verify the production storefront is reachable after deployment.
- Verify the homepage returns renderable HTML.
- Fail fast in CI/CD if production health degrades right after release.

## Workflow Job

`smoke-test-production` runs after `deploy-production` and performs:

1. **Stabilization wait**: sleep 30 seconds.
2. **Health check**: retry `curl` up to 5 times (10-second interval), expecting HTTP 200.
3. **Page smoke test**: fetch homepage HTML and validate `</html>` exists.

## Target URL

The checks use:

- `secrets.PRODUCTION_FRONTEND_URL` when provided.
- Fallback: `https://nordhjem.com`.

## Failure Behavior

If either check fails, the job exits non-zero and the workflow run is marked failed.
