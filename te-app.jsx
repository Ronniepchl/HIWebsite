// te-app.jsx — Trust Engine router: intro → assessment → report → dashboard

function TEIntro({ onStart }) {
  const cats = window.TE_CATS;
  return (
    <div className="te-intro">
      <div className="te-intro-inner">
        <a className="te-intro-back" href="Human Insurance.html"><TIcon name="back" size={15}/> กลับหน้าหลัก</a>
        <span className="te-intro-kicker mono">PROTECTION DIAGNOSTIC</span>
        <h1 className="te-intro-h">Life Protection Score™</h1>
        <p className="te-intro-sub">
          แบบประเมินความคุ้มครอง 3 นาที — เราเริ่มจาก<strong>การเข้าใจสถานการณ์ของคุณ</strong>
          ก่อนพูดถึงผลิตภัณฑ์ใด ๆ แล้วสร้างรายงานเฉพาะคุณพร้อมวิเคราะห์ความเสี่ยงที่ซ่อนอยู่
        </p>
        <div className="te-intro-cats">
          {cats.map(c => (
            <span key={c.key} className="te-intro-cat"><TIcon name={c.key==="family"?"family":c.key==="income"?"income":c.key==="health"?"health":c.key==="emergency"?"emergency":"future"} size={16}/> {c.th}</span>
          ))}
        </div>
        <button className="btn btn-primary btn-lg te-intro-cta" onClick={onStart}>
          เริ่มประเมิน ฟรี <TIcon name="arrow" size={18} className="arrow"/>
        </button>
        <div className="te-intro-trust">
          <span><TIcon name="check" size={14}/> ไม่ต้องสมัคร</span>
          <span><TIcon name="check" size={14}/> 11 คำถาม · ~3 นาที</span>
          <span><TIcon name="check" size={14}/> ไม่ขาย ไม่กดดัน</span>
        </div>
      </div>
    </div>
  );
}

function TEBooking({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name:"", contact:"", time:"เช้า (9:00–12:00)" });
  const [err, setErr] = React.useState({});
  React.useEffect(()=>{ document.body.style.overflow = open?"hidden":""; if(!open) setTimeout(()=>{setDone(false);setForm({name:"",contact:"",time:"เช้า (9:00–12:00)"});setErr({});},300); }, [open]);
  React.useEffect(()=>{ const k=(e)=>{ if(e.key==="Escape"&&open) onClose(); }; window.addEventListener("keydown",k); return ()=>window.removeEventListener("keydown",k); },[open,onClose]);
  if (!open) return null;
  const submit = (e) => { e.preventDefault(); const er={}; if(!form.name.trim())er.name=1; if(!form.contact.trim())er.contact=1; setErr(er); if(!Object.keys(er).length) { setDone(true); const r=window.__teLastResult||null; window.submitToSheet && window.submitToSheet({ source:"trust-engine", event:"lead", name:form.name.trim(), contact:form.contact.trim(), score:r?r.score:null, segment:(r&&window.teSegmentFor)?window.teSegmentFor(r.score).en:"", answers:r?r.answers:null, fields:r?window.teFields(r.answers):{}, summary:"Trust Engine review request"+(r?(" (score "+r.score+")"):"") }); } };
  return (
    <div className="lps-overlay on" onClick={onClose}>
      <div className="te-book card" onClick={e=>e.stopPropagation()}>
        <button className="lps-close te-book-close" onClick={onClose}><TIcon name="close" size={20}/></button>
        {!done ? (
          <>
            <span className="te-rkicker mono">PERSONAL PROTECTION REVIEW</span>
            <h3 className="te-book-h">จองรีวิวความคุ้มครองส่วนตัว</h3>
            <p className="te-book-sub">นักวิเคราะห์จะอธิบายรายงานของคุณ ทั้งสิ่งที่คุ้มครองและไม่คุ้มครอง — ฟรี ไม่มีการขาย</p>
            <form className="te-book-form" onSubmit={submit} noValidate>
              <label className={"field"+(err.name?" err":"")}><span>ชื่อ</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/></label>
              <label className={"field"+(err.contact?" err":"")}><span>อีเมล หรือ เบอร์โทร</span><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="you@email.com / 08X-XXX-XXXX"/></label>
              <label className="field"><span>ช่วงเวลาที่สะดวก</span>
                <select value={form.time} onChange={e=>setForm({...form,time:e.target.value})}>
                  <option>เช้า (9:00–12:00)</option><option>บ่าย (13:00–17:00)</option><option>เย็น (18:00–20:00)</option>
                </select>
              </label>
              <button type="submit" className="btn btn-primary btn-lg te-book-submit">ยืนยันการจอง <TIcon name="arrow" size={18} className="arrow"/></button>
              <p className="te-book-fine">เราจะติดต่อเพื่อยืนยันเวลา ไม่มีการเสนอขายทางโทรศัพท์</p>
            </form>
          </>
        ) : (
          <div className="te-book-done">
            <div className="te-book-done-ic"><TIcon name="check" size={38}/></div>
            <h3 className="te-book-h">จองเรียบร้อย</h3>
            <p className="te-book-sub">เราจะติดต่อ <b>{form.contact}</b> เพื่อยืนยันรีวิวในช่วง <b>{form.time}</b></p>
            <button className="btn btn-ghost" onClick={onClose}>ปิดหน้าต่าง</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TEApp() {
  const [view, setView] = React.useState("intro"); // intro | assess | report | dashboard
  const [result, setResult] = React.useState(null);
  const [booking, setBooking] = React.useState(false);
  const motion = true;
  const submittedRef = React.useRef(false); // one-shot guard against double completion

  React.useEffect(() => { window.scrollTo(0,0); }, [view]);

  const complete = (r) => {
    setResult(r);
    setView("report");
    window.__teLastResult = r;
    if (submittedRef.current) return;
    submittedRef.current = true;
    const seg = window.teSegmentFor ? window.teSegmentFor(r.score) : null;
    window.submitToSheet && window.submitToSheet({ source:"trust-engine", event:"completion", score:r.score, segment: seg ? seg.en : "", answers:r.answers, fields:window.teFields(r.answers), summary:"Trust Engine — score "+r.score+"/100" });
  };

  return (
    <div className="te-root" data-motion="on">
      {view === "intro" && <TEIntro onStart={()=>setView("assess")} />}
      {view === "assess" && (
        <div className="te-assess-wrap">
          <div className="te-assess-top">
            <a className="te-assess-brand" href="Human Insurance.html"><TEMark size={24}/> <span>Human Insurance</span></a>
          </div>
          <TEAssessment motion={motion} onComplete={complete} />
        </div>
      )}
      {view === "report" && result && (
        <>
          <div className="te-report-top">
            <a className="te-assess-brand" href="Human Insurance.html"><TEMark size={24}/> <span>Human Insurance</span></a>
            <button className="te-restart" onClick={()=>{ submittedRef.current=false; setResult(null); setView("intro"); }}>ทำแบบประเมินใหม่</button>
          </div>
          <TEReport result={result} motion={motion} onBook={()=>setBooking(true)} onDashboard={()=>setView("dashboard")} />
        </>
      )}
      {view === "dashboard" && <TEDashboard result={result} onBack={()=>setView("report")} />}
      <TEBooking open={booking} onClose={()=>setBooking(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TEApp />);
