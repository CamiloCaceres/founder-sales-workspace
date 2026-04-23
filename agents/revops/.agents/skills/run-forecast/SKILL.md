---
name: run-forecast
description: Use when the user says "build this week's forecast" / "commit / best / pipeline" — classifies each open deal against playbook exit criteria into Commit / Best / Pipeline / Omit buckets, rolls up ARR, and compares to last week's forecast.
---

# Run Forecast

## When to use

- "build this week's forecast".
- "commit / best / pipeline rollup".
- Scheduled: Friday afternoon (before the HoS review).

## Steps

1. **Read the playbook.** `../head-of-sales/sales-playbook.md`. Deal
   stages + exit criteria drive confidence.

2. **Load open deals.** `../ae/deals.json` joined with
   `../ae/deals/*/close-plan.md` target-close dates.

3. **Score confidence per deal.** Confidence = min(stage-confidence,
   qualification-completeness, close-plan-completeness):

   - **Commit (>80%):** last stage, economic buyer + champion known,
     close plan all steps GREEN, date within the forecast window.
   - **Best (40–80%):** in a mid-funnel stage, most pillars filled,
     close plan present but has UNKNOWNs.
   - **Pipeline (10–40%):** early stage, qualification thin.
   - **Omit (<10%):** stalled, no recent touch, or health RED for a
     reason unlikely to resolve.

4. **Roll up per bucket.** Count, sum ARR, list deals.

5. **Compare to last week's forecast.** Load
   `forecasts/{prior-week}.md`. For each deal, flag movement (moved
   up / down / unchanged / new / gone).

6. **Write the forecast** to `forecasts/{YYYY-WW}.md.tmp` → rename:

   ```markdown
   # Forecast — Week {YYYY-WW}

   ## Commit — ${ARR} ({N} deals)
   - {Deal} · ${ARR} · target {date} · drivers: ...
   ## Best — ${ARR} ({N})
   ...
   ## Pipeline — ${ARR} ({N})
   ...
   ## Omit — ${ARR} ({N})
   ...

   ## Week-over-week
   - Moved UP: {Deal} from Best → Commit (champion aligned EB)
   - Moved DOWN: {Deal} from Commit → Best (legal review surprise)
   - NEW in Commit: ...
   - GONE from Commit: ...

   ## Headline
   Committed total ${X} (last week ${Y}, {delta}).
   ```

7. **Append to `outputs.json`** with `type: "forecast"`.

8. **Summarize.** The headline number + the biggest week-over-week
   move.

## Outputs

- `forecasts/{YYYY-WW}.md`
- Appends to `outputs.json`.
