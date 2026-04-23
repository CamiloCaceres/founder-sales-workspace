---
name: query-crm
description: Use when the user asks a natural-language question about their pipeline or customer data — translates the question into a read-only CRM or warehouse query, runs it, returns the answer + the query it ran for reuse.
---

# Query CRM

Derived from Gumloop templates #13 (AI HubSpot Assistant for Slack),
#14 (AI Salesforce Assistant for Slack), #15 (AI Data Analyst for
Snowflake NL→SQL) — generalized.

## When to use

- "what's my pipeline coverage next quarter by stage".
- "how many GREEN leads came in last week".
- "show me deals > $50k that haven't had a touch in 14 days".
- Any pipeline / lead / customer question the user can state in
  English.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`. Needed
   for stage / pipeline terminology.

2. **Load CRM config.** `config/crm.json`. If missing, run `onboard-me`.

3. **Discover the right query tool.** `composio search crm` OR
   `composio search warehouse` depending on where the data lives.
   Prefer CRM for pipeline / deal / lead questions; prefer warehouse
   for usage / aggregate / historical analytics.

4. **Translate the question to a query:**
   - CRM providers (HubSpot / Salesforce / Attio / Pipedrive) —
     build the provider-native filter + properties list.
   - Warehouse providers (Snowflake / BigQuery / Postgres) — build
     SQL.

5. **Show the user the query BEFORE running.** If the query looks
   expensive (no date filter, no limit on a large object, cross-join),
   ask the user to confirm.

6. **Run read-only.** Never use a mutation tool slug.

7. **Summarize the answer** — one paragraph: the direct answer, the
   top-3 supporting rows, and any caveat (stale data, provider
   rate-limit).

8. **Write atomically** to `queries/{slug}.md.tmp` → rename. Slug is
   kebab of the question, truncated. Structure:

   ```markdown
   # {Question}

   **Ran:** {ISO}  **Provider:** {slug}  **Rows:** {N}

   ## Answer
   ...

   ## Top rows
   | ... | ... |

   ## Query
   ```sql  (or tool-call JSON)
   ...
   ```
   ```

9. **Append to `queries.json`** + `outputs.json` with `type: "query"`.

10. **Summarize to user.** The answer + "saved for reuse at {path}".

## Outputs

- `queries/{slug}.md`
- Appends to `queries.json` + `outputs.json`.
