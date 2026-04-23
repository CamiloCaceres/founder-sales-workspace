---
name: draft-churn-save
description: Use when a customer flips RED or the user says "draft the save for {customer}" — writes a non-defensive save outreach that names the specific signal, offers one concrete remedy, and proposes a dated next step.
---

# Draft Churn Save

The save is NOT a generic "we noticed you haven't been active." It
names the specific signal, offers a specific remedy, and asks for a
specific next step. Generic saves don't save.

## When to use

- `score-customer-health` flips the customer to RED.
- "draft the save for {customer}".
- Manual override on a YELLOW customer the user knows is at risk.

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`.

2. **Read the health drivers.** `customers/{slug}/health.md`. If
   missing, run `score-customer-health` first.

3. **Read voice.** `config/voice.md`. If missing, keep tonally neutral.

4. **Pick the top driver.** The ONE signal that's most actionable.
   Don't list three — pick one; the rest muddy the save.

5. **Draft the save (80–120 words):**

   - **Subject:** specific — "Re: {their original success metric}
     this quarter" beats "checking in".
   - **Open (1 line):** name the specific signal, non-defensively.
     "Your team's WAU dropped 40% over the last 30 days, and tickets
     spiked around {X}."
   - **Remedy (2 lines):** ONE concrete offer — unblock a specific
     feature, schedule a 30-min working session on {X}, rebalance
     scope. Not three options.
   - **Next step (1 line):** a dated ask. "Can we put 30 min on
     Thursday for a working session on {X}?"

6. **Match voice.** Opening / closing / sentence length from
   `config/voice.md`.

7. **Write atomically** to `customers/{slug}/save-{YYYY-MM-DD}.md.tmp`
   → rename.

8. **Append to `outputs.json`** with `type: "save"`, `status: "draft"`.

9. **Summarize.** Print subject + the ask-line inline. Don't send.

## Outputs

- `customers/{slug}/save-{YYYY-MM-DD}.md`
- Appends to `outputs.json`.
