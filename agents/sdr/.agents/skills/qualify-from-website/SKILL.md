---
name: qualify-from-website
description: Use when the user pastes a URL and wants a fast "in-ICP yes/no + angle to pitch" read — one scrape, one decision, one angle. 30 seconds, not a full research pass.
---

# Qualify from Website

The fast lane. Derived from Gumloop template #18 (BDR - Website Check).
Different from `score-icp-fit` (which works from an existing lead
record) and from `research-account` (which is the full brief). This
is "I'm looking at this tab, is it worth my time?".

## When to use

- "look at {url} and tell me if they're in-ICP".
- "is {url} worth enriching?".
- "quick read on {url}".

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`.
   If missing, stop.

2. **Scrape the homepage + about + pricing** via
   `composio search web-scrape`. Small footprint — 3–5 pages max.
   Extract: category positioning, target-customer language, pricing
   disclosure, product claims, customer logos if visible.

3. **Detect the category.** Match against our playbook's ICP
   industries. Note the closest ICP fit (or "out-of-ICP" if none).

4. **Evaluate disqualifiers** — apply each playbook disqualifier. If
   any hits, return NO with the specific disqualifier cited.

5. **Pick the angle.** If in-ICP, identify the single angle I'd lead
   with — grounded in something they actually say on their site.
   Quote it inline.

6. **Write the verdict** to `leads/{slug}/qualify.md` (atomic). Slug
   is kebab(company). Create `leads/{slug}/` if missing.

   ```markdown
   # {Company} — qualify-from-website

   **URL:** {url}
   **Captured:** {ISO}

   ## Verdict
   YES / NO / MAYBE

   ## Signals
   - {signal 1} — cite a line from their site.
   - {signal 2} — cite.
   - {signal 3} — cite.

   ## Angle to lead with
   One paragraph. What I'd open the email / DM / call with — grounded
   in a quoted line from their site.

   ## Next step
   - YES → run `enrich-contact` for the buyer-role title.
   - MAYBE → run `research-account` to validate.
   - NO → skip. Reason: {disqualifier that hit}.
   ```

7. **Update `leads.json`** — if no row exists, add one with
   `status: "new"`, `fitScore: "GREEN"|"YELLOW"|"RED"` (map from
   YES/MAYBE/NO), `qualifiedAt`. Atomic.

8. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "qualify",
     "title": "Qualify — {Company}",
     "summary": "{verdict}. {one-line angle or disqualifier}.",
     "path": "leads/{slug}/qualify.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

9. **Summarize to user.** Verdict + angle + next step, in one short
   paragraph. Link to the file.

## Outputs

- `leads/{slug}/qualify.md`
- Updates `leads.json`.
- Appends to `outputs.json` with `type: "qualify"`.
