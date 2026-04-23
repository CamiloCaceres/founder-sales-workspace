---
name: route-lead
description: Use when the user says "route new inbounds" / "apply the routing policy" — reads lead-scores.json, applies the policy from config/scoring.json (GREEN → AE, YELLOW → SDR, RED → drop), and surfaces any CRM mutations for approval before executing.
---

# Route Lead

Derived from Gumloop template #40 (Lead Scoring and Routing from
Typeform to HubSpot), routing side.

## When to use

- "route new inbounds".
- "apply the routing policy to scored leads".
- Called automatically after `score-lead` if the scheduled routine is
  on.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`.

2. **Load config.** `config/scoring.json` — use its `routingPolicy`.
   If missing, run `onboard-me`.

3. **Read `lead-scores.json`.** Filter to rows that don't already
   have a routing decision.

4. **Apply policy:**
   - GREEN → `route: "ae"`, surface activity card in AE's queue
     linking the lead + score reasoning.
   - YELLOW → `route: "sdr"`, activity card in SDR's queue.
   - RED → `route: "drop"` with a citation of the hard-miss or
     the low softScore.

5. **Check if CRM mutation required.** If yes (owner reassignment,
   lifecycle-stage bump), build the diff list: `{ recordId, field,
   currentValue, proposedValue }`. Do **NOT** execute yet.

6. **Surface the diff to the user for approval.** Activity card with
   the proposed changes. Wait for "approve" before executing.

7. **On approval** — execute mutations via the discovered CRM tool
   slug. On mutation failure, log per-record and continue.

8. **Write routing decisions.** Append to `routing-decisions.json`
   per lead:

   ```ts
   {
     id, leadSlug,
     fitScore, route: "ae" | "sdr" | "drop",
     routedAt: ISO,
     crmMutationApplied: bool,
     crmMutationApprovedBy?: string,
     createdAt, updatedAt
   }
   ```

9. **Append to `outputs.json`** with `type: "route"`.

10. **Summarize.** Counts per route + the top-3 GREEN leads now
    sitting in AE's queue.

## Outputs

- Appends to `routing-decisions.json`.
- Optional CRM mutations (on approval).
- Activity cards in target agents' queues.
- Appends to `outputs.json`.
