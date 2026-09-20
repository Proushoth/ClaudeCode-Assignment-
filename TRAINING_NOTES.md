# TRAINING_NOTES.md

Assignment write-up for the Claude Code Basics starter tasks.

---

## 1. Why is `.claude/settings.local.json` kept out of Git?

`.claude/settings.local.json` is a **personal override file** — it lets each developer
customise Claude's behaviour on their own machine without affecting the rest of the team.
Examples of what it might contain:

- Extra `allow` rules for commands that only make sense on one person's machine
- Personal API keys or paths that differ per developer
- Temporary overrides during debugging

Because its contents are **machine-specific and potentially sensitive**, it must never be
shared via version control. Committing it would either expose personal configuration to
the whole team or cause conflicts when two developers have different local settings.


The shared, team-wide rules live in `.claude/settings.json` (committed) and `AGENTS.md`
(committed). `settings.local.json` layers on top of those, privately.

---

## 2. What did `/review` report?

The `/review` command runs `npm run lint $ARGUMENTS`, `npm test`, checks the code against
the rules in `AGENTS.md`, and saves the report to `review-output.txt`.

Running `/review src/app.js` produced the following findings (saved to `review-output.txt`):

### Lint findings
Running ESLint on `src/app.js`:
- **✅ No lint issues.**

*(Earlier during full-project checks, 26 lint errors were caught in `tests/validators.test.js` because `tests/` was missing Jest globals in `eslint.config.js`. That was resolved by expanding the glob).*

### Test results
```
PASS src/__tests__/app.test.js
PASS tests/validators.test.js

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
```

✅ All 24 tests passed.

### AGENTS.md rule violations
Checked `src/app.js` against all rules in `AGENTS.md`:
- ✅ 2-space indentation and semicolons
- ✅ Single quotes and `'use strict';`
- ✅ CommonJS named exports (`module.exports = { app }`)
- ✅ All routes (`GET /tasks`, `POST /tasks`, `DELETE /tasks/:id`) have tests in `src/__tests__/app.test.js`
- ✅ All lines <= 100 characters

**Result:** ✅ No rule violations found. All results saved to `review-output.txt`.

---

## 3. One thing Claude got wrong — and how it was corrected

### What went wrong

When creating `eslint.config.js` (Task 2), Claude generated the file using **ES module
syntax** (`import` / `export default`):

```js
// ❌ What Claude wrote
import js from '@eslint/js';

export default [
  ...
];
```

Running `npm run lint` immediately failed with:

```
SyntaxError: Cannot use import statement outside a module
```

### Why it was wrong

The project uses **CommonJS** (`require` / `module.exports`) throughout — there is no
`"type": "module"` in `package.json`. Node.js therefore loads all `.js` files as CJS,
which does not understand `import`/`export`. Claude generated ESM syntax out of habit,
without checking the project's module system first.

### How it was corrected

The file was rewritten to use CommonJS syntax, matching every other file in the project:

```js
// ✅ Corrected version
'use strict';

const js = require('@eslint/js');

module.exports = [
  ...
];
```

After the fix, `npm run lint` ran cleanly. This correction was added to `AGENTS.md`
under the Code Style section to prevent the same mistake in future:

> **Module system**: CommonJS (`require` / `module.exports`) — no ES module
> `import`/`export`.
