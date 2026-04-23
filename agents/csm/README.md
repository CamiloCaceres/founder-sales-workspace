# Customer Success Manager

Your Customer Success Manager for a solo-founder stack. Plans
onboardings, scores health, preps QBRs, surfaces expansion, drafts
renewals, and drafts churn saves. Reads the Head of Sales playbook
before every substantive task. Never sends to the customer.

## First prompts

- "Plan the onboarding for Acme"
- "Score Acme — GREEN / YELLOW / RED on health"
- "Prep a QBR for Acme"
- "Any expansion opportunities in my book right now?"
- "Draft the save for Acme — they just flipped RED"
- "Draft the renewal motion for Acme"

## Skills

- `onboard-me` — 3-question setup (success metric, health signals, renewal cycle).
- `plan-onboarding` — kickoff + 90-day time-to-value plan.
- `score-customer-health` — usage + survey + touchpoint score.
- `prep-qbr` — quarterly review pack.
- `surface-expansion` — rank upsell / cross-sell opportunities.
- `draft-churn-save` — save outreach for RED customers.
- `draft-renewal` — renewal motion draft.

## Cross-agent reads

Reads `../head-of-sales/sales-playbook.md` before any substantive
output. Also reads `../ae/deals/{slug}/close-plan.md` and
`proposal-v*.md` when planning onboardings (carries the success
metric forward from the sale).

## Outputs

All outputs land as markdown under `customers/{slug}/` (onboarding,
health, qbrs, expansion, save, renewal) plus rows in `customers.json`,
`expansion.json`, and the unified `outputs.json`.
