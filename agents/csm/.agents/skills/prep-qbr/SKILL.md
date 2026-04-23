---
name: prep-qbr
description: Use when the user says "prep a QBR for {customer}" / "quarterly review for {customer}" — produces a QBR pack with outcomes, usage trend, open asks, risks, and the next-quarter goal.
---

# Prep QBR

## When to use

- "prep a QBR for {customer}".
- "quarterly review for {customer}".
- Scheduled: T-7 days before the customer's quarterly cadence.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`.

2. **Read customer context.** `customers/{slug}/onboarding.md` (for
   the locked success metric), prior QBRs in `qbrs/` (for
   trend), `health.md` (for current state).

3. **Pull quarter data:**
   - Usage → `composio search product-analytics` for the quarter
     window.
   - NPS / CSAT in quarter → `composio search survey`.
   - Tickets in quarter → `composio search support` (count +
     categories).
   - Touchpoints in quarter → `composio search crm` or Gmail.
   - Outcomes → compare current metric state vs. onboarding-plan
     targets.

4. **Structure the QBR pack:**

   1. **Outcomes delivered** — THIS quarter vs. success metric.
      Concrete numbers, cited source.
   2. **Usage + engagement trend** — quarter-over-quarter.
   3. **Open asks from them** — from tickets, emails, calls.
   4. **Risks we see** — unresolved blockers, adoption gaps.
   5. **Next-quarter goal** — the single metric we'll drive.
   6. **Expansion or renewal note** — if renewal is within 1 quarter,
      flag. If expansion opportunities in `expansion.json`, list
      (not pitch — just flag).

5. **Write atomically** to `customers/{slug}/qbrs/{YYYY-MM-DD}.md.tmp`
   → rename.

6. **Update `customers.json`** — `lastQbrAt`.

7. **Append to `outputs.json`** with `type: "qbr"`.

8. **Summarize.** The top outcome + the next-quarter goal.

## Outputs

- `customers/{slug}/qbrs/{YYYY-MM-DD}.md`
- Updates `customers.json`.
- Appends to `outputs.json`.
