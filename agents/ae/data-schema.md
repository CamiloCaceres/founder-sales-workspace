# AE — Data Schema

All records share these base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

All writes are atomic: write to a sibling `*.tmp` file, then rename.
Never edit in-place. Never write anywhere under `.houston/<agent>/` —
the Houston watcher skips those paths and reactivity breaks. Exception:
the seeded `.houston/activity.json` onboarding card at install time is
fine.

---

## Config — what the agent learns about the user

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  onboardedAt: string;
  status: "onboarded" | "partial";
}
```

### `config/qualification.json` — written by `onboard-me`

```ts
interface Qualification {
  framework: "MEDDPICC" | "BANT" | "custom";
  pillars: { key: string; question: string }[];  // the questions the AE asks per pillar
  capturedAt: string;
}
```

### `config/deal-stages.json` — written by `onboard-me`

```ts
interface DealStages {
  stages: { name: string; exitCriteria: string[] }[];
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me`

Markdown. 3-5 verbatim samples of the user's outbound style plus tone
notes.

### `config/objections.json` — progressive capture by `handle-objection`

```ts
interface ObjectionEntry {
  objection: string;
  bestResponse: string;
  sources: string[];   // call IDs where it surfaced
  updatedAt: string;
}
```

### `config/reference-customers.json` — used by `build-battlecard`

```ts
interface ReferenceCustomer {
  name: string;
  outcome: string;     // the 1-line win
  willReferToOthers: boolean;
}
```

### `config/notes-sync.json` — opt-in for notes upsert

```ts
interface NotesSync {
  enabled: boolean;
  provider?: string;   // composio slug of notes app
}
```

---

## Cross-agent reads

- `../head-of-sales/sales-playbook.md` — the playbook. Required
  before every substantive skill. If missing, stop and surface the
  "run Head of Sales first" message.
- `../sdr/leads/{slug}/` — when prepping a call for a lead the SDR
  already worked on (dossier, research, warm-paths).

---

## Domain data — what the agent produces

### `deals.json` — deal index

```ts
interface DealRow extends BaseRecord {
  slug: string;                // kebab(company-name)
  company: string;
  primaryContact: { name: string; title: string; email?: string };
  championName?: string;
  economicBuyerName?: string;
  stage: string;               // names from config/deal-stages.json
  stageSince: string;
  lastCallAt?: string;
  lastAnalysisAt?: string;
  lastProposalAt?: string;
  closePlanAt?: string;
  openFollowups: number;
  risk: "GREEN" | "YELLOW" | "RED";
  riskReason?: string;
  crmDealUrl?: string;
}
```

### `deals/{slug}/` — per-deal detail

| File | Written by | Content |
|------|------------|---------|
| `call-prep-{YYYY-MM-DD}.md` | `prepare-call` | Pre-call one-pager |
| `battlecard-vs-{competitor}.md` | `build-battlecard` | Per-prospect positioning |
| `objections/{YYYY-MM-DD}-{slug}.md` | `handle-objection` | In-call reframe + post-call email |
| `followups/{YYYY-MM-DD}.md` | `draft-followup` | Post-call follow-up draft |
| `proposal-{v}.md` | `draft-proposal` | One-pager proposal |
| `close-plan.md` | `draft-close-plan` | Mutual action plan |

### `calls.json` — call index

```ts
interface CallRow extends BaseRecord {
  callId: string;              // kebab(date-primary-external)
  dealSlug: string;
  date: string;
  duration?: number;
  attendeesInternal: string[];
  attendeesExternal: string[];
  nextStep: string;            // "TBD" if not agreed
  painCount: number;
  objectionCount: number;
  actionItemsTheirs: number;
  actionItemsOurs: number;
  analyzed: boolean;
}
```

### `calls/{call_id}/` — per-call detail

| File | Written by | Content |
|------|------------|---------|
| `notes.json` | `capture-call-notes` | Structured notes |
| `notes.md` | `capture-call-notes` | Human-readable notes |
| `analysis.md` | `analyze-discovery-call` | Talk-ratio, pains, objections, qual gaps, risk/opp, draft follow-up |

### `battlecards.json`

```ts
interface BattlecardRow extends BaseRecord {
  slug: string;                // deal-slug-vs-competitor
  dealSlug: string;
  competitor: string;
  generatedAt: string;
}
```

### `outputs.json` — dashboard index

Every substantive artifact appends an entry.

```ts
interface Output extends BaseRecord {
  type: "call-prep" | "call-notes" | "call-analysis" | "battlecard"
       | "objection" | "followup" | "proposal" | "close-plan"
       | "task-queued";
  title: string;
  summary: string;
  path: string;
  status: "draft" | "ready";
}
```

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename.
- IDs UUID v4; timestamps ISO-8601 UTC.
- Never under `.houston/<agent>/` at runtime.
- Read-merge-write on indexes. Never overwrite the whole array.
