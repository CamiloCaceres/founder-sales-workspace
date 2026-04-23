# Gumloop Sales Catalog — Full Scrape

**Scrape date:** 2026-04-23
**Scraped by:** Claude Code via MCP Chrome (`mcp__claude-in-chrome__*`).
**Page:** https://www.gumloop.com/templates/solutions/sales
**Header badge:** "40+ Examples" — actual count returned: **42 unique templates**.
**Method:** Scrolled the page to force lazy-loaded cards, then queried the
DOM for all `/templates/{slug}` anchors with their visible titles.

This catalog is the raw input for the per-agent research MDs in the
sibling `research/` folder. Each row gets a Houston verdict
(`NEW-SKILL` / `ROLL-INTO` / `SKIP`) tied to a specific agent slot in the
sales vertical: `head-of-sales`, `sdr`, `ae`, `csm`, `revops`.

Ignore **tool names** in the titles — "with HubSpot and Slack," "with
Circleback and Airtable," "with OpenAI" are Gumloop's vendor picks, not
workflow shape. Houston is Composio-first; the skill binds to the category.

---

## All 42 templates

| # | Title (as shown) | Slug |
|---|------------------|------|
| 1 | LinkedIn Contact Enrichment with HubSpot and Slack - Automated Workflow | `linkedin-contact-enrichment-with-hubspot-and-slack-automated-workflow` |
| 2 | Meeting Transcript Enrichment with Circleback and Airtable - Automated CRM Workflow | `meeting-transcript-enrichment-with-circleback-and-airtable-automated-crm-workflow` |
| 3 | Reference finder agent | `reference-finder-agent` |
| 4 | Search-grounded Email | `search-grounded-email` |
| 5 | Salesforce reporting agent | `salesforce-reporting-agent` |
| 6 | AI Sales Call Analysis Agent \| Gong to Slack Integration | `ai-sales-call-analysis-agent-gong-to-slack-integration` |
| 7 | Sales Battle Card For A Prospect | `sales-battle-card-for-a-prospect` |
| 8 | Business Fit Analyzer | `business-fit-analysis-with-hubspot-crm-and-google-sheets-automated-workflow` |
| 9 | Automated email draft responses with AI | `automated-email-draft-responses-with-ai` |
| 10 | Automated email triage | `automated-email-triage` |
| 11 | Personalized Lead Enrichment & Cold Email Opener Generator | `personalized-lead-enrichment-cold-email-opener-generator` |
| 12 | Competitor Content Gap Analysis & SEO Brief Generator | `competitor-content-gap-analysis-seo-brief-generator` |
| 13 | AI HubSpot Assistant for Slack \| Simple CRM Chatbot | `ai-hubspot-assistant-for-slack-simple-crm-chatbot` |
| 14 | AI Salesforce Assistant for Slack \| Simple Sales CRM Chatbot | `ai-salesforce-assistant-for-slack-simple-sales-crm-chatbot` |
| 15 | AI Data Analyst for Snowflake \| Natural Language to SQL Bot for Slack | `ai-data-analyst-for-snowflake-natural-language-to-sql-bot-for-slack` |
| 16 | HubSpot Sales Automation AI \| CRM Agent for Deal Management & Outreach | `hubspot-sales-automation-ai-crm-agent-for-deal-management-outreach` |
| 17 | Salesforce AI Sales Assistant \| AE/BDR Automation Agent | `salesforce-ai-sales-assistant-aebdr` |
| 18 | BDR - Website Check | `bdr-website-check` |
| 19 | Slack research assistant with Parallel | `slack-research-assistant-with-parallel` |
| 20 | HubSpot Lead Enrichment and Record Management | `hubspot-lead-enrichment-and-record-management` |
| 21 | Intelligent Slack-to-Attio Task Creator | `intelligent-slack-to-attio-task-creator` |
| 22 | Digital Marketing Lead Finder, Enricher, and Organizer for AI Consultants | `digital-marketing-lead-finder-enricher-and-organizer-for-ai-consultants` |
| 23 | LinkedIn URL Auto-Finder Using Email Address | `linkedin-url-auto-finder-using-email-address` |
| 24 | Scrape a company's LinkedIn page and write data to Google Sheets | `scrape-a-companys-linkedin-page-and-write-data-to-google-sheets` |
| 25 | Personal Assistant | `personal-assistant` |
| 26 | Scrape company LinkedIn page and get news | `scrape-company-linkedin-page-and-get-news` |
| 27 | Lead to Research to Email to CRM to Deck | `lead-to-research-to-email-to-crm-to-deck` |
| 28 | Research any company or person to send a personalized outreach or record details in CRM | `research-any-company-or-person-to-send-a-personalized-outreach-or-record-details-in-crm` |
| 29 | Brief me for my upcoming day on Google Calendar | `brief-me-for-my-upcoming-day-on-google-calendar` |
| 30 | LinkedIn Comment Lead Compiler | `linkedin-comment-lead-compiler` |
| 31 | Automated Lead Extraction and Outreach Notification | `automated-lead-extraction-and-outreach-notification` |
| 32 | YC Website Framework Detector, Recent News and Socials Extractor | `yc-website-framework-detector-recent-news-and-socials-extractor` |
| 33 | Analyze and score a candidate's LinkedIn profile | `analyze-and-score-a-candidates-linkedin-profile` |
| 34 | Research a lead, get an email report and draft cold outreach | `research-a-lead-get-an-email-report-and-draft-cold-outreach` |
| 35 | Research a startup, get a comprehensive email report | `research-a-startup-get-a-comprehensive-email-report` |
| 36 | Cold Calling Script Generator from Linkedin URL's | `cold-calling-script-generator-from-linkedin-urls` |
| 37 | Restaurant Google Maps Outreach Automation | `restaurant-google-maps-outreach-automation` |
| 38 | Talk to Google Doc | `talk-to-google-doc` |
| 39 | Talk to Google Sheet | `talk-to-google-sheet` |
| 40 | Lead Scoring and Routing from Typeform to HubSpot | `lead-scoring-and-routing-from-typeform-to-hubspot` |
| 41 | LinkedIn Profile Scraper | `linkedin-profile-scraper` |
| 42 | Local Business Discovery via Google Maps | `local-business-discovery-via-google-maps-1` |

---

## Master mapping (template → agent · skill · verdict)

The four verdicts per the playbook:

- **NEW-SKILL** — first template that establishes a skill (becomes its seed shape).
- **ROLL-INTO** — a sub-variant that adds a use case but not a new skill.
- **SPLIT** — the template actually covers two different jobs; split between agents/skills.
- **SKIP** — pure glue, a generic utility, or out-of-scope for this vertical.

| # | Template | Agent | Skill | Verdict |
|---|----------|-------|-------|---------|
| 1 | LinkedIn Contact Enrichment with HubSpot and Slack | `sdr` | `enrich-contact` | NEW-SKILL (carries forward from existing sdr-agent) |
| 2 | Meeting Transcript Enrichment with Circleback and Airtable | `ae` | `capture-call-notes` | NEW-SKILL |
| 3 | Reference finder agent | `sdr` | `find-references` | NEW-SKILL |
| 4 | Search-grounded Email | `sdr` | `draft-grounded-email` | NEW-SKILL |
| 5 | Salesforce reporting agent | `revops` | `generate-pipeline-report` | NEW-SKILL |
| 6 | AI Sales Call Analysis Agent \| Gong to Slack | `ae` | `analyze-discovery-call` | NEW-SKILL |
| 7 | Sales Battle Card For A Prospect | `ae` | `build-battlecard` | NEW-SKILL |
| 8 | Business Fit Analyzer | `sdr` | `score-icp-fit` | NEW-SKILL |
| 9 | Automated email draft responses with AI | `sdr` | `triage-inbound-reply` | NEW-SKILL |
| 10 | Automated email triage | `sdr` | `triage-inbound-reply` | ROLL-INTO |
| 11 | Personalized Lead Enrichment & Cold Email Opener Generator | `sdr` | `draft-grounded-email` + `enrich-contact` | ROLL-INTO (chained workflow — both sides already covered) |
| 12 | Competitor Content Gap Analysis & SEO Brief Generator | — | — | SKIP (SEO/marketing workflow — belongs to `seo-content` agent) |
| 13 | AI HubSpot Assistant for Slack \| Simple CRM Chatbot | `revops` | `query-crm` | NEW-SKILL |
| 14 | AI Salesforce Assistant for Slack \| Simple Sales CRM Chatbot | `revops` | `query-crm` | ROLL-INTO |
| 15 | AI Data Analyst for Snowflake \| NL→SQL Bot | `revops` | `query-crm` (adjacent — warehouse) | ROLL-INTO (warehouse variant of the same query shape) |
| 16 | HubSpot Sales Automation AI \| CRM Agent for Deal Management & Outreach | `ae` + `revops` | `progress-deal` (AE) + `clean-crm` (RevOps) | SPLIT |
| 17 | Salesforce AI Sales Assistant \| AE/BDR Automation Agent | `ae` + `sdr` | `progress-deal` + `draft-grounded-email` | SPLIT (already covered across both) |
| 18 | BDR - Website Check | `sdr` | `qualify-from-website` | NEW-SKILL |
| 19 | Slack research assistant with Parallel | `sdr` | `research-account` | NEW-SKILL |
| 20 | HubSpot Lead Enrichment and Record Management | `sdr` + `revops` | `enrich-contact` + `clean-crm` | SPLIT (enrich on SDR, CRM-hygiene side on RevOps) |
| 21 | Intelligent Slack-to-Attio Task Creator | `ae` | `queue-followup` | NEW-SKILL |
| 22 | Digital Marketing Lead Finder, Enricher, and Organizer (AI Consultants) | `sdr` | `find-leads` | NEW-SKILL |
| 23 | LinkedIn URL Auto-Finder Using Email Address | `sdr` | `enrich-contact` | ROLL-INTO (inverse enrichment — email → LinkedIn) |
| 24 | Scrape a company's LinkedIn page → Google Sheets | `sdr` | `research-account` | ROLL-INTO |
| 25 | Personal Assistant | `head-of-sales` | `daily-brief` | NEW-SKILL (coordinator's morning brief) |
| 26 | Scrape company LinkedIn page and get news | `sdr` | `research-account` | ROLL-INTO |
| 27 | Lead to Research to Email to CRM to Deck | `sdr` + `ae` | `research-account` + `draft-grounded-email` + `draft-proposal` | SPLIT (end-to-end chain — each step lands in its owner's skill) |
| 28 | Research any company/person → outreach / CRM record | `sdr` | `research-account` + `draft-grounded-email` | ROLL-INTO |
| 29 | Brief me for my upcoming day on Google Calendar | `head-of-sales` | `daily-brief` | ROLL-INTO (calendar-aware variant) |
| 30 | LinkedIn Comment Lead Compiler | `sdr` | `find-leads` | ROLL-INTO (intent-signal variant) |
| 31 | Automated Lead Extraction and Outreach Notification | `sdr` | `find-leads` + `draft-grounded-email` | ROLL-INTO |
| 32 | YC Website Framework Detector, Recent News, Socials | `sdr` | `research-account` | ROLL-INTO (tech-stack variant) |
| 33 | Analyze and score a candidate's LinkedIn profile | — | — | SKIP (recruiter workflow — not sales) |
| 34 | Research a lead, get email report, draft cold outreach | `sdr` | `research-account` + `draft-grounded-email` | ROLL-INTO |
| 35 | Research a startup, get a comprehensive email report | `sdr` | `research-account` | ROLL-INTO |
| 36 | Cold Calling Script Generator from LinkedIn URLs | `sdr` | `generate-cold-script` | NEW-SKILL |
| 37 | Restaurant Google Maps Outreach Automation | `sdr` | `find-leads` | ROLL-INTO (local-biz variant) |
| 38 | Talk to Google Doc | — | — | SKIP (utility — not a role skill) |
| 39 | Talk to Google Sheet | — | — | SKIP (utility) |
| 40 | Lead Scoring and Routing from Typeform to HubSpot | `revops` | `score-lead` + `route-lead` | NEW-SKILL (RevOps-owned; SDR runs single-shot `score-icp-fit`, RevOps runs the **system** across the whole pipe) |
| 41 | LinkedIn Profile Scraper | `sdr` | `enrich-contact` | ROLL-INTO |
| 42 | Local Business Discovery via Google Maps | `sdr` | `find-leads` | ROLL-INTO |

---

## Coverage gaps (not on Gumloop, invented from role knowledge)

Solo founders running sales need these on day one; Gumloop's public
sales catalog under-serves them. Each becomes a NEW-SKILL in the
owning agent.

| Gap | Owner | Skill | Why invented |
|-----|-------|-------|--------------|
| Sales playbook / positioning doc | `head-of-sales` | `define-sales-playbook` | The shared doc — ICP, qualification questions, objection handbook, pricing stance, deal stages. Without this every other agent produces bland output. |
| ICP & persona doc scoped for sales | `head-of-sales` | `profile-icp-sales` | Marketing ICP is broader; sales ICP is narrower ("who signs, who blocks, who budgets") and lives in the playbook. |
| Weekly sales review (not just pipeline data) | `head-of-sales` | `weekly-sales-review` | Gumloop has pipeline reports (RevOps) but no "Monday readout — what shipped, what slipped, what to push" framing. |
| Mine N calls for playbook edits | `head-of-sales` | `mine-call-insights` | Across-N-calls synthesis (pain patterns, objection frequency, win/loss themes) — different from AE's single-call `analyze-discovery-call`. |
| Draft a proposal / quote | `ae` | `draft-proposal` | Generate one-pager proposal with pricing bands, scope, terms. No Gumloop template covers this. |
| Build mutual action plan / close plan | `ae` | `draft-close-plan` | Post-discovery artifact — procurement steps, champion, budget timing, target close date. |
| Pre-call prep pack | `ae` | `prepare-call` | One-pager with recent research, warm paths, likely objections, question bank. |
| Handle objection drafts | `ae` | `handle-objection` | Given an objection and the playbook, draft the response + re-framing. |
| Next-step follow-up draft | `ae` | `draft-followup` | Post-call recap + mutual action plan next step, drafted for approval. |
| Deal health / slippage scoring | `revops` | `score-deal-health` | Gumloop covers pipeline reports; we add "which deals are slipping and why." |
| CRM hygiene sweep | `revops` | `clean-crm` | Deduping, missing-field, stage-mismatch — nobody maintains CRM in a solo founder's life. |
| Weekly forecast | `revops` | `run-forecast` | Commit / Best / Pipeline rollup by week. |
| Customer onboarding plan | `csm` | `plan-onboarding` | Post-close playbook — kickoff, success metrics, time-to-value. No Gumloop template. |
| QBR / check-in prep | `csm` | `prep-qbr` | Quarterly business review pack — usage, outcomes, asks, risks. |
| Health score per customer | `csm` | `score-customer-health` | Usage + sentiment + touchpoint recency → GREEN/YELLOW/RED. |
| Save email on churn signal | `csm` | `draft-churn-save` | On health = RED, draft the save outreach. |
| Expansion opportunity surface | `csm` | `surface-expansion` | On health = GREEN + usage spike, surface upsell/cross-sell. |
| Renewal cycle draft | `csm` | `draft-renewal` | T-90 renewal motion — pricing, terms, multi-year, risk. |

---

## Out-of-scope / SKIP summary

**SKIP (generic utilities):** Talk to Google Doc, Talk to Google Sheet.
These are chat-over-artifact utilities — Houston's baseline covers them
(chat + file reader), so they're not a role skill.

**SKIP (belong to other verticals):**
- Competitor Content Gap Analysis & SEO Brief Generator — belongs to
  `seo-content` in the marketing workspace.
- Analyze and score a candidate's LinkedIn profile — recruiting, not
  sales. Fits `houston-recruiter` in `role-agents-workspace/`.

**Merged into coverage skills (not separate skills):**
- AI Data Analyst for Snowflake — variant of `query-crm` when the
  founder's data lives in a warehouse, not a CRM. One skill, two
  destinations (CRM or warehouse, discovered at runtime via
  `composio search`).

---

## Roll-up by agent (skill counts)

| Agent | NEW-SKILLs derived from Gumloop | Coverage-gap skills | Total skills (excl. `onboard-me`) |
|-------|----------------------------------|----------------------|-----------------------------------|
| `head-of-sales` | 1 (`daily-brief`) | 4 (`define-sales-playbook`, `profile-icp-sales`, `weekly-sales-review`, `mine-call-insights`) | 5 |
| `sdr` | 9 (`enrich-contact`, `find-references`, `draft-grounded-email`, `score-icp-fit`, `triage-inbound-reply`, `qualify-from-website`, `research-account`, `find-leads`, `generate-cold-script`) | 0 | 9 |
| `ae` | 4 (`capture-call-notes`, `analyze-discovery-call`, `build-battlecard`, `queue-followup`) | 5 (`draft-proposal`, `draft-close-plan`, `prepare-call`, `handle-objection`, `draft-followup`) | 9 |
| `csm` | 0 | 6 (`plan-onboarding`, `prep-qbr`, `score-customer-health`, `draft-churn-save`, `surface-expansion`, `draft-renewal`) | 6 |
| `revops` | 3 (`generate-pipeline-report`, `query-crm`, `score-lead` + `route-lead` count as 2 skills) | 3 (`score-deal-health`, `clean-crm`, `run-forecast`) | 7 |

Each agent also ships `onboard-me` (mandatory).

---

## Hand-off

Next phase: write `TEAM-GUIDE.md` arguing the 5-agent split, then
per-agent research MDs under `research/{agent-id}.md`, then build each
agent. The team guide consumes this catalog; the research MDs deep-dive
their agent's subset.
