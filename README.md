# TaskAPI

A lightweight RESTful API for managing tasks, built with **Node.js** and **Express 5**.
All data is stored in-memory — no database required.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Validation](#validation)
- [Testing](#testing)
- [Linting](#linting)
- [Claude Code Integration](#claude-code-integration)

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

## Project Structure

```
TaskAPI/
├── .claude/
│   ├── agents/
│   │   └── test-writer.md       # AI subagent: writes Jest tests automatically
│   ├── commands/
│   │   └── review.md            # Custom /review slash command
│   └── settings.json            # Claude Code permission rules
├── src/
│   ├── __tests__/
│   │   └── app.test.js          # Integration tests for all HTTP routes
│   ├── app.js                   # Express app — all routes defined here
│   ├── server.js                # Entry point — starts the HTTP server
│   └── validators.js            # Pure validation logic for task input
├── tests/
│   └── validators.test.js       # Unit tests for validateTask()
├── .env                         # Local environment variables (git-ignored)
├── .gitignore
├── AGENTS.md                    # Shared rules for all AI coding agents
├── CLAUDE.md                    # Claude Code-specific rules (imports AGENTS.md)
├── eslint.config.js             # ESLint 9 flat config
└── package.json
```

### Key files explained

#### `src/app.js`
The heart of the API. Creates the Express application, sets up middleware, and registers
all route handlers. Exports the `app` object **without** calling `.listen()` so that
integration tests can import it directly without starting a real server.

#### `src/server.js`
Thin entry point. Imports `app` from `app.js` and calls `app.listen()` to bind to a port.
Kept separate so tests never accidentally start the server.

#### `src/validators.js`
A **pure function** — no Express, no side effects.  
`validateTask(input)` returns `{ value }` on success or `{ error }` on failure.  
Keeping validation logic here makes it easy to unit-test in isolation.

#### `src/__tests__/app.test.js`
Integration tests that send real HTTP requests through the Express app using Supertest.
Covers every route: success cases, validation errors, and edge cases.

#### `tests/validators.test.js`
Unit tests for `validateTask` written **before** the implementation (TDD).

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
node src/server.js
```

The server starts on **http://localhost:3000** by default.  
Override the port with the `PORT` environment variable:

```bash
PORT=8080 node src/server.js
```

---

## API Reference

### `GET /tasks`

Returns all tasks.

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "priority": "medium",
    "description": "",
    "createdAt": "2026-09-17T05:30:00.000Z"
  }
]
```

Returns an empty array `[]` when no tasks exist.

---

### `POST /tasks`

Creates a new task.

**Request body**
```json
{
  "title": "Buy groceries",
  "priority": "high",
  "description": "Milk, eggs, bread"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | ✅ Yes | 3–100 characters, trimmed |
| `priority` | string | ❌ No | `low`, `medium`, or `high` (default: `medium`) |
| `description` | string | ❌ No | Free text |

**Response `201 Created`**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "priority": "high",
  "description": "Milk, eggs, bread",
  "createdAt": "2026-09-17T05:30:00.000Z"
}
```

**Response `400 Bad Request`** (validation failure)
```json
{ "error": "title must be at least 3 characters long." }
```

---

### `DELETE /tasks/:id`

Deletes a task by its numeric ID.

**Response `204 No Content`** — task deleted successfully, no body returned.

**Response `404 Not Found`**
```json
{ "error": "Task with id 99 not found." }
```

---

## Validation

All `POST /tasks` input is validated by the pure function `validateTask` in
[`src/validators.js`](./src/validators.js) before any data is written.

| Rule | Detail |
|---|---|
| `title` required | Returns `400` if missing or not a string |
| `title` length | Must be 3–100 characters after trimming |
| `priority` values | Must be `low`, `medium`, or `high` |
| `priority` default | Omitting `priority` defaults to `"medium"` |

---

## Testing

Run the full test suite:

```bash
npm test
```

Run with coverage:

```bash
npx jest --coverage
```

**Test layout**

| File | Type | What it covers |
|---|---|---|
| `src/__tests__/app.test.js` | Integration | All HTTP routes (GET, POST, DELETE) |
| `tests/validators.test.js` | Unit | `validateTask` — 9 cases |

**Current results:** 20 tests pass, `src/validators.js` at **100% line coverage**.

---

## Linting

```bash
npm run lint
```

Uses **ESLint 9** with a flat config ([`eslint.config.js`](./eslint.config.js)).

Code style rules (enforced):
- 2-space indentation
- Single quotes for strings
- `'use strict'` at the top of every file
- CommonJS modules (`require` / `module.exports`) — no ESM `import`/`export`
- Semicolons always
- Max line length: 100 characters

---

## Claude Code Integration

This repo is fully configured for use with [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

| File | Purpose |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Claude reads this automatically; imports all shared rules via `@AGENTS.md` |
| [`AGENTS.md`](./AGENTS.md) | Shared rules for **all** AI agents (Claude, Cursor, Copilot, etc.) |
| [`.claude/settings.json`](./.claude/settings.json) | Allows `npm test` and `npm run lint`; blocks `git push` and reading `.env` |
| [`.claude/agents/test-writer.md`](./.claude/agents/test-writer.md) | Subagent that writes Jest + Supertest tests on demand |
| [`.claude/commands/review.md`](./.claude/commands/review.md) | `/review` slash command — runs lint + tests and checks against `AGENTS.md` |

### Using the test-writer agent

In Claude Code, type:
```
Use the test-writer agent to add tests for DELETE /tasks/:id
```

### Using the /review command

```
/review src/app.js
```

Runs ESLint and Jest scoped to `src/app.js`, then checks the file against every
rule in `AGENTS.md` and prints a structured report.
