# CLAUDE.md

@AGENTS.md

---

## Claude-Specific Notes

These rules apply only when Claude Code is the active agent.

### Before finishing any task
- Always run `npm test` and confirm all tests pass.
- Always run `npm run lint` and fix any errors (warnings are acceptable).

### File safety
- **Ask before deleting** any file — even if it looks unused.
- **Ask before overwriting** files that already have meaningful content.

### Commits
- Never run `git push` — the user handles pushing.
- Suggest clear, imperative commit messages (e.g. `feat: add DELETE /tasks/:id`).

### Secrets
- If you see a `.env` file, do not read it, log it, or include its contents in any output.

### Planning
- For non-trivial changes, propose a plan and wait for approval before editing code.
- Use a step-by-step approach: one logical change at a time.
