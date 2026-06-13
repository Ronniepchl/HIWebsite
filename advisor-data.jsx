// advisor-data.jsx — Advisor Fit Score™: questions, scoring, tiers, result generator

const AF_QUESTIONS = [
  { id:"q1", th:"คุณชอบอะไรที่สุด?", en:"What do you enjoy most?",
    options:[
      {th:"อธิบายเรื่องยากให้คนเข้าใจ", pts:1, trait:"explain"},
      {th:"ปิดการขายให้ได้", pts:0.2, trait:"sales"},
      {th:"บริหารทีมและกระบวนการ", pts:0.55, trait:"manage"},
    ]},
  { id:"q2", th:"เมื่อมีคนมาขอคำแนะนำ คุณมักจะ...", en:"When asked for advice",
    options:[
      {th:"ถามเพื่อเข้าใจสถานการณ์ก่อน", pts:1, trait:"listen"},
      {th:"เสนอทางเลือกทันที", pts:0.4, trait:"pitch"},
    ]},
  { id:"q3", th:"หน้าที่สำคัญที่สุดของที่ปรึกษาคืออะไร?", en:"Core duty of an advisor",
    options:[
      {th:"ช่วยให้คนตัดสินใจได้ดีขึ้น", pts:1, trait:"help"},
      {th:"ช่วยสร้างยอดขาย", pts:0.2, trait:"sales"},
    ]},
  { id:"q4", th:"คุณรู้สึกอย่างไรกับการเรียนรู้ต่อเนื่อง?", en:"Continuous learning",
    options:[
      {th:"ชอบมาก เรียนรู้อยู่เสมอ", pts:1, trait:"learn"},
      {th:"เรียนเมื่อจำเป็น", pts:0.55, trait:"learn"},
      {th:"ไม่ค่อยชอบ", pts:0.15, trait:"learn"},
    ]},
  { id:"q5", th:"คุณชอบพูดคุยและรับฟังผู้คนหรือไม่?", en:"Connecting with people",
    options:[
      {th:"ชอบมาก ฟังคนอื่นได้นาน", pts:1, trait:"people"},
      {th:"ได้บ้างตามโอกาส", pts:0.6, trait:"people"},
      {th:"ไม่ค่อยถนัด", pts:0.2, trait:"people"},
    ]},
  { id:"q6", th:"คุณต้องการรายได้แบบใด?", en:"Income style",
    options:[
      {th:"มั่นคงจากความไว้วางใจระยะยาว", pts:1, trait:"longterm"},
      {th:"ผสมระหว่างมั่นคงและผลงาน", pts:0.7, trait:"mix"},
      {th:"คอมมิชชั่นสูงเร็วในระยะสั้น", pts:0.3, trait:"fast"},
    ]},
  { id:"q7", th:"อะไรดึงดูดคุณสู่อาชีพนี้มากที่สุด?", en:"What draws you in",
    options:[
      {th:"อยากช่วยให้ผู้คนตัดสินใจได้ดีขึ้น", pts:1, trait:"purpose"},
      {th:"อิสระและการเติบโตในอาชีพ", pts:0.7, trait:"growth"},
      {th:"โอกาสสร้างรายได้สูง", pts:0.35, trait:"money"},
    ]},
];

const AF_TIERS = [
  { min:90, max:100, th:"Natural Advisor", thai:"ที่ปรึกษาโดยธรรมชาติ", color:"var(--c-optimal)",
    note:"คุณมีลักษณะของ Protection Advisor อย่างชัดเจน — เริ่มจากความเข้าใจและความไว้วางใจ" },
  { min:70, max:89, th:"Strong Potential", thai:"มีศักยภาพสูง", color:"var(--c-well)",
    note:"คุณมีพื้นฐานความเป็นที่ปรึกษาที่ดีมาก เหลือเพียงพัฒนาทักษะบางด้านให้ครบ" },
  { min:50, max:69, th:"Developing Advisor", thai:"กำลังพัฒนา", color:"var(--c-partial)",
    note:"คุณมีแนวโน้มที่ดี และสามารถเติบโตเป็นที่ปรึกษาได้ผ่านการเรียนรู้และฝึกฝน" },
  { min:0, max:49, th:"Not Yet Ready", thai:"ยังไม่พร้อมในตอนนี้", color:"var(--c-under)",
    note:"เส้นทางนี้อาจยังไม่ตรงกับคุณในตอนนี้ — แต่ทุกอย่างพัฒนาได้เมื่อพร้อม" },
];

function afTierFor(score){ return AF_TIERS.find(t=>score>=t.min&&score<=t.max) || AF_TIERS[AF_TIERS.length-1]; }

function afScore(answers){
  let sum=0, n=0;
  AF_QUESTIONS.forEach(q=>{ const i=answers[q.id]; if(i!=null){ sum+=q.options[i].pts; n++; } });
  return n ? Math.round((sum/n)*100) : 0;
}

// salesperson vs advisor lean (0..1, 1 = full advisor)
function afOutlook(answers){
  return afScore(answers)/100;
}

function afGenerate(answers){
  const traits = AF_QUESTIONS.map(q=>{ const i=answers[q.id]; return i!=null ? {...q.options[i], qid:q.id} : null; }).filter(Boolean);
  const has = (t)=> traits.some(x=>x.trait===t && x.pts>=0.7);

  const strengthPool = [
    { cond: has("listen")||has("people"), th:"ฟังเก่ง รับฟังก่อนตัดสิน" },
    { cond: has("help")||has("purpose"), th:"เข้าใจคนและตั้งใจช่วยจริง" },
    { cond: has("longterm")||has("listen"), th:"สร้างความไว้วางใจระยะยาวได้" },
    { cond: has("explain"), th:"อธิบายเรื่องซับซ้อนให้เข้าใจง่าย" },
    { cond: has("learn"), th:"กระตือรือร้นเรียนรู้ต่อเนื่อง" },
  ];
  let strengths = strengthPool.filter(s=>s.cond).map(s=>s.th);
  if(strengths.length<3) strengths = ["ฟังเก่ง รับฟังก่อนตัดสิน","เข้าใจคนและตั้งใจช่วยจริง","สร้างความไว้วางใจได้","อธิบายเรื่องซับซ้อนได้"].slice(0,4);
  strengths = strengths.slice(0,4);

  const areas = [];
  if(!has("learn")) areas.push("วินัยในการเรียนรู้ต่อเนื่อง");
  if(afScore(answers)<90) areas.push("ความรู้ด้านการเงินและความคุ้มครอง");
  areas.push("การวางแผนระยะยาวให้ลูกค้า");
  if(!has("longterm")) areas.push("การดูแลลูกค้าอย่างต่อเนื่อง");
  // ensure a meaningful set even for high scorers
  ["ความรู้ด้านผลิตภัณฑ์และกรมธรรม์","การบริหารลูกค้าระยะยาว","การสื่อสารเรื่องความเสี่ยง"].forEach(a=>areas.push(a));
  const areasFinal = [...new Set(areas)].slice(0,3);

  return { strengths, areas: areasFinal };
}

Object.assign(window, { AF_QUESTIONS, AF_TIERS, afTierFor, afScore, afOutlook, afGenerate });
