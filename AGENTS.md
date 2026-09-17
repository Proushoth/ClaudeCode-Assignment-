# AGENTS.md

> Shared rules for all AI coding agents (Claude, Cursor, Copilot, etc.).
> Every agent working in this repo MUST follow these rules.

---

## Project Overview

**TaskAPI** is a lightweight RESTful API for managing tasks.
Built with Node.js and Express 5. All data is stored in-memory (no database).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (LTS) |
| Framework | Express 5 |
| Test runner | Jest |
| HTTP test client | Supertest |
| Linter | ESLint 9 (flat config) |

---

## Commands

```bash
npm test          # Run full Jest test suite
npm run lint      # Run ESLint across all JS files
node src/server.js  # Start the dev server on PORT (default 3000)
```

---

## Code Style

- **Indentation**: 2 spaces — no tabs.
- **Quotes**: single quotes for strings.
- **Strict mode**: every file starts with `'use strict';`.
- **Module system**: CommonJS (`require` / `module.exports`) — no ES module `import`/`export`.
- **No default exports**: always use named exports or `module.exports = { ... }`.
- **Trailing commas**: yes, on multi-line objects and arrays.
- **Semicolons**: always.
- **Max line length**: 100 characters.

---

## Testing Rules

- Every route handler **must** have at least one corresponding test.
- Tests live in `src/__tests__/` (integration) or `tests/` (unit).
- Test file naming: `<subject>.test.js`.
- Cover: success cases, validation errors, and edge cases.
- Run `npm test` to confirm all tests pass before finishing any task.
- **Never edit tests to make them pass unless explicitly asked.**

---

## Do Not

- ❌ Never edit `package-lock.json` by hand.
- ❌ Never commit secrets or credentials to Git.
- ❌ Never modify `.env` files (treat them as read-only configuration).
- ❌ Never run `git push` without explicit user approval.
- ❌ Never delete files without confirming with the user first.
- ❌ Never change test assertions to make failing tests pass.
