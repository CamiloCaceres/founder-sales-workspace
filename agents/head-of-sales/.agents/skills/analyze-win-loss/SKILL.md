---
name: analyze-win-loss
description: Use when the founder wants to understand why deals are won or lost, after ≥5 closed-won and ≥5 closed-lost deals accumulate, or at quarter close — cluster deals by win-reason / loss-reason, identify patterns, and propose messaging / pricing / process changes for the playbook.
---

# Analyze Win-Loss

Pull closed-won and closed-lost deals, cluster by reason, surface the
top 3 win drivers and top 3 loss drivers, and hand back a themed
write-up with concrete messaging / pricing / process edits for
`sales-playbook.md`.

Single-call analysis is AE's `analyze-discovery-call`. Across-N-call
synthesis of open deals is `mine-call-insights`. This skill is
different — it's **closed-deal retrospective** focused on what makes us
win or lose. Output is a read-out, not an edit to the playbook. The
founder decides which changes to lock in.

## When to use

- "analyze win-loss" / "why are we winning" / "why are we losing".
- "quarterly win-loss review" / "run win-loss on {period}".
- Triggered automatically when `weekly-sales-review` detects the
  threshold (≥5 wins AND ≥5 losses since last review) has been crossed.
- At quarter close — founder kicks it off manually.

## Principles

- **Never invent quotes, reasons, or account names.** If I can't cite
  the source (CRM note, call transcript, or founder memory captured in
  writing), I don't claim it. Representative quotes are verbatim.
- **Frequency beats drama.** A loss reason appearing in 40% of losses
  matters more than one theatrical blow-up. Rank by frequency.
- **Playbook implications are the point.** Themes are observations;
  recommendations are decisions. Every theme ends with a concrete
  proposed edit (messaging line, pricing move, process change).
- **Sample size is a disclosure.** If there are only 6 wins and 5
  losses, say "sample: 6 wins / 5 losses" out loud.
- **Closed-won AND closed-lost.** Winning-only or losing-only analyses
  miss the contrast. If one side is thin, say so.

## Steps

1. **Read the playbook.** Load `sales-playbook.md`. If missing, stop
   and tell the founder to run `define-sales-playbook` first — there's
   nothing to compare findings against.

2. **Resolve the period + sample.** Parse from the founder's prompt:
   explicit quarter (`2026-Q1`), month, or "last N closed deals." If
   no period is given, default to the trailing 90 days. Compute
   `period` as `YYYY-QN` or `YYYY-MM-DD--YYYY-MM-DD`.

3. **Pull closed deals — best modality first:**

   a. **Connected CRM.** Run `composio search crm` → list deals with
      `stage = closed-won OR closed-lost` in the period. For each deal
      capture: account name, ACV if disclosed, stage-lost-at (if
      loss), primary reason field if the CRM has one, notes, owner.

   b. **Connected conversation-intelligence tool.** Run
      `composio search call-recorder` → pull transcripts tied to each
      closed deal. Prefer the last 2 calls before close (or close-lost
      signal). Extract verbatim objections, competitor mentions, and
      the moment the deal tipped.

   c. **AE `calls/` folder** (if the AE agent is installed) — read
      `../ae/calls/*/analysis.md` and cross-reference to the closed
      deals.

   d. **Founder memory fallback.** If no CRM is connected and no call
      data exists, ask the founder once, naming best modality first:
      *"No connected CRM or call-recorder — want me to (1) connect
      one now from the Integrations tab, (2) have you paste the 10
      most recent closed deals with a one-line outcome each, or (3)
      walk through them verbally and I'll capture as we go?"*
      Whichever they pick, write the captured memory to
      `config/closed-deals-{period}.json` before analyzing.

4. **Check sample size.** Minimum viable sample is 5 wins AND 5
   losses. If either side is below, tell the founder and ask whether
   to proceed with a caveat or wait. Don't silently ship a 3-deal
   "analysis."

5. **Extract per-deal observations.** For every deal in scope capture:

   - `outcome` — `win` | `loss`
   - `accountName` (sourced, never invented)
   - `acv` (if disclosed)
   - `stageLostAt` — for losses only; the stage the deal died in
   - `primaryReason` — the stated reason (from CRM field, call
     transcript, or founder capture)
   - `secondaryReasons` — patterns that came up even if not the top
   - `verbatimQuote` — one representative quote with source (file
     path or CRM record URL)
   - `competitor` — named competitor if they came up (losses only
     usually)
   - `segment` — ICP slice (industry · size · role · stage) so we can
     see whether losses cluster

6. **Cluster into themes.** Group observations into 4-8 themes per
   side (wins + losses), named in plain language — not jargon.

   **Loss-reason examples:**
   - "procurement killed the deal" / "security review took 6+ weeks"
   - "competitor had deeper {feature area}"
   - "pricing sticker shock above {seat-count}"
   - "champion left / got reorged"
   - "no urgency — deal just went cold"

   **Win-reason examples:**
   - "champion was already a user of {adjacent tool}"
   - "compelling event — their {regulator/customer/board} forced a
     decision"
   - "our {differentiator} closed the loop on {pain}"
   - "time-to-value demo in the first call beat their incumbent"

   A theme with only one deal is not a theme — merge it up or drop.

7. **Quantify each theme:**
   - `frequencyPct` = deals where theme appeared / total sample on
     that side (wins or losses)
   - `sampleSize` — N wins or N losses
   - `segmentConcentration` — does this theme cluster in a specific
     ICP slice? (e.g. "6 of 7 procurement losses were 500+ employees")

8. **Pick representative quotes.** One verbatim quote per theme if
   one exists, with `quoteSource` naming the file path or CRM record.
   If no verbatim exists, set `representativeQuote: ""` and
   `quoteSource: "no-verbatim-available"`. Never fabricate.

9. **Identify the top 3 win drivers and top 3 loss drivers.** Ranked
   by `frequencyPct`, ties broken by `acv` impact if available.

10. **Draft playbook implications per theme.** One concrete change,
    not "consider X." Split into three buckets:

    - **Messaging** — line the founder can steal verbatim. Example:
      "Lead with 'we install in <15 minutes; your incumbent took
      {benchmark}' — pulled from 4 wins."
    - **Pricing** — band change, new tier, discount policy edit.
      Example: "Add enterprise pricing landing page OR shift lead
      gate to mid-market where current pricing lands well."
    - **Process** — what we do in the motion. Example: "Publish
      security + SOC2 one-pager earlier — BEFORE procurement, not
      after."

11. **Write the analysis atomically** to
    `win-loss/{YYYY-MM-DD}-review.md.tmp` then rename:

    ```markdown
    # Win-loss review — {period}

    **Sample:** {N-wins} wins · {N-losses} losses
    **Generated:** {YYYY-MM-DD}
    **Period:** {period}
    **Sources:** {connected CRM / call tool / founder capture}

    ## What the data says
    {2-3 paragraph narrative — the story the numbers tell, in
    founder-readable prose. No "we leveraged"; name the pattern.}

    ## Top 3 win drivers
    ### {#1 theme name} — {frequencyPct}% of wins
    Quote: "{verbatim}" ({quoteSource})
    **Proposed messaging change:** {concrete line}
    **Proposed process change:** {concrete step}

    ### {#2} …
    ### {#3} …

    ## Top 3 loss drivers
    ### {#1 theme name} — {frequencyPct}% of losses
    Quote: "{verbatim}" ({quoteSource})
    Segment concentration: {e.g. "5 of 6 in 500+ employee segment"}
    **Proposed messaging change:** {concrete line}
    **Proposed pricing change:** {concrete move}
    **Proposed process change:** {concrete step}

    ### {#2} …
    ### {#3} …

    ## Cross-theme patterns
    {themes that appeared across BOTH wins and losses; segment
    clusters; competitor patterns}

    ## Recommended playbook edits
    1. {edit — section in sales-playbook.md it touches + before/after}
    2. …
    3. …

    ## Methodology
    - Sources: {list file paths / CRM queries / connected tools}
    - Exclusions: {deals dropped from the sample and why}
    - Sample caveats: {anything thin — "only 5 losses, take with salt"}
    ```

12. **Do NOT edit the playbook.** Hand the founder the file and the
    proposed edits. Flag that `define-sales-playbook` can apply them
    on approval — the founder picks which to accept.

13. **Append to `outputs.json`.** Read existing array, append, write
    atomically:

    ```json
    {
      "id": "<uuid v4>",
      "type": "win-loss",
      "title": "Win-loss review — {period}",
      "summary": "<2-3 sentences: top win driver, top loss driver, top proposed edit>",
      "path": "win-loss/{YYYY-MM-DD}-review.md",
      "status": "draft",
      "createdAt": "<ISO-8601>",
      "updatedAt": "<ISO-8601>"
    }
    ```

14. **Summarize to the founder.** One paragraph: the top 3 win
    drivers, the top 3 loss drivers, the single highest-leverage
    proposed edit, and the path. End with: "Approve edits? Reply
    `approve {#}` per item and I'll push them to the playbook via
    `define-sales-playbook`."

## Progressive config capture

- If `config/win-loss-thresholds.json` is missing, use documented
  defaults: minimum sample = 5 wins AND 5 losses; default period = 90
  days. Don't block — note the default used in the methodology
  section and mention it once to the founder so they can override.
- If founder-memory capture happened in step 3d, write the captured
  deals to `config/closed-deals-{period}.json` so the analysis is
  reproducible and the next run can extend the sample.

## Outputs

- `win-loss/{YYYY-MM-DD}-review.md`
- `config/closed-deals-{period}.json` if founder-memory capture ran
- Appends to `outputs.json` with `type: "win-loss"`.
- On approval of proposed edits: triggers a `define-sales-playbook`
  run with the accepted diffs.
