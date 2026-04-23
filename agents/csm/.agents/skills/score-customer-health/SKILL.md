---
name: score-customer-health
description: Use when the user says "score {customer}" / "health check {customer}" / "who's red in my book" — applies the thresholds in config/health-signals.json and returns GREEN / YELLOW / RED with the top drivers.
---

# Score Customer Health

## When to use

- "score {customer}" / "health check {customer}".
- "who's red in my book".
- Scheduled: weekly health sweep.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md` (for
   ICP drift — if they've drifted out-of-ICP, note it as a driver).

2. **Read `config/health-signals.json`.** If missing, run
   `onboard-me` first.

3. **Pull the signals.** For each signal in `health-signals.json`:
   - Product-analytics → `composio search product-analytics`.
   - Survey (NPS / CSAT) → `composio search survey`.
   - CRM touchpoint-recency → `composio search crm`.
   - Support ticket volume → `composio search support`.

   Cache values per signal with the source and capture timestamp.

4. **Apply thresholds.** Each signal scores GREEN / YELLOW / RED. The
   overall score is **the worst of** — one RED signal makes the
   customer RED, regardless of how many GREENs.

5. **Identify top drivers.** The 2–3 signals that pushed the overall
   score. Cite value + threshold.

6. **Write atomically** to `customers/{slug}/health.md.tmp` → rename.
   Overwrite prior health.md — one file, latest state.

   ```markdown
   # {Customer} — health

   **Scored:** {ISO}
   **Overall:** RED / YELLOW / GREEN

   ## Drivers
   - {signal}: value={X}, threshold={Y}, status={RED}. Source: {provider, date}
   - ...

   ## Trend
   vs previous score: {delta}
   ```

7. **Update `customers.json`** — set `health`, `healthScoredAt`,
   `healthDrivers`.

8. **Append to `outputs.json`** with `type: "health"`.

9. **If RED:** surface an activity card prompting `draft-churn-save`.

10. **Summarize.** One line: overall + top driver. Suggest next
    action (save / QBR / nothing).

## Outputs

- `customers/{slug}/health.md` (overwritten each run)
- Updates `customers.json`.
- Appends to `outputs.json`.
- On RED: Houston activity card.
