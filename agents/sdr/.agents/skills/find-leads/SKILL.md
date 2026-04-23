---
name: find-leads
description: Use when the user says "find me leads in {segment}" / "give me 20 in {segment}" / "surface leads I can reach out to this week" — surfaces new leads from connected sources or public intent signals, quick-scored and saved to leads.json as `status: new`.
---

# Find Leads

Surface net-new leads in a segment. Derived from Gumloop templates
#22 (Digital Marketing Lead Finder), #30 (LinkedIn Comment Lead
Compiler), #31 (Automated Lead Extraction), #37 (Restaurant Google
Maps Outreach), #42 (Local Business Discovery via Google Maps) —
generalized to any source.

## When to use

- "find me {N} leads in {segment}".
- "surface leads I can reach out to this week".
- "compile leads from {LinkedIn post / subreddit / event}".
- Scheduled: weekly prospecting routine.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`
   and `config/icp.json`. If missing, stop and ask the user to run
   the Head of Sales first.

2. **Pick a source.** Based on the segment + the user's intent, ask
   which source (unless they named one):
   - **Connected CRM** — expand from lookalike of closed-won.
   - **LinkedIn comment thread** — paste a post URL; compile commenters.
   - **Search engine / funding feed** — recent-funding or recent-hire
     signals in the segment.
   - **Google Maps** — for local-biz segments.
   - **Subreddit / community** — recent high-engagement posts.

3. **Pull candidates.** Via `composio search <category>` per picked
   source. Cap at ~3× the requested count to allow filtering.

4. **Per-candidate quick-score** — apply the playbook's hard
   disqualifiers. Drop RED. For each surviving candidate, capture:
   - Company + LinkedIn URL.
   - Primary contact name + title + LinkedIn (if available).
   - The trigger signal that surfaced them (hiring post, Series B,
     commented on X thread, 4.8-star review — cite specifically).
   - Quick fit: GREEN / YELLOW (don't score RED — we dropped them).

5. **Write the search result** to `searches/{slug}.md` (atomic) —
   query, source, date, lead list with trigger signals cited. Slug is
   kebab of the segment + date.

6. **Append to `leads.json`.** For each surviving candidate, append a
   new row with `status: "new"`, `source` (the slug of this search),
   `fitScore` (GREEN/YELLOW). Don't duplicate — check existing rows
   by company + name. Read-merge-write atomic.

7. **Append to `searches.json`:**

   ```ts
   interface SearchRow {
     id: string;
     slug: string;
     segment: string;
     source: string;               // "connected-crm" | "linkedin-post" | ...
     count: number;                // leads surfaced
     query?: string;
     path: string;                 // searches/{slug}.md
     createdAt: string;
     updatedAt: string;
   }
   ```

8. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "search",
     "title": "Leads — {segment}",
     "summary": "<N leads surfaced from {source}. Top signal: {signal}.>",
     "path": "searches/{slug}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

9. **Summarize to user.** The top 3 leads inline + the full file path.
   Suggest: "`enrich-contact` on #1 next?" or "`score-icp-fit` in bulk?".

## Outputs

- `searches/{slug}.md`
- Appends to `leads.json` (new rows only).
- Appends to `searches.json` and `outputs.json`.
