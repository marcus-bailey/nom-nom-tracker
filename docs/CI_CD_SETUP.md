# GitHub Actions CI/CD Setup Guide

Welcome! I've set up a complete GitHub Actions CI/CD pipeline for your Nom Nom Tracker project. Here's everything you need to know.

## 📋 What Was Created

### Workflow Files (`.github/workflows/`)

1. **ci.yml** - Main CI Pipeline
   - Runs on every push and pull request
   - Tests Node 18.x and 20.x
   - Lints, type-checks, builds, and tests your code
   - Publishes coverage reports
   - Builds Docker images

2. **publish-docker.yml** - Docker Publishing
   - Publishes to GitHub Container Registry
   - Triggered on main branch pushes and version tags
   - Automatically tags images with branch/version

3. **deploy-staging.yml** - Staging Deployment
   - Template for deploying after successful CI
   - Ready for you to customize

### Configuration Files

4. **backend/.eslintrc.json** - ESLint Configuration
   - TypeScript linting rules
   - Code quality standards
   - Consistent code style

5. **backend/.eslintignore** - ESLint Ignore File
   - Excludes node_modules, dist, etc.

### Helper Scripts

6. **scripts/local-ci.sh** - Local CI Runner
   - Run the same checks locally before pushing
   - Identifies issues early
   - Saves CI/CD pipeline time

7. **.github/workflows/README.md** - Detailed Documentation
   - Complete workflow documentation
   - Troubleshooting guide
   - GitHub Actions vs GitLab CI comparison

## 🚀 Getting Started

### Step 1: Install ESLint Dependencies (Backend)

```bash
cd backend
npm install
```

This installs ESLint and TypeScript plugin dependencies defined in your updated `package.json`.

### Step 2: Verify Local Setup

Run the local CI checks to make sure everything works:

```bash
./scripts/local-ci.sh
```

This will run:
- Backend: install, lint, build
- Frontend: install, lint, build, test
- Docker: build images (if Docker installed)

### Step 3: Commit and Push

```bash
git add .github/workflows backend/.eslint* scripts/local-ci.sh
git commit -m "feat: add GitHub Actions CI/CD pipeline"
git push origin main
```

### Step 4: Watch Your First Pipeline Run

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You should see your CI pipeline running
4. Wait for all checks to complete (should take ~3-5 minutes)

## 🔍 Understanding the Pipelines

### CI Pipeline (ci.yml)

Runs on: Every push and pull request

**Jobs:**
- **Backend** (2 parallel runs: Node 18, Node 20)
  - Installs dependencies
  - Lints TypeScript code
  - Compiles TypeScript

- **Frontend** (2 parallel runs: Node 18, Node 20)
  - Installs dependencies
  - Lints code (if ESLint configured)
  - Builds production bundle
  - Runs tests with coverage
  - Uploads coverage to Codecov

- **Docker** (single run)
  - Builds backend Docker image
  - Builds frontend Docker image
  - Uses GitHub Actions cache

- **CI Status** (final check)
  - Ensures all jobs passed

### Docker Publishing (publish-docker.yml)

Runs on: Push to main OR when you create a version tag

**Tags created:**
- `ghcr.io/username/repo/backend:latest`
- `ghcr.io/username/repo/backend:sha-abc123`
- `ghcr.io/username/repo/frontend:latest`
- etc.

**To use version tags:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 🛠️ Development Workflow

### Before Pushing Code

1. Run local checks:
   ```bash
   ./scripts/local-ci.sh
   ```

2. Fix any lint errors:
   ```bash
   # Backend
   cd backend && npm run lint:fix
   
   # Frontend (if using ESLint)
   cd frontend && npm run lint --fix
   ```

3. If still failing, fix manually and test again

### Opening a Pull Request

1. Push your branch to GitHub
2. GitHub Actions automatically runs CI on your branch
3. Your PR shows a check status (green = all pass, red = fixes needed)
4. Only merge when all checks pass

### Deploying to Production

1. Merge to main
2. CI pipeline runs automatically
3. Docker images published to registry
4. (Optional) Deploy staging automatically after CI passes

## 📚 Key Differences from GitLab

### Configuration Syntax
```yaml
# GitLab CI
test:
  script:
    - npm install
    - npm test

# GitHub Actions
test:
  runs-on: ubuntu-latest
  steps:
    - run: npm ci
    - run: npm test
```

### Execution Model
- **GitLab**: Stages run sequentially, jobs within a stage run in parallel
- **GitHub**: All jobs run in parallel by default, use `needs:` for dependencies

### Caching
```yaml
# GitLab
cache:
  paths:
    - node_modules/

# GitHub
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

## 🔐 Using Secrets

To add secrets (API keys, tokens, etc.):

1. Go to repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret name and value
4. Use in workflows:
   ```yaml
   - run: command
     env:
       SECRET_NAME: ${{ secrets.SECRET_NAME }}
   ```

## 📊 Monitoring Your Pipelines

### View All Workflow Runs
- Repository → Actions → See all workflows

### View Detailed Logs
- Click a workflow run
- Click a job
- See step-by-step logs
- Find exact error messages

### Re-run Failed Workflows
- Click "Re-run jobs" button
- Useful for temporary failures
- Saves you from pushing a dummy commit

## 🎯 Next Steps (Optional)

### 1. Configure Codecov for Coverage Reports
```bash
# Free for public repos
# Go to https://codecov.io and sign in with GitHub
# Enable your repository
# That's it! Coverage is auto-uploaded
```

### 2. Add Slack Notifications
```yaml
- name: Slack Notification
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. Deploy to Production
Edit `deploy-staging.yml` to deploy automatically, or create a `deploy-production.yml` for manual deployments.

### 4. Add Branch Protection Rules
```
Settings → Branches → Add rule
- Require "CI Status" to pass before merging
- Require pull request reviews
- Require code scanning
```

## ⚠️ Troubleshooting

### Workflow Not Running
- Check: Settings → Actions → General → Workflows enabled
- Ensure `.github/workflows/*.yml` is on your default branch

### Backend Lint Failures
```bash
cd backend
npm run lint        # See errors
npm run lint:fix    # Auto-fix simple issues
npm run lint        # Verify fixes
```

### Frontend Build Failures
```bash
cd frontend
npm run build       # Reproduce locally
# Check error messages
npm install         # Ensure dependencies
npm run build       # Retry
```

### Docker Build Failures
- Check Dockerfile syntax
- Ensure `node_modules/` is in `.dockerignore`
- Check for secrets in Dockerfile (should use ARG, not ENV)

### Tests Failing in CI but Not Locally
- Different Node version? Specify in local testing
- Environment variables? Check `.env` files
- Clean state? Try `npm ci` instead of `npm install`

## 📖 Documentation

Full documentation available in:
- `.github/workflows/README.md` - Detailed workflow guide
- GitHub Actions docs: https://docs.github.com/en/actions

## 🎉 You're All Set!

Your CI/CD pipeline is ready to use. Here's what happens now:

1. Every push runs automated tests and linting
2. Every PR shows if it's safe to merge
3. Successful builds publish Docker images
4. You focus on writing code, GitHub Actions handles the rest

**Happy coding!** 🚀
