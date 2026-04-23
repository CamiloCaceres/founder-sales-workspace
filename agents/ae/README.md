# Account Executive

Your Account Executive for a solo-founder stack. Runs discovery → close: prep,
capture, analyze, battlecard, objection handling, follow-up drafts,
proposals, and close plans. Reads the Head of Sales playbook before
every substantive task. Never sends, never commits the deal.

## First prompts

- "Prep me for my discovery call with Acme tomorrow at 2pm"
- "Read out my Acme discovery call — talk ratio, pain, objections"
- "Capture notes from my Acme call transcript"
- "Battlecard for Acme vs Competitor X"
- "They said '{objection}' — draft my reframe"
- "Draft my follow-up to Acme after today's call"
- "Draft a one-pager proposal for Acme"
- "Build a mutual action plan with Acme"
- "Queue a follow-up on the Acme deal for Friday"

## Skills

- `onboard-me` — 3-question setup.
- `prepare-call` — one-pager prep pack.
- `capture-call-notes` — transcript → structured notes.
- `analyze-discovery-call` — talk-ratio, pain, objections, next step.
- `build-battlecard` — per-prospect vs a competitor.
- `handle-objection` — in-call reframe + post-call follow-up.
- `draft-followup` — post-call email.
- `draft-proposal` — one-pager proposal.
- `draft-close-plan` — mutual action plan.
- `queue-followup` — push a task to your connected task tool.

## Cross-agent reads

Reads `../head-of-sales/sales-playbook.md` before any substantive
output. If missing, stops and asks the founder to run the Head of
Sales first. Also reads `../sdr/leads/{slug}/` when prepping a call
for a lead SDR already worked on.

## Outputs

All outputs land as markdown under `deals/{slug}/` (call-prep,
battlecard, objections, followups, proposal, close-plan) or
`calls/{id}/` (notes, analysis) plus rows in `deals.json`,
`calls.json`, `battlecards.json`, and the unified `outputs.json`.
