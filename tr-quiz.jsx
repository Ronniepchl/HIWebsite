// tr-quiz.jsx — intro hero + questionnaire flow

function TrIcon({ name, size = 22 }) {
  // reuse simple inline icons
  const paths = {
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c0-3.3 3-5.5 7-5.5s7 2.2 7 5.5",
    family: null, income: "M3 17l5-5 4 3 6-7M21 8v4M21 8h-4",
    life: "M12 21s-7-4.5-9-9.5C1.5 7 4.5 4 8 4c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.5 0 6.5 3 5 7.5C19 16.5 12 21 12 21z",
    health: "M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8M14 12h2.5l1.5 2.5L20 9l1.5 3H23",
    critical: "M3 12h4l2-5 3 9 2.5-6 1.5 3H21",
    emergency: "M12 7v5l3.5 2", debt: "M3 7h18v10H3zM12 12h.01",
    shield: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z",
  };
  if (name === "family") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/>
      <path d="M3.5 19c0-2.8 2-4.5 4.5-4.5S12.5 16.2 12.5 19M11.5 19c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"/>
    </svg>
  );
  if (name === "emergency") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.shield}/>
    </svg>
  );
}

function TrIntro({ onStart }) {
  return (
    <section className="tr-intro">
      <div className="wrap tr-intro-wrap">
        <div className="tr-kicker fade-up in">A HUMAN INSURANCE STUDY · ความจริงเรื่องประกัน</div>
        <h1 className="tr-intro-h fade-up in">
          5 ความเข้าใจผิดเรื่องประกัน<br/>
          <span className="tr-intro-em">ที่อาจทำให้คุณเสียเงินหลักล้าน</span>
        </h1>
        <p className="tr-intro-sub fade-up in">
          หลายคนซื้อประกันจากคำแนะนำ แต่ไม่เคยเข้าใจข้อจำกัด<br/>
          <span className="nowrap">Truth&nbsp;Report™</span> ช่วยให้คุณเห็นทั้งด้านที่คุ้มครอง และด้านที่คนมัก<span className="nowrap">เข้าใจผิด</span><br/>
          <strong>ภายในเวลาไม่ถึง 5 นาที</strong>
        </p>
        <div className="tr-intro-cta fade-up in">
          <button className="tr-btn tr-btn-primary tr-btn-lg" onClick={onStart}>
            รับ Truth Report™ ของคุณ <span className="ar">→</span>
          </button>
          <span className="tr-intro-note mono">10 คำถาม · ไม่ต้องใช้อีเมล · ไม่มีการขาย</span>
        </div>

        {/* what you will discover */}
        <div className="tr-receive fade-up in">
          <span className="tr-receive-label mono">คุณจะค้นพบอะไร</span>
          <ul className="tr-receive-list">
            {[
              "สิ่งที่คุณจ่ายเงินอยู่ แต่อาจไม่เคยใช้",
              "สิ่งที่คุณคิดว่าคุ้มครอง แต่จริง ๆ อาจไม่ใช่",
              "ความเสี่ยงที่ยังไม่มีใครเคยถามคุณ",
              "แนวทางลดความเสี่ยงที่เหมาะกับสถานการณ์ของคุณ",
              "รายงานที่ช่วยให้คุณตัดสินใจด้วยข้อมูลจริง",
            ].map((t) => (
              <li key={t}><span className="tr-receive-check">✓</span> {t}</li>
            ))}
          </ul>
          <span className="tr-receive-foot mono">ใช้เวลาเพียง 3–5 นาที</span>
        </div>

        <div className="tr-intro-promise fade-up in">
          {[
            ["สิ่งที่คุ้มครอง", "คุณอาจมีความคุ้มครองมากกว่าที่คิด"],
            ["สิ่งที่ไม่คุ้มครอง", "หลายคนเพิ่งรู้เมื่อถึงวันที่ต้องเคลม"],
            ["จุดบอดของคุณ", "ความเสี่ยงที่ยังไม่มีใครเคยถามคุณ"],
          ].map(([t, d]) => (
            <div key={t} className="tr-promise">
              <span className="tr-promise-t">{t}</span>
              <span className="tr-promise-d">{d}</span>
            </div>
          ))}
        </div>

        {/* positioning statement */}
        <div className="tr-positioning fade-up in">
          <span className="tr-positioning-mark serif">Truth Report™</span>
          <p className="tr-positioning-body serif">
            ไม่ใช่การขายประกัน ไม่ใช่การเปรียบเทียบแผน<br/>
            แต่คือการทำความเข้าใจ <em>สิ่งที่คุ้มครอง</em> <em>สิ่งที่ไม่คุ้มครอง</em><br/>
            และ<em>จุดบอดด้านความเสี่ยง</em> ก่อนตัดสินใจซื้อ
          </p>
        </div>
      </div>

      <div className="wrap tr-trust-row fade-up in">
        <blockquote className="tr-signature">
          <span className="tr-signature-rule" aria-hidden="true"></span>
          <span className="serif tr-signature-quote">“Trust is the real product.”</span>
          <span className="mono tr-signature-by">Human Insurance™</span>
          <span className="tr-signature-tag">ความเข้าใจก่อนการตัดสินใจ</span>
        </blockquote>
      </div>
    </section>
  );
}

function TrQuiz({ onComplete }) {
  const Q = window.TR_QUESTIONS;
  const [step, setStep] = React.useState(0);
  const [ans, setAns] = React.useState({});
  const [shown, setShown] = React.useState(false);
  const q = Q[step];
  const pct = Math.round((step / Q.length) * 100);

  React.useEffect(() => {
    setShown(false);
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(r);
  }, [step]);

  const choose = (v) => {
    const next = { ...ans, [q.id]: v };
    setAns(next);
    setTimeout(() => {
      if (step + 1 >= Q.length) onComplete(next);
      else setStep(step + 1);
    }, 240);
  };

  return (
    <section className="tr-quiz">
      <div className="tr-quiz-bar">
        <div className="wrap tr-quiz-bar-in">
          <span className="mono tr-quiz-count">คำถาม {String(step+1).padStart(2,"0")} / {String(Q.length).padStart(2,"0")}</span>
          <div className="tr-quiz-track"><div className="tr-quiz-fill" style={{ width: pct + "%" }}/></div>
          <button className="tr-quiz-back" disabled={step === 0} onClick={() => setStep(Math.max(0, step-1))}>← ย้อนกลับ</button>
        </div>
      </div>

      <div className="wrap tr-quiz-stage">
        <div className={"tr-quiz-card" + (shown ? " in" : "")} key={step}>
          <div className="tr-quiz-icon"><TrIcon name={q.icon} size={26}/></div>
          <h2 className="tr-quiz-q">{q.q}</h2>
          <p className="tr-quiz-sub">{q.sub}</p>
          <div className="tr-quiz-opts">
            {q.options.map((o, i) => (
              <button key={o.v}
                className={"tr-opt" + (ans[q.id] === o.v ? " sel" : "")}
                onClick={() => choose(o.v)}>
                <span className="tr-opt-key">{String.fromCharCode(65+i)}</span>
                <span className="tr-opt-label">{o.label}</span>
                <span className="tr-opt-tick">✓</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TrIntro, TrQuiz, TrIcon });
