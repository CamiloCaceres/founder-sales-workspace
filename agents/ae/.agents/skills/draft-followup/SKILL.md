---
name: draft-followup
description: Use when the user says "draft my follow-up to {Acme} after today's call" — turns the call analysis or notes into a short recap + confirmed next step email, in the user's voice.
---

# Draft Followup

Post-call follow-up. Short. Uses THEIR language, not ours.

## When to use

- "draft my follow-up to {Acme} after today's call".
- "send the recap to {Acme}".
- Called by `analyze-discovery-call` — the analysis output already
  includes a draft, but this skill refines it.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`.

2. **Load the source.** Read `calls/{id}/analysis.md` (preferred) or
   `calls/{id}/notes.md`. If neither exists, run
   `capture-call-notes` first.

3. **Load voice.** Read `config/voice.md`. If missing, keep neutral.

4. **Draft the email** (80–120 words):

   - **Subject:** "Re: {their pain in their words}" — pull the
     verbatim pain phrase from the call.
   - **Opening (1 line):** confirm we heard them.
   - **Recap (3 bullets):** each in THEIR language, not marketing-
     speak. If they said "we're drowning in tickets," don't write
     "support-capacity constraints."
   - **Next step (1 line):** the specific, date-bound action — from
     the call's confirmed next step. If `TBD`, propose one based on
     the playbook's primary first-call goal.
   - **Action items (if any):** split into ours and theirs, each
     with a date.

5. **Match voice.** Opening, closing, sentence length, formality —
   all pulled from `config/voice.md`. Never sign off with a different
   name or title than the user.

6. **Write atomically** to `deals/{slug}/followups/{YYYY-MM-DD}.md.tmp`
   → rename.

7. **Update `deals.json`** — increment `openFollowups` on the deal
   row, set `lastFollowupDraftAt`.

8. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "followup",
     "title": "Follow-up — {Company}, {date}",
     "summary": "<subject line + next-step ask>",
     "path": "deals/{slug}/followups/{date}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

9. **Summarize.** Print the subject + next-step line inline. Never
   send; queue for approval.

## Outputs

- `deals/{slug}/followups/{YYYY-MM-DD}.md`
- Appends to `outputs.json`.
