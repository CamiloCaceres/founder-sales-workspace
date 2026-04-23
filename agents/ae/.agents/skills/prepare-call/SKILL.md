---
name: prepare-call
description: Use when the user says "prep me for my {discovery / demo / followup} call with {Acme}" / "call prep for {Acme}" — produces a one-pager with meeting goal, attendees, question bank, likely objections, and exit criteria.
---

# Prepare Call

A pre-call one-pager I read 5 minutes before walking into the call.

## When to use

- "prep me for my {discovery / demo / followup} call with {Acme}".
- "call prep for {Acme} {date}".
- Called by `daily-brief` when a meeting is imminent and no prep exists.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`.
   If missing, stop and ask the user to run the Head of Sales first.

2. **Read the SDR's lead files if present** —
   `../sdr/leads/{slug}/dossier.md`, `research.md`, `warm-paths.md`.
   If the slug doesn't exist, ask the user if they want a light
   research pass or if they'll paste context.

3. **Pull meeting details** from `composio search calendar` if a
   meeting time was given. Capture attendees (with LinkedIn or
   internal CRM roles).

4. **Compile the one-pager:**

   1. **Meeting goal** — pulled from the playbook's primary first-call
      goal (or user-specified if different).
   2. **Attendees** — name, title, 1-line profile + their likely
      motivation at this meeting.
   3. **Context recap** — 2–3 bullets from the SDR's research.
   4. **Question bank** — 5–8 questions drawn from
      `config/qualification.json`. Prioritize the pillar weakest on
      the deal's current state (if we have prior call analyses,
      reference them).
   5. **Likely objections** — top 2 from `config/objections.json`
      with the reframe.
   6. **Exit criteria** — what has to be true at call-end for this
      deal to advance a stage (pulled from `config/deal-stages.json`).
   7. **Landmines to avoid** — anything from recent call-insights
      flagged as a loss pattern.

5. **Write atomically.** Write to
   `deals/{slug}/call-prep-{YYYY-MM-DD}.md.tmp`, then rename. Create
   `deals/{slug}/` if missing.

6. **Update `deals.json`** — create row if missing, set
   `lastCallPrepAt`.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "call-prep",
     "title": "Call prep — {Company}, {date}",
     "summary": "{meeting goal} · {N} questions · {N} objections prepared.",
     "path": "deals/{slug}/call-prep-{date}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize.** The meeting goal + top 3 questions inline. Path to
   full prep.

## Outputs

- `deals/{slug}/call-prep-{YYYY-MM-DD}.md`
- Updates `deals.json`; appends to `outputs.json`.
