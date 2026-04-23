# Sales Development Representative

Your AI Sales Development Representative for a solo-founder stack. Prospects,
enriches, researches accounts, scores ICP fit, finds warm paths,
drafts research-grounded outreach, generates cold-call scripts, and
triages inbound replies. Reads the Head of Sales playbook before
every substantive task. Never sends.

## First prompts

- "Enrich Jane Doe at Acme"
- "Research Acme end-to-end — news, stack, socials, intent signals"
- "Find 20 leads in {segment} I can reach out to this week"
- "Score Jane Doe at Acme against my ICP"
- "Look at {url} and tell me if they're in-ICP"
- "Find warm paths into Acme"
- "Draft a first-touch email to Jane Doe at Acme"
- "Generate a cold-call script for Jane Doe at Acme"
- "Triage my inbox and draft responses"

## Skills

- `onboard-me` — 3-question setup (company, ICP, voice).
- `enrich-contact` — firmographic + role + signals.
- `research-account` — end-to-end account brief.
- `find-leads` — surface leads in a segment.
- `score-icp-fit` — GREEN / YELLOW / RED against playbook.
- `qualify-from-website` — fast URL-only read.
- `find-references` — warm paths + intro-ask drafts.
- `draft-grounded-email` — research-cited outreach in your voice.
- `generate-cold-script` — 90-second cold-call script.
- `triage-inbound-reply` — classify + draft responses to replies.

## Cross-agent reads

Reads `../head-of-sales/sales-playbook.md` before any substantive
output. If missing, stops and asks the founder to run the Head of
Sales first.

## Outputs

All outputs land as markdown under per-lead subfolders
(`leads/{slug}/dossier.md`, `research.md`, `fit.md`, `qualify.md`,
`warm-paths.md`, `outreach-draft.md`, `cold-script.md`) or per-reply
(`replies/{id}/draft.md`) plus rows in `leads.json`, `replies.json`,
`searches.json`, and the unified `outputs.json` dashboard index.
