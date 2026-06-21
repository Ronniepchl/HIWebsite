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

// Life Protection Score™ risk zones (Critical → Fortress)
const SCORE_ZONES = [
  { max: 39,  label: "Critical",   color: "#EF4444" },
  { max: 59,  label: "At Risk",    color: "#F97316" },
  { max: 74,  label: "Vulnerable", color: "#FACC15" },
  { max: 89,  label: "Protected",  color: "#22C55E" },
  { max: 100, label: "Fortress",   color: "#0EA5E9" },
];
const scoreZone = (s) => SCORE_ZONES.find(z => s <= z.max) || SCORE_ZONES[SCORE_ZONES.length - 1];

// Premium 180° Life Protection Score™ gauge
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
  const zone = scoreZone(value);
  const uid = (React.useId ? React.useId() : "hg").replace(/[:]/g, "");
  const R = 86, CX = 110, CY = 116, semi = Math.PI * R; // 180deg arc length
  const frac = Math.max(0, Math.min(1, v / 100));
  const ang = Math.PI * (1 - frac);                 // left (π) → right (0)
  const mx = CX + R * Math.cos(ang), my = CY - R * Math.sin(ang);
  const track = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
  return (
    <div className="hero-gauge hg-semi">
      <svg viewBox="0 0 220 150" width="100%">
        <defs>
          <linearGradient id={`hgz-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={zone.color} stopOpacity=".55"/>
            <stop offset="1" stopColor={zone.color}/>
          </linearGradient>
          <filter id={`hgG-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d={track} fill="none" stroke="var(--surface-3)" strokeWidth="15" strokeLinecap="round"/>
        <path d={track} fill="none" stroke={`url(#hgz-${uid})`} strokeWidth="15" strokeLinecap="round"
          strokeDasharray={`${semi*frac} ${semi}`}
          style={{ transition: "stroke-dasharray .4s cubic-bezier(.4,0,.2,1), stroke .4s ease" }}/>
        {frac > 0.01 && <circle cx={mx} cy={my} r="9" fill={zone.color}
          style={{ filter: `url(#hgG-${uid})`, transition: "all .4s cubic-bezier(.4,0,.2,1)" }}/>}
        {frac > 0.01 && <circle cx={mx} cy={my} r="3.8" fill="#fff"
          style={{ transition: "all .4s cubic-bezier(.4,0,.2,1)" }}/>}
      </svg>
      <div className="hg-center">
        <span className="hg-num" style={{ color: zone.color }}>{v}</span>
        <span className="hg-status" style={{ color: zone.color }}>{zone.label}</span>
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
                    <span className="hero-card-status-th" style={{ color: "#F97316" }}>คุ้มครองบางส่วน</span>
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
