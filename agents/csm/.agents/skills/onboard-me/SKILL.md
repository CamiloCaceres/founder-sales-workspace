---
name: onboard-me
description: Use when the user says "onboard me" / "set me up" / "let's get started", or on first real task when `config/profile.json` is missing — 3-question interview covering success metric definition, health signals, and renewal cycle.
---

# Onboard Me

## Steps

0. **Preamble — FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   >
   > 1. **How you define 'success'** — one-paragraph on what a
   >    successful customer looks like, and how you'd measure it.
   >    *Best: paste. Or if the Head of Sales playbook has a primary-
   >    success-metric section, I'll hydrate from there.*
   > 2. **Health signals you watch** — what's your GREEN / YELLOW /
   >    RED threshold for each (e.g. WAU, NPS, last-touchpoint days).
   >    *Best: paste a list. Or point me at a connected
   >    product-analytics tool and I'll infer defaults.*
   > 3. **Your renewal cycle** — term months + how many weeks out you
   >    start the renewal motion. *Best: paste ('12 months term,
   >    T-10 weeks').*
   >
   > Let's start with #1 — what does a successful customer look like?"

1. **Capture success metric.** If "use the playbook": read
   `../head-of-sales/sales-playbook.md` for the Primary-first-call-
   goal / success section. Write `config/success-metric.json`.

2. **Capture health signals.** If connected-product-analytics route:
   `composio search product-analytics`, infer which metrics exist,
   propose defaults. User confirms. Write `config/health-signals.json`.

3. **Capture renewal cycle.** Parse "12 months, T-10 weeks" or
   similar. Write `config/renewal-cycle.json`.

4. **Write `config/profile.json`**.

5. **Atomic writes.** `{path}.tmp` → rename.

6. **Hand off:** "Ready. Try: `Plan the onboarding for my next close`."

## Outputs

- `config/profile.json`
- `config/success-metric.json`
- `config/health-signals.json`
- `config/renewal-cycle.json`
