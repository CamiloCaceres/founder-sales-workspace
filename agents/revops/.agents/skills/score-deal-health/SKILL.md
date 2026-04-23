---
name: score-deal-health
description: Use when the user says "score open deals on health" / "which deals are slipping" — applies time-in-stage, qualification-completeness, and touch-recency rules. Returns per-deal GREEN / YELLOW / RED ranked by risk × ARR.
---

# Score Deal Health

## When to use

- "score open deals on health".
- "which deals are slipping".
- Scheduled: weekly (Monday morning, before the HoS review).

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md` for
   deal stages and qualification framework.

2. **Load open deals** from `../ae/deals.json`. Union with CRM open
   deals that lack an AE record.

3. **Per-deal scoring:**

   - **Time-in-stage** — days since `stageSince` vs
     `config/deal-stages.json` `normAgeDays`. >1.5× = YELLOW, >2× =
     RED.
   - **Qualification completeness** — read latest
     `../ae/calls/*/analysis.md` for the deal. Count filled pillars
     vs the framework. <60% = RED, 60–80% = YELLOW.
   - **Touch recency** — days since `lastCallAt` / last email. >14d
     on an open deal = YELLOW, >30d = RED.
   - **Next step confirmed vs TBD** — latest call's `nextStep`. TBD
     = YELLOW minimum.

   Worst-signal wins — one RED makes the deal RED.

4. **Rank by risk × ARR.** RED high-ARR deals surface first. Include
   the drivers citation for each.

5. **Write the report** to `deal-health/{YYYY-MM-DD}.md.tmp` →
   rename:

   ```markdown
   # Deal health — {date}

   ## RED (N)
   - {Deal} · ${ARR} · drivers: stage-age 45d (norm 21d), champion UNKNOWN, last touch 22d.
   - ...

   ## YELLOW (N)
   ...

   ## GREEN (N — not listed)

   ## Suggested moves
   - @ae prepare-call for {top-RED}
   - @sdr find-references for {top-RED}
   ```

6. **Update `deals.json`** — set `risk` + `riskReason` per deal.
   **This is a mutation on OUR agent file, not the CRM.** If the CRM
   should also be updated, surface the diff for approval.

7. **Append to `outputs.json`** with `type: "deal-health"`.

8. **Summarize.** The top RED deal + the recommended next move.

## Outputs

- `deal-health/{YYYY-MM-DD}.md`
- Updates `../ae/deals.json` risk fields (this is within-workspace, not CRM).
- Appends to `outputs.json`.
