# Slice 4: Deterministic Scripts, Dead Code Check, README, and Final Verification

**Estimated time:** ≈9 minutes

## Goal

Configure all deterministic frontend scripts (`build`, `typecheck`, `lint`, `format:check`, `deadcode`), verify they all pass with zero warnings/errors, write the README with run instructions, and run the full end-to-end verification pipeline.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| D1 | `npm run build` succeeds (runs `tsc -b && vite build`) with zero errors |
| D2 | `npm run typecheck` succeeds (`tsc --noEmit`) with zero errors |
| D3 | `npm run lint` succeeds (ESLint with `--max-warnings 0`) with zero warnings |
| D4 | `npm run format:check` succeeds (Prettier check on all source files) |
| D5 | `npm run deadcode` produces no unused exports (or only documented safe false positives) |
| D6 | Backend `dotnet build && dotnet test && dotnet format --verify-no-changes` all pass |
| D7 | `npm run gen:api` is reproducible from source and runs as part of `npm run build` |
| D8 | README.md exists with prerequisites, setup, and run instructions |

## Required Tests

No new tests — this slice verifies that all existing tests and scripts pass.

## Files to Create/Modify

```
frontend/
  package.json                    — Finalize all scripts
  .eslintrc.cjs                   — ESLint config for TypeScript + React
  .prettierrc                     — Prettier config (if needed)
  tsconfig.json                   — Ensure strict mode, noUnusedLocals, noUnusedParameters

README.md                         — Project root
```

## Script Definitions

```jsonc
{
  "scripts": {
    "gen:api": "orval --config orval.config.ts",
    "dev": "vite",
    "build": "npm run gen:api && tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "deadcode": "knip --no-exit-code || npx ts-prune | grep -v 'used in module' || true"
  }
}
```

## README Content

- **Prerequisites:** .NET 10 SDK, Node.js 20+
- **Backend:** `cd backend && dotnet run` (serves on `http://localhost:5000`, Swagger at `/swagger`)
- **Frontend:** First run `cd frontend && npm install`, then:
  - Ensure backend is running on port 5000
  - `npm run gen:api` (generates typed client from backend OpenAPI)
  - `npm run dev` (serves on `http://localhost:5173`)
- **Scripts reference:** Explanation of `build`, `typecheck`, `lint`, `format:check`, `deadcode`
- **API endpoints:** Quick reference table

## Verification Commands

```bash
# Backend
cd backend && dotnet build && dotnet test && dotnet format --verify-no-changes

# Frontend (backend must be running for gen:api)
cd frontend && npm install && npm run gen:api && npm run build && npm run typecheck && npm run lint && npm run format:check && npm run deadcode
```

## Handoff Notes

- The dead code check may produce false positives for Orval-generated exports or shadcn/ui component exports. Document any such cases in the README or a `.knip.json` config.
- If `knip` is not available, use `ts-prune` as a fallback. The dead code check is informational — it should not block the build but should be clean.
- `npm run build` must run `gen:api` as a pre-step so the build is always reproducible from source.
- All scripts must work on a clean checkout after `npm install`.

## Non-Goals

- CI/CD pipeline configuration
- Docker setup
- E2E tests
- Performance profiling
