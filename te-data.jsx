// te-data.jsx — Trust Engine: questionnaire, weighted scoring, segments, report generators

// ===== Questionnaire: 6 steps, 11 questions =====
// Each scored question: weight within its category; options carry pts 0..1.
// category keys: income, health, family, emergency, future
const TE_STEPS = [
  {
    id: "about",
    label: "About You",
    th: "เกี่ยวกับคุณ",
    intro: "เริ่มจากทำความรู้จักคุณก่อน — ไม่มีคำตอบถูกหรือผิด",
    questions: [
      { id: "age", kind: "choice", category: null, th: "ช่วงอายุของคุณ", en: "Age",
        options: [ {th:"ต่ำกว่า 30", en:"<30", v:"u30"}, {th:"30–39", en:"30s", v:"30s"}, {th:"40–49", en:"40s", v:"40s"}, {th:"50 ขึ้นไป", en:"50+", v:"50p"} ] },
      { id: "family", kind: "choice", category: null, th: "สถานะครอบครัว", en: "Family status",
        options: [ {th:"โสด", en:"Single", v:"single"}, {th:"แต่งงาน ยังไม่มีบุตร", en:"Married, no kids", v:"married"}, {th:"มีบุตร", en:"Have children", v:"kids"}, {th:"ดูแลพ่อแม่/ผู้สูงอายุ", en:"Caring for parents", v:"parents"} ] },
      { id: "income", kind: "choice", category: null, th: "รายได้ต่อเดือน (โดยประมาณ)", en: "Monthly income",
        options: [ {th:"ต่ำกว่า 30,000", en:"<30K", v:"i1"}, {th:"30,000–70,000", en:"30–70K", v:"i2"}, {th:"70,000–150,000", en:"70–150K", v:"i3"}, {th:"มากกว่า 150,000", en:">150K", v:"i4"} ] },
      { id: "dependents", kind: "choice", category: null, th: "จำนวนคนที่พึ่งพารายได้ของคุณ", en: "Dependents",
        options: [ {th:"ไม่มี", en:"None", v:"0"}, {th:"1–2 คน", en:"1–2", v:"12"}, {th:"3–4 คน", en:"3–4", v:"34"}, {th:"มากกว่า 4 คน", en:"4+", v:"4p"} ] },
    ],
  },
  {
    id: "income",
    label: "Income Protection",
    th: "คุ้มครองรายได้",
    intro: "ถ้ารายได้หยุดกะทันหัน ครอบครัวจะเป็นอย่างไร",
    questions: [
      { id: "runway", kind: "scored", category: "income", weight: 1,
        th: "ถ้าคุณหยุดทำงานพรุ่งนี้ ครอบครัวจะรักษาคุณภาพชีวิตเดิมได้นานแค่ไหน", en: "Income runway",
        options: [ {th:"น้อยกว่า 1 เดือน", en:"<1 month", pts:0}, {th:"1–3 เดือน", en:"1–3 months", pts:0.3}, {th:"3–6 เดือน", en:"3–6 months", pts:0.55}, {th:"6–12 เดือน", en:"6–12 months", pts:0.8}, {th:"มากกว่า 12 เดือน", en:"12+ months", pts:1} ] },
      { id: "life", kind: "scored", category: "income", weight: 1,
        th: "คุณมีประกันชีวิตคิดเป็นกี่เท่าของรายได้ต่อปี", en: "Life cover multiple",
        options: [ {th:"ไม่มี", en:"None", pts:0}, {th:"น้อยกว่า 1 เท่า", en:"<1×", pts:0.25}, {th:"1–3 เท่า", en:"1–3×", pts:0.55}, {th:"3–5 เท่า", en:"3–5×", pts:0.8}, {th:"มากกว่า 5 เท่า", en:"5×+", pts:1} ] },
    ],
  },
  {
    id: "health",
    label: "Health Protection",
    th: "คุ้มครองสุขภาพ",
    intro: "ค่ารักษาก้อนใหญ่ คุณรับมือด้วยอะไร",
    questions: [
      { id: "health", kind: "scored", category: "health", weight: 1,
        th: "คุณมีประกันสุขภาพแบบไหน", en: "Health insurance",
        options: [ {th:"ไม่มี", en:"None", pts:0}, {th:"ประกันกลุ่มบริษัทเท่านั้น", en:"Group only", pts:0.4}, {th:"ประกันส่วนตัว", en:"Personal", pts:0.8}, {th:"มีทั้งสองแบบ", en:"Both", pts:1} ] },
      { id: "ci", kind: "scored", category: "health", weight: 1,
        th: "คุณมีความคุ้มครองโรคร้ายแรงหรือไม่", en: "Critical illness",
        options: [ {th:"ไม่มี", en:"No", pts:0}, {th:"ไม่แน่ใจ", en:"Not sure", pts:0.3}, {th:"มี", en:"Yes", pts:1} ] },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Readiness",
    th: "ความพร้อมฉุกเฉิน",
    intro: "เงินสำรองคือกันชนด่านแรกของทุกความเสี่ยง",
    questions: [
      { id: "fund", kind: "scored", category: "emergency", weight: 1,
        th: "คุณมีเงินสำรองฉุกเฉินกี่เดือนของค่าใช้จ่าย", en: "Emergency months",
        options: [ {th:"น้อยกว่า 1 เดือน", en:"<1", pts:0}, {th:"1–3 เดือน", en:"1–3", pts:0.4}, {th:"3–6 เดือน", en:"3–6", pts:0.7}, {th:"6–12 เดือน", en:"6–12", pts:0.9}, {th:"มากกว่า 12 เดือน", en:"12+", pts:1} ] },
    ],
  },
  {
    id: "future",
    label: "Future Planning",
    th: "วางแผนอนาคต",
    intro: "ความคุ้มครองที่ดีต้องเดินไปพร้อมเป้าหมายระยะยาว",
    questions: [
      { id: "retire", kind: "scored", category: "future", weight: 1,
        th: "คุณมีแผนเกษียณหรือยัง", en: "Retirement plan",
        options: [ {th:"ยังไม่มี", en:"No", pts:0}, {th:"กำลังคิดอยู่", en:"Thinking", pts:0.35}, {th:"เริ่มแล้ว", en:"Started", pts:0.7}, {th:"ชัดเจนแล้ว", en:"Well-defined", pts:1} ] },
      { id: "estate", kind: "scored", category: "future", weight: 1,
        th: "คุณมีการวางแผนมรดก/ส่งต่อทรัพย์สินหรือไม่", en: "Estate planning",
        options: [ {th:"ยังไม่มี", en:"No", pts:0}, {th:"มีบ้าง", en:"Somewhat", pts:0.5}, {th:"มีแล้ว", en:"Yes", pts:1} ] },
    ],
  },
  {
    id: "insight",
    label: "What Worries You",
    th: "สิ่งที่กังวล",
    intro: "คำถามสุดท้าย — เพื่อให้รายงานตรงกับใจคุณที่สุด",
    questions: [
      { id: "worry", kind: "choice", category: null, th: "อะไรที่คุณกังวลมากที่สุด", en: "Biggest worry",
        options: [ {th:"ค่ารักษาพยาบาล", en:"Hospital bills", v:"hospital"}, {th:"โรคร้ายแรง", en:"Critical illness", v:"ci"}, {th:"ความมั่นคงของครอบครัว", en:"Family security", v:"family"}, {th:"การเกษียณ", en:"Retirement", v:"retire"}, {th:"ภาษี", en:"Taxes", v:"tax"}, {th:"การส่งต่อมรดก", en:"Estate", v:"estate"} ] },
    ],
  },
];

// ===== Category weights (must sum to 1) =====
// Family Protection is derived from income cover × dependents (no standalone scored Qs),
// so we compute it in the engine. Weights per spec:
const TE_WEIGHTS = { income: 0.25, health: 0.25, family: 0.20, emergency: 0.15, future: 0.15 };

const TE_CATS = [
  { key: "income", th: "คุ้มครองรายได้", en: "Income Protection" },
  { key: "health", th: "คุ้มครองสุขภาพ", en: "Health Protection" },
  { key: "family", th: "คุ้มครองครอบครัว", en: "Family Protection" },
  { key: "emergency", th: "ความพร้อมฉุกเฉิน", en: "Emergency Readiness" },
  { key: "future", th: "วางแผนอนาคต", en: "Future Planning" },
];

const TE_SEGMENTS = [
  { min: 0,  max: 40,  key:"under",   th:"ยังคุ้มครองไม่พอ",   en:"Underprotected",      color:"var(--c-under)",
    note:"มีช่องว่างความเสี่ยงสำคัญหลายจุดที่ควรปิดก่อน เริ่มจากจุดที่กระทบครอบครัวมากที่สุด" },
  { min: 41, max: 70,  key:"partial", th:"คุ้มครองบางส่วน",     en:"Partially Protected", color:"var(--c-partial)",
    note:"คุณมีพื้นฐานแล้ว แต่ยังมีจุดเปราะบางที่อาจกลายเป็นปัญหาเมื่อชีวิตเปลี่ยน" },
  { min: 71, max: 85,  key:"well",    th:"คุ้มครองดี",          en:"Well Protected",      color:"var(--c-well)",
    note:"ความคุ้มครองหลักของคุณอยู่ในระดับดี เหลือเพียงปรับให้รัดกุมขึ้นในบางจุด" },
  { min: 86, max: 100, key:"optimal", th:"คุ้มครองครบ",         en:"Optimized",           color:"var(--c-optimal)",
    note:"วางแผนได้รัดกุมมาก สิ่งที่เหลือคือทบทวนเป็นระยะเมื่อเป้าหมายชีวิตเปลี่ยน" },
];

function teSegmentFor(score) {
  return TE_SEGMENTS.find(s => score >= s.min && score <= s.max) || TE_SEGMENTS[0];
}

// ===== Scoring engine =====
// answers: { questionId: optionIndex }  for scored; { questionId: value } for choice
function teComputeCategories(answers) {
  // gather scored pts per category
  const acc = {};
  TE_CATS.forEach(c => acc[c.key] = { sum: 0, w: 0 });
  TE_STEPS.forEach(step => step.questions.forEach(q => {
    if (q.kind !== "scored") return;
    const idx = answers[q.id];
    const pts = (idx != null && q.options[idx]) ? q.options[idx].pts : 0;
    acc[q.category].sum += pts * q.weight;
    acc[q.category].w += q.weight;
  }));

  // derive family protection: life-cover multiple scaled by dependents pressure
  const lifeIdx = answers["life"];
  const lifePts = (lifeIdx != null) ? TE_STEPS[1].questions[1].options[lifeIdx].pts : 0;
  const dep = answers["dependents"]; // 0,12,34,4p
  const depWeight = dep === "0" ? 0.25 : dep === "12" ? 0.6 : dep === "34" ? 0.9 : dep === "4p" ? 1 : 0.6;
  // if no dependents, family risk is low → family score high regardless of life cover
  const familyScore = dep === "0" ? Math.max(0.7, lifePts) : (lifePts * 0.7 + (1 - depWeight) * 0.3 + lifePts * depWeight * 0);
  const familyNorm = dep === "0" ? Math.max(0.7, lifePts) : (lifePts * (0.5 + 0.5*depWeight) + (lifePts>0?0.1:0));

  const cats = {};
  TE_CATS.forEach(c => {
    if (c.key === "family") { cats.family = Math.max(0, Math.min(1, familyNorm)); return; }
    cats[c.key] = acc[c.key].w ? acc[c.key].sum / acc[c.key].w : 0;
  });
  return cats;
}

function teComputeScore(answers) {
  const cats = teComputeCategories(answers);
  let total = 0;
  Object.keys(TE_WEIGHTS).forEach(k => { total += (cats[k] || 0) * TE_WEIGHTS[k]; });
  return { score: Math.round(total * 100), cats };
}

Object.assign(window, {
  TE_STEPS, TE_WEIGHTS, TE_CATS, TE_SEGMENTS,
  teSegmentFor, teComputeCategories, teComputeScore,
});
