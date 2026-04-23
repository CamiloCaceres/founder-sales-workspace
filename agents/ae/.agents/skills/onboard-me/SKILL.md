---
name: onboard-me
description: Use when the user says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (deal stages + qualification, competitors, voice) AND the best way to share each, then a 90-second 3-question interview.
---

# Onboard Me

## When to use

First-run setup. If `../head-of-sales/sales-playbook.md` already
exists, hydrate `config/` from it and ask fewer questions.

## Principles

- Scope + modality preamble, THEN roll into Q1.
- 3 questions max.
- Rank modalities: connected app > file/URL > paste.

## Steps

0. **Preamble — the FIRST message:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your deal stages + qualification framework** — what you use
   >    (MEDDPICC / BANT / your own) and the stages you track. *Best:
   >    paste a list. Or if the Head of Sales playbook exists, I'll
   >    hydrate from there and just confirm.*
   > 2. **Your top 3 competitors** — who you lose deals to. *Best:
   >    paste names. Or point me at a competitive-analysis doc.*
   > 3. **Your voice** — how you write call follow-ups and proposals.
   >    *Best: if you've connected your inbox via Composio, just say
   >    so. Otherwise paste 2-3 recent sent messages.*
   >
   > Let's start with #1 — paste your framework + stages, or say
   > 'use the playbook' if the Head of Sales has shipped."

1. **Capture qualification + deal stages.** If user says "use the
   playbook": read `../head-of-sales/sales-playbook.md`, extract the
   Qualification and Deal-stages sections, write
   `config/qualification.json` and `config/deal-stages.json`. If
   paste, parse and write.

2. **Capture competitors.** Write a brief
   `config/competitors.json` with the top 3 by name. If the playbook
   has a competitor section with more detail, enrich from it.

3. **Capture voice.** If connected inbox: `composio search inbox` →
   fetch 20–30 recent sent messages → extract tone cues. Write
   `config/voice.md`. If paste: write verbatim samples + short tone
   notes.

4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`.

5. **Atomic writes.** `{path}.tmp` → rename.

6. **Hand off:** "Ready. Try: `Prep me for my {next meeting}`."

## Outputs

- `config/profile.json`
- `config/qualification.json`
- `config/deal-stages.json`
- `config/competitors.json`
- `config/voice.md`
