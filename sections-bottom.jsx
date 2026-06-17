// sections-bottom.jsx — Stories, Career, FAQ, Final CTA, Footer, Truth Report modal

function Stories() {
  return (
    <section className="section stories grid-bg" id="stories">
      <div className="wrap">
        <SectionHead center kicker="WHAT WE LEARNED"
          title="ความเสี่ยงที่คนเพิ่งรู้ เมื่อสายไป"
          lede="ไม่ใช่คำรับรอง แต่เป็นลำดับเหตุการณ์จริง ที่เริ่มจากเรื่องเล็ก ๆ แล้วลุกลามโดยไม่มีใครทันระวัง" />
        <div className="stories-grid">
          {window.STORIES.map((s,i) => (
            <article key={i} className="story-card card reveal" style={{ transitionDelay:(i*80)+"ms" }}>
              <span className="story-focus tag">{s.tag}</span>
              <ol className="story-chain">
                {s.chain.map((step, j) => (
                  <li key={j} className={"story-step" + (j === s.chain.length-1 ? " story-step-last" : "")}>
                    <span className="story-step-dot"/>
                    <span className="story-step-text">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="story-learned">
                <span className="story-learned-label mono">บทเรียน</span>
                <p>{s.learned}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="wrap">
        <SectionHead center kicker="CLIENT VOICES"
          title="เสียงจากลูกค้า"
          lede="ความรู้สึกของผู้ที่ได้เข้าใจความคุ้มครองของตัวเองอย่างแท้จริง ก่อนตัดสินใจ" />
        <div className="testimonials-grid">
          {window.TESTIMONIALS.map((t, i) => (
            <figure key={i} className={"testimonial-card card reveal" + ((t.video || t.youtube) ? " has-video" : "")} style={{ transitionDelay:(i*80)+"ms" }}>
              {t.youtube ? (
                <div className="testimonial-video">
                  <iframe src={"https://www.youtube.com/embed/" + t.youtube} title={t.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
                </div>
              ) : t.video ? (
                <div className="testimonial-video">
                  <video src={t.video} poster={t.poster || undefined} controls muted playsInline preload="metadata" />
                </div>
              ) : null}
              <span className="testimonial-mark" aria-hidden="true">“</span>
              <blockquote className="testimonial-quote">{t.quote}</blockquote>
              <figcaption className="testimonial-author">
                <span className="testimonial-avatar" aria-hidden="true">{t.initial}</span>
                <span className="testimonial-meta">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="section team" id="team">
      <div className="wrap">
        <SectionHead center kicker="PROTECTION ANALYSIS TEAM"
          title="ทีมวิเคราะห์ความคุ้มครองของคุณ"
          lede="ไม่ใช่ทีมขาย — แต่คือนักวิเคราะห์ที่อ่านเงื่อนไขจริง และทำงานเพื่อความเข้าใจของคุณ" />
        <div className="team-grid">
          {window.TEAM.map((m, i) => (
            <article key={i} className="team-card card reveal" style={{ transitionDelay: (i*70)+"ms" }}>
              <div className="team-photo ph">
                {m.photo
                  ? <img className="team-portrait" src={m.photo} alt={m.name} loading="lazy"/>
                  : <span className="ph-label">PORTRAIT</span>}
                <span className="team-focus tag">{m.focus}</span>
              </div>
              <div className="team-info">
                <h3 className="team-name">{m.name}</h3>
                <div className="team-name-en mono">{m.en}</div>
                <div className="team-role">{String(m.role).split("\n").map((l,i)=><React.Fragment key={i}>{i>0&&<br/>}{l}</React.Fragment>)}</div>
                <div className="team-role-en mono">{String(m.roleEn).split("\n").map((l,i)=><React.Fragment key={i}>{i>0&&<br/>}{l}</React.Fragment>)}</div>
                <p className="team-bio">{m.bio}</p>
                <div className="team-lic mono"><Icon name="shield" size={13}/> {m.lic}</div>
              </div>
            </article>
          ))}
        </div>
        <p className="team-foot">
          <Icon name="eye" size={15}/> นักวิเคราะห์ทุกคนมีใบอนุญาตตัวแทน/นายหน้าประกันชีวิตถูกต้อง
        </p>
      </div>
    </section>
  );
}

function Career({ onJoin }) {
  const tools = [
    { name: "The Human Insurance Method™", note: "กรอบการให้คำปรึกษาที่เริ่มจากลูกค้า ไม่ใช่จากผลิตภัณฑ์" },
    { name: "Life Protection Score™", note: "เครื่องมือวิเคราะห์ช่องว่างความคุ้มครองและความเสี่ยง" },
    { name: "Truth Report™", note: "รายงานที่ช่วยให้ลูกค้าเข้าใจความเสี่ยงจริงก่อนตัดสินใจ" },
  ];
  const manifesto = [
    ["Trust", "Sales"],
    ["Understanding", "Pressure"],
    ["Advisory", "Transaction"],
    ["Truth", "Hype"],
  ];
  const beliefs = [
    <><strong>การอธิบายความจริง</strong> สำคัญกว่าการปิดการขาย</>,
    <>ลูกค้าควรเข้าใจ ทั้ง<strong>สิ่งที่คุ้มครอง</strong>และ<strong>สิ่งที่ไม่คุ้มครอง</strong></>,
    <><strong>ความไว้วางใจ</strong> สร้างจากความชัดเจน ไม่ใช่แรงกดดัน</>,
    <><strong>หน้าที่ของที่ปรึกษา</strong> คือช่วยให้ผู้คนตัดสินใจได้ดีขึ้น</>,
  ];
  return (
    <section className="section career" id="career">
      <div className="wrap">
        <div className="career-card card reveal">
          <div className="career-l">
            <div className="kicker">A NEW KIND OF ADVISOR</div>
            <h2 className="section-title career-h">
              สำหรับคนที่เชื่อว่า<br/><span className="career-h-accent">ความไว้วางใจสำคัญกว่ายอดขาย</span>
            </h2>
            <p className="career-lede">
              เรากำลังสร้างที่ปรึกษารุ่นใหม่ ที่ช่วยให้ผู้คนตัดสินใจเรื่องความคุ้มครองได้ดีขึ้น
              ผ่าน<strong> ความเข้าใจ ความชัดเจน และความจริง</strong>
            </p>
            <div className="career-tools">
              {tools.map((t, i) => (
                <div key={i} className="career-tool">
                  <span className="career-tool-no mono">{String(i+1).padStart(2,"0")}</span>
                  <div className="career-tool-body">
                    <span className="career-tool-name">{t.name}</span>
                    <span className="career-tool-note">{t.note}</span>
                  </div>
                </div>
              ))}
            </div>
            <a className="btn btn-primary btn-lg" href="Advisor Fit Score.html">
              สำรวจเส้นทางการเป็นที่ปรึกษา <Icon name="arrow" size={18} className="arrow"/>
            </a>
            <span className="career-cta-sub">เริ่มต้นด้วยการพูดคุย ไม่ใช่การสมัคร · ผ่าน Advisor Fit Score™</span>
          </div>
          <div className="career-wall">
            <span className="career-wall-eyebrow mono">WHAT WE STAND FOR</span>
            <span className="career-principles mono">Human Insurance Principles™</span>
            <div className="career-wall-list">
              {manifesto.map(([a, b], i) => (
                <div key={i} className={"career-wall-row" + (i===0 ? " cw-core" : "")}>
                  <span className="cw-strong">{a}</span>
                  <span className="cw-gt">&gt;</span>
                  <span className="cw-weak">{b}</span>
                </div>
              ))}
            </div>
            <div className="career-manifesto">
              <span className="career-manifesto-title"><span className="cm-mark" aria-hidden="true"><BrandMark size={22} /></span> Human Insurance Manifesto™</span>
              <div className="career-manifesto-list">
                {beliefs.map((b, i) => <p key={i}>{b}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="wrap wrap-narrow">
        <SectionHead center kicker="HONEST ANSWERS"
          title="คำถามยาก ที่เรากล้าตอบตรง ๆ"
          lede="เพราะการตัดสินใจที่ดี เริ่มจากการถามคำถามที่ถูกต้อง" />
        <div className="faq-list reveal">
          {window.FAQS.map((f,i) => {
            const on = open === i;
            return (
              <div key={i} className={"faq-item" + (on ? " on" : "")}>
                <button className="faq-q" onClick={() => setOpen(on ? -1 : i)}>
                  <span className="faq-q-ic"><Icon name="q" size={18}/></span>
                  <span className="faq-q-t">{f.q}</span>
                  <span className="faq-chev"><Icon name="plus" size={18}/></span>
                </button>
                <div className="faq-a-wrap" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="faq-a-inner"><p className="faq-a">{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onScore, onReport }) {
  return (
    <section className="section final-cta">
      <div className="wrap">
        <div className="final-card grid-bg reveal">
          <div className="final-glow"/>
          <div className="kicker">START HERE</div>
          <h2 className="final-h">รู้ก่อนว่าคุณ<br/>คุ้มครองพอหรือยัง</h2>
          <p className="final-sub">
            ไม่ต้องรอจนเกิดเรื่อง — ใช้เวลา 3 นาที เพื่อเห็นช่องว่างความเสี่ยงของคุณวันนี้
          </p>
          <div className="final-ctas">
            <button className="btn btn-primary btn-lg" onClick={onScore}>
              เริ่ม Life Protection Score™ <Icon name="arrow" size={18} className="arrow"/>
            </button>
            <button className="btn btn-ghost btn-lg" onClick={onReport}>
              <Icon name="doc" size={18}/> รับ Truth Report™
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="wrap wrap-narrow">
        <div className="manifesto-inner reveal">
          <span className="manifesto-mark" aria-hidden="true"><BrandMark size={40} /></span>
          <span className="manifesto-tag mono">BRAND PHILOSOPHY</span>
          <p className="manifesto-text">
            ประกันที่ดี ไม่ใช่ประกันที่<span className="manifesto-em">คุ้มครองทุกอย่าง</span>
            <br/>
            แต่คือประกันที่คุณ<span className="manifesto-em">เข้าใจข้อจำกัดของมัน</span>
          </p>
          <p className="manifesto-sub">
            เราเชื่อว่าคนไม่ควรซื้อประกันเพราะความกลัว แต่ควรซื้อเพราะเข้าใจความเสี่ยงของตัวเองอย่างแท้จริง
          </p>
          <span className="manifesto-by mono">— Human Insurance · ประกันภาษาคน</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ["แพลตฟอร์ม", ["Life Protection Score™","Truth Report™","ความคุ้มครอง","วิธีทำงาน"]],
    ["บริษัท", ["เกี่ยวกับเรา","ร่วมงานกับเรา","ปรัชญาแบรนด์","ติดต่อ"]],
    ["ความรู้", ["ความจริงเรื่องประกัน","คำถามที่พบบ่อย","คำศัพท์ประกัน","บทความ"]],
  ];
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <a href="#top" className="brand">
            <BrandMark size={30}/>
            <span className="brand-text"><b>Human Insurance</b><em>ประกันภาษาคน</em></span>
          </a>
          <p className="footer-philo">
            “Trust is the real product.”<br/>
            <span className="muted">ที่ปรึกษาที่กล้าพูดความจริงเรื่องประกัน</span>
          </p>
        </div>
        <div className="footer-cols">
          {cols.map(([h, items]) => (
            <div key={h} className="footer-col">
              <div className="footer-col-h mono">{h}</div>
              {items.map(it => <a key={it} href="#">{it}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Human Insurance · ประกันภาษาคน</span>
        <span className="footer-domains mono">
          <a href="https://www.human-insurance.com">www.human-insurance.com</a>
          <i aria-hidden="true">|</i>
          <a href="https://www.ประกันภาษาคน.com">www.ประกันภาษาคน.com</a>
        </span>
        <span className="muted">เพื่อการศึกษาและให้คำปรึกษา · ไม่ใช่การเสนอขายผลิตภัณฑ์</span>
      </div>
    </footer>
  );
}

// ---- Truth Report capture modal ----
function ReportModal({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name:"", email:"", phone:"" });
  const [err, setErr] = React.useState({});
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setTimeout(() => { setDone(false); setForm({name:"",email:"",phone:""}); setErr({}); }, 300);
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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = true;
    setErr(er);
    if (Object.keys(er).length === 0) {
      setDone(true);
      const lps = window.__lpsLast || null;
      window.submitToSheet && window.submitToSheet({
        source: "life-protection-score",
        event: "lead",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        score: lps ? lps.score : null,
        segment: lps ? lps.segment : "",
        answers: lps ? lps.answers : null,
        fields: lps ? window.lpsFields(lps.answers) : {},
        summary: "Truth Report request" + (lps ? (" — Life Protection Score " + lps.score + "/100") : ""),
      });
    }
  };

  return (
    <div className="lps-overlay on" onClick={onClose}>
      <div className="report-modal card" onClick={e => e.stopPropagation()}>
        <button className="lps-close report-close" onClick={onClose} aria-label="close">
          <Icon name="plus" size={20} style={{ transform:"rotate(45deg)" }}/>
        </button>
        {!done ? (
          <div className="report-grid">
            <div className="report-l">
              <div className="kicker">TRUTH REPORT™</div>
              <h3 className="report-h">5 ความเข้าใจผิดเรื่องประกัน<br/>ที่อาจทำให้คุณเสียเงินหลักล้าน</h3>
              <p className="report-sub">รายงานฉบับเต็ม พร้อมคำแนะนำเฉพาะคุณ และการวิเคราะห์ช่องว่างความคุ้มครอง</p>
              <ul className="report-list">
                {["รายงาน PDF อ่านง่าย","คำแนะนำเฉพาะบุคคล","วิเคราะห์ Protection Gap"].map(t => (
                  <li key={t}><Icon name="check" size={16}/> {t}</li>
                ))}
              </ul>
              <div className="report-preview ph">
                <span className="ph-label">REPORT COVER PREVIEW</span>
              </div>
            </div>
            <form className="report-form" onSubmit={submit} noValidate>
              <label className={"field" + (err.name ? " err" : "")}>
                <span>ชื่อ–นามสกุล</span>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/>
                {err.name && <em>กรุณากรอกชื่อ</em>}
              </label>
              <label className={"field" + (err.email ? " err" : "")}>
                <span>อีเมล</span>
                <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
                {err.email && <em>กรุณากรอกอีเมลให้ถูกต้อง</em>}
              </label>
              <label className="field">
                <span>เบอร์โทร <i className="opt">(ไม่บังคับ)</i></span>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08X-XXX-XXXX"/>
              </label>
              <button type="submit" className="btn btn-primary btn-lg report-submit">
                ส่ง Truth Report™ ให้ฉัน <Icon name="arrow" size={18} className="arrow"/>
              </button>
              <p className="report-fine">เราจะไม่ส่งสแปม และไม่กดดันการขาย — เพราะนั่นไม่ใช่เรา</p>
            </form>
          </div>
        ) : (
          <div className="report-done">
            <div className="report-done-ic"><Icon name="check" size={40}/></div>
            <h3 className="report-h">ส่งให้แล้ว 🙂</h3>
            <p className="report-sub">เราส่ง Truth Report™ ไปที่ <b>{form.email}</b> เรียบร้อย<br/>ตรวจสอบกล่องจดหมายของคุณได้เลย</p>
            <button className="btn btn-ghost" onClick={onClose}>ปิดหน้าต่าง</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Stories, Team, Career, FAQ, Manifesto, FinalCTA, Footer, ReportModal, AdvisorModal });

// ---- Advisor Conversation modal (recruitment journey — NOT customer Truth Report) ----
function AdvisorModal({ open, onClose }) {
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({ name:"", email:"", phone:"", interest:"สำรวจว่าเส้นทางนี้เหมาะกับผมหรือไม่" });
  const [err, setErr] = React.useState({});
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setTimeout(() => { setDone(false); setForm({name:"",email:"",phone:"",interest:"สำรวจว่าเส้นทางนี้เหมาะกับผมหรือไม่"}); setErr({}); }, 300);
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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = true;
    setErr(er);
    if (Object.keys(er).length === 0) setDone(true);
  };

  const interests = [
    "สำรวจว่าเส้นทางนี้เหมาะกับผมหรือไม่",
    "อยากเข้าใจวิธีทำงานจริง",
    "อยากรู้เรื่องรายได้และการเติบโต",
    "กำลังมองหาอาชีพใหม่",
    "สนใจ Human Insurance จากคำแนะนำของเพื่อน",
    "อื่น ๆ",
  ];

  return (
    <div className="lps-overlay on" onClick={onClose}>
      <div className="report-modal advisor-modal card" onClick={e => e.stopPropagation()}>
        <button className="lps-close report-close" onClick={onClose} aria-label="close">
          <Icon name="close" size={18}/>
        </button>
        {!done ? (
          <div className="report-grid">
            <div className="report-l advisor-l">
              <div className="kicker">A NEW KIND OF ADVISOR</div>
              <h3 className="report-h">เส้นทางนี้<br/>เหมาะกับคุณหรือไม่?</h3>
              <p className="report-sub">เราไม่ได้เริ่มจากการสมัคร — เราเริ่มจากการพูดคุย เพื่อดูว่าเส้นทางนี้เหมาะกับคุณหรือไม่</p>
              <ul className="report-list">
                {["ไม่มีแรงกดดัน","เข้าใจก่อนตัดสินใจ","เริ่มจากการพูดคุย"].map(t => (
                  <li key={t}><Icon name="check" size={16}/> {t}</li>
                ))}
              </ul>

              {/* Advisor Fit Snapshot™ — premium report preview */}
              <div className="advisor-preview advisor-snapshot">
                <div className="advisor-preview-head">
                  <span className="advisor-preview-label mono">EXAMPLE RESULT™</span>
                  <span className="advisor-preview-foot">ตัวอย่างผลลัพธ์ที่คุณอาจได้รับ</span>
                </div>
                <div className="advisor-preview-score">
                  <span className="advisor-preview-num">83<small>/100</small></span>
                  <span className="advisor-preview-tiers">
                    <span className="advisor-preview-tier-th">ศักยภาพสูง</span>
                    <span className="advisor-preview-tier-en mono">Strong Potential</span>
                  </span>
                </div>
                <span className="advisor-snapshot-lead">จุดแข็งที่อาจพบ</span>
                <div className="advisor-preview-strengths">
                  {["การสร้างความไว้วางใจ","การฟังเชิงลึก","การอธิบายเรื่องซับซ้อนให้เข้าใจง่าย","การช่วยผู้อื่นตัดสินใจ"].map(s => (
                    <span key={s} className="advisor-preview-str"><Icon name="check" size={13}/> {s}</span>
                  ))}
                </div>
              </div>

              {/* mini manifesto */}
              <div className="advisor-mini-manifesto">
                <span className="advisor-mini-mark" aria-hidden="true">“</span>
                <span className="advisor-mini-label mono">WHAT WE BELIEVE™</span>
                <p>เราเชื่อว่าที่ปรึกษาที่ดี ไม่ใช่คนที่ขายเก่งที่สุด<br/>แต่คือคนที่<strong>ช่วยให้ผู้อื่นตัดสินใจได้ดีที่สุด</strong></p>
              </div>
            </div>
            <form className="report-form advisor-form" onSubmit={submit} noValidate>
              {/* STEP 1 — primary product feature card */}
              <a className="advisor-fit-card advisor-fit-primary" href="Advisor Fit Score.html?start=1">
                <span className="advisor-fit-card-label mono">STEP 1 · ADVISOR FIT SCORE™</span>
                <span className="advisor-fit-card-h">ยังไม่แน่ใจว่าเส้นทางนี้เหมาะกับคุณหรือไม่?</span>
                <span className="advisor-fit-card-b">ตอบ 7 คำถาม ใช้เวลาเพียง 3 นาที เพื่อค้นหาว่าจุดแข็ง วิธีคิด และสไตล์การทำงานของคุณ สอดคล้องกับบทบาท Protection Advisor หรือไม่</span>
                <span className="advisor-fit-card-meta">
                  <span><Icon name="check" size={13}/> 7 Questions</span>
                  <span><Icon name="check" size={13}/> ~3 Minutes</span>
                  <span><Icon name="check" size={13}/> Personalized Result</span>
                  <span><Icon name="check" size={13}/> No Registration Required</span>
                </span>
                <span className="advisor-fit-primary-cta">เริ่ม Advisor Fit Score™ <Icon name="arrow" size={17} className="arrow"/></span>
              </a>

              <div className="advisor-form-divider advisor-divider-lead"><span><b>ยังไม่อยากทำแบบประเมิน?</b>คุณสามารถเริ่มจากการพูดคุยกับทีม Human Insurance ก่อนได้</span></div>

              <label className={"field" + (err.name ? " err" : "")}>
                <span>ชื่อที่เราใช้เรียกคุณ</span>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/>
                {err.name && <em>กรุณากรอกชื่อ</em>}
              </label>
              <label className={"field" + (err.email ? " err" : "")}>
                <span>อีเมลสำหรับการติดต่อ</span>
                <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com"/>
                {err.email && <em>กรุณากรอกอีเมลให้ถูกต้อง</em>}
              </label>
              <label className="field">
                <span>เบอร์โทร <i className="opt">(ถ้าสะดวก)</i></span>
                <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="08X-XXX-XXXX"/>
              </label>
              <label className="field">
                <span>คุณอยากเริ่มต้นจากเรื่องไหน?</span>
                <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}>
                  {interests.map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
              <div className="advisor-trustbar">
                <span><Icon name="check" size={14}/> ไม่มีการสมัครงานทันที</span>
                <span><Icon name="check" size={14}/> ไม่มีค่าใช้จ่าย</span>
                <span><Icon name="check" size={14}/> ไม่มีแรงกดดันในการตัดสินใจ</span>
              </div>
              <button type="submit" className="btn btn-ghost btn-lg report-submit advisor-secondary-cta">
                นัดพูดคุยกับทีม Human Insurance <Icon name="arrow" size={18} className="arrow"/>
              </button>
              <p className="report-fine"><b className="advisor-fine-strong">Conversation First · Opportunity Later</b><br/>ใช้เวลาประมาณ 15–20 นาที · ไม่มีภาระผูกพันใด ๆ</p>
            </form>
          </div>
        ) : (
          <div className="report-done">
            <div className="report-done-ic"><Icon name="check" size={40}/></div>
            <h3 className="report-h">ได้รับแล้ว ขอบคุณครับ</h3>
            <p className="report-sub">เราจะติดต่อ <b>{form.email}</b> เพื่อชวนพูดคุยแบบสบาย ๆ เร็ว ๆ นี้</p>
            <button className="btn btn-ghost" onClick={onClose}>ปิดหน้าต่าง</button>
          </div>
        )}
      </div>
    </div>
  );
}
