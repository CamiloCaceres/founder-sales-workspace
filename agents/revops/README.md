# Revenue Operations

Your Revenue Operations agent for a solo-founder stack. Pipeline
reports, CRM queries, lead scoring + routing, CRM hygiene, deal
health, and weekly forecasts. Reads the Head of Sales playbook before
every substantive task. Read-only by default; CRM mutations require
your approval.

## First prompts

- "Run this week's pipeline readout"
- "Build this week's commit / best / pipeline forecast"
- "Score open deals on health — which are slipping and why?"
- "What's my pipeline coverage for next quarter by stage?"
- "Score the whole inbound queue against my ICP"
- "Route new inbounds — SDR for YELLOW, AE for GREEN, drop RED"
- "Sweep the CRM for dupes, missing fields, stage mismatch"

## Skills

- `onboard-me` — 3-question setup (CRM, stages, scoring rubric).
- `generate-pipeline-report` — narrative weekly rollup.
- `query-crm` — natural-language CRM / warehouse query.
- `score-lead` — bulk ICP scoring across inbound.
- `route-lead` — apply routing policy to scored leads.
- `clean-crm` — hygiene sweep with diff-before-mutate.
- `score-deal-health` — open deals GREEN / YELLOW / RED.
- `run-forecast` — Commit / Best / Pipeline forecast.

## Cross-agent reads

Reads `../head-of-sales/sales-playbook.md` before any substantive
output. Reads `../sdr/leads.json`, `../ae/deals.json`, and
`../csm/customers.json` to cross-reference CRM state with agent
activity.

## Outputs

All outputs land as markdown under subfolders (`reports/`,
`queries/`, `hygiene-sweeps/`, `deal-health/`, `forecasts/`) plus
rows in `reports.json`, `queries.json`, `lead-scores.json`,
`routing-decisions.json`, and the unified `outputs.json`.
