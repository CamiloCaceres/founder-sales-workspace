# CSM — Data Schema

All records share these base fields:

```ts
interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

Atomic writes only. Never under `.houston/<agent>/` at runtime.

---

## Config — learned context

### `config/profile.json`

```ts
interface Profile {
  userName: string;
  company: string;
  onboardedAt: string;
  status: "onboarded" | "partial";
}
```

### `config/success-metric.json` — written by `onboard-me`

```ts
interface SuccessMetric {
  definition: string;          // one-paragraph: what does "successful customer" mean
  measurables: string[];       // how we'd measure each
  source: "paste" | "file" | "playbook";
  capturedAt: string;
}
```

### `config/health-signals.json` — written by `onboard-me`

```ts
interface HealthSignals {
  signals: {
    key: string;               // e.g. "weekly-active-users", "nps", "last-touchpoint-days"
    source: string;            // composio category: product-analytics | survey | crm | support
    green: string;             // threshold for GREEN
    yellow: string;
    red: string;
  }[];
  capturedAt: string;
}
```

### `config/renewal-cycle.json` — written by `onboard-me`

```ts
interface RenewalCycle {
  termMonths: number;          // 12 | 24 | 36
  noticeWeeks: number;         // T-{N} weeks when renewal motion starts
  autoRenew: boolean;
  capturedAt: string;
}
```

### `config/voice.md`

3–5 verbatim samples of the user's customer-facing writing + tone notes.

---

## Cross-agent reads

- `../head-of-sales/sales-playbook.md` — required before every skill.
- `../ae/deals/{slug}/close-plan.md` + `proposal-v*.md` — read
  during `plan-onboarding` to carry the success metric forward.

---

## Domain data

### `customers.json` — customer index

```ts
interface CustomerRow extends BaseRecord {
  slug: string;                // kebab(company)
  company: string;
  primaryContact: { name: string; title: string; email?: string };
  arr?: number;
  plan?: string;
  startedAt: string;
  renewalAt?: string;          // ISO date
  health: "GREEN" | "YELLOW" | "RED";
  healthScoredAt?: string;
  healthDrivers?: string[];
  lastQbrAt?: string;
  openExpansions: number;
}
```

### `customers/{slug}/` — per-customer detail

| File | Written by | Content |
|------|------------|---------|
| `onboarding.md` | `plan-onboarding` | Kickoff + 90-day plan |
| `health.md` | `score-customer-health` | Latest scorecard (overwritten) |
| `qbrs/{YYYY-MM-DD}.md` | `prep-qbr` | Per-quarter QBR |
| `expansion-{YYYY-MM-DD}.md` | `surface-expansion` | Per-opportunity brief |
| `save-{YYYY-MM-DD}.md` | `draft-churn-save` | Per-save draft |
| `renewal-{YYYY-MM-DD}.md` | `draft-renewal` | Renewal motion draft |

### `expansion.json` — opportunity pipeline

```ts
interface ExpansionRow extends BaseRecord {
  slug: string;                // customer-slug--opportunity-slug
  customerSlug: string;
  type: "upsell" | "cross-sell" | "add-on" | "seat-expansion";
  estArr: number;
  effort: "low" | "med" | "high";
  signal: string;              // 1-line cited signal
  status: "surfaced" | "qualified" | "proposed" | "closed-won" | "closed-lost" | "dropped";
}
```

### `outputs.json`

```ts
interface Output extends BaseRecord {
  type: "onboarding" | "health" | "qbr" | "expansion" | "save" | "renewal";
  title: string;
  summary: string;
  path: string;
  status: "draft" | "ready";
}
```
