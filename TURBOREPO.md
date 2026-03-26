# Turborepo Configuration Guide

## Overview

This project uses **Turborepo**, a high-performance build system and monorepo tool, to manage the frontend and backend packages.

## What is Turborepo?

Turborepo provides:

- **Smart Caching**: Never rebuild the same code twice
- **Parallel Execution**: Run tasks across packages simultaneously
- **Task Orchestration**: Manages dependencies between package tasks
- **Git-Aware**: Only rebuilds what changed since git remotes
- **Remote Caching**: Share cache across CI/CD and local machines (premium)

## Configuration

### turbo.json

The [turbo.json](turbo.json) file defines the build pipeline:

```json
{
  "globalDependencies": ["**/.env.local"],
  "tasks": {
    "dev": {
      "cache": false, // Don't cache dev tasks
      "interactive": true // Keep interactive mode
    },
    "build": {
      "outputs": ["dist/**"], // Cache these outputs
      "cache": true,
      "dependsOn": ["^build"] // Wait for deps to build
    },
    "lint": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "type-check": {
      "cache": true,
      "dependsOn": ["^build"]
    }
  }
}
```

## Available Commands

### Development

```bash
npm run dev
```

Runs development servers for all packages in parallel:

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

### Building

```bash
npm run build
```

Builds all packages with smart caching:

- Frontend: Runs `tsc -b && vite build`
- Backend: Runs `tsc`

Subsequent builds only rebuild changed packages.

### Linting

```bash
npm run lint
```

Runs ESLint across all packages.

### Type Checking

```bash
npm run type-check
```

Runs TypeScript type checking.

### Clean

```bash
npm run clean
```

Clears Turborepo cache and node_modules.

### Run Single Package

```bash
npm run frontend      # Frontend dev only
npm run backend       # Backend dev only
```

## Filtering Tasks

Run tasks in specific packages using `--filter`:

```bash
# Build only frontend
turbo run build --filter=realtime-incident-center-frontend

# Dev only backend
turbo run dev --filter=realtime-incident-center-backend

# Run lint excluding certain packages
turbo run lint --filter='!realtime-incident-center-frontend'
```

## Cache Strategy

### Tasks with Caching Enabled

- `build` - Caches `dist/` outputs
- `lint` - Caches `.eslintcache`
- `type-check` - Caches type information

### Tasks without Caching

- `dev` - Never cached (needs live reload)
- `preview` - Never cached (interactive)
- `start` - Never cached (interactive)

## Dependency Graph

The build pipeline respects dependencies:

```
build (frontend)
  ↓ depends on
build (backend)

lint (all)
  ↓ depends on (optional)
build (all)
```

The `^build` notation means "depend on the build task of dependencies".

## Performance Benefits

### Before Turborepo (with concurrently)

- Sequential builds
- No caching
- Rebuild everything every time
- Example: 45 seconds per build

### After Turborepo

- Parallel execution
- Smart caching
- Incremental builds
- Example: 8 seconds (first build), 2 seconds (cached)

## Workspace Configuration

Package names in `package.json`:

- Frontend: `realtime-incident-center-frontend`
- Backend: `realtime-incident-center-backend`

These names are used for filtering tasks:

```bash
turbo run build --filter=realtime-incident-center-frontend
```

## Advanced Usage

### Run with dry mode (show what would run)

```bash
turbo run build --dry
```

### Run with verbose output

```bash
turbo run build --verbose
```

### Profile build performance

```bash
turbo run build --profile
```

This generates a profile you can upload to [turbo.build](https://turbo.build).

## Environment Variables

Turborepo respects environment variables:

- `TURBO_TEAM` - Team slug for remote caching
- `TURBO_TOKEN` - Token for remote caching (premium)
- `TURBO_CACHE_DIR` - Custom cache directory

Example:

```bash
TURBO_TOKEN=xxx npm run build
```

## Troubleshooting

### Clear cache and rebuild

```bash
npm run clean
npm run build
```

### Cache hitting wrong

If Turborepo seems to cache wrong results:

1. Check for non-deterministic outputs
2. Verify `outputs` in turbo.json matches actual outputs
3. Run with `--no-cache` to bypass caching

### Performance not improving

1. Check `tasks` in turbo.json are properly configured
2. Ensure `cache: true` is set for appropriate tasks
3. Verify outputs are correctly specified
4. Run with `--profile` to analyze build times

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build
  run: npm run build

- name: Lint
  run: npm run lint
```

Turborepo will:

1. Detect changes from git
2. Only run affected tasks
3. Use caching for faster builds

### Environment setup for CI

```bash
# Set CI flag for Turborepo optimization
export CI=true
npm run build
```

## Migration from Concurrently to Turborepo

Changes made:

1. ✅ Replaced `concurrently` with `turbo`
2. ✅ Created `turbo.json` with build pipeline
3. ✅ Updated root `package.json` scripts
4. ✅ Kept individual package scripts unchanged

The individual package.json files in `frontend/` and `backend/` need no changes.

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Turborepo CLI](https://turbo.build/repo/docs/reference/command-line-reference)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Monorepo Best Practices](https://turbo.build/repo/docs/handbook)

## Next Steps

1. **Try building**: `npm run build` (notice the speed!)
2. **Make a change**: Edit a file in frontend or backend
3. **Build again**: `npm run build` (much faster due to caching!)
4. **Clean and rebuild**: `npm run clean && npm run build`

---

Turborepo makes this monorepo fast, maintainable, and production-ready. 🚀
