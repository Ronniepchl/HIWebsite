// calculator.jsx — Life Protection Score™ multi-step wizard + animated result

// Animated number hook
function useCountUp(target, run, dur = 1500) {
  const [n, setN] = React.useState(run ? 0 : target);
  React.useEffect(() => {
    if (!run) { setN(target); return; }
    let raf, start, done = false;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step); else done = true;
    };
    raf = requestAnimationFrame(step);
    const guard = setTimeout(() => { if (!done) setN(target); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(guard); };
  }, [target, run, dur]);
  return n;
}

function segmentFor(score) {
  return window.LPS_SEGMENTS.find(s => score >= s.min && score <= s.max) || window.LPS_SEGMENTS[0];
}

// Result gauge — arc / ring / linear
function ResultGauge({ score, style = "arc", motion }) {
  const n = useCountUp(score, motion);
  const seg = segmentFor(n);
  if (style === "linear") {
    return (
      <div className="rg-linear">
        <div className="rg-linear-num"><b style={{color: seg.color}}>{n}</b><span>/ 100</span></div>
        <div className="rg-track">
          <div className="rg-fill" style={{ width: n + "%", background: seg.color, boxShadow: `0 0 24px ${seg.color}` }}/>
          {window.LPS_SEGMENTS.map(s => (
            <span key={s.key} className="rg-tick" style={{ left: s.max + "%" }}/>
          ))}
        </div>
        <div className="rg-linear-seg" style={{ color: seg.color }}>{seg.th} · {seg.en}</div>
      </div>
    );
  }
  const full = style === "ring";
  const R = 92, C = 2 * Math.PI * R, span = full ? 1 : 0.75;
  const frac = (n / 100);
  const rot = full ? -90 : 135;
  return (
    <div className="rg-arc">
      <svg viewBox="0 0 220 220" width="100%">
        <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,.07)"
          strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${C*span} ${C}`} transform={`rotate(${rot} 110 110)`} />
        <circle cx="110" cy="110" r={R} fill="none" stroke={seg.color}
          strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${C*span*frac} ${C}`} transform={`rotate(${rot} 110 110)`}
          style={{ filter: `drop-shadow(0 0 12px ${seg.color})` }} />
      </svg>
      <div className="rg-c">
        <span className="rg-num" style={{ color: seg.color }}>{n}</span>
        <span className="rg-cap">/ 100</span>
      </div>
    </div>
  );
}

function ScoreWizard({ open, onClose, onReport, tweaks }) {
  const Q = window.LPS_QUESTIONS;
  const [step, setStep] = React.useState(0);    // 0..Q.length-1 questions, Q.length = result
  const [ans, setAns] = React.useState({});
  const motion = tweaks.motion;
  const optStyle = tweaks.calcOptionStyle;
  const gaugeStyle = tweaks.gaugeStyle;

  React.useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; setTimeout(() => { setStep(0); setAns({}); }, 300); }
  }, [open]);

  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  const isResult = step >= Q.length;
  const q = Q[step];

  const score = React.useMemo(() => {
    let s = 0, w = 0;
    Q.forEach(qq => { w += qq.weight; const a = ans[qq.id]; if (a != null) s += qq.options[a].pts * qq.weight; });
    return Math.round((s / w) * 100);
  }, [ans, Q]);

  const choose = (i) => {
    setAns(a => ({ ...a, [q.id]: i }));
    setTimeout(() => setStep(s => s + 1), motion ? 220 : 0);
  };

  const pct = isResult ? 100 : Math.round((step / Q.length) * 100);

  // Log every completed protection score to the Sheet (once, when the result appears).
  const sentRef = React.useRef(false);
  React.useEffect(() => {
    if (!isResult) { sentRef.current = false; return; }
    if (sentRef.current) return;
    sentRef.current = true;
    const sg = segmentFor(score);
    window.__lpsLast = { score, answers: ans, segment: sg ? sg.en : "" };
    window.submitToSheet && window.submitToSheet({
      source: "life-protection-score",
      event: "completion",
      score,
      segment: sg ? sg.en : "",
      answers: ans,
      fields: window.lpsFields(ans),
      summary: "Life Protection Score — " + (sg ? sg.en : "") + " (" + score + "/100)",
    });
  }, [isResult, score, ans]);

  if (!open) return null;
  const seg = segmentFor(score);

  return (
    <div className={"lps-overlay" + (open ? " on" : "")} onClick={onClose}>
      <div className="lps-modal card" onClick={e => e.stopPropagation()}>
        <div className="lps-head">
          <div className="lps-head-l">
            <BrandMark size={24} />
            <span className="lps-head-t">Life Protection Score™</span>
          </div>
          <button className="lps-close" onClick={onClose} aria-label="close">
            <Icon name="plus" size={20} style={{ transform: "rotate(45deg)" }}/>
          </button>
        </div>

        <div className="lps-progress">
          <div className="lps-progress-fill" style={{ width: pct + "%" }}/>
        </div>

        {!isResult && (
          <div className="lps-body" key={step}>
            <div className="lps-stepmeta">
              <span className="mono">{String(step+1).padStart(2,"0")} / {String(Q.length).padStart(2,"0")}</span>
              <span className="lps-domain"><Icon name={q.icon} size={16}/> {q.en}</span>
            </div>
            <h3 className="lps-q">{q.th}</h3>
            <p className="lps-qsub">{q.sub}</p>
            <div className={"lps-options lps-opt-" + optStyle}>
              {q.options.map((o, i) => (
                <button key={i}
                  className={"lps-opt" + (ans[q.id] === i ? " sel" : "")}
                  onClick={() => choose(i)}>
                  <span className="lps-opt-dot"/>
                  <span className="lps-opt-th">{o.th}</span>
                  <span className="lps-opt-en">{o.en}</span>
                </button>
              ))}
            </div>
            <div className="lps-nav">
              <button className="lps-back" disabled={step === 0}
                onClick={() => setStep(s => Math.max(0, s - 1))}>
                <Icon name="arrow" size={16} style={{ transform: "scaleX(-1)" }}/> ย้อนกลับ
              </button>
              <span className="lps-hint">เลือกคำตอบเพื่อไปต่อ</span>
            </div>
          </div>
        )}

        {isResult && (
          <div className="lps-result">
            <div className="kicker">YOUR RESULT</div>
            <ResultGauge score={score} style={gaugeStyle} motion={motion} />
            <h3 className="lps-seg" style={{ color: seg.color }}>{seg.th}</h3>
            <p className="lps-seg-en">{seg.en} · {seg.note}</p>

            <div className="lps-breakdown">
              {Q.map(qq => {
                const a = ans[qq.id];
                const v = a != null ? qq.options[a].pts : 0;
                return (
                  <div key={qq.id} className="lps-bd-row">
                    <span className="lps-bd-l"><Icon name={qq.icon} size={15}/> {qq.en}</span>
                    <span className="lps-bd-track">
                      <i style={{ width: (v*100)+"%", background: v < .4 ? "var(--c-under)" : v < .75 ? "var(--c-partial)" : "var(--c-optimal)" }}/>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="lps-result-cta">
              <button className="btn btn-primary btn-lg" onClick={onReport}>
                <Icon name="doc" size={18}/> รับ Truth Report™ ฉบับเต็ม
              </button>
              <button className="btn btn-ghost" onClick={() => { setStep(0); setAns({}); }}>
                ทำแบบประเมินใหม่
              </button>
            </div>
            <p className="lps-disclaimer">
              คะแนนนี้เป็นการประเมินเบื้องต้นเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุนหรือการขายผลิตภัณฑ์
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ScoreWizard, ResultGauge, segmentFor, useCountUp });
