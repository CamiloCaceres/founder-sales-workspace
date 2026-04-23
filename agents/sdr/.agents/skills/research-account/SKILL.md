---
name: research-account
description: Use when the user names an account and asks for a full brief — site scrape, recent news, tech-stack detection, socials scan, intent signals — one cited brief that feeds directly into outreach drafting.
---

# Research Account

End-to-end account research. Heavier than `enrich-contact` (which is
person-shaped); this is company-shaped and precedes outbound pushes.
Derived from Gumloop templates #19 (Slack research assistant), #24/26
(Scrape LinkedIn + GSheets / + news), #32 (YC Website Framework +
News + Socials), #34/35 (Research a lead / startup → email report).

## When to use

- "research {Acme} end-to-end" / "full account brief on {Acme}" /
  "before I reach out to {Acme}, research it".
- Called by `find-leads` when the user wants deeper context on a
  surfaced lead.
- Called by `draft-grounded-email` when no research file exists yet
  for the lead.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`.
   If missing, stop and ask the user to run the Head of Sales first.

2. **Slugify the account** — kebab-case. Create `leads/{slug}/` if
   missing.

3. **Scrape the site** via `composio search web-scrape` (execute by
   slug). Pull homepage, pricing page, about page, and 1–2 blog /
   newsroom posts. Extract: category positioning, ICP hints, pricing
   transparency (if any), product claims, customer logos.

4. **Detect tech stack** — `composio search tech-stack` (BuiltWith,
   Wappalyzer variants). Capture web framework, hosting, CMS,
   analytics, MarTech, payments. Note anything that changes the
   pitch angle (e.g. "uses Supabase → our integration story lands").

5. **Pull recent news (last 90 days)** — `composio search web-search`.
   Filter for: funding, product launches, hiring spikes, exec moves,
   partnerships, customer wins, incidents. Cite URL per item.

6. **Scan socials** — `composio search linkedin` for the company page
   + top 3 exec posts in the last 30 days. `composio search x` /
   `reddit` if configured. Summarize 3–5 themes.

7. **Flag intent signals.** Cross-reference #3–#6 against the
   playbook's `triggers` list. Surface any match ("hiring VP Eng
   matches our champion-title trigger"). Mark each as STRONG / WEAK /
   INFERRED.

8. **Write the brief** to `leads/{slug}/research.md` (atomic):

   ```markdown
   # {Account} — research

   **Captured:** {ISO date}
   **Sources:** {N} URLs cited inline below.

   ## Positioning & category
   ...cite...

   ## Tech stack
   ...cite...

   ## Last 90 days — news
   ...cite each...

   ## Socials — themes
   ...cite...

   ## Intent signals
   - STRONG — hiring VP Eng (triggers champion-title match). Source: ...
   - WEAK — recent Series B. Source: ...

   ## Recommended angle
   One paragraph. What to lead with in outreach. Cite the signal.
   ```

9. **Update `leads.json`** — find the row by slug (or create it if the
   user asked research before enrichment), set `lastResearchedAt`,
   `sources` (URLs used), and a one-line `researchSummary`. Atomic.

10. **Append to `outputs.json`:**

    ```json
    {
      "id": "<uuid v4>",
      "type": "research",
      "title": "Account research — {Account}",
      "summary": "<2–3 sentences — category, top intent signal, recommended angle>",
      "path": "leads/{slug}/research.md",
      "status": "ready",
      "createdAt": "<ISO>",
      "updatedAt": "<ISO>"
    }
    ```

11. **Summarize to user.** The single recommended angle + a prompt:
    "Draft the email next? `draft-grounded-email for {slug}`".

## Outputs

- `leads/{slug}/research.md`
- Updates `leads.json` row.
- Appends to `outputs.json` with `type: "research"`.
