// nav-hero.jsx — top navigation + hero (3 directions)

function Nav({ onScore }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    ["ความจริงเรื่องประกัน", "#truth"], ["Life Protection Score™", "#score"], ["ทำไมเราถึงต่าง", "#why"],
    ["วิธีทำงาน", "#how"], ["ความคุ้มครอง", "#areas"], ["Protection Analysis Team™", "#team"],
    ["เสียงจากลูกค้า", "#testimonials"], ["คำถามที่พบบ่อย", "#faq"],
  ];
  const badges = ["ไม่เร่งขาย", "บอกทั้งข้อดีและข้อจำกัด", "เข้าใจง่าย ไม่ใช้ศัพท์ประกัน"];
  const [badgeIdx, setBadgeIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setBadgeIdx(i => (i + 1) % badges.length), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className={"nav" + (scrolled ? " nav-on" : "")}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand">
          <BrandMark size={32} />
          <span className="brand-text">
            <b>Human Insurance</b>
            <em>ประกันภาษาคน</em>
          </span>
        </a>
        <nav className="nav-links">
          {links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <div className="nav-cta">
          <span className="nav-cta-meta">
            <span className="nav-badge" key={badgeIdx}>
              <Icon name="check" size={13}/> {badges[badgeIdx]}
            </span>
            <span className="nav-cta-sub">3 นาที • ไม่ต้องกรอกอีเมล</span>
          </span>
          <button className="btn btn-primary" onClick={onScore}>
            <span className="cta-full">ค้นหาช่องว่างความคุ้มครอง</span>
            <span className="cta-short">ตรวจฟรี</span>
          </button>
        </div>
        <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="menu">
          <span/><span/><span/>
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <button className="btn btn-primary" onClick={() => { setOpen(false); onScore(); }}>
            ค้นหาช่องว่างความคุ้มครอง
          </button>
        </div>
      )}
    </header>
  );
}

// Small animated arc gauge for hero preview
function HeroGauge({ value = 45, motion }) {
  const [v, setV] = React.useState(motion ? 0 : value);
  React.useEffect(() => {
    if (!motion) { setV(value); return; }
    let raf, start, done = false;
    const dur = 1600;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(step); else done = true;
    };
    const id = setTimeout(() => { raf = requestAnimationFrame(step); }, 350);
    const guard = setTimeout(() => { if (!done) setV(value); }, dur + 900);
    return () => { clearTimeout(id); clearTimeout(guard); cancelAnimationFrame(raf); };
  }, [value, motion]);
  const R = 80, C = 2 * Math.PI * R, span = 0.75; // 270deg
  const frac = Math.max(0, Math.min(1, v / 100));
  const tipDeg = 135 + 270 * frac, tipRad = tipDeg * Math.PI / 180;
  const tx = 100 + R * Math.cos(tipRad), ty = 100 + R * Math.sin(tipRad);
  // Colour the gauge by the score's band (red → amber → blue → green).
  const seg = (window.LPS_SEGMENTS || []).find(s => value >= s.min && value <= s.max);
  const color = (seg && seg.color) || "var(--c-partial)";
  return (
    <div className="hero-gauge">
      <svg viewBox="0 0 200 200" width="100%">
        <defs>
          <filter id="hgGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface-3)"
          strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${C*span} ${C}`} transform="rotate(135 100 100)" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={color}
          strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${C*span*frac} ${C}`} transform="rotate(135 100 100)"
          style={{ transition: "stroke-dasharray .3s ease, stroke .3s ease" }} />
        {frac > 0.015 && <circle cx={tx} cy={ty} r="7.5" fill={color}
          style={{ filter: "url(#hgGlow)", transition: "all .3s ease" }} />}
        {frac > 0.015 && <circle cx={tx} cy={ty} r="3.2" fill="#fff"
          style={{ transition: "all .3s ease" }} />}
      </svg>
      <div className="hero-gauge-c">
        <span className="hg-num" style={{ color }}>{v}</span>
        <span className="hg-cap">/ 100</span>
        <span className="hg-lbl">Life Protection Score™</span>
      </div>
    </div>
  );
}

function Hero({ variant = "editorial", motion, onScore, onReport }) {
  const head = (
    <>
      <h1 className="hero-h1">
        <span className="hero-mark" aria-hidden="true"><BrandMark size={62} /></span>
        ประกัน<span className="hero-em">ภาษาคน</span>
      </h1>
      <div className="hero-h1-en">Insurance, translated into human language.</div>
    </>
  );
  const sub = (
    <div className="hero-sub-wrap">
      <p className="hero-sub">
        เพราะการตัดสินใจเรื่องประกัน <strong>ไม่ควรเริ่มจากการขาย</strong>
        แต่ควรเริ่มจาก<strong>การเข้าใจ</strong>
      </p>
      <p className="hero-support">
        เราแปลภาษากรมธรรม์ให้เป็นภาษาที่คุณเข้าใจ พร้อมบอกทั้งสิ่งที่คุ้มครอง
        และสิ่งที่ไม่คุ้มครอง เพื่อให้คุณตัดสินใจบนข้อมูลจริง ไม่ใช่ความกังวล
      </p>
    </div>
  );
  const ctas = (
    <div className="hero-ctas">
      <button className="btn btn-primary btn-lg" onClick={onScore}>
        ค้นหาช่องว่างความคุ้มครอง <Icon name="arrow" size={18} className="arrow"/>
      </button>
      <a className="btn btn-ghost btn-lg" href="Truth Report.html">
        <Icon name="doc" size={18}/> ดู Truth Report ของฉัน
      </a>
    </div>
  );
  const trust = (
    <div className="hero-trust">
      <span className="tag tag-check">ไม่เร่งขาย</span>
      <span className="tag tag-check">บอกทั้งข้อดีและข้อจำกัด</span>
      <span className="tag tag-check">เข้าใจง่าย ไม่ใช้ศัพท์ประกัน</span>
    </div>
  );
  const philoBand = (
    <div className="hero-philo reveal">
      <p>ประกันที่ดี ไม่ใช่ประกันที่<span className="hero-philo-hl">คุ้มครองทุกอย่าง</span> แต่คือประกันที่คุณ<span className="hero-philo-hl">เข้าใจข้อจำกัดของมัน</span></p>
    </div>
  );

  return (
    <section className={"hero grid-bg hero-" + variant} id="top">
      <div className="hero-glow" />
      <div className="wrap hero-wrap">
        {variant === "centered" && (
          <div className="hero-centered">
            {head}{sub}{ctas}
            <div className="hero-score-strip">
              <HeroGauge value={45} motion={motion} />
              <p className="hero-score-note">
                ผู้ใช้ส่วนใหญ่เริ่มต้นที่คะแนน <strong>40–60</strong><br/>
                <span className="muted">รู้ช่องว่างของคุณใน 3 นาที</span>
              </p>
            </div>
            {trust}
          </div>
        )}

        {variant === "editorial" && (
          <div className="hero-split">
            <div className="hero-left">
              {head}{sub}{ctas}{trust}
            </div>
            <div className="hero-right">
              <div className="hero-card card">
                <div className="hero-card-head">
                  <span className="hero-card-title">ตัวอย่างภาพรวมความคุ้มครองของคุณ</span>
                  <span className="tag">SNAPSHOT</span>
                </div>
                <div className="hero-card-score">
                  <HeroGauge value={45} motion={motion} />
                  <div className="hero-card-status">
                    <span className="hero-card-status-th" style={{ color: "var(--c-partial)" }}>คุ้มครองบางส่วน</span>
                    <span className="hero-card-status-sub">มีพื้นฐานแล้ว แต่ยังมีจุดที่ควรเสริม</span>
                  </div>
                </div>
                <div className="hero-card-lists">
                  <div className="hcl">
                    <span className="hcl-h hcl-good">จุดแข็ง</span>
                    <span className="hcl-item"><i className="hcl-dot ok"/> มีประกันสุขภาพ</span>
                    <span className="hcl-item"><i className="hcl-dot ok"/> มีเงินสำรองฉุกเฉิน</span>
                  </div>
                  <div className="hcl">
                    <span className="hcl-h hcl-warn">ควรทบทวน</span>
                    <span className="hcl-item"><i className="hcl-dot warn"/> ความคุ้มครองชีวิต</span>
                    <span className="hcl-item"><i className="hcl-dot warn"/> โรคร้ายแรง</span>
                  </div>
                </div>
                <button className="btn btn-ghost hero-card-btn" onClick={onScore}>
                  ดูรายละเอียด <Icon name="arrow" size={16} className="arrow"/>
                </button>
              </div>
            </div>
          </div>
        )}

        {variant === "statement" && (
          <div className="hero-statement">
            <h1 className="hero-h1 hero-h1-xl">
              คุณไม่ต้องการ<span className="strike">คนขายเก่ง</span><br/>
              คุณต้องการคนที่<span className="hero-em">กล้าพูดความจริง</span>
            </h1>
            {sub}{ctas}
            <div className="hero-statement-foot">
              <HeroGauge value={45} motion={motion} />
              {trust}
            </div>
          </div>
        )}
      </div>
      {philoBand}
    </section>
  );
}

/* Recognition / credentials strip — sits just below the hero.
   Built to look intentional with a single logo; TNQA can slot in later. */
function TrustStrip() {
  return (
    <section className="trust-strip reveal" aria-label="Trusted by Professional Standards">
      <div className="wrap">
        <div className="trust-kicker mono">Trusted by Professional Standards</div>
        <div className="trust-row">
          <figure className="trust-item">
            <span className="trust-logo-box"><img className="trust-logo trust-mdrt" src="assets/mdrt-seeklogo.com.svg"
              alt="MDRT — Million Dollar Round Table" loading="lazy" /></span>
            <figcaption className="trust-cap">ที่ปรึกษาระดับ MDRT</figcaption>
          </figure>
          <span className="trust-sep" aria-hidden="true"></span>
          <figure className="trust-item">
            <span className="trust-logo-box"><img className="trust-logo trust-azay" src="assets/allianz-ayudhya.png"
              alt="Allianz Ayudhya" loading="lazy" /></span>
            <figcaption className="trust-cap">พันธมิตรบริษัทประกัน</figcaption>
          </figure>
          <span className="trust-sep" aria-hidden="true"></span>
          <figure className="trust-item">
            <span className="trust-logo-box"><img className="trust-logo trust-tnqa" src="assets/TNQA.webp"
              alt="Thailand National Quality Awards" loading="lazy" /></span>
            <figcaption className="trust-cap">รางวัลตัวแทนคุณภาพดีเด่นแห่งชาติ</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, HeroGauge, TrustStrip });
