// advisor-app.jsx — Advisor Fit Score™ discovery experience

function AFGauge({ score, motion, size = 260 }) {
  const [n, setN] = React.useState(motion ? 0 : score);
  React.useEffect(() => {
    if (!motion) { setN(score); return; }
    let raf, start; const dur = 1700;
    const step = (t) => { if(!start)start=t; const p=Math.min((t-start)/dur,1); const e=1-Math.pow(1-p,3); setN(Math.round(score*e)); if(p<1) raf=requestAnimationFrame(step); };
    const id = setTimeout(()=>{ raf=requestAnimationFrame(step); }, 250);
    return ()=>{ clearTimeout(id); cancelAnimationFrame(raf); };
  }, [score, motion]);
  const tier = window.afTierFor(n);
  const R=100, C=2*Math.PI*R, span=0.75, frac=n/100;
  return (
    <div className="te-gauge" style={{ width:size }}>
      <svg viewBox="0 0 240 240" width="100%">
        <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(19,41,75,.08)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${C*span} ${C}`} transform="rotate(135 120 120)"/>
        <circle cx="120" cy="120" r={R} fill="none" stroke={tier.color} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${C*span*frac} ${C}`} transform="rotate(135 120 120)" style={{ filter:`drop-shadow(0 4px 12px ${tier.color})`, transition:"stroke-dasharray .2s linear" }}/>
      </svg>
      <div className="te-gauge-c">
        <span className="te-gauge-num" style={{ color:tier.color }}>{n}</span>
        <span className="te-gauge-cap mono">/ 100</span>
      </div>
    </div>
  );
}

function AFIntro({ onStart }) {
  const signals = ["ใช้เวลา ~3 นาที","ไม่มีค่าสมัคร","ไม่มีการขาย","ได้รับรายงานเฉพาะบุคคล"];
  return (
    <div className="te-intro">
      <div className="te-intro-inner">
        <a className="te-intro-back" href="Human Insurance.html"><TIcon name="back" size={15}/> กลับหน้าหลัก</a>
        <span className="te-intro-kicker mono">ADVISOR FIT SCORE™</span>
        <h1 className="te-intro-h">คุณเหมาะกับการเป็น<br/>Protection Advisor หรือไม่?</h1>
        <p className="te-intro-sub">
          ใช้เวลาเพียง 3 นาที ตอบคำถาม 7 ข้อ เพื่อค้นหาว่าคุณมีลักษณะของ
          <strong> Human Insurance Advisor</strong> มากน้อยเพียงใด — ไม่ใช่การสมัครงาน แต่คือเครื่องมือค้นหาตัวเอง
        </p>
        <div className="te-intro-trust af-signals">
          {signals.map(s => <span key={s}><TIcon name="check" size={14}/> {s}</span>)}
        </div>
        <button className="btn btn-primary btn-lg te-intro-cta" onClick={onStart}>
          เริ่มประเมิน Advisor Fit Score™ <TIcon name="arrow" size={18} className="arrow"/>
        </button>
      </div>
    </div>
  );
}

function AFAssessment({ onComplete, motion }) {
  const Q = window.AF_QUESTIONS;
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const aRef = React.useRef(answers); aRef.current = answers;
  const q = Q[idx];
  const pct = Math.round((idx / Q.length) * 100);

  const choose = (i) => {
    const next = { ...aRef.current, [q.id]: i };
    setAnswers(next); aRef.current = next;
    setTimeout(() => {
      if (idx < Q.length - 1) setIdx(idx + 1);
      else onComplete({ answers: next, score: window.afScore(next) });
    }, motion ? 230 : 0);
  };

  return (
    <div className="te-assess-wrap">
      <div className="te-assess-top">
        <a className="te-assess-brand" href="Human Insurance.html"><TEMark size={24}/> <span>Advisor Fit Score™</span></a>
      </div>
      <div className="te-assess">
        <div className="af-progressbar"><div className="af-progressbar-fill" style={{ width: pct + "%" }}/></div>
        <div className="te-assess-body" key={idx}>
          <div className="te-qmeta">
            <span className="mono">{String(idx+1).padStart(2,"0")} / {String(Q.length).padStart(2,"0")}</span>
            {q.en && <span className="te-qen">{q.en}</span>}
          </div>
          <h2 className="te-q">{q.th}</h2>
          <div className="te-options">
            {q.options.map((o, i) => (
              <button key={i} className={"te-opt" + (answers[q.id]===i ? " sel" : "")} onClick={()=>choose(i)}>
                <span className="te-opt-dot"/>
                <span className="te-opt-th">{o.th}</span>
              </button>
            ))}
          </div>
          <div className="te-assess-nav">
            <button className="te-back" disabled={idx===0} onClick={()=>setIdx(Math.max(0, idx-1))}>
              <TIcon name="back" size={16}/> ย้อนกลับ
            </button>
            <span className="te-assess-pct mono">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AFResult({ result, motion, onTalk, onRestart }) {
  const { score, answers } = result;
  const tier = window.afTierFor(score);
  const gen = React.useMemo(()=>window.afGenerate(answers), [answers]);
  const outlook = Math.round(window.afOutlook(answers) * 100);

  return (
    <>
      <div className="te-report-top">
        <a className="te-assess-brand" href="Human Insurance.html"><TEMark size={24}/> <span>Advisor Fit Score™</span></a>
        <button className="te-restart" onClick={onRestart}>ทำแบบประเมินใหม่</button>
      </div>
      <div className="te-report">
        {/* score */}
        <section className="te-rsec te-rscore">
          <div className="te-rscore-inner">
            <span className="te-rkicker mono">YOUR ADVISOR FIT SCORE™</span>
            <AFGauge score={score} motion={motion} size={260}/>
            <h1 className="te-seg-th" style={{ color:tier.color }}>{tier.th}</h1>
            <div className="te-seg-en mono">{tier.thai}</div>
            <p className="te-seg-note">{tier.note}</p>
          </div>
        </section>

        {/* strengths + areas */}
        <section className="te-rsec">
          <div className="te-twocol">
            <div className="te-block">
              <div className="te-block-head te-good"><TIcon name="check" size={18}/> จุดแข็งของคุณ</div>
              <div className="te-items">
                {gen.strengths.map((s,i)=>(
                  <div key={i} className="te-item te-item-good"><span className="te-item-th">{s}</span></div>
                ))}
              </div>
            </div>
            <div className="te-block">
              <div className="te-block-head te-warn"><TIcon name="spark" size={18}/> สิ่งที่ควรพัฒนา</div>
              <div className="te-items">
                {gen.areas.map((s,i)=>(
                  <div key={i} className="te-item te-item-warn"><span className="te-item-th">{s}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* advisor outlook */}
        <section className="te-rsec af-outlook-sec">
          <div className="te-rsec-head">
            <span className="te-rkicker mono">ADVISOR OUTLOOK</span>
            <h2 className="te-rh">คุณมีแนวโน้มเป็น...</h2>
          </div>
          <div className="af-outlook">
            <div className="af-outlook-bar">
              <span className="af-outlook-fill" style={{ width: outlook + "%" }}/>
              <span className="af-outlook-marker" style={{ left: outlook + "%" }}/>
            </div>
            <div className="af-outlook-labels">
              <span className="af-outlook-l af-weak">Traditional<br/>Salesperson</span>
              <span className="af-outlook-l af-strong">Protection<br/>Advisor</span>
            </div>
          </div>
          <p className="af-brandmsg">
            Human Insurance ไม่ได้มองหานักขาย<br/>
            <strong>เรามองหาคนที่อยากช่วยให้ผู้คนตัดสินใจได้ดีขึ้น</strong>
          </p>
        </section>

        {/* invitation */}
        <section className="te-rsec te-rconvert">
          <div className="te-convert-card">
            <div className="te-convert-glow"/>
            <span className="te-rkicker mono" style={{ color:"var(--gold-bright)" }}>INTERESTED?</span>
            <h2 className="te-convert-h">สนใจพูดคุยเพิ่มเติมไหม?</h2>
            <p className="te-convert-sub">
              เราไม่รีบให้คุณสมัคร แต่ยินดีเล่าให้ฟังว่า <strong>Human Insurance ทำงานอย่างไร</strong>
              และเส้นทางนี้เหมาะกับคุณหรือไม่
            </p>
            <div className="te-convert-btns">
              <button className="btn btn-primary btn-lg" onClick={onTalk}>
                พูดคุยกับทีม Human Insurance <TIcon name="arrow" size={18} className="arrow"/>
              </button>
            </div>
            <p className="te-convert-fine">เริ่มต้นด้วยการพูดคุย ไม่ใช่การสมัคร · ไม่มีค่าใช้จ่าย</p>
          </div>
        </section>
      </div>
    </>
  );
}

function AFTalk({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name:"", contact:"" });
  const [err, setErr] = React.useState({});
  React.useEffect(()=>{ document.body.style.overflow = open?"hidden":""; if(!open) setTimeout(()=>{setDone(false);setForm({name:"",contact:""});setErr({});},300); },[open]);
  React.useEffect(()=>{ const k=(e)=>{ if(e.key==="Escape"&&open) onClose(); }; window.addEventListener("keydown",k); return ()=>window.removeEventListener("keydown",k); },[open,onClose]);
  if(!open) return null;
  const submit=(e)=>{ e.preventDefault(); const er={}; if(!form.name.trim())er.name=1; if(!form.contact.trim())er.contact=1; setErr(er); if(!Object.keys(er).length){ setDone(true); const r=window.__afLastResult||null; window.submitToSheet && window.submitToSheet({ source:"advisor-fit", event:"lead", name:form.name.trim(), contact:form.contact.trim(), score:r?r.score:null, answers:r?r.answers:null, summary:"Advisor Fit — let's talk"+(r?(" (score "+r.score+")"):"") }); } };
  return (
    <div className="lps-overlay on" onClick={onClose}>
      <div className="te-book card" onClick={e=>e.stopPropagation()}>
        <button className="lps-close te-book-close" onClick={onClose}><TIcon name="plus" size={20} style={{transform:"rotate(45deg)"}}/></button>
        {!done ? (
          <>
            <span className="te-rkicker mono">LET'S TALK</span>
            <h3 className="te-book-h">พูดคุยกับทีม Human Insurance</h3>
            <p className="te-book-sub">ทิ้งช่องทางติดต่อไว้ แล้วเราจะชวนคุยแบบสบาย ๆ — ไม่ใช่การสัมภาษณ์งาน ไม่มีการกดดัน</p>
            <form className="te-book-form" onSubmit={submit} noValidate>
              <label className={"field"+(err.name?" err":"")}><span>ชื่อ</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/></label>
              <label className={"field"+(err.contact?" err":"")}><span>อีเมล หรือ เบอร์โทร</span><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="you@email.com / 08X-XXX-XXXX"/></label>
              <button type="submit" className="btn btn-primary btn-lg te-book-submit">ขอให้ทีมติดต่อกลับ <TIcon name="arrow" size={18} className="arrow"/></button>
              <p className="te-book-fine">เริ่มต้นด้วยการพูดคุย ไม่ใช่การสมัคร</p>
            </form>
          </>
        ) : (
          <div className="te-book-done">
            <div className="te-book-done-ic"><TIcon name="check" size={38}/></div>
            <h3 className="te-book-h">ขอบคุณครับ</h3>
            <p className="te-book-sub">เราจะติดต่อ <b>{form.contact}</b> เพื่อชวนพูดคุยเร็ว ๆ นี้</p>
            <button className="btn btn-ghost" onClick={onClose}>ปิดหน้าต่าง</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AFApp() {
  const startInAssess = /[?&]start=1/.test(window.location.search);
  const [view, setView] = React.useState(startInAssess ? "assess" : "intro");
  const [result, setResult] = React.useState(null);
  const [talk, setTalk] = React.useState(false);
  const submittedRef = React.useRef(false); // one-shot guard against double completion
  React.useEffect(()=>{ window.scrollTo(0,0); }, [view]);
  const complete = (r) => {
    setResult(r); setView("result"); window.__afLastResult = r;
    if (submittedRef.current) return;
    submittedRef.current = true;
    window.submitToSheet && window.submitToSheet({ source:"advisor-fit", event:"completion", score:r.score, answers:r.answers, summary:"Advisor Fit — score "+r.score+"/100" });
  };
  return (
    <div className="te-root" data-motion="on">
      {view==="intro" && <AFIntro onStart={()=>setView("assess")} />}
      {view==="assess" && <AFAssessment motion={true} onComplete={complete} />}
      {view==="result" && result && <AFResult result={result} motion={true} onTalk={()=>setTalk(true)} onRestart={()=>{ submittedRef.current=false; setResult(null); setView("intro"); }} />}
      <AFTalk open={talk} onClose={()=>setTalk(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AFApp />);
