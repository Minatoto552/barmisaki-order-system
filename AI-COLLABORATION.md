# Codex / Claude Collaboration

This repository is maintained with both Codex and Claude. GitHub is the shared source of truth.

## Branch ownership

- Codex branches: `codex/<task-name>`
- Claude branches: `claude/<task-name>`
- Do not have both agents edit the same branch or worktree at the same time.
- Do not push directly to `main` unless the user explicitly asks for publication.
- Before starting, fetch the latest `origin/main` and create a task branch from it.

## Responsibilities

Either agent may implement changes. A useful default split is:

- Claude: requirements, UI proposals, design review, and first-pass implementation.
- Codex: integration, regression fixes, Firebase rules, tests, deployment, and final verification.

The reviewing agent must inspect the actual diff and run the relevant checks instead of relying only on the handoff summary.

## Required checks

Run these before handing work to the other agent:

```powershell
pnpm lint
pnpm test -- --run
pnpm build
```

For Firestore or Storage rule changes, also run the applicable emulator tests when available. Do not deploy Firebase rules or modify live Firestore data without the user's explicit approval.

## Handoff format

Include the following in a commit message, pull request, or handoff note:

- Goal and user-visible behavior
- Branch and commit SHA
- Files changed
- Tests run and results
- Firebase rule or data migration impact
- Remaining risks or follow-up work

Keep each task focused. Do not include unrelated formatting or refactors in the same change.

## Project invariants

- Preserve existing product, order, profile, emergency, and announcement data.
- Keep desktop and mobile layouts usable.
- Maintain anonymous Firebase Authentication and real-time Firestore updates.
- Keep accepted orders as immutable snapshots when product data changes.
- Never commit Firebase credentials, service-account keys, tokens, or user data.

