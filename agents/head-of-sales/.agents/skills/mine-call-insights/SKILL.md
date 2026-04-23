---
name: mine-call-insights
description: Use when the user says "mine my last N calls for playbook edits" / "what patterns am I missing" / "extract objections from my calls" — across-N-call synthesis of pains, objections, and win/loss themes, with proposed playbook diffs.
---

# Mine Call Insights

Single-call analysis is the AE's `analyze-discovery-call`. This skill
is different — it's the across-N-call synthesis that tunes the
playbook. The output is a proposed playbook diff the founder approves.

## When to use

- "mine my last {N} calls for playbook edits".
- "what patterns am I missing in my calls".
- "extract objections from my calls".
- Called by `weekly-sales-review` when the prior week had 3+ new call
  analyses.

## Steps

1. **Read the playbook.** Load `sales-playbook.md`. If missing, run
   `define-sales-playbook` first.

2. **Source calls.** First preference: read
   `../ae/calls/*/analysis.md` files from the AE agent (already-analyzed
   calls). Second preference: pull raw transcripts from the user's
   connected call-recording app via `composio search call-recorder`
   and analyze fresh. Ask which the user wants if unclear.

3. **Extract per-call, then aggregate:**

   - **Verbatim pain phrases** — quote 2–3 per call. Aim for 20+
     total. Attribute: `"<quote>" — {Account}, {Date}`.
   - **Objection frequency** — count and rank. Top 5.
   - **Win themes** — in calls that advanced, what language did the
     prospect use when agreeing? What did we say that landed?
   - **Loss / stall themes** — in calls that went silent or lost,
     what was the last objection / competitor mention / concern?
   - **Playbook contradictions** — any prospect phrasing that
     directly contradicts how the current playbook describes the
     pain / category / competitor.

4. **Propose playbook diffs.** For each finding, write an explicit
   before/after:

   ```
   Section: Objection handbook
   Current: "Too expensive → reframe as ROI over 6 months"
   Proposed: "Too expensive → lead with the {X} cost they already pay (pulled from 4 of 10 calls)"
   Evidence: Acme (2026-04-02), Beta Inc (2026-04-09), ...
   ```

5. **Write atomically.** Write to `call-insights/{YYYY-MM-DD}.md.tmp`,
   then rename. Structure: quotes section · objection table · win
   themes · loss themes · proposed playbook diffs.

6. **Do NOT edit the playbook yourself.** Hand the diff to the user
   and wait for approval. On approval: invoke `define-sales-playbook`
   with the accepted diffs.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "call-insight",
     "title": "Call insights — {period}",
     "summary": "<2–3 sentences — top objection, top pain, top proposed edit>",
     "path": "call-insights/{YYYY-MM-DD}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize to user.** One paragraph + the path + "Approve diffs?
   Reply `approve` and I'll push them into the playbook."

## Outputs

- `call-insights/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "call-insight"`.
- On approval: triggers `define-sales-playbook` run.
