# Task 4 - CI/CD Pipeline with GitHub Actions

## Overview
Complete CI/CD pipeline for the React UI application using GitHub Actions.

## Features
- ✅ **Automated Testing** - Runs tests on every push and PR
- ✅ **Code Linting** - ESLint for code quality
- ✅ **Security Scanning** - Snyk vulnerability scanning
- ✅ **Docker Build** - Automated Docker image creation and push to Docker Hub
- ✅ **GitHub Pages Deployment** - Automatic deployment of build artifacts
- ✅ **Build Artifacts** - Stores build files for 7 days

## Pipeline Stages

### 1. Build and Test
- Node.js setup and dependency installation
- ESLint code quality check
- Jest test execution with coverage
- React application build
- Artifact upload for later stages

### 2. Docker Build
- Multi-stage Docker build
- Push to Docker Hub with latest and commit SHA tags
- Only triggers on main branch

### 3. Security Scan
- Snyk vulnerability scanning
- High severity threshold

### 4. Deployment
- GitHub Pages deployment
- Only triggers on main branch after successful tests

## Setup Requirements

### GitHub Secrets
1. `DOCKERHUB_USERNAME` - Docker Hub username
2. `DOCKERHUB_TOKEN` - Docker Hub access token
3. `SNYK_TOKEN` - (Optional) Snyk API token

### Local Testing
```bash
# Build and run with Docker
docker build -t task3-react-ui .
docker run -p 3000:80 task3-react-ui

# Or use docker-compose for full stack
docker-compose up
