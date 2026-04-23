---
name: weekly-sales-review
description: Use when the user says "Monday sales review" / "weekly readout" / "how was the week" — aggregates every other sales agent's `outputs.json`, flags stalled work and missed follow-ups, and recommends the 3 moves for the week.
---

# Weekly Sales Review

The Monday readout. Fast — the founder should read it in 2 minutes and
know exactly what to push on this week.

## When to use

- "Monday sales review" / "weekly sales review" / "weekly readout".
- "how was the week" / "what shipped last week".

## Steps

1. **Read the playbook.** Load `sales-playbook.md`. If missing, say so
   and ask the user to run `define-sales-playbook` first.

2. **Read each other agent's `outputs.json`:**
   - `../sdr/outputs.json` — leads enriched, scored, drafted; replies
     triaged; searches run.
   - `../ae/outputs.json` + `../ae/deals.json` — calls held, deals
     progressed or stalled, proposals drafted, close plans.
   - `../csm/outputs.json` + `../csm/customers.json` — customer health
     changes, renewals touched, saves run, expansions surfaced.
   - `../revops/outputs.json` + `../revops/reports/` — pipeline moves,
     forecasts, hygiene sweeps.

   Handle missing gracefully — if an agent isn't installed or has no
   outputs yet, note it as "no activity" and continue.

3. **Compute the summary:**
   - What shipped (ready status, last 7 days).
   - What's in draft (awaiting approval, last 14 days).
   - What stalled (deals with `stalledAt`, leads with no activity
     past the stall-threshold, customers with YELLOW/RED health no
     touchpoint).
   - Agent quietness — any agent with zero `outputs.json` entries in
     the last 14 days gets flagged.

4. **Cross-reference against the playbook.** If a specific objection
   keeps appearing in AE call analyses, flag it. If recent deals are
   losing to the same competitor, flag it. Point at the exact playbook
   section that should be updated and suggest running
   `mine-call-insights`.

5. **Recommend 3 moves.** Each addressed to a specific agent with a
   one-line handoff prompt the user can paste:
   - "@sdr Triage the 12 un-triaged replies from this weekend."
   - "@ae Prep the Acme renewal call Thursday — use `prepare-call`."
   - "@revops Clean up the 8 deals stuck in Stage 2 past 30 days."

6. **Write atomically.** Write to `reviews/{YYYY-MM-DD}.md.tmp`, then
   rename.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "review",
     "title": "Weekly sales review — week of {YYYY-MM-DD}",
     "summary": "<2–3 sentences — shipped vs stalled vs next moves>",
     "path": "reviews/{YYYY-MM-DD}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize to user.** The 3 moves, each as a copyable one-liner.
   Path to the full review.

## Outputs

- `reviews/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "review"`.
