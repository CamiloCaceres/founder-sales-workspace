---
name: clean-crm
description: Use when the user says "sweep the CRM for hygiene" / "clean up the CRM" — detects dupes, missing required fields, and stage mismatches. Writes a diff list. Mutates only on explicit user approval.
---

# Clean CRM

Derived from Gumloop templates #16 (HubSpot Sales Automation) + #20
(HubSpot Lead Enrichment and Record Management) — hygiene side.

## When to use

- "sweep the CRM for dupes, missing fields, stage mismatch".
- "clean up the CRM".
- Scheduled: monthly hygiene sweep.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`. Need
   the required fields per stage + the disqualifiers.

2. **Load `config/crm.json`.** Discover the CRM tool slug.

3. **Pull records:**
   - All contacts created in last 90 days (for dupe detection).
   - All open deals (for stage mismatch + missing fields).

4. **Detect issues:**

   - **Duplicates** — same email OR (same company AND same name).
     For each group, propose a surviving record + the ones to merge.
   - **Missing required fields** — per stage in
     `config/deal-stages.json`, list the required fields (next-step,
     champion-name, close-date). Deals missing these are flagged.
   - **Stage mismatch:**
     - Deal in a "demo" stage with no call analysis on our side →
       flag (stage bumped without evidence).
     - Deal in "proposal" with no `proposal-v*.md` on AE's side →
       flag.
     - Deal stagnant past `normAgeDays` for that stage → flag
       stalled.

5. **Write a hygiene report.** `hygiene-sweeps/{YYYY-MM-DD}.md`:
   counts by issue type + a diff list per issue (what to change +
   source of truth).

   ```markdown
   ## Duplicates (3)
   - Jane Doe @ Acme — records A, B, C. Propose A (oldest + most fields).
   ## Missing fields (8)
   - {Deal X}: missing champion-name. Source from call analysis {path}.
   ## Stage mismatch (4)
   - {Deal Y}: stage=proposal, no proposal-v*.md found. Revert to {prior stage}?
   ```

6. **Do NOT mutate.** Present the diff list to the user. Each row has
   a proposed action (merge / update / revert). Wait for approval.

7. **On approval** — execute mutations in batches. Per-record error
   handling; log in the sweep report.

8. **Append to `outputs.json`** with `type: "hygiene"`.

9. **Summarize.** Issue counts + "X mutations queued for approval."

## Outputs

- `hygiene-sweeps/{YYYY-MM-DD}.md`
- Optional CRM mutations (on approval).
- Appends to `outputs.json`.
