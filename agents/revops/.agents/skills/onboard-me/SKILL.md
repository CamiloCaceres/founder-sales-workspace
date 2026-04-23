---
name: onboard-me
description: Use when the user says "onboard me" / "set me up" — 3-question interview covering CRM connection, deal stages, and lead-scoring rubric. Hydrates from the Head of Sales playbook if present.
---

# Onboard Me

## Steps

0. **Preamble — FIRST message, then Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   >
   > 1. **Your CRM (or warehouse)** — so I can connect.
   >    *Best: connect it in Integrations tab (HubSpot / Salesforce /
   >    Attio / Pipedrive / Snowflake / BigQuery). I'll discover it
   >    via Composio.*
   > 2. **Your deal stages + exit criteria** — *Best: if the Head of
   >    Sales playbook exists, I'll hydrate from its Deal-stages
   >    section. Otherwise paste.*
   > 3. **Your lead-scoring rubric** — hard criteria (must-hit for
   >    GREEN) and soft criteria (rank). *Best: paste, or hydrate
   >    from the playbook's ICP section.*
   >
   > Let's start with #1 — which CRM do you use? (Or say 'connected'
   > if you've already linked it.)"

1. **Capture CRM.** Run `composio search crm` and list what's
   connected; if nothing, point the user at the Integrations tab and
   stop. Write `config/crm.json` with `{ provider, capturedAt }`.

2. **Capture deal stages.** Read `../head-of-sales/sales-playbook.md`
   if the user says "use the playbook". Otherwise parse paste. Write
   `config/deal-stages.json`.

3. **Capture scoring.** Read playbook's ICP section if applicable.
   Parse hard + soft criteria. Write `config/scoring.json` with
   defaults `routingPolicy: { green: "ae", yellow: "sdr", red: "drop" }`.

4. **Write `config/profile.json`.**

5. **Atomic writes.** `{path}.tmp` → rename.

6. **Hand off:** "Ready. Try: `Run this week's pipeline readout`."

## Outputs

- `config/profile.json`
- `config/crm.json`
- `config/deal-stages.json`
- `config/scoring.json`
