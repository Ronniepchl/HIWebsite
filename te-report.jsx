// te-report.jsx — Personalized AI Report (6 pages, scroll sections)

function TEReport({ result, motion, onBook, onDashboard }) {
  const { score, cats, answers } = result;
  const seg = window.teSegmentFor(score);
  const gen = React.useMemo(() => window.teGenerateReport(answers, cats), [answers, cats]);
  const worry = (window.TE_STEPS[5].questions[0].options.find(o => o.v === answers.worry) || {}).th;

  return (
    <div className="te-report">
      {/* PAGE 1 — Score */}
      <section className="te-rsec te-rscore">
        <div className="te-rscore-inner">
          <span className="te-rkicker mono">YOUR LIFE PROTECTION SCORE™</span>
          <TEGauge score={score} motion={motion} size={260} />
          <h1 className="te-seg-th" style={{ color: seg.color }}>{seg.th}</h1>
          <div className="te-seg-en mono">{seg.en}</div>
          <p className="te-seg-note">{seg.note}</p>
          {worry && <p className="te-worry">สิ่งที่คุณกังวลที่สุด: <strong>{worry}</strong> — เราจัดลำดับรายงานให้คุณตามนี้</p>}
        </div>
      </section>

      {/* PAGE 2/3 — Strengths + Areas */}
      <section className="te-rsec">
        <div className="te-twocol">
          <div className="te-block">
            <div className="te-block-head te-good"><TIcon name="check" size={18}/> จุดแข็งของคุณ</div>
            <div className="te-items">
              {gen.strengths.length ? gen.strengths.map((s,i)=>(
                <div key={i} className="te-item te-item-good">
                  <span className="te-item-th">{s.th}</span>
                  <span className="te-item-note">{s.note}</span>
                </div>
              )) : <div className="te-item te-empty">ยังไม่มีจุดแข็งเด่นชัด — เริ่มสร้างได้จากส่วนถัดไป</div>}
            </div>
          </div>
          <div className="te-block">
            <div className="te-block-head te-warn"><TIcon name="warn" size={18}/> จุดที่ควรทบทวน</div>
            <div className="te-items">
              {gen.areas.map((s,i)=>(
                <div key={i} className="te-item te-item-warn">
                  <span className="te-item-th">{s.th}</span>
                  <span className="te-item-note">{s.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAGE 4 — Hidden Risk Analysis */}
      <section className="te-rsec te-rhidden">
        <div className="te-rsec-head">
          <span className="te-rkicker mono">HIDDEN RISK ANALYSIS™</span>
          <h2 className="te-rh">ความเสี่ยงที่ซ่อนอยู่ในความคุ้มครองของคุณ</h2>
          <p className="te-rsub">วิเคราะห์จากคำตอบของคุณ — สิ่งที่อาจกลายเป็นปัญหาเมื่อชีวิตเปลี่ยน</p>
        </div>
        <div className="te-hidden-grid">
          <div className="te-viz-card">
            <span className="te-viz-title mono">PROTECTION RADAR</span>
            <TERadar cats={cats} motion={motion} />
          </div>
          <div className="te-viz-card">
            <span className="te-viz-title mono">PROTECTION GAP MAP</span>
            <TEGapMap cats={cats} />
          </div>
        </div>
        <div className="te-risks">
          {gen.hiddenRisks.map((r,i)=>(
            <div key={i} className={"te-risk te-risk-"+r.level}>
              <span className="te-risk-ic"><TIcon name={r.icon} size={20}/></span>
              <div className="te-risk-body">
                <div className="te-risk-top">
                  <span className="te-risk-th">{r.th}</span>
                  <span className={"te-risk-level te-lv-"+r.level}>{r.level==="high"?"เสี่ยงสูง":r.level==="medium"?"เสี่ยงปานกลาง":"เฝ้าระวัง"}</span>
                </div>
                <p className="te-risk-note">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 5 — Questions you should ask */}
      <section className="te-rsec te-rquestions">
        <div className="te-rsec-head">
          <span className="te-rkicker mono">QUESTIONS YOU SHOULD ASK</span>
          <h2 className="te-rh">คำถามที่คุณควรถาม ก่อนตัดสินใจ</h2>
          <p className="te-rsub">นำรายการนี้ไปคุยกับที่ปรึกษาคนไหนก็ได้ — เพื่อให้คุณได้คำตอบที่แท้จริง</p>
        </div>
        <ol className="te-qlist">
          {gen.questions.map((q,i)=>(
            <li key={i} className="te-qitem">
              <span className="te-qnum mono">{String(i+1).padStart(2,"0")}</span>
              <span className="te-qtext">{q}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* PAGE 6 — Learning Path */}
      <section className="te-rsec te-rlearn">
        <div className="te-rsec-head">
          <span className="te-rkicker mono">RECOMMENDED LEARNING PATH</span>
          <h2 className="te-rh">สิ่งที่ควรทำความเข้าใจต่อ</h2>
          <p className="te-rsub">เราแนะนำ <strong>ความรู้</strong> ไม่ใช่ผลิตภัณฑ์ — เข้าใจก่อน แล้วค่อยตัดสินใจ</p>
        </div>
        <div className="te-learn-grid">
          {gen.learning.map((l,i)=>(
            <div key={i} className="te-learn-card">
              <span className="te-learn-ic"><TIcon name="book" size={20}/></span>
              <span className="te-learn-th">{l.th}</span>
              <span className="te-learn-min mono">{l.min}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Conversion — trust-first */}
      <section className="te-rsec te-rconvert">
        <div className="te-convert-card">
          <div className="te-convert-glow"/>
          <span className="te-rkicker mono" style={{ color:"var(--gold-bright)" }}>NEXT STEP</span>
          <h2 className="te-convert-h">อยากเข้าใจรายงานของคุณ<br/>ให้ลึกขึ้นไหม?</h2>
          <p className="te-convert-sub">คุยกับนักวิเคราะห์ความคุ้มครอง ที่จะอธิบายทั้ง<strong> สิ่งที่คุ้มครอง </strong>และ<strong> สิ่งที่ไม่คุ้มครอง </strong>— ไม่ขาย ไม่กดดัน</p>
          <div className="te-convert-btns">
            <button className="btn btn-primary btn-lg" onClick={onBook}>
              จองรีวิวความคุ้มครองส่วนตัว <TIcon name="arrow" size={18} className="arrow"/>
            </button>
          </div>
          <p className="te-convert-fine">รายงานนี้เพื่อการศึกษา ไม่ใช่การเสนอขายผลิตภัณฑ์ · คุณเป็นเจ้าของข้อมูลของคุณเสมอ</p>
        </div>
        <button className="te-dash-link" onClick={onDashboard}>ดูมุมมองนักวิเคราะห์ (Advisor Dashboard) <TIcon name="arrow" size={14}/></button>
      </section>
    </div>
  );
}

Object.assign(window, { TEReport });
