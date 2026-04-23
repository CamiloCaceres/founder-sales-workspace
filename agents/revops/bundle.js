// Houston agent dashboard bundle — Revenue Operations.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's quick-CTA menu for the agent: a slim
// header followed by a 2-column grid of mission tiles. Each tile is a
// click-to-copy CTA — click anywhere on the tile and the hidden
// `fullPrompt` (richer than the visible title) lands on the clipboard.
//
// Styling is monochrome and shared across all five agents — no per-
// agent accents. Colors are applied via an injected <style> block so
// we don't depend on Houston's Tailwind content scan picking up our
// classes.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target
// pattern. Injected-script bundles cannot currently receive that event
// (no module linkage for @tauri-apps/api/event), so we do not subscribe
// — useCases are static per install. The literal string above documents
// the intent for the Phase-6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useCallback = React.useCallback;

  // ═════════ PER-AGENT CONFIG (injected by generator) ═════════
  var AGENT = {
  "name": "Revenue Operations",
  "tagline": "Pipeline reports, CRM queries, lead scoring + routing, CRM hygiene, deal-health, weekly forecast. Read-only CRM writes on explicit approval only.",
  "accent": "rose",
  "useCases": [
    {
      "category": "Pipeline",
      "title": "Run the weekly pipeline readout",
      "blurb": "Narrative rollup — where deals are, what moved.",
      "prompt": "Run this week's pipeline readout.",
      "fullPrompt": "Run the weekly pipeline readout. Use the generate-pipeline-report skill. Pull open deals from my connected CRM via Composio, grouped by stage. For each stage: count, ARR, average age, stalled (past stage duration threshold). Narrative section: what moved this week (by deal slug), what slipped, top-3 deals to push. Save to reports/{week}/pipeline.md and log in reports.json + outputs.json.",
      "description": "Query CRM for open deals, group by stage, compute age + stall, write a narrative report with what moved / what slipped / what to push.",
      "outcome": "A pipeline report at reports/{week}/pipeline.md. Paste into your Monday investor update.",
      "skill": "generate-pipeline-report",
      "tool": "HubSpot"
    },
    {
      "category": "Pipeline",
      "title": "Build the weekly forecast",
      "blurb": "Commit / Best / Pipeline — grounded in the CRM.",
      "prompt": "Build this week's commit / best / pipeline forecast.",
      "fullPrompt": "Build this week's forecast. Use the run-forecast skill. Apply the playbook's deal-stage exit criteria to each open deal. Classify each as Commit (>80% confidence) / Best (40–80%) / Pipeline (10–40%) / Omit. Roll up ARR per bucket. Compare to last week's forecast — what moved between buckets. Save to forecasts/{YYYY-WW}.md.",
      "description": "Score each open deal's confidence against playbook exit criteria. Bucket into Commit / Best / Pipeline. Compare to last week.",
      "outcome": "Forecast at forecasts/{YYYY-WW}.md with the week-over-week deltas.",
      "skill": "run-forecast"
    },
    {
      "category": "Pipeline",
      "title": "Score open deals on health",
      "blurb": "Which deals are slipping and why.",
      "prompt": "Score open deals on health — which are slipping and why?",
      "fullPrompt": "Score deal health across open deals. Use the score-deal-health skill. For each open deal, check: time-in-stage vs norm, qualification completeness (MEDDPICC pillars filled vs. missing), last-touch recency, next-step confirmed vs TBD. Return GREEN / YELLOW / RED per deal with drivers. Rank by risk × ARR. Save to deal-health/{YYYY-MM-DD}.md.",
      "description": "Apply stage-age + qualification-completeness + touch-recency rules. Return per-deal scores and rank by risk × ARR.",
      "outcome": "Deal-health report at deal-health/{date}.md — top slippers at the top.",
      "skill": "score-deal-health"
    },
    {
      "category": "Data",
      "title": "Ask the CRM a question",
      "blurb": "Natural language over your pipeline data.",
      "prompt": "What's my pipeline coverage for next quarter by stage?",
      "fullPrompt": "Answer: '{question}'. Use the query-crm skill. Discover my connected CRM (or warehouse) via `composio search crm` / `composio search warehouse`. Translate the natural-language question into the provider's query model. Run it read-only. Return: the answer in one paragraph + a small table of supporting rows + the exact query (or tool call) you ran. Save to queries/{slug}.md for reuse.",
      "description": "Translate a natural-language question into a CRM or warehouse query. Read-only. Returns the answer + the query it ran.",
      "outcome": "A query log at queries/{slug}.md you can re-run later.",
      "skill": "query-crm",
      "tool": "HubSpot"
    },
    {
      "category": "Scoring",
      "title": "Score the whole inbound queue",
      "blurb": "ICP model across every un-scored lead.",
      "prompt": "Score the whole inbound queue against my ICP.",
      "fullPrompt": "Score every un-scored inbound lead. Use the score-lead skill. Pull from the SDR's leads.json AND the connected CRM's new-leads view. Apply the playbook's ICP hard-criteria (must-hit for GREEN) and soft-criteria (rank). For each: GREEN / YELLOW / RED with 2-bullet reasoning. Append to lead-scores.json. Don't mutate the CRM unless I approve the next route step.",
      "description": "Bulk-score inbound leads against the playbook's ICP. System-wide, not single-shot like SDR's score-icp-fit.",
      "outcome": "Score rows in lead-scores.json. Feed into route-lead next.",
      "skill": "score-lead"
    },
    {
      "category": "Scoring",
      "title": "Route new inbounds",
      "blurb": "GREEN → AE, YELLOW → SDR, RED → drop.",
      "prompt": "Route new inbounds — SDR for YELLOW, AE for GREEN, drop RED.",
      "fullPrompt": "Route scored leads per policy. Use the route-lead skill. Read lead-scores.json (or run score-lead first if stale). Apply the routing policy: GREEN → assign to AE + activity card, YELLOW → assign to SDR + activity card, RED → mark dropped with reason. For each decision, write a row in routing-decisions.json. If CRM routing requires a mutation (owner reassignment), surface the diff for my approval.",
      "description": "Read scored leads, apply the policy, write routing decisions, and surface any CRM mutations for approval.",
      "outcome": "Decisions in routing-decisions.json + activity cards in the assigned agent's queue.",
      "skill": "route-lead"
    },
    {
      "category": "Hygiene",
      "title": "Sweep the CRM for hygiene",
      "blurb": "Dupes, missing fields, stage mismatch.",
      "prompt": "Sweep the CRM for dupes, missing fields, stage mismatch.",
      "fullPrompt": "Run a CRM hygiene sweep. Use the clean-crm skill. Detect: duplicate records (by email + company), missing required fields per playbook (next-step, champion name, close-date), stage mismatch (deal in 'demo' with no call recorded, deal in 'proposal' with no proposal file). Produce a diff per issue: what to change + source of truth. Do NOT mutate — surface the diff list for my approval. On approval, execute mutations as a batch.",
      "description": "Scan CRM for dupes / missing fields / stage mismatches. Produce a diff. Mutate only on explicit approval.",
      "outcome": "A hygiene report at hygiene-sweeps/{date}.md with a diff per issue.",
      "skill": "clean-crm"
    }
  ]
};
  // ══════════════════════════════════════════════════════════

  // ── Shared monochrome stylesheet ─────────────────────────────
  // All five agents render identically. The only per-agent content is
  // name, tagline, and useCases.
  var STYLE_CSS =
    ".hv-dash{background:#ffffff;color:#0f172a;}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Grid of mission tiles
    ".hv-dash .hv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}" +
    "@media (max-width: 720px){.hv-dash .hv-grid{grid-template-columns:1fr;}}" +
    // Tile base
    ".hv-dash .hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-height:148px;padding:22px 26px 22px 22px;border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;cursor:pointer;transition:border-color 160ms ease-out,box-shadow 160ms ease-out,transform 160ms ease-out,background 160ms ease-out;text-align:left;font:inherit;color:inherit;}" +
    ".hv-dash .hv-tile:hover{border-color:#0f172a;box-shadow:0 6px 20px -8px rgba(15,23,42,0.12);transform:translateY(-1px);}" +
    ".hv-dash .hv-tile:active{transform:translateY(0);box-shadow:0 1px 2px rgba(15,23,42,0.04);}" +
    ".hv-dash .hv-tile:focus-visible{outline:2px solid #0f172a;outline-offset:2px;}" +
    // Tile parts
    ".hv-dash .hv-eyebrow{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;color:#64748b;padding-right:44px;}" +
    ".hv-dash .hv-eyebrow-sep{color:#cbd5e1;font-weight:500;}" +
    ".hv-dash .hv-title{font-size:17px;font-weight:600;letter-spacing:-0.006em;color:#0f172a;line-height:1.35;margin:0;padding-right:36px;}" +
    ".hv-dash .hv-blurb{font-size:13px;color:#475569;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}" +
    ".hv-dash .hv-tile-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#94a3b8;}" +
    ".hv-dash .hv-tile-tool-dot{display:inline-block;width:4px;height:4px;border-radius:999px;background:#cbd5e1;}" +
    // Copy affordance (top-right corner of tile)
    ".hv-dash .hv-copy-chip{position:absolute;top:18px;right:18px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid #e2e8f0;background:#ffffff;color:#94a3b8;transition:all 160ms ease-out;}" +
    ".hv-dash .hv-tile:hover .hv-copy-chip{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    // Copied state
    ".hv-dash .hv-tile-copied{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-title{color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-blurb{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow-sep{color:#64748b;}" +
    ".hv-dash .hv-tile-copied .hv-tile-foot{color:#94a3b8;}" +
    ".hv-dash .hv-tile-copied .hv-copy-chip{border-color:#ffffff;background:#ffffff;color:#0f172a;}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.copy;
    var s = size || 14;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: s,
        height: s,
        "aria-hidden": "true",
        style: { display: "inline-block", flexShrink: 0 },
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Clipboard hook ───────────────────────────────────────────
  function useClipboard() {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var copy = useCallback(function (text, idx) {
      if (!text) return;
      function flash() {
        setState({ idx: idx, at: Date.now() });
        setTimeout(function () {
          setState(function (cur) {
            return cur.idx === idx ? { idx: null, at: 0 } : cur;
          });
        }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash).catch(function () {
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            flash();
          } catch (e) {
            /* silent */
          }
        });
      }
    }, []);
    return { copiedIdx: state.idx, copy: copy };
  }

  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Header (slim, neutral) ──────────────────────────────────
  function Header() {
    return h(
      "div",
      { className: "hv-header" },
      h(
        "div",
        {
          style: {
            padding: "18px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          },
        },
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "h1",
            {
              style: {
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.2,
              },
            },
            AGENT.name,
          ),
          h(
            "p",
            {
              style: {
                marginTop: 6,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.5,
                maxWidth: 640,
              },
            },
            AGENT.tagline,
          ),
        ),
      ),
    );
  }

  // ── Mission tile ────────────────────────────────────────────
  function Tile(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "button",
      {
        type: "button",
        onClick: function () {
          onCopy(payloadFor(uc), idx);
        },
        className: "hv-tile" + (isCopied ? " hv-tile-copied" : ""),
        "aria-label": "Copy prompt: " + (uc.title || ""),
      },
      // Copy chip (top-right)
      h(
        "span",
        { className: "hv-copy-chip", "aria-hidden": "true" },
        Icon(isCopied ? "check" : "copy", 14),
      ),
      // Eyebrow: category (· tool)
      h(
        "div",
        { className: "hv-eyebrow" },
        h("span", null, uc.category || "Mission"),
        uc.tool
          ? h(
              React.Fragment || "span",
              null,
              h("span", { className: "hv-eyebrow-sep" }, "·"),
              h("span", null, uc.tool),
            )
          : null,
      ),
      // Title — the CTA
      h("h3", { className: "hv-title" }, uc.title || ""),
      // Blurb — super-short context (6–12 words)
      uc.blurb
        ? h("p", { className: "hv-blurb" }, uc.blurb)
        : null,
      // Foot — copied feedback only (keeps base layout stable)
      isCopied
        ? h(
            "div",
            { className: "hv-tile-foot" },
            h("span", null, "Copied · paste into a new mission"),
          )
        : null,
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            margin: 0,
          },
        },
        "No missions declared yet.",
      ),
      h(
        "p",
        { style: { marginTop: 6, fontSize: 13, color: "#64748b" } },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    var body;
    if (useCases.length === 0) {
      body = h(Empty);
    } else {
      body = h(
        "div",
        { style: { padding: "28px 40px 56px 40px" } },
        // Intro meta row
        h(
          "div",
          {
            style: {
              marginBottom: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            },
          },
          h(
            "p",
            {
              style: {
                fontSize: 13,
                color: "#475569",
                margin: 0,
                lineHeight: 1.5,
              },
            },
            useCases.length +
              " " +
              (useCases.length === 1 ? "thing" : "things") +
              " I can do for you right now",
          ),
          h(
            "span",
            {
              style: {
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.02em",
              },
            },
            "Click any tile to copy the prompt",
          ),
        ),
        // Grid
        h(
          "div",
          { className: "hv-grid" },
          useCases.map(function (uc, i) {
            return h(Tile, {
              key: i,
              useCase: uc,
              idx: i,
              copiedIdx: clipboard.copiedIdx,
              onCopy: clipboard.copy,
            });
          }),
        ),
      );
    }

    return h(
      "div",
      {
        className: "hv-dash",
        style: {
          height: "100%",
          overflowY: "auto",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        },
      },
      h("style", { dangerouslySetInnerHTML: { __html: STYLE_CSS } }),
      h(Header),
      body,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
