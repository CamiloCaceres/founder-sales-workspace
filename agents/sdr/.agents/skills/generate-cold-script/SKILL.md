---
name: generate-cold-script
description: Use when the user says "generate a cold-call script for {prospect}" / "draft my opener for {prospect}" — produces a 60–90-second script with opener, pattern-interrupt, 2 discovery questions, soft CTA, and objection branches drawn from the playbook.
---

# Generate Cold Script

Derived from Gumloop template #36 (Cold Calling Script Generator from
LinkedIn URLs).

## When to use

- "generate a cold-call script for {prospect}".
- "draft my cold-call opener for {prospect}".
- "script for my call with {prospect}".

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`
   (for objection handbook + qualification questions + primary
   first-call goal). If missing, stop.

2. **Read the lead's research** if it exists:
   `leads/{slug}/research.md` and `leads/{slug}/dossier.md`. If
   neither exists, ask the user to run `research-account` or
   `enrich-contact` first — don't write a script without grounding.

3. **Read voice.** Load `config/voice.md`. If missing, keep the
   script tonally neutral.

4. **Draft the script:**

   - **Opener (≤8 seconds)** — name the prospect by name, name one
     specific signal from their research (a quote from a recent talk,
     a team they're hiring, a stack choice), and the reason I'm
     calling. No "how are you today".
   - **Pattern-interrupt phrase** — one line that breaks the "cold
     call" script-expectation. Often permission-based ("if you've
     got 30 seconds, I'll explain why I called, and you can tell me
     if it's worth another minute").
   - **2 discovery questions** — pulled from the playbook's
     qualification framework. Concrete, not "what are your
     challenges". Example: "how are you handling X today" where X
     is the pain in the playbook.
   - **Soft CTA** — a time-boxed meeting ask. Use the playbook's
     primary first-call goal.
   - **Objection branches** — for the top 2 objections in
     `config/objections.json`, write a 2-sentence reframe using the
     playbook's best-current response.

5. **Write the script** to `leads/{slug}/cold-script.md` (atomic):

   ```markdown
   # Cold-call script — {Prospect}, {Company}

   **Grounded on:** {research.md / dossier.md}
   **Playbook version:** {date of sales-playbook.md}

   ## Opener (≤8s)
   > ...

   ## Pattern-interrupt
   > ...

   ## Discovery questions
   1. ...
   2. ...

   ## Soft CTA
   > ...

   ## If-objection branches
   ### "{Objection 1}"
   > ...

   ### "{Objection 2}"
   > ...
   ```

6. **Update `leads.json`** — set `lastCallScriptAt` on the row. Atomic.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "cold-script",
     "title": "Cold-call script — {Prospect}",
     "summary": "<one-line opener + the angle>",
     "path": "leads/{slug}/cold-script.md",
     "status": "draft",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize to user.** Print the opener + the soft CTA inline in
   chat so they can dial immediately. Path to the full script.

## Outputs

- `leads/{slug}/cold-script.md`
- Updates `leads.json`.
- Appends to `outputs.json` with `type: "cold-script"`.
