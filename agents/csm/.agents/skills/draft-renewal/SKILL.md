---
name: draft-renewal
description: Use when a customer hits the T-{N} notice window or the user says "draft the renewal motion for {customer}" — bundles outcomes, expansion, and pricing reasoning into a renewal draft. Never commits pricing outside the playbook's pricing stance.
---

# Draft Renewal

## When to use

- "draft the renewal motion for {customer}".
- A customer's `renewalAt` is within `config/renewal-cycle.json`'s
  notice window.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md` —
   pricing stance is required. If missing, stop.

2. **Read customer history:**
   - `customers/{slug}/onboarding.md` — the locked success metric.
   - `customers/{slug}/qbrs/*.md` — outcomes delivered per quarter.
   - `customers/{slug}/health.md` — current state.
   - `expansion.json` — open expansion opportunities to bundle into
     the renewal.

3. **Read pricing signals:** the current contract state (from CRM if
   connected), the current plan, the term, the ARR.

4. **Compute the ask:**
   - **Renewal** — same plan, same term, or step up?
   - **Expansion** — bundle any surfaced opportunity?
   - **Multi-year** — if the playbook allows, propose with discount.
   - **Pricing** — inside the bands. If the renewal would exceed
     anything, FLAG.

5. **Draft the renewal motion (~300–400 words):**

   1. **Outcomes delivered** — pull specific numbers from QBRs, with
      cite. If outcomes are thin, be honest — don't inflate.
   2. **Next-year ask** — renewal + expansion (if any), with the
      specific SKU / seat / tier.
   3. **Pricing reasoning** — why the ask lands inside policy. If a
      discount is proposed, show the math and the policy it triggers.
   4. **Multi-year option** (if relevant) — with the discount
      rationale and what we give up.
   5. **Target close date** — T-{N} weeks per `renewal-cycle.json`.
   6. **Risk flags** — anything that could derail.

6. **Sanity-check against policy.** Any pricing move outside the
   stance gets `FLAG: needs approval — exceeds {policy clause}`.
   Surface these in the summary.

7. **Write atomically** to
   `customers/{slug}/renewal-{YYYY-MM-DD}.md.tmp` → rename.

8. **Update `customers.json`** — set `renewalMotionDraftedAt`.

9. **Append to `outputs.json`** with `type: "renewal"`,
   `status: "draft"`.

10. **Summarize.** The ask (renewal ARR + expansion ARR) and any
    flags. Suggest handoff to AE for contract redlines if
    approved: `@ae draft-proposal — renewal for {customer}`.

## Outputs

- `customers/{slug}/renewal-{YYYY-MM-DD}.md`
- Updates `customers.json`.
- Appends to `outputs.json`.
