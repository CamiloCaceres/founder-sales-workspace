# Founder Sales Workspace

A Houston workspace of **five AI sales hires for solo founders**. You
chat with them; they produce markdown artifacts (playbooks, enriched
lead dossiers, call readouts, battlecards, proposals, pipeline reports,
renewal drafts) and keep them consistent across the funnel via one
shared sales playbook.

Built for: the founder at week 0 with a handful of inbound leads they
haven't replied to, an outbound list they haven't touched, a pricing
page that's a guess, and no budget for a sales hire or a RevOps
contractor.

---

## The five agents

| Agent | Hired to… | Good first prompt |
|-------|-----------|-------------------|
| **Head of Sales** | Own the playbook, coordinate the team, weekly sales review | "Help me write my sales playbook — ICP, qualification, pricing, objections" |
| **Sales Development Representative** | Prospecting, research, enrichment, outreach drafts, inbox triage | "Enrich Jane Doe at Acme" |
| **Account Executive** | Discovery → close — call prep, analysis, battlecards, proposals, close plans | "Prep me for tomorrow's Acme discovery call" |
| **Customer Success Manager** | Post-close — onboarding, health, Quarterly Business Reviews, renewals, saves, expansion | "Plan the onboarding for Acme" |
| **Revenue Operations** | Pipeline, CRM, lead scoring, forecasts, CRM hygiene | "Run this week's pipeline readout" |

---

## Shared state — the sales playbook

The **Head of Sales** owns a single source-of-truth document:
`agents/head-of-sales/sales-playbook.md`.

It holds the ICP + buying committee, qualification framework, pricing
stance, objection handbook, deal stages, and primary-call goal. Every
other agent reads it via `../head-of-sales/sales-playbook.md` before
doing substantive work. Until it exists, the other four agents stop
and ask the founder to talk to the Head of Sales first.

This is the single highest-leverage pattern in the workspace: one
doc, five agents, one voice.

---

## Install

In Houston: **Add workspace from GitHub → paste the workspace repo URL**.
All five agents install together under `~/.houston/agents/` and a
workspace entry appears in the sidebar.

---

## First prompts — copy / paste

**Head of Sales**

- "Help me write my sales playbook — ICP, qualification, pricing, objections"
- "Mine my last 10 sales calls for playbook edits"
- "Give me the Monday sales review"
- "Brief me for the day"

**Sales Development Representative**

- "Enrich Jane Doe at Acme"
- "Research Acme end-to-end — news, stack, socials, intent signals"
- "Find 20 leads in {segment} I can reach out to this week"
- "Triage my inbox and draft responses"

**Account Executive**

- "Prep me for my discovery call with Acme tomorrow at 2pm"
- "Read out my Acme discovery call — talk ratio, pain, objections"
- "Battlecard for Acme vs Competitor X"
- "Draft a one-pager proposal for Acme"

**Customer Success Manager**

- "Plan the onboarding for {customer}"
- "Score {customer} — GREEN / YELLOW / RED on health"
- "Prep a Quarterly Business Review for {customer}"
- "Draft the renewal motion for {customer}"

**Revenue Operations**

- "Run this week's pipeline readout"
- "Score the whole inbound queue against my ICP"
- "Sweep the CRM for dupes, missing fields, stage mismatch"
- "Build this week's commit / best / pipeline forecast"

---

## How each agent works

- **Chat-first.** Ask in natural language; the agent picks the right
  skill.
- **Markdown outputs.** Every substantive deliverable lands as a
  markdown file under the agent's root (`leads/{slug}/`,
  `deals/{slug}/`, `customers/{slug}/`, `reports/{period}/`, …) plus
  a row in the agent's `outputs.json` (or domain index like
  `leads.json`).
- **Composio for every external transport.** Inboxes, CRMs,
  enrichment APIs, meeting-notes apps, calendars, web-scrape — all
  via `composio search <category>` at runtime. No hardcoded tool
  names. If a connection is missing the agent tells you which
  category to link and stops.
- **Never send, post, or commit without approval.** Every agent is a
  drafter. You ship.

---

## Build guide

Full team-level spec: `TEAM-GUIDE.md`. Workspace-scoped conventions:
`BUILD-CONVENTIONS.md`. Raw Gumloop research the skills were derived
from: `research/gumloop-sales-catalog-2026-04-23.md`.
