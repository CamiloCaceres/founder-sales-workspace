# Founder Sales Team — Build Guide

**Workspace:** `founder-sales-workspace/`
**Framing:** A solo founder downloads Houston and "hires" a sales
department. No AEs, no SDRs, no RevOps analyst, no CSM, no VP of Sales.
The five agents below are everything they need to run sales ops
end-to-end — from "who should I email this week" to "we just renewed
our first logo."

This document is the **team-level spec**. It sits above the per-agent
Gumloop research MDs (in `research/`). Build order, agent roster,
skill lists, and use cases are decided here. Each agent then gets its
own research MD per `../../gumloop-research-playbook.md`, then its own
build.

The per-template mapping that backs every skill in this guide lives at
`research/gumloop-sales-catalog-2026-04-23.md` (full 42-template Chrome
scrape of `gumloop.com/templates/solutions/sales`).

---

## Who we're building for

**The solo founder, week 0.** They have:

- A product (or close enough) and maybe 0–5 customers.
- A pricing page that's probably a guess.
- Zero sales hires, zero SDR retainer, zero CS contractor.
- A Stripe account, a Google Workspace, maybe HubSpot free or Attio,
  a handful of LinkedIn connections, a meetings tool, a call recorder.
- A vague ICP (they've said "mid-market SaaS" forty times but never
  written it down).
- A handful of inbound leads they haven't replied to, and an outbound
  list they haven't touched in a month.

What they need is **not** another SaaS subscription that tells them
their pipeline is on fire. They need a team they can **chat with**
that produces the artifacts (enriched lead records, drafted emails,
call analyses, deal plans, pipeline readouts, renewal drafts) and
keeps them consistent across the funnel.

**The "done" line:** the founder can go from "I have a product" to
consistently running weekly sales ops (prospect, enrich, draft,
triage, qualify, run discovery, progress deals, keep the CRM honest,
onboard customers, renew) without a human salesperson in the loop.

**Hard nos (baked into every agent):**

- Never send, publish, or commit a deal on the founder's behalf.
- Never invent customer facts, pricing commitments, or references.
- Never close the CRM state on a deal without explicit sign-off.

---

## The five agents

Five hireable roles, each self-contained but aware of the others via
a shared sales playbook. Err toward fewer, sharper agents: two
overlapping agents is worse than one clear one.

| # | Agent | Hired to… | Primary owner of |
|---|-------|-----------|------------------|
| 1 | **Head of Sales** (`head-of-sales`) | Own the sales story and coordinate the team | Sales playbook, ICP, qualification framework, weekly review, morning brief |
| 2 | **Sales Development Representative** (`sdr`) | Run outbound + inbound qualification | Lead research, enrichment, ICP scoring, outreach drafts, inbox triage, cold scripts |
| 3 | **Account Executive** (`ae`) | Run discovery → close | Call prep, call analysis, battlecards, proposals, close plans, follow-ups, objections |
| 4 | **Customer Success Manager** (`csm`) | Run post-close success | Onboarding plans, health scores, Quarterly Business Reviews, renewal drafts, churn saves, expansion surfacing |
| 5 | **Revenue Operations** (`revops`) | Run the pipeline + CRM + data layer | Pipeline reports, CRM queries, lead scoring & routing, CRM hygiene, forecasts, deal-health |

### Why this split (and why not the other splits)

- **Head of Sales, not "Sales Strategist."** Solo founders want to
  chat with a boss-shaped agent that owns the playbook AND coordinates
  the other four. Strategist is academic; the job is operational — it
  owns the weekly review and the morning brief.
- **SDR and AE are separate, not merged.** Prospecting + drafting +
  triage runs on high-frequency, short-form cycles (dozens of
  lead-level artifacts a week). Discovery + closing runs on
  low-frequency, high-stakes cycles (a handful of deal-level artifacts
  a week). Merging them would force one agent to swap modes all day.
  Humans would hire two different people; so do we.
- **CSM is its own agent, not part of AE.** Post-close ops have a
  fundamentally different rhythm (renewal cycles, QBRs, health) and a
  different shared state (customer list, not pipeline). AE handles
  accounts pre-contract; CSM owns them after. The handoff is the
  boundary.
- **RevOps is its own agent, not absorbed into Head of Sales.** The
  volume of Gumloop templates for CRM assistants, pipeline reports,
  lead scoring, and data queries is too high to bolt onto the
  coordinator. RevOps as its own agent also lets the founder invoke it
  ad-hoc ("what's the pipeline look like?" / "what changed this week?")
  without waking up the whole team.
- **We do NOT have** a BDR agent separate from SDR (same role,
  different title), a dedicated Outbound agent (SDR owns it), a Quota
  Coach (HoS owns the review), or a Pricing agent (HoS owns pricing
  stance in the playbook).

### Granularity sanity check

- If the founder would hire two different humans for it, it's two
  agents. SDR + AE → two (real-world split). AE + CSM → two (real-world
  split, even at seed-stage companies).
- CSM could be deferred if the founder has zero paying customers. Ship
  it anyway — the solo-founder bar is "the first close triggers
  onboarding in week N," and we need that agent ready the day the
  contract closes.

---

## Shared state: the sales playbook

All five agents read **one** shared markdown file owned by the Head
of Sales:

- Path (inside the workspace): `agents/head-of-sales/sales-playbook.md`
- Cross-agent read: `../head-of-sales/sales-playbook.md`

It contains:

- **ICP & persona** — ideal company size, industry, stage, buying role,
  champion profile, economic buyer profile, disqualifiers.
- **Positioning vs. top 3 competitors** — who we beat and why, and
  whose gravity we lose to.
- **Pricing stance** — current bands, discount policy, minimum viable
  terms, what's negotiable / what's not.
- **Qualification framework** — the founder's current MEDDPICC-equivalent
  (metrics, economic buyer, decision criteria, decision process, pain,
  champion, competition).
- **Objection handbook** — top 5 objections + the founder's best current
  response (evolves from AE call analyses).
- **Deal stages & exit criteria** — what moves a deal from Stage N → N+1
  (prevents hope-stage bloat in the CRM).
- **Current CTA / first-call goal** — what the founder wants every first
  discovery call to produce.

**Rule baked into every non-HoS agent's `CLAUDE.md`:** "Before any
substantive output, read the sales playbook. If it's empty or stale,
say so and ask the founder to chat with the Head of Sales first."
This mirrors the single-highest-leverage pattern from
`../founder-marketing-workspace/` (positioning doc) and carries forward.

**Mine-call-insights flow:** the Head of Sales can read AE's
`calls/{id}/` outputs and propose playbook edits after every N calls.
This is the only cross-agent *read* beyond the shared doc. AE never
writes to the playbook; HoS is the scribe.

---

## Per-agent skill lists

Each list is a first-pass. The per-agent research MD will tighten
(split, merge, add coverage gaps) before build. Every agent also gets
`onboard-me` (standard across Houston role agents).

### 1. Head of Sales — `head-of-sales`


**Skills (5 + onboard-me):**

| Skill | Use case (README "First prompt") | Source templates |
|-------|----------------------------------|------------------|
| `define-sales-playbook` | "Help me write the sales playbook — ICP, qualification, pricing, objections" | Coverage gap (solo-founder essential) |
| `profile-icp-sales` | "Profile the ICP and buying committee for {product}" | Coverage gap (#8 Business Fit Analyzer is fit-scoring — different from authoring the ICP) |
| `mine-call-insights` | "Mine my last 10 calls for playbook edits — pain, objections, win/loss" | Coverage gap (across-N-call synthesis) |
| `weekly-sales-review` | "Give me the Monday sales review across the team" | Coverage gap |
| `daily-brief` | "What's on today — brief me for the day" | #25 Personal Assistant, #29 Brief me for my upcoming day on Google Calendar |

**Owns:** `sales-playbook.md`, `personas/{slug}.md`,
`reviews/{YYYY-MM-DD}.md`, `briefs/{YYYY-MM-DD}.md`,
`call-insights/{period}.md`.

### 2. Sales Development Representative — `sdr`

**Skills (9 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `enrich-contact` | "Enrich Jane Doe at Acme — firmographics, role, recent signals" | #1 LinkedIn Contact Enrichment w/ HubSpot+Slack, #23 LinkedIn URL Auto-Finder from Email, #41 LinkedIn Profile Scraper, #20 HubSpot Lead Enrichment (enrich side) |
| `research-account` | "Research Acme end-to-end — news, stack, socials, intent signals" | #19 Slack research assistant with Parallel, #24 Scrape LinkedIn + GSheets, #26 LinkedIn + news, #28 Research any company/person, #32 YC Website Framework + news + socials, #34 Research a lead → email report, #35 Research a startup → report |
| `find-leads` | "Find 20 leads in {segment} I can reach out to this week" | #22 Digital Marketing Lead Finder (AI Consultants), #30 LinkedIn Comment Lead Compiler, #31 Automated Lead Extraction, #37 Restaurant Google Maps Outreach, #42 Local Business Discovery via Google Maps |
| `score-icp-fit` | "Score Jane Doe at Acme — GREEN / YELLOW / RED against my ICP" | #8 Business Fit Analyzer |
| `qualify-from-website` | "Look at {url} and tell me if they're in-ICP and what angle to pitch" | #18 BDR - Website Check |
| `find-references` | "Warm paths to Acme — mutual connections, past colleagues, referenceable customers" | #3 Reference finder agent |
| `draft-grounded-email` | "Draft a first-touch email to Jane at Acme grounded in real cited research" | #4 Search-grounded Email, #11 Personalized Lead Enrichment & Cold Email Opener, #27 Lead→Research→Email→CRM→Deck (outreach side) |
| `generate-cold-script` | "Generate a 90-second cold-call script for calling Jane at Acme" | #36 Cold Calling Script Generator from LinkedIn URLs |
| `triage-inbound-reply` | "Triage my inbox and draft responses to new replies" | #9 Automated email draft responses with AI, #10 Automated email triage |

**Owns:** `leads.json`, `leads/{slug}/*` (research.md,
enrichment.json, signals.md, scripts/*, drafts/*),
`replies.json`, `replies/{id}/*`, `searches/{slug}.md`.

### 3. Account Executive — `ae`

**Skills (9 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `prepare-call` | "Prep me for my discovery call with Acme tomorrow at 2pm" | Coverage gap |
| `capture-call-notes` | "Here's my call recording / transcript — capture it" | #2 Meeting Transcript Enrichment w/ Circleback+Airtable |
| `analyze-discovery-call` | "Read out my Acme discovery call — talk ratio, pain, objections, next steps" | #6 AI Sales Call Analysis Agent \| Gong→Slack |
| `build-battlecard` | "Battlecard for Acme vs Competitor X" | #7 Sales Battle Card For A Prospect |
| `handle-objection` | "They said '{objection}' — draft my response" | Coverage gap |
| `draft-followup` | "Draft my post-call follow-up to Acme with next step and recap" | Coverage gap (sequel to analyze-discovery-call) |
| `draft-proposal` | "Draft a one-pager proposal for Acme — scope, pricing, terms" | Coverage gap |
| `draft-close-plan` | "Build a mutual action plan with Acme — procurement steps, champion, timing" | Coverage gap |
| `queue-followup` | "Queue this action as a follow-up on the Acme deal in my CRM/task tool" | #21 Intelligent Slack-to-Attio Task Creator |

**Owns:** `deals.json`, `deals/{slug}/*` (call-prep.md,
discovery-readout.md, battlecard.md, objections.md, followups/*,
proposal.md, close-plan.md), `calls.json`, `calls/{id}/*`.

### 4. Customer Success Manager — `csm`

**Skills (6 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `plan-onboarding` | "Plan the onboarding for {customer} — kickoff, success metric, time-to-value" | Coverage gap (solo-founder essential) |
| `score-customer-health` | "Score {customer} — GREEN / YELLOW / RED on health and why" | Coverage gap |
| `prep-qbr` | "Prep a QBR for {customer} — usage, outcomes, asks, risks" | Coverage gap |
| `surface-expansion` | "Any expansion opportunities in my book right now?" | Coverage gap |
| `draft-churn-save` | "Draft the save outreach for {customer} — health just turned RED" | Coverage gap |
| `draft-renewal` | "Draft the renewal motion for {customer} — pricing, terms, multi-year option" | Coverage gap |

**Owns:** `customers.json`, `customers/{slug}/*` (onboarding.md,
health.md, qbrs/{date}.md, renewal.md, save.md), `expansion.json`.

**Note on Gumloop coverage:** the sales catalog has **zero** CSM-shaped
templates. This agent is entirely coverage-gap territory — which is
itself a signal (Gumloop skews early-funnel; CSM is a real solo-founder
need we're filling deliberately).

### 5. Revenue Operations — `revops`

**Skills (6 + onboard-me):**

| Skill | Use case | Source templates |
|-------|----------|------------------|
| `generate-pipeline-report` | "Run the weekly pipeline readout" | #5 Salesforce reporting agent |
| `query-crm` | "What's my pipeline coverage for next quarter by stage?" | #13 AI HubSpot Assistant for Slack, #14 AI Salesforce Assistant, #15 AI Data Analyst for Snowflake (NL→SQL variant) |
| `score-lead` | "Score the whole inbound queue against my ICP model" | #40 Lead Scoring and Routing from Typeform to HubSpot (scoring side) |
| `route-lead` | "Route new inbounds — SDR for YELLOW, AE for GREEN, drop on RED" | #40 Lead Scoring and Routing (routing side) |
| `clean-crm` | "Sweep the CRM for dupes, missing fields, stage mismatch" | #20 HubSpot Lead Enrichment (hygiene side), #16 HubSpot Sales Automation AI (CRM-tidy portion) |
| `score-deal-health` | "Score open deals on health — which are slipping and why?" | Coverage gap |
| `run-forecast` | "Build this week's commit / best / pipeline forecast" | Coverage gap |

**Owns:** `reports/{period}/*`, `queries/{slug}.md`,
`lead-scores.json`, `routing-decisions.json`, `hygiene-sweeps/{date}.md`,
`deal-health/{date}.md`, `forecasts/{week}.md`.

---

## Gumloop → Houston mapping (from the 42-template scrape)

The full per-template verdicts live at
`research/gumloop-sales-catalog-2026-04-23.md`. This team guide keeps
the summary table only.

### NEW-SKILL by agent (count)

- `head-of-sales`: 1 NEW-SKILL from Gumloop (`daily-brief`); 4 from
  coverage gaps.
- `sdr`: 9 NEW-SKILLs (all Gumloop-derived).
- `ae`: 4 NEW-SKILLs from Gumloop, 5 from coverage gaps.
- `csm`: 0 from Gumloop (entirely coverage-gap).
- `revops`: 3 from Gumloop (`generate-pipeline-report`, `query-crm`,
  `score-lead`/`route-lead`), 3 from coverage gaps.

### Skipped templates

- **Out-of-vertical:** #12 Competitor Content Gap Analysis (→ marketing),
  #33 Candidate LinkedIn scoring (→ recruiting).
- **Generic utilities:** #38 Talk to Google Doc, #39 Talk to Google
  Sheet (Houston's baseline covers these).

### Coverage gaps (summary — details in the catalog MD)

- **Sales playbook** and its dependent doc tree (`head-of-sales`).
- **Post-call artifact set** (`ae`): proposal, close plan, call prep,
  objections, follow-ups.
- **Entire CSM surface** (`csm`): onboarding, health, QBR, renewal,
  save, expansion.
- **Deal-health + forecast** (`revops`).

---

## Build order (recommended)

Don't build all five in parallel — the Head of Sales ships first
because the other four read its `sales-playbook.md`.

1. **Head of Sales** first. Without a playbook, the others produce
   generic output. Ship HoS, have the founder run `define-sales-playbook`
   and `profile-icp-sales`, lock the playbook doc.
2. **SDR** second. Highest-volume work, clearest shape. Already exists
   at `../../sdr-agent/` — we port it into this workspace and extend
   with the 3 new skills the sales-catalog uncovered
   (`find-leads`, `qualify-from-website`, `generate-cold-script`,
   `research-account`).
3. **AE** third. Reads the playbook + SDR's lead records.
4. **RevOps** fourth. Needs pipeline data to be worth running — give
   the founder a week of SDR/AE activity first.
5. **CSM** fifth. Activates on first-close — safe to ship last.

Each agent is built per the playbook:

1. Run `../../gumloop-research-playbook.md` against the sales catalog
   for that role. Output: `research/{agent-id}.md`.
2. Build the agent per `../../role-agents-workspace/role-agent-guide.md`,
   using the research MD's skills table as the skill list and the
   use-cases table as the README "First prompts" + CLAUDE.md "My skills"
   one-liners.

---

## Workspace conventions

- **Directory:** `founder-sales-workspace/` (this dir).
- **Each agent is self-contained** — would work as a standalone install.
  Cross-agent reads are **only** for `sales-playbook.md` (plus HoS
  reading AE's `calls/{id}/*` for `mine-call-insights`), and each
  non-HoS CLAUDE.md handles the "playbook not found" case gracefully.
- **Outputs are markdown + JSON indexes.** Every skill writes a
  markdown artifact (enrichment brief, call readout, proposal draft)
  plus an entry in the agent's top-level `outputs.json` (or a
  domain-specific index like `leads.json`, `deals.json`) for the
  dashboard.
- **Dashboard:** hand-crafted IIFE per agent, read-only, shows the
  founder's mission menu (2-column grid of tiles, each tile a
  click-to-copy mission). See
  `../founder-marketing-workspace/scripts/bundle_template.js` as the
  reference.
- **Data paths never go under `.houston/<agent>/`** — the Houston file
  watcher skips that prefix.
- **Monochrome palette across the whole vertical.** Per the
  `BUILDING-A-VERTICAL.md` lessons: one palette reads as one product.

---

## What lives where (output tree after all five are built)

```
founder-sales-workspace/
├── workspace.json
├── README.md                       # install + first-prompts
├── TEAM-GUIDE.md                   # this file
├── BUILD-CONVENTIONS.md            # copied/tweaked from marketing workspace
├── research/
│   ├── gumloop-sales-catalog-2026-04-23.md
│   ├── head-of-sales.md
│   ├── sdr.md
│   ├── ae.md
│   ├── csm.md
│   └── revops.md
├── scripts/
│   ├── bundle_template.js          # copied from marketing workspace
│   └── generate_bundles.py
└── agents/
    ├── head-of-sales/
    ├── sdr/
    ├── ae/
    ├── csm/
    └── revops/
```

---

## Hand-off to the per-agent phase

The next session (or the next sub-task in this session) does, **per
agent, one at a time starting with Head of Sales**:

1. Start from the catalog at
   `research/gumloop-sales-catalog-2026-04-23.md` — it already contains
   the deep 42-template scrape (Chrome, JS-rendered). For each agent,
   identify the subset of templates mapped to its skills (see the table
   in this guide) and extend with the coverage-gap skills listed above.
2. Write `research/{agent-id}.md` per the playbook template.
3. Build the agent per
   `../../role-agents-workspace/role-agent-guide.md`, writing files
   under `agents/{agent-id}/`.

The skill lists in this guide are the **starting draft**. Per-agent
research will add, remove, and rename — that's expected. When the
research MD and this guide disagree, the research MD wins (it's newer
and closer to evidence).

---

## Deltas vs. the existing `../../sdr-agent/`

The existing `sdr-agent/` ships 10 skills and is the canonical
single-agent reference shape. This vertical **reuses its skill bodies**
for the SDR slot and extends with three sales-catalog-derived skills
(`find-leads`, `qualify-from-website`, `generate-cold-script`,
`research-account`) that weren't in the original 9-template marketing
scrape.

The vertical shifts other skills to the right owner:

- `capture-call-notes`, `analyze-discovery-call`, `build-battlecard` →
  **AE** (pre-close, deal-scoped).
- `generate-pipeline-report` → **RevOps** (cross-deal, data-shaped).

The standalone `sdr-agent/` can continue to exist for users who only
want an SDR install; this workspace is the coordinated team.

---

## Done criteria for this guide

- [x] Team roster locked (5 agents named).
- [x] Per-agent skill list drafted with use-case phrasings.
- [x] Full Gumloop sales scrape (42 templates, Chrome) catalogued with
      verdict per template (see `research/gumloop-sales-catalog-2026-04-23.md`).
- [x] Coverage gaps named.
- [x] Build order decided.
- [ ] Per-agent research MDs exist in `research/`.
- [ ] Agents are built under `agents/`.
- [ ] `workspace.json` + root `README.md` + per-agent `bundle.js`.
- [ ] Local smoke test.
