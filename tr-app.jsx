// tr-app.jsx — Truth Report orchestration

function TrConsultModal({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", contact: "" });
  const [err, setErr] = React.useState({});
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setTimeout(() => { setDone(false); setForm({ name:"", contact:"" }); setErr({}); }, 300);
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
    if (!form.contact.trim()) er.contact = true;
    setErr(er);
    if (!Object.keys(er).length) setDone(true);
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
            <label className={"tr-field" + (err.contact ? " err" : "")}>
              <span>อีเมล หรือ เบอร์โทร</span>
              <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="you@email.com หรือ 08X-XXX-XXXX"/>
              {err.contact && <em>กรุณากรอกช่องทางติดต่อ</em>}
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

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.setAttribute("data-reduced", reduced ? "1" : "0");
  }, []);

  const start = () => { setPhase("quiz"); window.scrollTo(0, 0); };
  const complete = (a) => { setAns(a); setPhase("report"); window.scrollTo(0, 0); };
  const restart = () => { setAns(null); setPhase("intro"); window.scrollTo(0, 0); };

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
