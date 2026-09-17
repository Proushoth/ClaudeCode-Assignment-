# /review

Run a full quality check on $ARGUMENTS (or the whole project if no argument is given).

## Steps

1. **Lint** — run `npm run lint $ARGUMENTS` and capture output.
2. **Tests** — run `npm test` and capture output.
3. **Rules check** — read `AGENTS.md` and compare the code in $ARGUMENTS against every rule.

## Report format

Produce a structured report with three sections:

### Lint findings
List every ESLint error or warning, with file + line number.
If clean, write "✅ No lint issues."

### Test results
Show the Jest pass/fail summary.
If all pass, write "✅ All tests pass."
If any fail, list the failing test names and the error message.

### AGENTS.md rule violations
For each rule in AGENTS.md, check whether $ARGUMENTS violates it.
List any violations as:
- `[RULE]` description of violation, file:line

If no violations, write "✅ No rule violations found."

## Notes
- If $ARGUMENTS is empty, run the checks across the whole project.
- Do not auto-fix anything — only report findings.
- Save this output to `review-output.txt` in the project root.
