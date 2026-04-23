---
name: define-sales-playbook
description: Use when the user says "write my sales playbook" / "draft the playbook" / "our ICP changed" / "let's lock pricing" — drafts or updates the shared `sales-playbook.md` at the agent root, the single source of truth the other four sales agents read.
---

# Define Sales Playbook

The Head of Sales OWNS `sales-playbook.md`. No other agent writes it.
This skill creates or updates it. Its existence is what unblocks the
other four agents in the workspace.

## When to use

- "write my sales playbook" / "draft the playbook" / "let's do the playbook".
- "update the playbook" / "our ICP changed, fix the playbook" / "update
  pricing stance".
- Called implicitly by any other skill that needs the playbook and
  finds it missing — but only after confirming with the user.

## Steps

1. **Read config.** Load `config/company.json`, `config/icp.json`,
   `config/pricing.json`. If any is missing, run `onboard-me` first
   (or ask the ONE missing piece just-in-time with the best-modality
   hint: connected app > file > URL > paste).

2. **Read the existing playbook if present.** If `sales-playbook.md`
   exists, read it so this run is an update, not a rewrite. Preserve
   anything the founder has already sharpened; change only what's
   stale or new.

3. **Mine recent calls if available.** Read `../ae/calls/*/analysis.md`
   (if the AE agent is installed). Pull objection patterns and
   verbatim pain phrases directly into the handbook; don't paraphrase.
   If `call-insights/` already has entries, prefer those.

4. **Draft the playbook (~500–800 words, opinionated, concrete).**
   Structure, in this order:

   1. **Company overview** — one paragraph: what we make, who it's
      for, what makes it worth building now.
   2. **ICP** — industry, size, region, stage. Name **1–2 anchor
      accounts** (real closed-won or target).
   3. **Buying committee** — champion (title + motivations),
      economic buyer (title + what wins them), blocker (who kills
      deals + why), influencers.
   4. **Disqualifiers** — 3–5 hard nos. If we see X, we walk.
   5. **Qualification framework** — MEDDPICC / BANT / the founder's
      own list. Write out the questions the AE asks to score each
      pillar.
   6. **Pricing stance** — model, bands (if disclosed), discount
      policy, minimum viable terms, the non-negotiable line.
   7. **Deal stages + exit criteria** — what moves a deal from
      Stage N → N+1. Concrete: "Stage 2 exits when champion has
      confirmed pain AND identified the economic buyer by name."
   8. **Objection handbook** — top 5 objections + the founder's best
      current response. Prefer verbatim call-derived phrasing over
      marketing-speak.
   9. **Top 3 competitors** — named, with a one-line "they're
      strong at X, we beat on Y" for each.
   10. **Primary first-call goal** — the single ask every discovery
       call lands on. Concrete: "Next step is a technical validation
       with their eng lead in the next 7 days."

5. **Mark gaps honestly.** If a section is thin (no call data yet, no
   anchor account named), write `TBD — {what the founder should bring
   next}` rather than guessing. Never invent.

6. **Write atomically.** Write to `sales-playbook.md.tmp`, then rename
   to `sales-playbook.md`. Single file at agent root. NOT under a
   subfolder. NOT under `.agents/`. NOT under `.houston/<agent>/`.

7. **Update side configs** where the playbook made a decision:
   - If qualification framework changed → `config/qualification.json`.
   - If deal stages changed → `config/deal-stages.json`.
   - If objection list changed → `config/objections.json`.
   Atomic writes.

8. **Append to `outputs.json`.** Read existing array, append a new
   entry, write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "playbook-update",
     "title": "Sales playbook updated",
     "summary": "<2–3 sentences — what changed this pass>",
     "path": "sales-playbook.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (The playbook itself is a live file, but each substantive edit is
   indexed so the founder sees the update on the dashboard.)

9. **Summarize to user.** One paragraph: what you changed, what's
   still `TBD`, and the exact next move (e.g. "run `profile-icp-sales`
   for {segment} to fill out the buying-committee section"). Remind
   them the other four agents now have the context they need.

## Outputs

- `sales-playbook.md` (at the agent root — live document)
- Possibly updated: `config/qualification.json`,
  `config/deal-stages.json`, `config/objections.json`.
- Appends to `outputs.json` with `type: "playbook-update"`.
