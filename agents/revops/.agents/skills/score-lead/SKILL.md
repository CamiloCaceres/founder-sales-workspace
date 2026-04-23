---
name: score-lead
description: Use when the user says "score the whole inbound queue" / "bulk-score my leads" — applies the playbook's ICP criteria across every un-scored lead (SDR's leads.json + CRM new-leads view). System-wide, not single-shot.
---

# Score Lead (System-wide)

Different from SDR's `score-icp-fit` (which scores a single lead).
This skill sweeps the entire pipe. Derived from Gumloop template #40
(Lead Scoring and Routing from Typeform to HubSpot), scoring side.

## When to use

- "score the whole inbound queue".
- "bulk-score my leads".
- Scheduled: nightly scoring sweep.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`.

2. **Load `config/scoring.json`.** If missing, run `onboard-me`.

3. **Build the pool.** Union of:
   - `../sdr/leads.json` — filter to rows where `fitScore` is missing
     or older than 14 days.
   - CRM new-leads view — `composio search crm` → list contacts
     created in the last 30 days without an owner.

4. **Per-lead scoring.** Apply `hardCriteria` — any miss → RED.
   Otherwise compute `softScore` via weighted sum. Map to GREEN (top
   ~30%), YELLOW (middle), RED (bottom + all hard-miss). Reasoning:
   2 bullets citing which criteria hit / missed.

5. **Append to `lead-scores.json`** — one row per lead scored:

   ```ts
   {
     id, leadSlug,
     fitScore: "GREEN" | "YELLOW" | "RED",
     hardHits: string[],
     softScore: number,
     reasoning: "...",
     createdAt, updatedAt
   }
   ```

   Read-merge-write atomic. Never overwrite.

6. **Do NOT mutate the CRM.** Scoring is separate from routing. If
   the user wants CRM sync, they run `route-lead` next.

7. **Summarize.** Counts per bucket (GREEN/YELLOW/RED) + the 3
   highest-softScore leads by name.

## Outputs

- Appends to `lead-scores.json` (new rows).
- Appends to `outputs.json` with `type: "score"`.
