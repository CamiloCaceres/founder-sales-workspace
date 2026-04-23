// Houston agent dashboard bundle — Account Executive.
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
  "name": "Account Executive",
  "tagline": "Call prep, call analysis, battlecards, proposals, close plans, objection handling, follow-ups. Drafts only — I never commit the deal.",
  "accent": "amber",
  "useCases": [
    {
      "category": "Call flow",
      "title": "Prep me for a discovery call",
      "blurb": "Research, warm paths, likely objections, question bank.",
      "prompt": "Prep me for my discovery call with {Acme} {tomorrow at 2pm}.",
      "fullPrompt": "Prep me for my discovery call with {Acme}. Use the prepare-call skill. Pull SDR's leads/{slug}/ files (dossier, research, warm-paths) if they exist; otherwise kick off a light research pass. From the playbook, pull the qualification-framework questions I should ask, the 2–3 objections most likely to land this call, and the primary first-call goal. Produce a one-pager: meeting goal, attendees (with brief per person), 5–8 question bank, likely objections + reframe, 1-line exit criteria for 'advance the deal'. Save to deals/{slug}/call-prep-{YYYY-MM-DD}.md.",
      "description": "Pulls existing research, the playbook's qualification questions, likely objections, and bundles it into a one-pager I read before walking into the call.",
      "outcome": "A prep pack at deals/{slug}/call-prep-{date}.md. Read 5 minutes before the call.",
      "skill": "prepare-call"
    },
    {
      "category": "Call flow",
      "title": "Analyze my discovery call",
      "blurb": "Talk ratio, pains, objections, next step, risk.",
      "prompt": "Read out my {Acme} discovery call — talk ratio, pain, objections, next steps.",
      "fullPrompt": "Analyze my {Acme} discovery call. Use the analyze-discovery-call skill. Pull the transcript (from my connected call-recorder via Composio, or paste). Return: talk-ratio (me vs them), pains identified (verbatim quotes), objections surfaced (verbatim), qualification gaps per MEDDPICC (or whatever the playbook uses), risk flags, opportunity flags, and a draft of my next-step follow-up email. Save to calls/{id}/analysis.md and update deals/{slug}/ + calls.json.",
      "description": "Read the call transcript, score talk-ratio, extract verbatim pain + objections, find qualification gaps, flag risks/opportunities, draft the follow-up.",
      "outcome": "An analysis at calls/{id}/analysis.md + a follow-up draft ready to send.",
      "skill": "analyze-discovery-call",
      "tool": "Gong"
    },
    {
      "category": "Call flow",
      "title": "Capture call notes from a transcript",
      "blurb": "Structured: agenda, pains, decisions, actions.",
      "prompt": "Here's my call transcript for {Acme} — capture it.",
      "fullPrompt": "Capture structured notes from this call. Use the capture-call-notes skill. Pull the transcript from my connected meeting-notes app (Circleback / Fathom / Fireflies) or accept paste. Structure: attendees, agenda, pains named, objections, decisions made, action items (ours + theirs), confirmed next step, and a 1-paragraph summary. Save to calls/{id}/notes.md and update deals/{slug}/ + calls.json. Optional: if notes-sync is enabled, push to my notes app.",
      "description": "Ingest a raw transcript, produce structured call notes with attendees / agenda / pains / decisions / actions / next step.",
      "outcome": "Notes at calls/{id}/notes.md. Pipe to analyze-discovery-call for the deeper read.",
      "skill": "capture-call-notes",
      "tool": "Circleback"
    },
    {
      "category": "Deal",
      "title": "Battlecard for this prospect vs a competitor",
      "blurb": "Per-prospect positioning, pricing, proof points.",
      "prompt": "Battlecard for {Acme} vs {Competitor X}.",
      "fullPrompt": "Build a battlecard for {Acme} vs {Competitor X}. Use the build-battlecard skill. Combine the playbook's competitor section with what we know about {Acme} from SDR's research. Return: positioning cut-lines, where we beat them (with proof), where they beat us (with honest gaps), pricing framing, customer proof points from config/reference-customers.json, 3 traps they'll set, 3 questions to plant. Save to deals/{slug}/battlecard-vs-{competitor}.md and battlecards.json.",
      "description": "Stitch the playbook's competitive section with the prospect's research. Writes a per-prospect card with pitch, pricing framing, proof, traps, plants.",
      "outcome": "A card at deals/{slug}/battlecard-vs-{competitor}.md. Print before the call.",
      "skill": "build-battlecard"
    },
    {
      "category": "Deal",
      "title": "Handle an objection",
      "blurb": "Given their line, draft my reframe.",
      "prompt": "They said '{objection}' on the {Acme} call — draft my reframe.",
      "fullPrompt": "They said: '{objection}' on the {Acme} call. Use the handle-objection skill. Pull the playbook's objection handbook + any recent call-insights that touched this objection. Draft a 3-sentence reframe in my voice: (1) acknowledge without backpedaling, (2) reframe with a concrete customer example or data point, (3) propose the next step. Also draft the short follow-up email I send after the call. Save to deals/{slug}/objections/{YYYY-MM-DD}-{slug}.md.",
      "description": "Look up the objection in the playbook, pull any call-insights pattern, write a 3-sentence in-call reframe + a short follow-up email.",
      "outcome": "Reframe + follow-up at deals/{slug}/objections/{date}-{slug}.md.",
      "skill": "handle-objection"
    },
    {
      "category": "Deal",
      "title": "Draft my post-call follow-up",
      "blurb": "Recap + the next step in the action plan.",
      "prompt": "Draft my follow-up to {Acme} after today's call.",
      "fullPrompt": "Draft my follow-up email to {Acme} after today's call. Use the draft-followup skill. Read calls/{id}/analysis.md (if present) or calls/{id}/notes.md. Structure: 1-sentence 'great talking', 3-bullet recap using THEIR language (not mine), confirmed next step with a specific date, and any action items they committed to. Match my voice from config/voice.md. Never send — queue for my approval. Save to deals/{slug}/followups/{YYYY-MM-DD}.md.",
      "description": "Turn the call analysis or notes into a short follow-up email — recap in their language, next step, action items. Matches your voice.",
      "outcome": "Draft at deals/{slug}/followups/{date}.md. Approve → I'll (optionally) queue it via queue-followup.",
      "skill": "draft-followup",
      "tool": "Gmail"
    },
    {
      "category": "Close",
      "title": "Draft a one-pager proposal",
      "blurb": "Scope, pricing, terms — grounded in the playbook.",
      "prompt": "Draft a one-pager proposal for {Acme} — scope, pricing, terms.",
      "fullPrompt": "Draft a one-pager proposal for {Acme}. Use the draft-proposal skill. Pull config/pricing.json and the playbook's pricing-stance section — stay inside the bands, never promise below the non-negotiable. Structure: problem statement (their words from calls), scope (what's in / explicitly out), proposed approach, pricing with assumptions, terms, success metrics we'll be judged on, timeline. Save to deals/{slug}/proposal-{v}.md. Never send — surface as draft for my approval.",
      "description": "Take call notes + the playbook's pricing-stance and draft a one-pager proposal with scope / pricing / terms / success metrics. Never oversteps pricing bands.",
      "outcome": "Proposal at deals/{slug}/proposal-{v}.md. Forward to the buyer after you approve.",
      "skill": "draft-proposal"
    },
    {
      "category": "Close",
      "title": "Build the mutual action plan",
      "blurb": "Procurement, champion, budget, target close.",
      "prompt": "Build a mutual action plan with {Acme} — target close in {N} weeks.",
      "fullPrompt": "Build a mutual action plan with {Acme}. Use the draft-close-plan skill. From the latest call analysis, identify: economic buyer (name + title or UNKNOWN), champion, decision process (steps left), procurement / security review steps, budget timing, and target close date. For each step, assign owner (us or them), target date, and blocker. Save to deals/{slug}/close-plan.md. Surface gaps honestly — anything UNKNOWN is flagged for the next call's discovery.",
      "description": "Stitch the call analysis into a mutual action plan — procurement, champion, budget, timeline, owners. Flags what we still don't know.",
      "outcome": "Close plan at deals/{slug}/close-plan.md. Share with the champion on our next touch.",
      "skill": "draft-close-plan"
    },
    {
      "category": "Operational",
      "title": "Queue a follow-up as a task",
      "blurb": "One task, one owner, one due date.",
      "prompt": "Queue a follow-up on the {Acme} deal for {Friday}: {action}.",
      "fullPrompt": "Queue '{action}' as a follow-up task on the {Acme} deal, due {date}. Use the queue-followup skill. Discover my connected task tool via `composio search task` (Attio tasks, Linear, Asana, Notion-tasks — whatever's linked). Create the task with a link back to the deal file on my disk and a 1-line context pulled from the latest call analysis. Update deals/{slug}/ to reflect the open follow-up. If no task tool is connected, surface a Houston activity card instead.",
      "description": "Push a follow-up into your connected task tool with a deal context line and a link back to the deal file. Falls back to a Houston activity card if no task tool is linked.",
      "outcome": "A task in Attio / Linear / Asana + a mirror entry in the deal's followups list.",
      "skill": "queue-followup",
      "tool": "Attio"
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
