# Head of Sales

Your Head of Sales for a solo-founder stack. Owns the playbook — ICP,
qualification, pricing, objections, deal stages — and coordinates the
other four sales agents through one shared `sales-playbook.md`.

## First prompts

- "Help me write my sales playbook — ICP, qualification, pricing, objections"
- "Profile the buying committee for {segment} — who signs, who blocks"
- "Mine my last 10 sales calls for playbook edits"
- "Give me the Monday sales review"
- "Brief me for today"

## Skills

- `onboard-me` — 3-question setup (company, ICP, pricing stance). Writes `config/`.
- `define-sales-playbook` — drafts or updates the shared `sales-playbook.md`.
- `profile-icp-sales` — buying-committee profile (champion, EB, blocker, disqualifiers).
- `mine-call-insights` — across-N-call synthesis with proposed playbook diffs.
- `weekly-sales-review` — cross-agent rollup + next-move recommendations.
- `daily-brief` — today's meetings, approvals queue, top-3 moves.

## I own the shared sales playbook

The Head of Sales is the ONLY agent that writes `sales-playbook.md`.
It lives at this agent's root. Every other sales agent in the workspace
reads it via `../head-of-sales/sales-playbook.md` before doing any
substantive work. Until it exists, the other four agents stop and ask
the founder to talk to me first.

## Outputs

All outputs land as markdown under a topic subfolder (`personas/`,
`call-insights/`, `reviews/`, `briefs/`) plus a record in
`outputs.json` (shown in the Overview dashboard). `sales-playbook.md`
is a live document and is not recorded in `outputs.json`.
