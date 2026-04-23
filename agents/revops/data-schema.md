# RevOps — Data Schema

All records share:

```ts
interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

Atomic writes only. Never under `.houston/<agent>/` at runtime.
Read-only CRM by default; mutations require approval.

---

## Config

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile { userName: string; company: string; onboardedAt: string; status: "onboarded" | "partial"; }
```

### `config/crm.json` — written by `onboard-me`

```ts
interface CrmConfig {
  provider: string;           // composio slug: HUBSPOT | SALESFORCE | ATTIO | PIPEDRIVE
  dealPipelineId?: string;
  defaultOwner?: string;      // the founder's user ID in the CRM
  capturedAt: string;
}
```

### `config/deal-stages.json` — written by `onboard-me` (hydrated from playbook)

```ts
interface DealStages {
  stages: { name: string; exitCriteria: string[]; normAgeDays: number }[];
  capturedAt: string;
}
```

### `config/scoring.json` — written by `onboard-me`

```ts
interface Scoring {
  hardCriteria: string[];     // must-hit for GREEN
  softCriteria: { criterion: string; weight: number }[];
  routingPolicy: {
    green: "ae";              // who gets GREEN leads
    yellow: "sdr";
    red: "drop";
  };
  capturedAt: string;
}
```

---

## Cross-agent reads

- `../head-of-sales/sales-playbook.md` — required.
- `../sdr/leads.json` — scored leads' canonical source.
- `../ae/deals.json` + `../ae/calls/*/analysis.md` — deal activity for
  pipeline / forecast / health.
- `../csm/customers.json` — renewals in the forecast window.

---

## Domain data

### `reports.json` + `reports/{period}/*`

```ts
interface ReportRow extends BaseRecord {
  period: string;             // "2026-W17"
  kind: "weekly" | "monthly";
  summary: string;
  path: string;
}
```

`reports/{YYYY-WW}/pipeline.md` — narrative weekly report.

### `queries.json` + `queries/{slug}.md`

```ts
interface QueryRow extends BaseRecord {
  slug: string;
  question: string;
  provider: string;           // composio slug used
  queryDsl: string;           // the query we ran (SQL / tool call JSON)
  resultSummary: string;
  rowsReturned: number;
  path: string;
}
```

### `lead-scores.json` — bulk scoring output

```ts
interface LeadScore extends BaseRecord {
  leadSlug: string;
  fitScore: "GREEN" | "YELLOW" | "RED";
  hardHits: string[];
  softScore: number;
  reasoning: string;
}
```

### `routing-decisions.json`

```ts
interface RoutingDecision extends BaseRecord {
  leadSlug: string;
  fitScore: "GREEN" | "YELLOW" | "RED";
  route: "ae" | "sdr" | "drop";
  routedAt: string;
  crmMutationApplied: boolean;
  crmMutationApprovedBy?: string;
}
```

### `hygiene-sweeps/{date}.md`

Per-sweep report. Structure: issue type · count · diff list · path
to per-issue detail.

### `deal-health/{date}.md`

Per-deal score with drivers. Ranked by risk × ARR.

### `forecasts/{YYYY-WW}.md`

Commit / Best / Pipeline buckets with week-over-week deltas.

### `outputs.json`

```ts
interface Output extends BaseRecord {
  type: "pipeline" | "query" | "score" | "route" | "hygiene" | "deal-health" | "forecast";
  title: string;
  summary: string;
  path: string;
  status: "draft" | "ready";
}
```
