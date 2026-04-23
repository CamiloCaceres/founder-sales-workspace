---
name: handle-objection
description: Use when the user says "they said '{objection}' — draft my reframe" / "how do I handle '{objection}'" — looks up the objection in the playbook, pulls any call-insights pattern, and drafts a 3-sentence in-call reframe plus a short post-call follow-up email.
---

# Handle Objection

Single-objection handler. Two outputs: the in-call reframe (short,
verbal) and the post-call follow-up email (short, written).

## When to use

- "they said '{objection}' on the {deal} call — draft my reframe".
- "how do I handle '{objection}'".
- Called by `analyze-discovery-call` for any OBJECTION surfaced in
  the call.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`.
   Find the matching entry in the Objection handbook. If missing, ask
   the user to run the Head of Sales first.

2. **Read `config/objections.json`** — richer, progressively-captured
   responses may supersede the playbook's initial version.

3. **Check recent call-insights** — read `../head-of-sales/call-
   insights/*.md` (top 3 most recent) for any pattern that touched
   this objection. Prefer verbatim successful reframes from past
   calls.

4. **Draft the in-call reframe (3 sentences):**

   1. **Acknowledge** — don't backpedal, don't dismiss.
   2. **Reframe** with a concrete customer example or data point
      (use `config/reference-customers.json` if it applies).
   3. **Propose the next step** — specific, time-boxed.

5. **Draft the post-call follow-up email** — 5–8 lines:

   - Subject: "Re: {their pain, in their words}"
   - Open: confirm we heard them.
   - 2–3 bullets: facts/proof addressing the specific objection.
   - Close: concrete next step + date.

   Match voice from `config/voice.md`.

6. **Write atomically** to
   `deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md.tmp` → rename.
   Structure: objection (verbatim) · reframe (3 lines) · follow-up
   email (body) · sources (playbook + calls referenced).

7. **Update `config/objections.json`** — if this objection surfaced a
   new variant, append a capture with `sources: [callId]`.

8. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "objection",
     "title": "Objection — {objection short}",
     "summary": "<reframe first line + follow-up CTA>",
     "path": "deals/{slug}/objections/{date}-{slug}.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

9. **Summarize.** Print the 3-sentence reframe inline so the user can
   use it verbally on the next touch. Path to the full artifact.

## Outputs

- `deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md`
- Possibly updates `config/objections.json`.
- Appends to `outputs.json`.
