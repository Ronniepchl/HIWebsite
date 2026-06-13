// te-dashboard.jsx — internal Advisor Dashboard (the user's own lead + sample leads)

const TE_SAMPLE_LEADS = [
  { name:"คุณ A. (คุณ)", you:true, score:null, income:"—", family:"—", worry:"—" },
  { name:"คุณ ธีรภัทร", score:34, income:"70–150K", family:"มีบุตร", worry:"ค่ารักษาพยาบาล" },
  { name:"คุณ มนัสนันท์", score:58, income:"30–70K", family:"แต่งงาน", worry:"โรคร้ายแรง" },
  { name:"คุณ ปริญญา", score:77, income:">150K", family:"มีบุตร", worry:"การเกษียณ" },
  { name:"คุณ ศุภวิชญ์", score:46, income:"70–150K", family:"ดูแลพ่อแม่", worry:"ความมั่นคงครอบครัว" },
  { name:"คุณ กัญญาวีร์", score:89, income:">150K", family:"แต่งงาน", worry:"การส่งต่อมรดก" },
];

function priorityOf(score) {
  if (score == null) return { key:"high", th:"สูง" };
  if (score <= 45) return { key:"high", th:"สูง" };
  if (score <= 72) return { key:"medium", th:"กลาง" };
  return { key:"low", th:"ต่ำ" };
}

function TEDashboard({ result, onBack }) {
  const youCats = result ? result.cats : null;
  const youScore = result ? result.score : null;
  const youWorry = result ? (window.TE_STEPS[5].questions[0].options.find(o=>o.v===result.answers.worry)||{}).th : "—";
  const youIncome = result ? ({i1:"<30K",i2:"30–70K",i3:"70–150K",i4:">150K"}[result.answers.income] || "—") : "—";
  const youFamily = result ? ({single:"โสด",married:"แต่งงาน",kids:"มีบุตร",parents:"ดูแลพ่อแม่"}[result.answers.family] || "—") : "—";

  const leads = TE_SAMPLE_LEADS.map(l => l.you
    ? { ...l, score: youScore, income: youIncome, family: youFamily, worry: youWorry, cats: youCats }
    : l
  ).sort((a,b)=> (a.score??0) - (b.score??0));

  const [sel, setSel] = React.useState(null);
  const selLead = sel != null ? leads[sel] : leads.find(l=>l.you) || leads[0];

  const gaps = (cats) => {
    if (!cats) return [];
    return window.TE_CATS.filter(c => (cats[c.key]||0) < 0.6).map(c => c.th);
  };

  const stat = [
    { label:"ลีดทั้งหมด", value: leads.length },
    { label:"ความเสี่ยงสูง", value: leads.filter(l=>priorityOf(l.score).key==="high").length },
    { label:"คะแนนเฉลี่ย", value: Math.round(leads.filter(l=>l.score!=null).reduce((s,l)=>s+l.score,0)/leads.filter(l=>l.score!=null).length) },
  ];

  return (
    <div className="te-dash">
      <div className="te-dash-bar">
        <div className="te-dash-bar-l">
          <TEMark size={26}/>
          <div className="te-dash-title">
            <b>Advisor Dashboard</b>
            <span className="mono">Protection Analysis · internal view</span>
          </div>
        </div>
        <button className="btn btn-ghost te-dash-back" onClick={onBack}><TIcon name="back" size={16}/> กลับไปรายงาน</button>
      </div>

      <div className="te-dash-stats">
        {stat.map((s,i)=>(
          <div key={i} className="te-stat">
            <span className="te-stat-v">{s.value}</span>
            <span className="te-stat-l">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="te-dash-main">
        <div className="te-dash-table">
          <div className="te-trow te-thead">
            <span>ลีด</span><span>Score</span><span>กลุ่มเสี่ยง</span><span className="te-hide-sm">รายได้</span><span className="te-hide-sm">ครอบครัว</span><span>ความกังวล</span><span>ลำดับ</span>
          </div>
          {leads.map((l, i) => {
            const seg = l.score!=null ? window.teSegmentFor(l.score) : null;
            const pr = priorityOf(l.score);
            const active = selLead === l;
            return (
              <button key={i} className={"te-trow te-lead" + (l.you?" te-you":"") + (active?" active":"")} onClick={()=>setSel(i)}>
                <span className="te-lead-name">{l.name}{l.you && <em className="te-you-tag">YOU</em>}</span>
                <span className="te-lead-score" style={{ color: seg?seg.color:"var(--text-faint)" }}>{l.score ?? "—"}</span>
                <span className="te-lead-seg">{seg ? seg.th : "—"}</span>
                <span className="te-hide-sm">{l.income}</span>
                <span className="te-hide-sm">{l.family}</span>
                <span className="te-lead-worry">{l.worry}</span>
                <span className={"te-prio te-prio-"+pr.key}>{pr.th}</span>
              </button>
            );
          })}
        </div>

        <aside className="te-dash-detail">
          <div className="te-detail-head">
            <span className="te-detail-name">{selLead.name}</span>
            {selLead.score!=null && <span className="te-detail-score" style={{ color: window.teSegmentFor(selLead.score).color }}>{selLead.score}<small>/100</small></span>}
          </div>
          <div className="te-detail-meta">
            <div><span className="mono">INCOME</span>{selLead.income}</div>
            <div><span className="mono">FAMILY</span>{selLead.family}</div>
            <div><span className="mono">WORRY</span>{selLead.worry}</div>
            <div><span className="mono">PRIORITY</span><b className={"te-prio-text te-prio-"+priorityOf(selLead.score).key}>{priorityOf(selLead.score).th}</b></div>
          </div>
          <div className="te-detail-gaps">
            <span className="te-detail-sub mono">PROTECTION GAPS</span>
            {selLead.cats ? (
              gaps(selLead.cats).length ? gaps(selLead.cats).map((g,i)=>(
                <div key={i} className="te-detail-gap"><TIcon name="warn" size={14}/> {g}</div>
              )) : <div className="te-detail-gap te-gap-none"><TIcon name="check" size={14}/> ไม่พบช่องว่างสำคัญ</div>
            ) : <div className="te-detail-gap te-gap-muted">ยังไม่มีข้อมูลวิเคราะห์</div>}
          </div>
          <div className="te-detail-note mono">แนวทาง: เริ่มจากการอธิบาย ไม่ใช่การเสนอขาย</div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { TEDashboard });
