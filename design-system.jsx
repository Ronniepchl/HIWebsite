// design-system.jsx — Human Insurance Design System™ reference

const DS_STATES = [
  { key:"truth", num:"01", th:"Truth", thai:"ความจริง", color:"#13294b", accent:"#a07d1f",
    meaning:"เข้าใจความจริง ก่อนการโน้มน้าว", used:["Truth Report™","Manifesto™","Educational content"] },
  { key:"protection", num:"02", th:"Protection", thai:"ความคุ้มครอง", color:"#1f7a52", accent:"#1f7a52",
    meaning:"สุขภาพของความคุ้มครอง และความแข็งแรงของการป้องกัน", used:["Life Protection Score™","Protection dashboards","Coverage recommendations"] },
  { key:"analysis", num:"03", th:"Analysis", thai:"การวิเคราะห์", color:"#2a4f86", accent:"#2a4f86",
    meaning:"การประเมิน ค้นหา และวินิจฉัย", used:["Scoring engines","Advisor Fit Score™","Diagnostics"] },
  { key:"advisor", num:"04", th:"Advisor Excellence", thai:"ความเป็นที่ปรึกษา", color:"#a07d1f", accent:"#a07d1f",
    meaning:"ที่ปรึกษามืออาชีพ และคำแนะนำที่ไว้ใจได้", used:["Advisor pages","Career section","Training"] },
];

const DS_COLORS = [
  { name:"Navy", v:"#13294b", role:"Primary · ink, brand core" },
  { name:"Navy Soft", v:"#1d3a63", role:"Interactive primary" },
  { name:"Gold", v:"#a07d1f", role:"Truth accent · emphasis" },
  { name:"Gold Bright", v:"#c2a14a", role:"Accent on dark" },
  { name:"Green", v:"#1f7a52", role:"Protection · positive" },
  { name:"Blue", v:"#2f5d9e", role:"Analysis · well-protected" },
  { name:"Coral", v:"#c0552f", role:"Risk · underprotected" },
  { name:"Canvas", v:"#f6f8fb", role:"Soft surface" },
];

function DSwatch({ c }) {
  const light = c.v === "#f6f8fb";
  return (
    <div className="ds-swatch">
      <div className="ds-swatch-chip" style={{ background:c.v, border: light ? "1px solid var(--border)" : "none" }}/>
      <div className="ds-swatch-meta">
        <span className="ds-swatch-name">{c.name}</span>
        <span className="ds-swatch-hex mono">{c.v.toUpperCase()}</span>
        <span className="ds-swatch-role">{c.role}</span>
      </div>
    </div>
  );
}

function DSSection({ id, label, title, lede, children }) {
  return (
    <section className="ds-sec" id={id}>
      <div className="ds-sec-head">
        <span className="ds-label mono">{label}</span>
        <h2 className="ds-h2">{title}</h2>
        {lede && <p className="ds-lede">{lede}</p>}
      </div>
      {children}
    </section>
  );
}

function DesignSystem() {
  return (
    <div className="ds-root">
      {/* header */}
      <header className="ds-top">
        <a className="ds-back" href="Human Insurance.html"><TIcon name="back" size={15}/> Human Insurance</a>
        <span className="ds-top-tag mono">DESIGN SYSTEM v1.0</span>
      </header>

      {/* hero */}
      <section className="ds-hero">
        <div className="ds-hero-mark">
          <TruthMark state="truth" size={92} glow/>
        </div>
        <span className="ds-label mono">HUMAN INSURANCE DESIGN SYSTEM™</span>
        <h1 className="ds-hero-h">ภาษาภาพเดียว<br/>สำหรับทุกประสบการณ์</h1>
        <p className="ds-hero-sub">
          ระบบดีไซน์ที่ทำให้ทุกหน้า ทุกเครื่องมือ และทุกรายงานของ Human Insurance
          รู้สึกเชื่อมโยงกัน — สร้างจาก <strong>ความจริง ความชัดเจน และความเข้าใจ</strong>
        </p>
        <div className="ds-hero-nav">
          {[["Mark","#mark"],["Colors","#colors"],["States","#states"],["Type","#type"],["Components","#components"]].map(([l,h])=>(
            <a key={h} href={h}>{l}</a>
          ))}
        </div>
      </section>

      {/* the mark */}
      <DSSection id="mark" label="01 · BRAND ASSET"
        title="Truth Conversation™ Mark"
        lede="ไม่ใช่แค่โลโก้ แต่คือสัญลักษณ์ของปรัชญา — ฟองสนทนา (ภาษาคน) + เครื่องหมายถูก (ความจริงที่ตรวจสอบแล้ว)">
        <div className="ds-mark-showcase">
          <div className="ds-mark-hero">
            <TruthMark state="truth" size={140} glow/>
          </div>
          <div className="ds-mark-meaning">
            {[
              ["Understanding","before selling","ความเข้าใจ ก่อนการขาย"],
              ["Truth","before persuasion","ความจริง ก่อนการโน้มน้าว"],
              ["Conversation","before recommendation","บทสนทนา ก่อนคำแนะนำ"],
              ["Human language","before insurance language","ภาษาคน ก่อนภาษาประกัน"],
            ].map(([a,b,th],i)=>(
              <div key={i} className="ds-mark-line">
                <span className="ds-mark-strong">{a}</span>
                <span className="ds-mark-weak">{b}</span>
                <span className="ds-mark-th">{th}</span>
              </div>
            ))}
          </div>
        </div>
      </DSSection>

      {/* states */}
      <DSSection id="states" label="02 · MARK SYSTEM"
        title="สี่สถานะอย่างเป็นทางการ"
        lede="มาร์คเดียว สี่ความหมาย — ใช้สถานะให้ตรงกับบริบทของแต่ละประสบการณ์">
        <div className="ds-states">
          {DS_STATES.map(s=>(
            <div key={s.key} className="ds-state-card" style={{ "--sc": s.color, "--sa": s.accent }}>
              <div className="ds-state-top">
                <TruthMark state={s.key} size={56} glow/>
                <span className="ds-state-num mono">{s.num}</span>
              </div>
              <h3 className="ds-state-th">{s.th}</h3>
              <span className="ds-state-thai">{s.thai}</span>
              <p className="ds-state-meaning">{s.meaning}</p>
              <div className="ds-state-used">
                {s.used.map(u=> <span key={u} className="ds-state-tag">{u}</span>)}
              </div>
            </div>
          ))}
        </div>
      </DSSection>

      {/* colors */}
      <DSSection id="colors" label="03 · COLOR"
        title="พาเลตต์ของแบรนด์"
        lede="Navy เป็นแกน · Gold คือความจริง · Green คือความคุ้มครอง · Blue คือการวิเคราะห์">
        <div className="ds-colors">
          {DS_COLORS.map(c=> <DSwatch key={c.name} c={c}/>)}
        </div>
      </DSSection>

      {/* type */}
      <DSSection id="type" label="04 · TYPOGRAPHY"
        title="ลำดับชั้นตัวอักษร"
        lede="Anuphan สำหรับหัวเรื่อง · IBM Plex Sans Thai สำหรับเนื้อหา · IBM Plex Mono สำหรับ label และตัวเลข">
        <div className="ds-type">
          <div className="ds-type-row"><span className="ds-type-spec mono">DISPLAY · 56</span><span className="ds-type-sample" style={{ fontFamily:"var(--font-display)", fontWeight:600, fontSize:"clamp(34px,5vw,56px)" }}>ประกันภาษาคน</span></div>
          <div className="ds-type-row"><span className="ds-type-spec mono">HEADING · 30</span><span className="ds-type-sample" style={{ fontFamily:"var(--font-display)", fontWeight:600, fontSize:"30px" }}>เข้าใจก่อนตัดสินใจ</span></div>
          <div className="ds-type-row"><span className="ds-type-spec mono">BODY · 17</span><span className="ds-type-sample" style={{ fontSize:"17px", color:"var(--text-soft)" }}>เราแปลภาษากรมธรรม์ให้เป็นภาษาที่คุณเข้าใจ พร้อมบอกทั้งสิ่งที่คุ้มครองและสิ่งที่ไม่คุ้มครอง</span></div>
          <div className="ds-type-row"><span className="ds-type-spec mono">LABEL · 12</span><span className="ds-type-sample mono" style={{ fontSize:"12px", letterSpacing:".16em", textTransform:"uppercase", color:"var(--gold)" }}>WHAT WE BELIEVE</span></div>
        </div>
      </DSSection>

      {/* components */}
      <DSSection id="components" label="05 · COMPONENTS"
        title="ไลบรารีการ์ด"
        lede="ส่วนประกอบที่ใช้ซ้ำได้ทั่วทั้งระบบ — แต่ละแบบมีหน้าที่และสถานะมาร์คของตัวเอง">
        <div className="ds-components">
          {/* Insight Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">INSIGHT CARD</span>
            <div className="dc dc-insight">
              <TruthMark state="truth" size={28}/>
              <p className="dc-insight-text">ผู้ใช้ส่วนใหญ่เริ่มต้นที่คะแนน <strong>40–60</strong> — แทบทุกคนมีช่องว่างที่มองไม่เห็น</p>
            </div>
          </div>
          {/* Truth Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">TRUTH CARD</span>
            <div className="dc dc-truth">
              <span className="dc-truth-hear">“วงเงิน 100 ล้านบาท”</span>
              <span className="dc-truth-arrow"><TIcon name="arrow" size={16}/></span>
              <span className="dc-truth-know"><b>✓</b> ยังมีเงื่อนไขและข้อยกเว้นที่ควรเข้าใจ</span>
            </div>
          </div>
          {/* Risk Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">RISK CARD</span>
            <div className="dc dc-risk">
              <span className="dc-risk-ic"><TIcon name="warn" size={20}/></span>
              <div>
                <div className="dc-risk-head"><b>โรคร้ายแรง</b><span className="dc-risk-level">เสี่ยงสูง</span></div>
                <p>ยังไม่มีเงินก้อนทดแทนรายได้ระหว่างพักรักษาตัว</p>
              </div>
            </div>
          </div>
          {/* Protection Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">PROTECTION CARD</span>
            <div className="dc dc-protect">
              <div className="dc-protect-head"><TruthMark state="protection" size={24}/> คุ้มครองสุขภาพ</div>
              <div className="dc-protect-bar"><i style={{ width:"82%" }}/></div>
              <span className="dc-protect-tag">คุ้มครองดี</span>
            </div>
          </div>
          {/* Score Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">SCORE CARD</span>
            <div className="dc dc-score">
              <div className="dc-score-num" style={{ color:"var(--blue, #2f5d9e)" }}>73<small>/100</small></div>
              <div className="dc-score-meta"><TruthMark state="analysis" size={22}/><span>Life Protection Score™</span></div>
            </div>
          </div>
          {/* Advisor Card */}
          <div className="ds-comp">
            <span className="ds-comp-label mono">ADVISOR CARD</span>
            <div className="dc dc-advisor">
              <div className="dc-advisor-av ph"><span className="ph-label">PHOTO</span></div>
              <div className="dc-advisor-body">
                <TruthMark state="advisor" size={20}/>
                <b>คุณภานุพงศ์ ศรีโสภา</b>
                <span>Head of Critical Illness Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </DSSection>

      {/* principle footer */}
      <section className="ds-foot">
        <TruthMark state="truth" size={40}/>
        <p className="ds-foot-text">
          “The mark should appear like a <strong>signature</strong>, not a decoration.”
        </p>
        <span className="ds-foot-sub mono">HUMAN INSURANCE DESIGN SYSTEM™ · v1.0</span>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<DesignSystem />);
