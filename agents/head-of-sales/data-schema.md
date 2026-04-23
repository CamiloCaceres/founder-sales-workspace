# Head of Sales — Data Schema

All records share these base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

All writes are atomic: write to a sibling `*.tmp` file, then rename
onto the target path. Never edit in-place. Never write anywhere under
`.houston/<agent>/` — the Houston file watcher skips those paths and
reactivity breaks. Exception: the seeded `.houston/activity.json`
onboarding card at install time is fine; the agent never writes there
at runtime.

---

## Config — what the agent learns about the user

Nothing in `config/` is shipped in the repo. Every file appears at
runtime, written by `onboard-me` or by progressive capture.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  role?: string;
  onboardedAt: string;        // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/company.json` — written by `onboard-me`

```ts
interface Company {
  name: string;
  oneLine: string;            // one-line pitch
  url?: string;
  painsSolved: string[];
  differentiators?: string[];
  pricing?: { model: string; range?: string; nonNegotiable?: string };
  source: "paste" | "url" | "file";
  capturedAt: string;
}
```

### `config/icp.json` — written by `onboard-me` or `profile-icp-sales`

```ts
interface Icp {
  industry: string[];
  size: { min?: number; max?: number; band?: string };
  role: string[];              // champion titles
  economicBuyer?: string[];    // title patterns of who signs
  stage?: string[];
  triggers: string[];
  examples: string[];          // named anchor accounts
  disqualifiers: string[];     // hard nos
  pains?: string[];
  source: "paste" | "url" | "file" | "connected-crm";
  capturedAt: string;
}
```

### `config/pricing.json` — written by `onboard-me` or `define-sales-playbook`

```ts
interface Pricing {
  model: string;              // usage / seat / platform-fee / hybrid
  bands?: { tier: string; range: string }[];
  discountPolicy?: string;    // up to what, with what approval
  minViableTerms?: string;
  nonNegotiable?: string[];   // the lines we never cross
  capturedAt: string;
}
```

### Other config files (written just-in-time)

| File | Written by | When |
|------|------------|------|
| `config/qualification.json` | `define-sales-playbook` | First run — user picks MEDDPICC / BANT / own |
| `config/deal-stages.json` | `define-sales-playbook` | First run — names stages + exit criteria |
| `config/objections.json` | `define-sales-playbook` or `mine-call-insights` | Updated as patterns surface |
| `config/voice.md` | `onboard-me` | Optional — captures writing style for team-facing drafts |

---

## The shared sales playbook

### `sales-playbook.md` — written by `define-sales-playbook`

**Special file.** Lives at the agent root (NOT in a subfolder, NOT
under `.agents/`). Single source of truth for ICP, qualification,
pricing, and objections across the whole workspace.

- The Head of Sales is the ONLY agent that writes it.
- Every non-HoS agent reads it via
  `../head-of-sales/sales-playbook.md` before any substantive output.
  If missing, they stop and tell the user to run the Head of Sales
  first.
- Live document, NOT recorded in `outputs.json`.

Structure (markdown, ~500–800 words):

1. Company overview + one-line pitch
2. ICP — firmographics, stage, region
3. Buying committee — champion, economic buyer, blocker, influencer
4. Disqualifiers — hard nos
5. Qualification framework — the founder's chosen (MEDDPICC / BANT / own)
6. Pricing stance — model, bands, discount policy, non-negotiable
7. Deal stages + exit criteria (prevents hope-stage bloat)
8. Objection handbook — top 5 objections + best current response
9. Top 3 competitors — who we beat and why; where we lose
10. Primary first-call goal — the one ask every discovery ends with

---

## Domain data — what the agent produces

### `outputs.json` — dashboard index

Single array at the agent root. Every substantive artifact appends an
entry. Read-merge-write atomically — never overwrite the whole array.

```ts
interface Output extends BaseRecord {
  type: "persona"             // profile-icp-sales
       | "call-insight"       // mine-call-insights
       | "review"             // weekly-sales-review
       | "brief";             // daily-brief
  title: string;
  summary: string;            // 2-3 sentences
  path: string;               // relative to agent root
  status: "draft" | "ready";
}
```

### Topic subfolders

All markdown artifacts. One file per deliverable.

| Subfolder | Written by | Filename pattern | Content |
|-----------|------------|------------------|---------|
| `personas/` | `profile-icp-sales` | `{segment-slug}.md` | Buying-committee profile: champion, economic buyer, blocker, disqualifiers, triggers |
| `call-insights/` | `mine-call-insights` | `{YYYY-MM-DD}.md` | N-call synthesis + proposed playbook diffs |
| `reviews/` | `weekly-sales-review` | `{YYYY-MM-DD}.md` | Weekly cross-agent rollup + next moves |
| `briefs/` | `daily-brief` | `{YYYY-MM-DD}.md` | Today's brief. Overwritten per day. |

---

## Cross-agent reads

The Head of Sales reads (never writes) these files:

- `../sdr/outputs.json` — leads enriched, drafts written, replies triaged
- `../ae/outputs.json` + `../ae/calls/{id}/analysis.md` — call analyses
  feed `mine-call-insights`
- `../csm/outputs.json` — customer health changes, renewals touched
- `../revops/outputs.json` + `../revops/reports/{period}/pipeline.md` —
  pipeline movement for the weekly review

Each read handles missing gracefully — if an agent isn't installed or
has no outputs yet, note it as "no activity" and continue.

---

## Write discipline

- **Atomic writes.** Write `{file}.tmp` first, then rename.
- **IDs** are UUID v4.
- **Timestamps** are ISO-8601 UTC.
- **Never write under `.houston/<agent>/` at runtime.** Seeded
  `.houston/activity.json` at install is fine.
- **`sales-playbook.md` is live.** Not recorded in `outputs.json`;
  every update is an atomic rename in place.
