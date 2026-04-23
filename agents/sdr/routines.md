# SDR — Routine Recipes

Houston's **Routines** feature runs recurring jobs on a schedule
(cron-style or heartbeat). Each routine fires a Claude session with a
specific prompt against this agent. Ask me to "set up my routines"
and I'll create them via Houston's routines system, or add them
manually from the **Routines** tab inside the agent.

Each recipe below lists:

- **Schedule** — when it fires.
- **Approval mode** — `auto` (I act end-to-end, read-only / local
  writes) or `review` (I propose, you approve before anything leaves).
  For anything that touches outbound, always `review`. See the
  approval-mode rule at the bottom.
- **Prompt** — the exact prompt that runs.
- **Expected output** — the skill invoked and the artifact that lands.

All thresholds (stall period, batch caps, recency windows) come from
`config/` with documented overridable defaults. Override by editing
the referenced config file — never by hardcoding in the prompt.

---

## 1. Inbox triage — every 2 hours, work hours

- **Schedule:** every 2 hours between work-hours-start and
  work-hours-end on weekdays (read from `config/work-hours.json`;
  default 08:00–18:00 local).
- **Approval mode:** `review` — drafts queued, never sent.
- **Prompt:**
  > Run `triage-inbound-reply`. Pull new unread threads from any
  > Composio-connected inbox where I'm the recipient and the latest
  > message isn't mine, from the recency window in
  > `config/triage.json` (default 4 hours). For each, classify,
  > extract action items, and draft a voice-matched response for
  > non-terminal categories. Do NOT send. Summarize counts in chat
  > only if there are replies — stay silent on a zero-reply run.
- **Output:** `replies/{id}/reply.json` + `replies/{id}/draft.md` per
  handled reply; `replies.json` index updated; lead status moved in
  `leads.json`.

## 2. Stalled-thread sweep — daily

- **Schedule:** daily at the sweep time in `config/work-hours.json`
  (default 09:00 local).
- **Approval mode:** `review` — recovery drafts queued, never sent.
- **Prompt:**
  > Read `leads.json`. Find leads where `status` is active (not
  > closed-lost / unsubscribed) and `lastContactedAt` is older than
  > my stall threshold (read from `config/stall-threshold.json`;
  > default 14 days — document this as an overridable default).
  > For each of the top 5 (ranked by `fitScore` GREEN > YELLOW and
  > recency of last engagement), run `draft-grounded-email` in
  > recovery mode — a short voice-matched re-engagement touch that
  > cites a fresh signal from the lead's `leads/{slug}/dossier.md`.
  > Do NOT send. Summarize the list in chat — one bullet per lead
  > with the stall reason and the draft's opening line.
- **Output:** `leads/{slug}/drafts/recovery-{YYYY-MM-DD}.md` per
  flagged lead; chat summary.

## 3. Nightly enrichment — daily evening

- **Schedule:** daily at the enrichment time in
  `config/work-hours.json` (default 19:00 local).
- **Approval mode:** `auto` — enrichment writes locally, no outbound.
- **Prompt:**
  > Read `leads.json`. Find any leads added in the last 24 hours
  > where `enrichedAt` is missing. For each, run `enrich-contact`.
  > Cap at the batch size in `config/enrichment.json` (default 25
  > per run — respect provider quotas). After each run, immediately
  > run `score-icp-fit` on the enriched lead so the morning standup
  > can prioritize by fit. Summarize counts in chat at the end:
  > "{N} enriched · {G} GREEN · {Y} YELLOW · {R} RED."
- **Output:** `leads/{slug}/lead.json` + `leads/{slug}/dossier.md` +
  `leads/{slug}/fit.md` per lead; `leads.json` updated with
  `enrichedAt`, `fitScore`, `fitColor`.

## 4. Weekly prospecting sweep — Monday morning

- **Schedule:** weekly, Monday at the sweep time in
  `config/work-hours.json` (default 09:00 local).
- **Approval mode:** `review` — new leads surface for approval before
  any outreach drafting.
- **Prompt:**
  > Run `find-leads` against the segments I've marked active in
  > `config/segments.json`. Cap per segment at the batch size in
  > `config/prospecting.json` (default 20 leads per segment per
  > week). For each new lead found, immediately run `score-icp-fit`
  > so I can triage. Do NOT draft outreach yet. Summarize in chat:
  > "{N} new leads · {G} GREEN · {Y} YELLOW · {R} RED — want me to
  > draft first-touch for the GREENs?"
- **Output:** new entries in `leads.json`; `leads/{slug}/fit.md`
  per lead; no drafts, no outbound.

## 5. Account research queue — on-demand nightly

- **Schedule:** nightly at the enrichment time +1 hour (default
  20:00 local), only when `config/research-queue.json` is non-empty.
- **Approval mode:** `auto` — research writes locally, no outbound.
- **Prompt:**
  > Read `config/research-queue.json` — the list of accounts I've
  > queued for deep research. For each (cap at the batch size in
  > `config/research.json`, default 5 per night), run
  > `research-account` end-to-end. Write the per-account brief to
  > `leads/{account-slug}/research.md`. After the batch, clear the
  > processed accounts from the queue and summarize in chat:
  > "{N} accounts researched — next I'd draft grounded first-touch
  > for {names}."
- **Output:** `leads/{account-slug}/research.md` per account;
  `config/research-queue.json` trimmed.

---

## How to set these up

Ask me: "Set up my routines — all five." I'll create them via
Houston (names, schedules, prompts, approval modes) and you confirm
each before it goes live.

You can also open the **Routines** tab in this agent and add them
manually — the prompts above are ready to copy-paste.

## Approval-mode rule

**Hard rule: nothing outbound leaves without your explicit approval.**
Every recipe above that could generate a reply, a follow-up, a
re-engagement draft, or a first-touch email runs in `review` mode —
the draft lands locally, I summarize the queue in chat, and you
approve before anything is sent.

`review` (always — anything that could become outbound):

- Inbox triage drafts (recipe 1).
- Stalled-thread recovery drafts (recipe 2).
- First-touch drafts triggered by a prospecting sweep (recipe 4,
  once you hand me the GREENs).

`auto` is fine (read-only or strictly internal local writes):

- Enrichment + fit scoring (recipe 3) — local writes only.
- Account research (recipe 5) — local writes only.
- Lead surfacing in the prospecting sweep (recipe 4, up to the point
  of surfacing — drafting stays `review`).

When in doubt: `review`. A routine that silently sends to a prospect
is a routine that will send the wrong thing once.
