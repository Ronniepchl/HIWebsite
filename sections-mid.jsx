// sections-mid.jsx — Score band, Truth, Why, How, Areas

function ScoreBand({ onScore, motion }) {
  return (
    <section className="section score-band" id="score">
      <div className="wrap">
        <div className="score-band-card card reveal">
          <div className="score-band-l">
            <div className="kicker">LIFE PROTECTION SCORE™</div>
            <h2 className="section-title">รู้คะแนนความคุ้มครองของคุณ<br/>ใน 3 นาที</h2>
            <p className="section-lede">
              ตอบคำถาม 7 ข้อเกี่ยวกับรายได้ ครอบครัว หนี้สิน สุขภาพ และการเกษียณ
              แล้วรับคะแนน 0–100 พร้อมแผนที่ความเสี่ยงของคุณ — ฟรี ไม่ต้องใช้อีเมล
            </p>
            <div className="score-band-segs">
              {window.LPS_SEGMENTS.map(s => (
                <div key={s.key} className="sb-seg">
                  <span className="sb-dot" style={{ background: s.color }}/>
                  <span className="sb-range mono">{s.min}–{s.max}</span>
                  <span className="sb-name">{s.th}</span>
                </div>
              ))}
            </div>
            <div className="score-band-cta-row">
              <button className="btn btn-primary btn-lg" onClick={onScore}>
                เริ่มประเมิน Life Protection Score™ <Icon name="arrow" size={18} className="arrow"/>
              </button>
              <a className="score-band-deep" href="Human Insurance - Trust Engine.html">
                <Icon name="spark" size={15}/> ลองเวอร์ชันเต็ม: Protection Diagnostic + AI Report™
              </a>
            </div>
          </div>
          <div className="score-band-r">
            <HeroGauge value={62} motion={motion} />
            <div className="score-band-meta">
              <span className="tag">7 คำถาม</span>
              <span className="tag">~3 นาที</span>
              <span className="tag">ไม่ต้องสมัคร</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, lede, center }) {
  return (
    <div className={"sec-head reveal" + (center ? " center" : "")}>
      <div className="kicker">{kicker}</div>
      <h2 className="section-title">{title}</h2>
      {lede && <p className="section-lede">{lede}</p>}
    </div>
  );
}

function Confusion() {
  const items = [
    { th: "สิ่งที่ไม่คุ้มครอง", en: "Not covered", body: "บางโรคและบางสถานการณ์ อาจไม่อยู่ในความคุ้มครองตั้งแต่แรก" },
    { th: "ทำไมยังเคลมไม่ได้", en: "Waiting periods", body: "บางความคุ้มครองมีระยะเวลารอคอย ก่อนเริ่มใช้สิทธิ" },
    { th: "ทำไมเอกสารการเคลมสำคัญ", en: "Disclosure matters", body: "การเคลมที่ราบรื่น เริ่มตั้งแต่การเปิดเผยข้อมูลที่ถูกต้อง" },
    { th: "วงเงินสูง ไม่ได้แปลว่าจ่ายทุกกรณี", en: "Limits ≠ everything", body: "วงเงินเป็นเพียงส่วนหนึ่ง ของความคุ้มครองทั้งหมด" },
  ];
  return (
    <section className="section confusion" id="confusion">
      <div className="wrap">
        <div className="confusion-head reveal">
          <div className="kicker">THE TRUTH MOST PEOPLE NEVER HEAR</div>
          <h2 className="section-title">คนส่วนใหญ่ไม่ได้ซื้อประกันผิด<br/><span className="confusion-em">แต่เข้าใจเงื่อนไขไม่ครบ</span></h2>
          <p className="section-lede">
            หลายครั้งปัญหาไม่ได้เกิดขึ้นตอนซื้อ แต่เกิดขึ้นตอนเคลม —
            เพราะสิ่งสำคัญมักซ่อนอยู่ในรายละเอียดที่อ่านยาก
          </p>
        </div>

        <div className="reveal-sub">สิ่งที่คนมักเข้าใจผิด</div>
        <div className="confusion-cards">
          {items.map((it, i) => (
            <div key={it.en} className="confusion-item card reveal" style={{ transitionDelay: (i*70)+"ms" }}>
              <span className="confusion-warn">⚠</span>
              <h3 className="confusion-item-th">{it.th}</h3>
              <p className="confusion-item-body">{it.body}</p>
            </div>
          ))}
        </div>

        <div className="truth-hero card reveal">
          <div className="truth-hero-glow"/>
          <span className="truth-hero-tag mono">ความจริงที่สำคัญที่สุด</span>
          <p className="truth-hero-line">
            ประกันที่ดี ไม่ใช่ประกันที่คุ้มครองทุกอย่าง<br/>
            แต่คือประกันที่คุณ<span className="truth-hero-em">เข้าใจข้อจำกัดของมัน</span>
          </p>
          <div className="truth-hero-promise">
            <span className="thp-label mono">HUMAN INSURANCE TRUTH PROMISE™</span>
            <p className="thp-text">
              เราเชื่อว่าคุณควรรู้ทั้ง<strong>สิ่งที่คุ้มครอง</strong> และ<strong>สิ่งที่ไม่คุ้มครอง</strong> ก่อนตัดสินใจซื้อเสมอ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TruthReportPreview({ onReport }) {
  const myths = [
    { n: "Myth #1", claim: "มีประกันสุขภาพแล้ว", truth: "ทุกอย่างไม่ได้เคลมได้ทั้งหมด", impact: "หลายคนเพิ่งรู้เรื่องข้อยกเว้น เมื่อเข้ารับการรักษาจริง" },
    { n: "Myth #2", claim: "ประกันกลุ่มของบริษัทเพียงพอแล้ว", truth: "ความคุ้มครองหายไปเมื่อเปลี่ยนงาน", impact: "บางคนเพิ่งรู้ว่าไม่มีความคุ้มครอง ตอนที่ออกจากงานพอดี" },
    { n: "Myth #3", claim: "วงเงิน 100 ล้านบาท จ่ายทุกกรณี", truth: "วงเงินเป็นเพียงส่วนหนึ่งของความคุ้มครอง", impact: "ยังมีเงื่อนไขย่อยและข้อยกเว้น ที่ทำให้จ่ายไม่เต็มจำนวน" },
  ];
  return (
    <section className="section trp" id="truth-report">
      <div className="wrap">
        <div className="trp-head reveal">
          <div className="kicker">TRUTH REPORT™</div>
          <h2 className="section-title">5 ความเข้าใจผิดเรื่องประกัน<br/><span className="trp-em">ที่คนส่วนใหญ่เพิ่งรู้ตอนเคลม</span></h2>
          <p className="section-lede">ตัวอย่างจากรายงาน — ความเชื่อที่ฟังดูสมเหตุสมผล แต่อาจทำให้คุณเสียสิทธิ์โดยไม่รู้ตัว</p>
        </div>
        <div className="trp-myths">
          {myths.map((m, i) => (
            <div key={i} className="trp-myth card reveal" style={{ transitionDelay: (i*80)+"ms" }}>
              <div className="trp-stage">
                <span className="trp-stage-label mono">สิ่งที่คนเชื่อ</span>
                <p className="trp-claim">“{m.claim}”</p>
              </div>
              <span className="trp-down">↓</span>
              <div className="trp-stage">
                <span className="trp-verdict">❌ ไม่จริง</span>
                <p className="trp-truth">{m.truth}</p>
              </div>
              <span className="trp-down">↓</span>
              <div className="trp-stage trp-impact">
                <span className="trp-stage-label mono trp-impact-label">ผลกระทบ</span>
                <p className="trp-impact-text">{m.impact}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="trp-cta reveal">
          <button className="btn btn-primary btn-lg" onClick={onReport}>
            <Icon name="eye" size={18}/> ค้นหาช่องว่างความคุ้มครองของคุณ <Icon name="arrow" size={18} className="arrow"/>
          </button>
          <span className="trp-cta-note">รับ Truth Report™ ฟรี — อ่านครบทั้ง 5 ข้อ พร้อมคำแนะนำเฉพาะคุณ</span>
        </div>
      </div>
    </section>
  );
}

function Truth() {
  return (
    <section className="section truth-sec" id="truth">
      <div className="wrap">
        <SectionHead center kicker="THE TRUTH ABOUT INSURANCE"
          title="สิ่งที่คนมักได้ยิน และสิ่งที่ควรรู้"
          lede="เราไม่ได้บอกว่าโฆษณาผิด — แต่ความจริงมักมีอีกด้านที่ควรเข้าใจก่อนตัดสินใจ" />
        <div className="truth-contrast">
          <div className="truth-contrast-head">
            <span className="tch tch-l">สิ่งที่คนมักได้ยิน</span>
            <span className="tch tch-r">สิ่งที่ควรรู้</span>
          </div>
          {window.TRUTH_CONTRAST.map((c, i) => (
            <div key={i} className="truth-row reveal" style={{ transitionDelay: (i*55)+"ms" }}>
              <div className="tr-hear">{c.hear}</div>
              <div className="tr-arrow"><Icon name="arrow" size={18}/></div>
              <div className="tr-know"><span className="tr-know-mark">✓</span> {c.know}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Why() {
  const pairs = [
    { agent: "เริ่มจากผลิตภัณฑ์ที่อยากขาย", human: "เริ่มจากความเข้าใจในตัวคุณ" },
    { agent: "พูดถึงเฉพาะสิ่งที่คุ้มครอง", human: "อธิบายทั้งสิ่งที่คุ้มครอง และสิ่งที่ไม่คุ้มครอง" },
    { agent: "วัดความสำเร็จจากยอดขาย", human: "วัดความสำเร็จจากความเข้าใจของลูกค้า" },
  ];
  return (
    <section className="section why grid-bg" id="why">
      <div className="wrap">
        <SectionHead center kicker="WHERE TRUST COMES FROM"
          title="ทำไม Human Insurance ถึงต่าง"
          lede="เรากล้าบอกความจริง เพราะเราไม่ได้วัดความสำเร็จจากยอดขาย แต่วัดจากความเข้าใจของคุณ" />
        <div className="why2">
          <div className="why2-head reveal">
            <span className="why2-h why2-h-agent">ตัวแทนทั่วไป</span>
            <span className="why2-h-spacer"/>
            <span className="why2-h why2-h-human">Human Insurance</span>
          </div>
          {pairs.map((p, i) => (
            <div key={i} className="why2-row reveal" style={{ transitionDelay: (i*70)+"ms" }}>
              <div className="why2-cell why2-agent">
                <span className="why2-x"><Icon name="minus" size={14}/></span>
                <span>{p.agent}</span>
              </div>
              <div className="why2-arrow"><Icon name="arrow" size={18}/></div>
              <div className="why2-cell why2-human">
                <span className="why2-c"><Icon name="check" size={14}/></span>
                <span>{p.human}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="why2-philo reveal">
          <p>ประกันที่ดี ไม่ใช่ประกันที่คุ้มครองทุกอย่าง<br/><span className="why2-philo-em">แต่คือประกันที่คุณเข้าใจข้อจำกัดของมัน</span></p>
        </div>
      </div>
    </section>
  );
}

function How({ onScore }) {
  const steps = window.STEPS;
  const [active, setActive] = React.useState(0);
  const tones = ["blue", "teal", "gold", "green"];

  // auto-advance highlight
  React.useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % steps.length), 3800);
    return () => clearInterval(id);
  }, [steps.length]);

  const N = steps.length;
  const cx = 200, cy = 200, orbit = 150;
  const pos = (i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / N);
    return { x: cx + Math.cos(ang) * orbit, y: cy + Math.sin(ang) * orbit, ang };
  };
  // arc segment from node i to node i+1, leaving a gap around each node
  const seg = (i) => {
    const gap = 0.30; // radians of clearance near each node
    const a0 = -Math.PI/2 + i * (2*Math.PI/N) + gap;
    const a1 = -Math.PI/2 + (i+1) * (2*Math.PI/N) - gap;
    const p0 = { x: cx + Math.cos(a0)*orbit, y: cy + Math.sin(a0)*orbit };
    const p1 = { x: cx + Math.cos(a1)*orbit, y: cy + Math.sin(a1)*orbit };
    // arrowhead at p1, tangent direction
    const td = a1 + Math.PI/2; // tangent (clockwise)
    const ah = 9;
    const tip = p1;
    const back = { x: p1.x - Math.cos(td)*ah, y: p1.y - Math.sin(td)*ah };
    const perp = { x: Math.cos(td + Math.PI/2)*ah*0.62, y: Math.sin(td + Math.PI/2)*ah*0.62 };
    const arrow = `M ${(back.x+perp.x).toFixed(1)} ${(back.y+perp.y).toFixed(1)} L ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${(back.x-perp.x).toFixed(1)} ${(back.y-perp.y).toFixed(1)}`;
    return {
      d: `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${orbit} ${orbit} 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`,
      arrow,
    };
  };

  return (
    <section className="section how" id="how">
      <div className="wrap">
        <SectionHead center kicker="THE HUMAN INSURANCE METHOD™"
          title={<>กระบวนการที่เริ่มจากคุณ<br/>ไม่ใช่จากผลิตภัณฑ์</>}
          lede="4 ขั้นตอนที่ช่วยให้คุณเข้าใจความเสี่ยง ก่อนตัดสินใจเรื่องความคุ้มครอง" />

        <div className="method">
          {/* circular journey */}
          <div className="method-orbit reveal">
            <svg className="method-svg" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <linearGradient id="methodPath" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--navy)"/><stop offset="1" stopColor="var(--green)"/>
                </linearGradient>
              </defs>
              {steps.map((s, i) => {
                const g = seg(i);
                const on = active === i;
                const segLen = (2*Math.PI*orbit)/N;
                return (
                  <g key={i} className={"method-seg" + (on ? " on" : "")}>
                    <path d={g.d} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d={g.d} fill="none" stroke="url(#methodPath)" strokeWidth="3" strokeLinecap="round"
                      className="method-seg-active"
                      style={{ strokeDasharray: segLen, strokeDashoffset: on ? 0 : segLen,
                        transition: "stroke-dashoffset .85s cubic-bezier(.4,0,.2,1)" }}/>
                    <path d={g.arrow} fill="none" stroke={on ? "var(--green)" : "var(--text-faint)"} strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ transition: "stroke .5s" }}/>
                  </g>
                );
              })}
            </svg>

            <button className="method-center" onClick={onScore}>
              <span className="method-center-default">
                <span className="method-center-label">ชีวิตของคุณ</span>
                <span className="method-center-en mono">YOUR LIFE</span>
                <span className="method-center-sub">ทุกการตัดสินใจ<br/>เริ่มจากความเข้าใจชีวิตของคุณ</span>
              </span>
              <span className="method-center-hover">
                <span className="method-center-hlabel mono">LIFE PROTECTION SCORE™</span>
                <span className="method-center-gauge">
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(19,41,75,.10)" strokeWidth="7"
                      strokeLinecap="round" strokeDasharray={`${2*Math.PI*42*0.75} ${2*Math.PI*42}`} transform="rotate(135 50 50)"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--gold)" strokeWidth="7"
                      strokeLinecap="round" strokeDasharray={`${2*Math.PI*42*0.75*0.62} ${2*Math.PI*42}`} transform="rotate(135 50 50)"/>
                  </svg>
                  <span className="method-center-score">62<i>/100</i></span>
                </span>
                <span className="method-center-cta">ค้นหาช่องว่างความคุ้มครอง · เริ่มฟรี</span>
              </span>
            </button>

            {steps.map((s, i) => {
              const p = pos(i);
              const on = active === i;
              return (
                <button key={s.no}
                  className={"method-node method-node-" + tones[i] + (on ? " on" : "")}
                  style={{ left: (p.x/400*100)+"%", top: (p.y/400*100)+"%" }}
                  onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)}>
                  <span className="method-node-ic"><Icon name={s.glyph} size={22}/></span>
                  <span className="method-node-no mono">{s.no}</span>
                  <span className="method-node-th">{s.th}</span>
                </button>
              );
            })}
          </div>

          {/* active step detail */}
          <div className="method-detail">
            {steps.map((s, i) => (
              <div key={s.no} className={"method-panel method-panel-" + tones[i] + (active===i ? " on" : "")} aria-hidden={active!==i}>
                <div className="method-panel-head">
                  <span className="method-panel-ic"><Icon name={s.glyph} size={26}/></span>
                  <div>
                    <span className="method-panel-no mono">STEP {s.no}</span>
                    <h3 className="method-panel-th">{s.th} <span className="method-panel-en">{s.en}</span></h3>
                  </div>
                </div>
                <p className="method-panel-body">{s.body}</p>
                <ul className="method-points">
                  {s.points.map((pt, j) => (
                    <li key={j}><Icon name="check" size={15}/> {pt}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="method-dots">
              {steps.map((s,i)=>(
                <button key={i} className={"method-dot" + (active===i?" on":"")} onClick={()=>setActive(i)} aria-label={s.th}/>
              ))}
            </div>
          </div>
        </div>

        {/* mobile vertical timeline (adaptive, not a shrunk orbit) */}
        <ol className="method-timeline reveal">
          {steps.map((s, i) => (
            <li key={s.no} className={"mt-step method-panel-" + tones[i]}>
              <span className="mt-rail" aria-hidden="true">
                <span className="mt-node"><Icon name={s.glyph} size={20}/></span>
              </span>
              <div className="mt-body">
                <span className="mt-no mono">STEP {s.no}</span>
                <h3 className="mt-th">{s.th} <span className="mt-en">{s.en}</span></h3>
                <p className="mt-desc">{s.body}</p>
                <ul className="mt-points">
                  {s.points.map((pt, j) => <li key={j}><Icon name="check" size={14}/> {pt}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* brand manifesto */}
        <div className="method-statement reveal">
          <span className="ms-eyebrow mono">WHAT WE BELIEVE</span>
          <div className="ms-journey">
            {steps.map((s, i) => (
              <React.Fragment key={s.no}>
                <span className="ms-phrase">{s.stmt}</span>
                {i < steps.length-1 && <span className="ms-sep" aria-hidden="true">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="ms-philosophy">
            <span className="ms-philo-label mono">PROTECTION PLANNING IS CONTINUOUS</span>
            <p className="ms-philo-th">การวางแผนความคุ้มครอง<strong>เป็นกระบวนการต่อเนื่อง</strong><br/><span className="ms-philo-contrast">ไม่ใช่การตัดสินใจครั้งเดียว</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="section areas" id="areas">
      <div className="wrap">
        <SectionHead center kicker="PROTECTION AREAS"
          title="ความคุ้มครองที่เราช่วยให้คุณเข้าใจ"
          lede="ครอบคลุมทุกมิติของความเสี่ยง โดยไม่ผลักดันให้คุณซื้อเกินจำเป็น" />
        <div className="areas-grid">
          {window.AREAS.map((a,i) => (
            <div key={a.en} className={"area-card card reveal area-tone-" + a.tone} style={{ transitionDelay:(i*55)+"ms" }}>
              <div className="area-ic"><Icon name={a.icon} size={24}/></div>
              <h3 className="area-th">{a.th}</h3>
              <div className="area-en mono">{a.en}</div>
              <p className="area-body">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ScoreBand, Confusion, TruthReportPreview, Truth, Why, How, Areas, SectionHead });
