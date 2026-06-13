// truth-mark.jsx — Truth Conversation™ Mark — the core brand asset, 4 official states
// States: truth (navy+gold) · protection (green) · analysis (blue) · advisor (gold)

const TM_STATES = {
  truth:      { stroke: "#13294b", tick: "#a07d1f", glow: "rgba(160,125,31,.22)" },
  protection: { stroke: "#1f7a52", tick: "#1f7a52", glow: "rgba(31,122,82,.20)" },
  analysis:   { stroke: "#2a4f86", tick: "#2a4f86", glow: "rgba(42,79,134,.20)" },
  advisor:    { stroke: "#a07d1f", tick: "#a07d1f", glow: "rgba(160,125,31,.22)" },
};

// A speech bubble (conversation) with a check (verified truth) inside.
function TruthMark({ state = "truth", size = 40, glow = false, title }) {
  const s = TM_STATES[state] || TM_STATES.truth;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      role="img" aria-label={title || "Truth Conversation Mark"}
      style={glow ? { filter: `drop-shadow(0 4px 14px ${s.glow})` } : undefined}>
      {/* bubble */}
      <path d="M9 7.5h30a3.5 3.5 0 0 1 3.5 3.5v18a3.5 3.5 0 0 1-3.5 3.5H21l-8.6 7.2A1 1 0 0 1 10.8 39v-6H9a3.5 3.5 0 0 1-3.5-3.5V11A3.5 3.5 0 0 1 9 7.5z"
        stroke={s.stroke} strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
      {/* check */}
      <path d="M16.5 20.2l5 5L32 14.6" stroke={s.tick} strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

Object.assign(window, { TruthMark, TM_STATES });
