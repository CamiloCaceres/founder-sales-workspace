// Houston agent dashboard bundle — Sales Development Representative.
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
  "name": "Sales Development Representative",
  "tagline": "Prospect, enrich, research, draft, triage. The outbound + inbound qualification engine — tool-agnostic, Composio-first. Drafts only — I never send.",
  "accent": "emerald",
  "useCases": [
    {
      "category": "Prospecting",
      "title": "Enrich a prospect before you spend effort on them",
      "blurb": "Firmographics, role, intent signals, warm paths.",
      "prompt": "Enrich {Jane Doe} at {Acme} — give me everything I need before I reach out.",
      "fullPrompt": "Enrich {Jane Doe} at {Acme}. Use the enrich-contact skill. Pull firmographics (company size, industry, stage, HQ), buyer role + recent role history, ~3 intent signals (hiring posts, recent funding, public talks, stack changes, product launches), and 1–2 candidate warm paths from my network. Cite every source. If anything's thin, mark UNKNOWN. Save to leads/{slug}/ and update leads.json. Don't sync to the CRM unless I approve.",
      "description": "Runs enrichment via whatever enrichment provider you've connected (HubSpot, Clay, Apollo, raw LinkedIn scrape). Writes a dossier, updates the leads index.",
      "outcome": "A full dossier at leads/{slug}/dossier.md. Hand it to `draft-grounded-email` next.",
      "skill": "enrich-contact",
      "tool": "HubSpot"
    },
    {
      "category": "Prospecting",
      "title": "Research an account end-to-end before outbound",
      "blurb": "News, stack, socials, intent — one brief.",
      "prompt": "Research {Acme} end-to-end — news, stack, socials, intent signals.",
      "fullPrompt": "Do full account research on {Acme}. Use the research-account skill. Scrape their site, pull last 90 days of news via my connected web-search, detect their website framework + MarTech stack, summarize their top 3 social channels' recent posts, and flag any intent signals (hiring, funding, stack change, incident, exec move) worth pitching on. Save to leads/{slug}/research.md and update leads.json. Cite every source. If I should invoke `draft-grounded-email` next, tell me the one angle you'd lead with.",
      "description": "End-to-end account research: site scrape, recent news, tech stack detection, socials scan, intent signals — one brief cited inline.",
      "outcome": "A research brief at leads/{slug}/research.md. Pipes directly into draft-grounded-email.",
      "skill": "research-account",
      "tool": "Firecrawl"
    },
    {
      "category": "Prospecting",
      "title": "Find 20 leads in a segment I can reach out to this week",
      "blurb": "Connected sources or public intent signals.",
      "prompt": "Find 20 leads in {segment} I can reach out to this week.",
      "fullPrompt": "Find 20 leads in {segment}. Use the find-leads skill. Start from the ICP in my playbook and config/icp.json. Sources to consider (ask which I want if unclear): connected CRM + any closed-won we could expand from, LinkedIn comment threads on relevant posts, funding feeds (Crunchbase), Google Maps for local-biz segments, my own network. For each lead: company, primary contact with LinkedIn, fit score (quick GREEN/YELLOW/RED), and the trigger signal that made me surface it. Save to searches/{slug}.md and log new lead rows in leads.json with `status: new`. Cap at 20.",
      "description": "Find fresh leads in a segment using connected sources or public intent signals. Scores quick fit per lead and surfaces the trigger signal.",
      "outcome": "A search result at searches/{slug}.md + up to 20 new rows in leads.json. Hand to enrich-contact next.",
      "skill": "find-leads",
      "tool": "LinkedIn"
    },
    {
      "category": "Qualification",
      "title": "Score a lead against your ICP",
      "blurb": "GREEN / YELLOW / RED with reasoning.",
      "prompt": "Score {Jane Doe} at {Acme} against my ICP.",
      "fullPrompt": "Score {Jane Doe} at {Acme}. Use the score-icp-fit skill. Read `../head-of-sales/sales-playbook.md` and `config/icp.json`. Apply every hard criterion (must-hit for GREEN) and every soft criterion (ranks). Return GREEN / YELLOW / RED with a 3–5 bullet reasoning and the single biggest signal pushing it up or down. Save to leads/{slug}/fit.md and update the lead row in leads.json.",
      "description": "Check the lead against every ICP criterion in the playbook. Return a single-label score with cited reasoning.",
      "outcome": "A scorecard at leads/{slug}/fit.md + the fitScore on leads.json. Skip RED, enrich GREEN, validate YELLOW.",
      "skill": "score-icp-fit"
    },
    {
      "category": "Qualification",
      "title": "Look at a URL — in-ICP yes/no and the angle to pitch",
      "blurb": "30-second read on a website.",
      "prompt": "Look at {url} and tell me if they're in-ICP and what angle to pitch.",
      "fullPrompt": "Look at {url}. Use the qualify-from-website skill. Scrape the site (homepage, pricing, about), detect the tech-stack and category, and evaluate fit against my playbook's ICP. Return: in-ICP yes / no / maybe, 2–3 concrete signals that drove the call, the single angle I'd lead with in outreach (grounded in what they actually say on the site), and the next step (enrich full lead / skip / refer to {seo-content, growth-paid, etc.}). Save to leads/{slug}/qualify.md.",
      "description": "Fast website-only qualification. Scrapes the site, checks fit, names the pitch angle.",
      "outcome": "A qualify note at leads/{slug}/qualify.md. Use it to decide whether to run full enrich-contact next.",
      "skill": "qualify-from-website",
      "tool": "Firecrawl"
    },
    {
      "category": "Qualification",
      "title": "Find warm paths into an account",
      "blurb": "Mutuals, past colleagues, referenceable customers.",
      "prompt": "Find warm paths into {Acme} — mutuals, past colleagues, customers I can name.",
      "fullPrompt": "Find warm paths into {Acme}. Use the find-references skill. Pull: (1) mutual LinkedIn connections between me and the target buyer, (2) past colleagues of mine now at {Acme}, (3) customers of mine that would vouch (from config/reference-customers.json). Rank by warmth (strong / weak) and intro-cost. For each strong path, draft a 2-sentence ask I can paste into LinkedIn or Slack to request the intro. Save to leads/{slug}/warm-paths.md and update leads.json.",
      "description": "Scan my connected LinkedIn + past-colleagues + referenceable-customer list. Rank warm paths and draft intro-asks for the strong ones.",
      "outcome": "Warm paths + intro-ask drafts at leads/{slug}/warm-paths.md.",
      "skill": "find-references",
      "tool": "LinkedIn"
    },
    {
      "category": "Outreach",
      "title": "Draft a research-grounded first-touch email",
      "blurb": "Cited grounding, 3 variants, in your voice.",
      "prompt": "Draft a first-touch email to {Jane Doe} at {Acme} grounded in real research.",
      "fullPrompt": "Draft a first-touch email to {Jane Doe} at {Acme}. Use the draft-grounded-email skill. Read any existing leads/{slug}/research.md and leads/{slug}/dossier.md. Ground every claim inline — quote from their site, reference their recent post or talk, name their stack. Produce: subject (8 words max, human), 90–120 word body, and 2 alternate subject lines. Match the voice in config/voice.md. Never invent facts. Save to leads/{slug}/outreach-draft.md and update the lead row.",
      "description": "Draft a first-touch email with cited grounding from the lead's research file. 3 subject variants. Never invents. Matches your voice.",
      "outcome": "Draft at leads/{slug}/outreach-draft.md. Approve or edit — I never send.",
      "skill": "draft-grounded-email",
      "tool": "Gmail"
    },
    {
      "category": "Outreach",
      "title": "Generate a 90-second cold-call script",
      "blurb": "Opener, pattern-interrupt, 2 discovery questions, exit.",
      "prompt": "Generate a 90-second cold-call script for {Jane Doe} at {Acme}.",
      "fullPrompt": "Generate a cold-call script for {Jane Doe} at {Acme}. Use the generate-cold-script skill. Structure: (1) 8-second opener naming them + the reason I'm calling (grounded in a real signal from their research), (2) pattern-interrupt phrase, (3) 2 discovery questions from the playbook's qualification framework, (4) soft CTA (time-boxed meeting ask), (5) if-objection branches for the top 2 objections from the playbook. Match the voice in config/voice.md. Save to leads/{slug}/cold-script.md.",
      "description": "Produce a 60–90-second cold-call script grounded in the lead's research. Opener + discovery questions + objection branches — straight from the playbook.",
      "outcome": "Script at leads/{slug}/cold-script.md. Print it, dial, don't freestyle.",
      "skill": "generate-cold-script"
    },
    {
      "category": "Inbox",
      "title": "Triage my inbox and draft responses",
      "blurb": "Classify, draft, queue for your approval.",
      "prompt": "Triage my inbox and draft responses to new replies.",
      "fullPrompt": "Triage my connected inbox. Use the triage-inbound-reply skill. Pull unread replies to outbound threads from the last 72 hours. For each: classify (INTERESTED / ASKING-QUESTION / OBJECTION / NOT-NOW / NOT-INTERESTED / UNSUBSCRIBE / OUT-OF-OFFICE / WRONG-PERSON), extract any action items, and draft a response in my voice for any non-terminal class. Never send; queue each draft for my approval. Update replies.json and surface an activity card per draft.",
      "description": "Pull recent inbound replies, classify, draft per-class responses in your voice, queue for approval. Never sends.",
      "outcome": "Drafts at replies/{id}/draft.md + activity cards in the \"Needs you\" column.",
      "skill": "triage-inbound-reply",
      "tool": "Gmail"
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
