---
name: qa
description: Run the full QA pipeline (build, lint, code smells, tests) against the codebase. Use when user types "/qa", "run qa", "check my changes", or "run tests".
allowed-tools: Bash, Grep, Read, Glob
---

# qa

## Context

- Recently changed files: !`git diff --name-only HEAD~1 2>/dev/null`
- Staged files: !`git diff --staged --name-only`
- Unstaged changes: !`git diff --name-only`

## Instructions

Run all steps below and report a summary. Do not fix issues — only report them. Use a 5-minute timeout for the entire run.

### Step 1: Identify changed files

Collect all changed `.ts` and `.tsx` files from the context above (recently changed, staged, and unstaged) into a single deduplicated list. These drive code smell checks.

### Step 2: Build

Run `pnpm run build` to compile all packages.

**If the build fails, report immediately and stop — do not continue to later steps.**

### Step 3: Lint

Run `pnpm run lint` and capture results.

### Step 4: Code smell scan

Scan changed `.ts`/`.tsx` files (exclude `dist/`, `node_modules/`, and test files) using Grep for:

- `console.log` — debug logging left in production code
- `: any` or `as any` — type escape hatches
- `@ts-ignore` or `@ts-expect-error` — TypeScript suppressions
- `debugger` — debugger statements

Record each finding with file path and line number.

### Step 5: Tests

Run `pnpm run test:run` and capture the output. Record pass/fail and any failure details.

### Step 6: Report summary

Output a summary table:

```
## QA Results

| Check          | Status | Details |
|----------------|--------|---------|
| Build          | ...    | ...     |
| Lint           | ...    | ...     |
| Code smells    | ...    | ...     |
| Tests          | ...    | ...     |
```

Below the table, list every command that was run and its exit code. Then list any issues found with file paths and line numbers.

If all checks pass, end with "All QA checks passed."
