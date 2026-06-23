// tr-app.jsx — Truth Report orchestration

function TrConsultModal({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "" });
  const [err, setErr] = React.useState({});
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setTimeout(() => { setDone(false); setForm({ name:"", email:"", phone:"" }); setErr({}); }, 300);
  }, [open]);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = true;
    if (!form.email.trim() && !form.phone.trim()) { er.email = true; er.phone = true; }
    setErr(er);
    if (!Object.keys(er).length) {
      setDone(true);
      const ans = window.__trLastAnswers || null;
      const score = ans ? window.trComputeScore(ans) : null;
      const seg = score != null ? window.trSegmentFor(score) : null;
      window.submitToSheet && window.submitToSheet({
        source: "truth-report",
        event: "lead",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        score,
        segment: seg ? seg.en : "",
        answers: ans,
        fields: window.trFields(ans),
        summary: seg ? ("Truth Report — " + seg.en + " (" + score + "/100)") : "Truth Report consult request",
      });
    }
  };
  return (
    <div className="tr-modal-ov" onClick={onClose}>
      <div className="tr-modal" onClick={e => e.stopPropagation()}>
        <button className="tr-modal-close" onClick={onClose} aria-label="close">×</button>
        {!done ? (
          <form onSubmit={submit} noValidate>
            <div className="tr-kicker">PERSONAL REVIEW</div>
            <h3>ขอรับการรีวิวส่วนตัว</h3>
            <p className="tr-modal-sub">ทิ้งช่องทางติดต่อไว้ ที่ปรึกษาจะติดต่อกลับเพื่อพูดคุยอย่างตรงไปตรงมา — ไม่มีการกดดันการขาย</p>
            <label className={"tr-field" + (err.name ? " err" : "")}>
              <span>ชื่อ</span>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อของคุณ"/>
              {err.name && <em>กรุณากรอกชื่อ</em>}
            </label>
            <label className={"tr-field" + (err.email ? " err" : "")}>
              <span>อีเมล</span>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com"/>
            </label>
            <label className={"tr-field" + (err.phone ? " err" : "")}>
              <span>เบอร์โทร</span>
              <input type="tel" inputMode="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="08X-XXX-XXXX"/>
              {(err.email || err.phone) && <em>กรุณากรอกอีเมลหรือเบอร์โทรอย่างน้อยหนึ่งช่อง</em>}
            </label>
            <button type="submit" className="tr-btn tr-btn-primary tr-btn-lg">ส่งคำขอ <span className="ar">→</span></button>
            <p className="tr-modal-fine">เราเก็บข้อมูลของคุณเป็นความลับ และจะไม่ส่งต่อให้บุคคลที่สาม</p>
          </form>
        ) : (
          <div className="tr-modal-done">
            <div className="tr-modal-done-ic">✓</div>
            <h3>ได้รับคำขอแล้ว</h3>
            <p className="tr-modal-sub">ขอบคุณ {form.name} — ที่ปรึกษาจะติดต่อกลับโดยเร็ว เพื่อพูดคุยเรื่องความคุ้มครองของคุณอย่างตรงไปตรงมา</p>
            <button className="tr-btn tr-btn-ghost" style={{ width:"100%", marginTop:20 }} onClick={onClose}>ปิดหน้าต่าง</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TrApp() {
  const [phase, setPhase] = React.useState("intro"); // intro | quiz | report
  const [ans, setAns] = React.useState(null);
  const [consult, setConsult] = React.useState(false);
  const submittedRef = React.useRef(false); // one-shot guard against double completion

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.setAttribute("data-reduced", reduced ? "1" : "0");
  }, []);

  const start = () => { setPhase("quiz"); window.scrollTo(0, 0); };
  const complete = (a) => {
    setAns(a);
    setPhase("report");
    window.scrollTo(0, 0);
    window.__trLastAnswers = a; // shared with the consult modal
    if (submittedRef.current) return; // already logged this completion
    submittedRef.current = true;
    const score = window.trComputeScore(a);
    const seg = window.trSegmentFor(score);
    window.submitToSheet && window.submitToSheet({
      source: "truth-report",
      event: "completion",
      score,
      segment: seg ? seg.en : "",
      answers: a,
      fields: window.trFields(a),
      summary: "Truth Report — " + (seg ? seg.en : "") + " (" + score + "/100)",
    });
  };
  const restart = () => { submittedRef.current = false; setAns(null); setPhase("intro"); window.scrollTo(0, 0); };

  return (
    <>
      <header className="tr-top">
        <a className="tr-brand" href="#" onClick={(e) => { e.preventDefault(); restart(); }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="9" stroke="var(--navy)" strokeWidth="1.5" opacity="0.5"/>
            <path d="M10 16.5l4 4 8-9" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tr-brand-txt">
            <b>Truth Report<sup>™</sup></b>
            <em>by Human Insurance</em>
          </span>
        </a>
        <div className="tr-top-right">
          <span className="tr-top-meta">
            {phase === "intro" && "ความจริงเรื่องประกัน"}
            {phase === "quiz" && "กำลังประเมิน…"}
            {phase === "report" && "รายงานของคุณ"}
          </span>
          {phase === "report" && (
            <button className="tr-btn tr-btn-ghost" style={{ padding: "9px 18px", fontSize: 14 }} onClick={restart}>เริ่มใหม่</button>
          )}
        </div>
      </header>

      {phase === "intro" && <TrIntro onStart={start} />}
      {phase === "quiz" && <TrQuiz onComplete={complete} />}
      {phase === "report" && ans && (
        <>
          <div className="tr-report-flag">
            <div className="wrap tr-report-flag-in">
              <span className="green" style={{ fontWeight: 700 }}>✓</span>
              รายงานนี้สร้างจากคำตอบของคุณ — ตรงไปตรงมา ไม่มีการแนะนำขายผลิตภัณฑ์
            </div>
          </div>
          <TrReport ans={ans} onRestart={restart} onConsult={() => setConsult(true)} />
        </>
      )}

      <TrConsultModal open={consult} onClose={() => setConsult(false)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("tr-root")).render(<TrApp />);
