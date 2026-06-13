// tr-report.jsx — generated Truth Report (sections A–F + gauge + split-screen)

function TrCountUp({ target, dur = 1700, run = true }) {
  const [n, setN] = React.useState(run ? 0 : target);
  React.useEffect(() => {
    if (!run) { setN(target); return; }
    let raf, start, done = false;
    const finish = () => { if (!done) { done = true; setN(target); } };
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step); else done = true;
    };
    const id = setTimeout(() => { raf = requestAnimationFrame(step); }, 200);
    // Fallback: guarantee the final value even if rAF is throttled/frozen
    const guard = setTimeout(finish, dur + 500);
    return () => { clearTimeout(id); clearTimeout(guard); cancelAnimationFrame(raf); };
  }, [target, run, dur]);
  return n;
}

function TrGauge({ score }) {
  const n = TrCountUp({ target: score });
  const seg = window.trSegmentFor(n);
  const R = 100, C = 2 * Math.PI * R, span = 0.75;
  const frac = n / 100;
  return (
    <div className="tr-gauge">
      <svg viewBox="0 0 240 240" width="100%">
        <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(20,34,60,.08)"
          strokeWidth="18" strokeLinecap="round"
          strokeDasharray={`${C*span} ${C}`} transform="rotate(135 120 120)" />
        <circle cx="120" cy="120" r={R} fill="none" stroke={seg.color}
          strokeWidth="18" strokeLinecap="round"
          strokeDasharray={`${C*span*frac} ${C}`} transform="rotate(135 120 120)"
          style={{ transition: "stroke-dasharray .2s linear" }} />
        {/* ticks for segments */}
        {[40,70,85].map(t => {
          const ang = (135 + (t/100)*270) * Math.PI/180;
          const x1 = 120 + Math.cos(ang)*(R-9), y1 = 120 + Math.sin(ang)*(R-9);
          const x2 = 120 + Math.cos(ang)*(R+9), y2 = 120 + Math.sin(ang)*(R+9);
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--paper)" strokeWidth="2.5"/>;
        })}
      </svg>
      <div className="tr-gauge-c">
        <span className="tr-gauge-num" style={{ color: seg.color }}>{n}</span>
        <span className="tr-gauge-cap mono">/ 100</span>
      </div>
    </div>
  );
}

function TrReveal({ children, className = "", delay = 0 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"fade-up " + className} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

function SectionLabel({ letter, title, sub }) {
  return (
    <div className="tr-sec-label">
      <span className="tr-sec-letter mono">{letter}</span>
      <div>
        <h2 className="tr-sec-title">{title}</h2>
        {sub && <p className="tr-sec-sub">{sub}</p>}
      </div>
    </div>
  );
}

function TrReport({ ans, onRestart, onConsult }) {
  const score = React.useMemo(() => window.trComputeScore(ans), [ans]);
  const seg = window.trSegmentFor(score);
  const blind = React.useMemo(() => window.trBlindSpots(ans), [ans]);
  const summary = React.useMemo(() => window.trSummary(ans), [ans]);
  const asks = React.useMemo(() => window.trQuestionsToAsk(ans), [ans]);
  const [openMyth, setOpenMyth] = React.useState(0);

  return (
    <main className="tr-report">
      {/* SECTION A — Protection Reality */}
      <section className="tr-sec tr-sec-hero">
        <div className="wrap">
          <div className="tr-kicker">SECTION A · YOUR PROTECTION REALITY</div>
          <div className="tr-reality">
            <div className="tr-reality-l">
              <h1 className="tr-reality-h">ความจริงของความคุ้มครองคุณ</h1>
              <p className="tr-reality-sub">
                คะแนนนี้ประเมินจากคำตอบของคุณ เพื่อสะท้อนว่าคุณพร้อมรับความเสี่ยงมากแค่ไหน
                ไม่ใช่การให้คะแนนตัวคุณ แต่เป็นภาพของช่องว่างที่ยังปิดได้
              </p>
              <div className="tr-reality-seg">
                <span className="tr-seg-dot" style={{ background: seg.color }}/>
                <span className="tr-seg-th" style={{ color: seg.color }}>{seg.th}</span>
                <span className="tr-seg-en mono">{seg.en}</span>
              </div>
              <p className="tr-seg-note">{seg.note}</p>
            </div>
            <div className="tr-reality-r">
              <TrGauge score={score} />
              <div className="tr-scale">
                {window.TR_SEGMENTS.map(s => (
                  <div key={s.key} className={"tr-scale-row" + (s.key===seg.key ? " on":"")}>
                    <span className="tr-scale-range mono">{s.min}–{s.max}</span>
                    <span className="tr-scale-name">{s.th}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — 5 Truths */}
      <section className="tr-sec tr-sec-myths">
        <div className="wrap">
          <TrReveal><SectionLabel letter="B" title="5 ความจริงเรื่องประกัน ที่คุณควรรู้"
            sub="ความเข้าใจผิดที่พบบ่อยที่สุด และความจริงที่อยู่เบื้องหลัง" /></TrReveal>
          <div className="tr-myths">
            {window.TR_MYTHS.map((m, i) => {
              const on = openMyth === i;
              return (
                <TrReveal key={m.n} delay={i*60}>
                  <div className={"tr-myth" + (on ? " on" : "")}>
                    <button className="tr-myth-head" onClick={() => setOpenMyth(on ? -1 : i)}>
                      <span className="tr-myth-n mono">MYTH {m.n}</span>
                      <span className="tr-myth-q">“{m.myth}”</span>
                      <span className="tr-myth-chev">{on ? "–" : "+"}</span>
                    </button>
                    {on && (
                      <div className="tr-myth-open">
                        <div className="tr-myth-verdict">
                          <span className="mono tr-verdict-label">REALITY</span>
                          <span className="tr-verdict-val">{m.verdict}</span>
                        </div>
                        <p className="tr-myth-explain">{m.explain}</p>
                        <p className="tr-myth-example">{m.example}</p>
                      </div>
                    )}
                  </div>
                </TrReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPECIAL — split screen */}
      <section className="tr-sec tr-sec-contrast">
        <div className="wrap">
          <TrReveal><SectionLabel letter="✕" title="สิ่งที่โฆษณาประกันมักไม่บอกคุณ"
            sub="สิ่งที่คุณมักได้ยิน เทียบกับสิ่งที่คุณควรเข้าใจ" /></TrReveal>
          <div className="tr-contrast">
            <div className="tr-contrast-head">
              <span className="tr-ch-l">สิ่งที่คุณมักได้ยิน</span>
              <span className="tr-ch-r">สิ่งที่คุณควรเข้าใจ</span>
            </div>
            {window.TR_CONTRAST.map((c, i) => (
              <TrReveal key={i} delay={i*50}>
                <div className="tr-contrast-row">
                  <div className="tr-cc tr-cc-hear">{c.hear}</div>
                  <div className="tr-cc-vs mono">vs</div>
                  <div className="tr-cc tr-cc-know"><span className="tr-cc-mark">→</span> {c.know}</div>
                </div>
              </TrReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C — Blind Spots */}
      <section className="tr-sec tr-sec-blind">
        <div className="wrap">
          <TrReveal><SectionLabel letter="C" title="จุดบอดของคุณ"
            sub="ช่องว่างความเสี่ยงที่พบจากคำตอบของคุณ" /></TrReveal>
          {blind.length === 0 ? (
            <TrReveal><div className="tr-blind-empty">
              <span className="green" style={{fontSize:32}}>✓</span>
              <p>จากคำตอบของคุณ เราไม่พบจุดบอดความเสี่ยงที่ชัดเจน — เยี่ยมมาก ทบทวนแผนเป็นระยะเพื่อรักษาระดับนี้ไว้</p>
            </div></TrReveal>
          ) : (
            <div className="tr-blind-grid">
              {blind.map((b, i) => (
                <TrReveal key={i} delay={i*60}>
                  <div className="tr-blind-card">
                    <span className="tr-blind-warn">⚠</span>
                    <h3 className="tr-blind-t">{b.title}</h3>
                    <p className="tr-blind-b">{b.body}</p>
                  </div>
                </TrReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION D — Questions to ask */}
      <section className="tr-sec tr-sec-ask">
        <div className="wrap wrap-narrow">
          <TrReveal><SectionLabel letter="D" title="คำถามที่คุณควรถามตัวแทนประกันทุกครั้ง"
            sub="พิมพ์หรือบันทึกไว้ แล้วถามก่อนตัดสินใจ" /></TrReveal>
          <ol className="tr-asks">
            {asks.map((a, i) => (
              <TrReveal key={i} delay={i*50}>
                <li className="tr-ask">
                  <span className="tr-ask-n mono">{String(i+1).padStart(2,"0")}</span>
                  <span className="tr-ask-t">{a}</span>
                </li>
              </TrReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION E — Truth Summary */}
      <section className="tr-sec tr-sec-summary">
        <div className="wrap">
          <TrReveal><SectionLabel letter="E" title="สรุปความจริง"
            sub="ไม่มีการแนะนำผลิตภัณฑ์ในขั้นนี้ — เป็นเพียงภาพรวมที่ตรงไปตรงมา" /></TrReveal>
          <div className="tr-summary">
            <TrReveal className="tr-sum-col-wrap">
              <div className="tr-sum-col tr-sum-well">
                <div className="tr-sum-head"><span className="tr-sum-ic green">✓</span> สิ่งที่คุณทำได้ดี</div>
                <ul>
                  {(summary.well.length ? summary.well : ["คุณลงมือตรวจสอบความคุ้มครองของตัวเอง ซึ่งหลายคนไม่เคยทำ"]).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </TrReveal>
            <TrReveal className="tr-sum-col-wrap" delay={80}>
              <div className="tr-sum-col tr-sum-review">
                <div className="tr-sum-head"><span className="tr-sum-ic amber">!</span> สิ่งที่ควรทบทวน</div>
                <ul>
                  {(summary.review.length ? summary.review : ["ทบทวนแผนเป็นระยะเมื่อชีวิตเปลี่ยน เช่น แต่งงาน มีบุตร หรือเปลี่ยนงาน"]).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </TrReveal>
          </div>
        </div>
      </section>

      {/* SECTION F — Consultation */}
      <section className="tr-sec tr-sec-consult">
        <div className="wrap">
          <div className="tr-consult-card">
            <div className="tr-kicker" style={{color:"var(--blue-soft)"}}>SECTION F · OPTIONAL</div>
            <h2 className="tr-consult-h">อยากเข้าใจลึกกว่านี้ไหม?</h2>
            <p className="tr-consult-sub">
              พูดคุยกับที่ปรึกษาที่กล้าพูดทั้งข้อดี และข้อจำกัดของความคุ้มครอง
              ไม่มีการกดดันการขาย — มีแต่ความจริงที่ช่วยให้คุณตัดสินใจได้ดีขึ้น
            </p>
            <div className="tr-consult-cta">
              <button className="tr-btn tr-btn-primary tr-btn-lg" onClick={onConsult}>
                ขอรับการรีวิวส่วนตัว <span className="ar">→</span>
              </button>
              <button className="tr-btn tr-btn-ghost" onClick={onRestart}>ทำแบบประเมินใหม่</button>
            </div>
            <p className="tr-consult-fine mono">
              รายงานนี้จัดทำเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุนหรือการเสนอขายผลิตภัณฑ์
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { TrReport, TrGauge });
