---
name: queue-followup
description: Use when the user says "queue a follow-up on the {deal} for {date}" / "create a task for the {deal} to {action}" — pushes a task into the user's connected task tool (Attio / Linear / Asana / Notion-tasks) with a 1-line context and a link back to the deal file.
---

# Queue Followup

Derived from Gumloop template #21 (Intelligent Slack-to-Attio Task
Creator), generalized.

## When to use

- "queue a follow-up on the {deal} for {date}: {action}".
- "create a task for the {deal} to {action}".
- Called by `draft-followup` or `draft-close-plan` when an action has
  a target date.

## Steps

1. **Read the playbook.** Load `../head-of-sales/sales-playbook.md`
   (for deal stage context — tasks may vary by stage).

2. **Discover the task tool.** Run `composio search task`. Expect
   slugs like `ATTIO_TASKS_CREATE`, `LINEAR_ISSUES_CREATE`,
   `ASANA_TASKS_CREATE`, `NOTION_TASKS_CREATE`, etc. If nothing's
   connected: skip the external write; instead, create a Houston
   activity card in `.houston/activity.json` (via the mount seed
   pattern). Note the fallback clearly in the summary.

3. **Build the task payload:**

   - **Title:** `{Deal company} — {action}`.
   - **Due:** user-specified date, or parse "Friday" / "next week" /
     "EOD" into an absolute ISO date.
   - **Context:** 1 line pulled from the latest call analysis or
     close-plan for this deal — enough that the user knows why this
     task exists without opening the file.
   - **Back-link:** file path `deals/{slug}/...` (the agent's file
     store). Include the absolute path if the task tool supports a
     URL field.

4. **Execute** — call the discovered tool slug with the payload. If
   it fails, surface the error and fall back to the Houston activity
   card.

5. **Record in `deals/{slug}/followups/queue-{YYYY-MM-DD}.md`** —
   task title, due date, target, external URL (if the task tool
   returns one). Single file per queue action, timestamped.

6. **Update `deals.json`** — increment `openFollowups`.

7. **Append to `outputs.json`:**

   ```json
   {
     "id": "<uuid v4>",
     "type": "task-queued",
     "title": "Task queued — {Company}: {action}",
     "summary": "Due {date} · {provider or 'Houston activity card'}.",
     "path": "deals/{slug}/followups/queue-{date}.md",
     "status": "ready",
     "createdAt": "<ISO>",
     "updatedAt": "<ISO>"
   }
   ```

8. **Summarize.** One line: where the task lives + when it's due.

## Outputs

- `deals/{slug}/followups/queue-{YYYY-MM-DD}.md`
- External task in the connected tool (or a Houston activity card).
- Appends to `outputs.json`.
