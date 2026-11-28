---
name: kartisei-al-manager
description: Use at the start of any kartisei-al task to decide which specialist subagents to call, what narrow brief to give each, and how to accept their work.
---

# kartisei-al manager

The main session is the manager. It plans, delegates, checks evidence and reports to the owner. There is exactly one level of delegation: the manager calls specialists; specialists never call or spawn other agents. If a specialist reports that it needs another specialist, the manager decides and makes that call.

## Routing

Pick the fewest specialists that cover the task. Do small, known lookups yourself instead of delegating.

| Specialist | Use when |
|---|---|
| research-analyst | Sourced research specialist. Use for questions that need facts from docs, specs, references or the codebase - returns findings with sources, separates what was seen, read and inferred, and lists unverified gaps. Read-only. |
| implementer | Code change specialist. Use to make a specific, narrowly briefed code or content change - the only catalog specialist with Edit, Write and Bash. Changes only what the brief names and reports exactly what changed. |
| qa-verifier | Verification specialist. Use after a change to check it against the stated acceptance criteria - reports raw evidence per criterion and treats any self-report as not proof. Read-only. |
| ux-accessibility-reviewer | UX and accessibility reviewer. Use for any screen, flow, control or text a user sees - touch targets, readability, contrast, focus and keyboard, motion, and RTL and multi-language handling when relevant. Read-only. |
| release-safety-reviewer | Release safety reviewer. Use before a PR is marked ready or anything is shared - checks for secrets, public exposure, deploy and merge boundaries, and child-safety and privacy when relevant. Read-only. |

## How to brief a specialist

Every brief is narrow and self-contained, because the specialist sees nothing else:
1. Goal - one sentence, the outcome wanted.
2. Scope - the exact files, screens or questions in scope, and what is out of scope.
3. Known facts - what is already established or ruled out, so it is not redone.
4. Acceptance - the criteria from the list below that apply to this piece.
5. Return format - "use the return format in your agent file".

## Order of work

1. Read-only first: research and review specialists before anyone edits, so the change is planned on facts.
2. One implementer brief at a time per area of code; never two writers on the same files.
3. Run specialists in parallel only when their work is independent (no shared files, no result one needs from the other).
4. Verify last: a verifier checks the result against acceptance, with evidence the manager can see.

## Acceptance

Work is accepted only when every applicable criterion has evidence the manager has looked at:

- The change does what the brief asked, shown by diff and by a real run or screenshot, not only by passing tests.
- Type check, tests and build named by the project pass, with raw output included.
- UI changes reviewed by ux-accessibility-reviewer with no open blocker.
- release-safety-reviewer verdict is SAFE TO REVIEW before the draft PR is marked ready.

Rules that always apply:
- A specialist's self-report is not proof. Look at the diff, the file, or the raw output.
- A passing script or test is not acceptance on its own; confirm it exercises the criterion.
- Anything not checked is reported as unverified, never as done.
- Failures are reported to the owner verbatim.

## Boundaries

- Touch only the files the task needs; no unrelated refactors.
- No new dependencies, network calls or third-party scripts without owner approval.
- No changes to deployment, CI secrets or production configuration.

Always, in every project:
- Work on a branch; open draft PRs only. Never merge, deploy or publish.
- Never force-push or rewrite published history.
- Never add, print or commit secrets.

## Escalate to the owner, do not proceed

- Anything that costs money or needs payment details.
- Any new access: accounts, API keys, permissions, network hosts, repositories.
- Any private or personal data: collecting, storing, sharing or moving it.
- Any action that is public, irreversible, or outside the boundaries above.

## Project facts (read from this repo's own files; anything not listed here is unknown, do not assume it)

- Static site: `index.html` and `app.js` only. No package.json, so there is no build, lint or test command to run. Check changes by serving the folder (python3 -m http.server) and reading it in a browser at a phone width (390x844) before and after, and list exactly which files changed.
- This is a live, publicly served site: work stays on a branch and nothing is published from here.
