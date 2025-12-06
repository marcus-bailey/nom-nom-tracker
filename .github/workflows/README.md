# GitHub Actions Workflows Guide

This directory contains the GitHub Actions CI/CD pipelines for the Nom Nom Tracker project.

## Workflows

### 1. **ci.yml** - Main CI Pipeline ⚙️
**Triggers:** Push to `main` or `develop`, Pull requests

**Jobs:**
- **Backend**: Linting, TypeScript type checking, and build compilation
- **Frontend**: Linting, TypeScript type checking, build, tests, and coverage reporting
- **Docker**: Builds Docker images without pushing
- **CI Status**: Summary job that ensures all checks pass

**Key Features:**
- Multi-version Node.js testing (18.x, 20.x)
- Dependency caching for faster builds
- ESLint configuration for backend code quality
- Frontend test coverage reporting (via Codecov)
- Docker image caching using GitHub Actions Cache

### 2. **publish-docker.yml** - Docker Registry Publishing 🐳
**Triggers:** Pushes to `main` or semantic version tags (e.g., `v1.0.0`)

**Publishes to:** GitHub Container Registry (ghcr.io)

**Features:**
- Automatic tagging based on branch/tag
- Builds both backend and frontend images
- Uses GitHub Actions cache for faster builds
- Requires `GITHUB_TOKEN` (automatic)

**Usage:**
```bash
# Push images for main branch
git push origin main

# Push images with version tag
git tag v1.0.0
git push origin v1.0.0
```

### 3. **deploy-staging.yml** - Staging Deployment 🚀
**Triggers:** Successful CI pipeline on `main` branch

**Purpose:** Template for deploying to staging environment after CI passes

**Note:** This is a template. Add your specific deployment steps:
- Docker registry deploys
- Kubernetes deployments
- Infrastructure provisioning
- Smoke tests
- Notifications (Slack, Discord, etc.)

## Setup Instructions

### 1. Prerequisites
- GitHub repository set up with this project
- Docker Dockerfile in `backend/` and `frontend/`
- `package.json` files in both directories (already in place)

### 2. Enable GitHub Actions
1. Go to your GitHub repository
2. Click "Settings" → "Actions" → "General"
3. Ensure "Actions permissions" is set to allow workflows

### 3. Configure Codecov (Optional)
For frontend coverage reporting:
1. Go to [codecov.io](https://codecov.io)
2. Sign up with GitHub
3. Enable coverage for your repository
4. The workflow will automatically upload coverage reports

### 4. Deploy Staging Workflow (Optional)
Edit `deploy-staging.yml` to add your deployment commands:
```yaml
- name: Deploy to staging
  run: |
    # Your deployment script here
    echo "Deploying to staging..."
```

### 5. Publish Docker Workflow (Optional)
To use Docker publishing:
1. Ensure GitHub Container Registry is enabled
2. The workflow uses the auto-generated `GITHUB_TOKEN`
3. Images are pushed to `ghcr.io/username/repo-name`

## GitHub Actions vs GitLab CI

### Key Differences You'll Notice

| Feature | GitLab CI | GitHub Actions |
|---------|-----------|---|
| **Config location** | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| **Job definition** | `stages:`, `script:` | `jobs:`, `steps:`, `run:` |
| **Parallel jobs** | Implicit with stages | Explicit `needs:` keyword |
| **Caching** | `cache:` key | `actions/setup-node@v4` with `cache:` |
| **Artifacts** | `artifacts:` → download | Upload/download as separate steps |
| **Variables** | `variables:` | `env:` or `${{ secrets.VAR }}` |
| **Matrix/Parallel** | `parallel:` | `strategy.matrix:` |
| **Runners** | Self-hosted/GitLab runners | GitHub-hosted + self-hosted options |
| **Docker registry** | GitLab Container Registry | GitHub Container Registry (ghcr.io) |

### Syntax Comparison

**GitLab CI:**
```yaml
test:
  stage: test
  script:
    - npm install
    - npm run test
  cache:
    paths:
      - node_modules/
```

**GitHub Actions:**
```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        cache: 'npm'
    - run: npm ci
    - run: npm run test
```

## Common Tasks

### View Workflow Runs
1. Go to your GitHub repository
2. Click "Actions" tab
3. See all workflow runs and their status

### Check a Specific Workflow
Click on a workflow run to see:
- Timing for each job
- Detailed logs for each step
- Artifacts (if any)
- Failed step details

### Re-run a Workflow
1. Click on a failed workflow run
2. Click "Re-run jobs" or "Re-run all jobs"
3. Workflow will execute again with the same code

### Debug a Workflow
1. Click the workflow run
2. Expand failed job
3. Check the logs for error messages
4. Make fixes locally
5. Push changes to trigger workflow again

## Troubleshooting

### Backend Lint Failures
```bash
# Fix linting issues locally
cd backend
npm run lint:fix
```

### Frontend Test Failures
```bash
# Run tests locally with coverage
cd frontend
npm test -- --watchAll=false --coverage
```

### Docker Build Failures
1. Check `Dockerfile` syntax
2. Verify all referenced files exist
3. Check for Docker layer caching issues

### Workflow Not Triggering
- Check branch name matches (main/develop)
- Ensure workflow file is in default branch
- Check "Actions" settings are enabled

## Next Steps

1. **Commit these workflows** to your `main` branch
2. **Push to GitHub** to trigger the CI pipeline
3. **Monitor the Actions tab** to see workflows run
4. **Customize as needed** based on your deployment strategy

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/guides)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Codecov Action](https://github.com/codecov/codecov-action)
