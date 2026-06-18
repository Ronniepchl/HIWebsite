// engagement.jsx — Welcome modal + Sticky CTA bar + Exit-Intent capture

function WelcomeModal({ onScore, onReport, suppressed }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (sessionStorage.getItem("hi_welcome_seen")) return;
    const id = setTimeout(() => {
      if (!suppressed) { setOpen(true); sessionStorage.setItem("hi_welcome_seen", "1"); }
    }, 900);
    return () => clearTimeout(id);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  const close = () => setOpen(false);
  const go = (fn) => { setOpen(false); fn(); };
  return (
    <div className="lps-overlay on" onClick={close}>
      <div className="welcome-modal card" onClick={e => e.stopPropagation()}>
        <button className="lps-close welcome-close" onClick={close} aria-label="close">
          <Icon name="close" size={20}/>
        </button>
        <div className="welcome-glow"/>
        <div className="welcome-mark"><BrandMark size={46}/></div>
        <span className="welcome-tag mono">ยินดีต้อนรับ</span>
        <h3 className="welcome-h">เราไม่ได้มาขายประกัน<br/><span className="welcome-em">เรามาช่วยให้คุณเข้าใจ</span></h3>
        <p className="welcome-sub">
          Human Insurance แปลภาษากรมธรรม์ให้เป็นภาษาคน พร้อมบอกทั้ง
          <strong> สิ่งที่คุ้มครอง</strong> และ<strong> สิ่งที่ไม่คุ้มครอง</strong> ก่อนคุณตัดสินใจ
        </p>
        <div className="welcome-trust">
          <span><Icon name="check" size={14}/> ไม่เร่งขาย</span>
          <span><Icon name="check" size={14}/> 7 คำถาม</span>
          <span><Icon name="check" size={14}/> 3 นาที</span>
          <span><Icon name="check" size={14}/> ไม่ต้องกรอกอีเมล</span>
        </div>
        <div className="welcome-btns">
          <button className="btn btn-primary btn-lg" onClick={() => go(onScore)}>
            ค้นหาช่องว่างความคุ้มครอง <Icon name="arrow" size={18} className="arrow"/>
          </button>
          <button className="btn btn-ghost" onClick={() => go(onReport)}>
            <Icon name="doc" size={16}/> รับ Truth Report™ แทน
          </button>
        </div>
        <button className="welcome-dismiss" onClick={close}>ขอดูเว็บไซต์ก่อน</button>
      </div>
    </div>
  );
}

function StickyCTA({ onScore, onReport, onJoin, hidden }) {
  const [show, setShow] = React.useState(false);
  const [inCareer, setInCareer] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      // show after leaving hero, hide near the very bottom (final CTA + footer)
      setShow(y > window.innerHeight * 0.9 && y < h - 680);
      // detect advisor (career) section in view → swap message
      const career = document.getElementById("career");
      if (career) {
        const r = career.getBoundingClientRect();
        setInCareer(r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.3);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const visible = show && !hidden;
  return (
    <div className={"sticky-cta" + (visible ? " on" : "") + (inCareer ? " sticky-cta-advisor" : "")} aria-hidden={!visible}>
      <div className="sticky-cta-inner">
        {inCareer ? (
          <div className="sticky-cta-invite">
            <span className="sticky-invite-q">สนใจเส้นทางการเป็นที่ปรึกษา?</span>
            <button className="sticky-invite-link" onClick={onJoin} tabIndex={visible ? 0 : -1}>
              พูดคุยกับทีม Human Insurance <Icon name="arrow" size={15} className="arrow"/>
            </button>
          </div>
        ) : (
          <>
            <div className="sticky-cta-text">
              <span className="sticky-cta-mono mono">LIFE PROTECTION SCORE™</span>
              <span className="sticky-cta-q">รู้ช่องว่างความคุ้มครองของคุณใน 3 นาที</span>
            </div>
            <div className="sticky-cta-btns">
              <button className="btn btn-primary" onClick={onScore} tabIndex={visible ? 0 : -1}>
                ตรวจ Score ฟรี <Icon name="arrow" size={16} className="arrow"/>
              </button>
              <button className="btn btn-ghost sticky-cta-ghost" onClick={onReport} tabIndex={visible ? 0 : -1}>
                <Icon name="doc" size={15}/> Truth Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ExitIntent({ onScore, onReport, suppressed }) {
  const [open, setOpen] = React.useState(false);
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    if (sessionStorage.getItem("hi_exit_seen")) { firedRef.current = true; return; }
    const trigger = () => {
      if (firedRef.current || suppressed) return;
      firedRef.current = true;
      sessionStorage.setItem("hi_exit_seen", "1");
      setOpen(true);
    };
    const onLeave = (e) => { if (e.clientY <= 0) trigger(); };
    // desktop: mouse leaves viewport top. mobile: fast scroll-up fallback.
    let lastY = window.scrollY, lastT = Date.now();
    const onScroll = () => {
      const now = Date.now(), y = window.scrollY;
      const v = (lastY - y) / Math.max(1, now - lastT);
      if (v > 1.4 && y < 240 && window.scrollY < lastY) trigger();
      lastY = y; lastT = now;
    };
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { document.removeEventListener("mouseout", onLeave); window.removeEventListener("scroll", onScroll); };
  }, [suppressed]);

  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  if (!open) return null;
  const close = () => setOpen(false);
  const go = (fn) => { setOpen(false); fn(); };

  return (
    <div className="lps-overlay on" onClick={close}>
      <div className="exit-modal card" onClick={e => e.stopPropagation()}>
        <button className="lps-close exit-close" onClick={close} aria-label="close">
          <Icon name="close" size={20}/>
        </button>
        <div className="exit-glow"/>
        <span className="exit-tag mono">ก่อนคุณจะไป</span>
        <h3 className="exit-h">คุณอยากรู้ไหมว่า<br/><span className="exit-em">คุณมีช่องว่างความคุ้มครองอะไรบ้าง?</span></h3>
        <p className="exit-sub">
          ใช้เวลา 3 นาที ตรวจ Life Protection Score™ — ฟรี ไม่ต้องสมัคร
          แล้วเห็นภาพความเสี่ยงของคุณก่อนตัดสินใจ
        </p>
        <div className="exit-btns">
          <button className="btn btn-primary btn-lg" onClick={() => go(onScore)}>
            ตรวจ Life Protection Score™ ฟรี <Icon name="arrow" size={18} className="arrow"/>
          </button>
          <button className="btn btn-ghost" onClick={() => go(onReport)}>
            <Icon name="doc" size={16}/> ขอ Truth Report™ แทน
          </button>
        </div>
        <button className="exit-dismiss" onClick={close}>ยังไม่ตอนนี้</button>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeModal, StickyCTA, ExitIntent });
