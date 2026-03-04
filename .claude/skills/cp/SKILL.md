---
name: cp
description: Stage, commit, and push all changes to the remote branch. Use when user types "/cp", "commit and push", or "push my changes". Do NOT use for selective staging, PR creation, or general git questions.
allowed-tools: Bash
---

# cp

## Context

- Working tree status: !`git status`
- Changes to commit: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
- Open PR for this branch: !`gh pr view --json number,title,url 2>/dev/null || echo "No open PR"`

## Instructions

Complete all steps in a single message using only tool calls. Do not output any other text.

### Step 1: Stage all changes
Review the working tree status and stage appropriate files individually. Do not stage files that contain secrets, credentials, `.env` files, `dist/` directories, or large binaries.

### Step 2: Commit
Create a single commit following the convention of recent commits (e.g. `feat:`, `fix:`, `refactor:`, `chore:` prefixes).

### Step 3: Push
Push with `git push`. If the branch has no upstream, use `git push -u origin HEAD`.

## Error handling

- **Nothing to commit**: If working tree is clean, inform the user and stop.
- **Push rejected**: Do not force-push. Inform the user about remote changes.
