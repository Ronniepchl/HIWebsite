// tr-data.jsx — Truth Report™ content + scoring engine (real Thai copy)

// ---------- QUESTIONNAIRE (10 questions) ----------
const TR_QUESTIONS = [
  {
    id: "age", icon: "user", scored: false,
    q: "คุณอายุเท่าไร", sub: "ช่วงวัยมีผลต่อความเสี่ยงที่ควรให้ความสำคัญ",
    options: [
      { label: "ต่ำกว่า 30 ปี", v: "u30" },
      { label: "30–39 ปี", v: "30s" },
      { label: "40–49 ปี", v: "40s" },
      { label: "50 ปีขึ้นไป", v: "50p" },
    ],
  },
  {
    id: "family", icon: "family", scored: false,
    q: "สถานะครอบครัวของคุณ", sub: "เพื่อเข้าใจว่ามีใครพึ่งพาคุณอยู่บ้าง",
    options: [
      { label: "โสด", v: "single" },
      { label: "แต่งงานแล้ว ยังไม่มีบุตร", v: "married" },
      { label: "มีบุตร", v: "kids" },
      { label: "ดูแลพ่อแม่ / คนในครอบครัว", v: "parents" },
    ],
  },
  {
    id: "income", icon: "income", scored: false,
    q: "รายได้ต่อเดือนโดยประมาณ", sub: "ใช้ประเมินว่าความคุ้มครองควรอยู่ระดับใด",
    options: [
      { label: "ต่ำกว่า 30,000 บาท", v: "lo" },
      { label: "30,000–70,000 บาท", v: "mid" },
      { label: "70,000–150,000 บาท", v: "hi" },
      { label: "มากกว่า 150,000 บาท", v: "vhi" },
    ],
  },
  {
    id: "dependents", icon: "family", scored: false,
    q: "มีคนที่ต้องดูแลทางการเงินกี่คน", sub: "คนที่จะได้รับผลกระทบหากรายได้ของคุณหายไป",
    options: [
      { label: "ไม่มี", v: "0" },
      { label: "1–2 คน", v: "1-2" },
      { label: "3–4 คน", v: "3-4" },
      { label: "5 คนขึ้นไป", v: "5p" },
    ],
  },
  {
    id: "life", icon: "life", scored: true, weight: 1.2,
    q: "ความคุ้มครองชีวิตที่คุณมีตอนนี้", sub: "ทุนประกันชีวิตรวมทุกกรมธรรม์",
    options: [
      { label: "ยังไม่มีเลย", v: "none", pts: 0 },
      { label: "ต่ำกว่า 1 ล้านบาท", v: "u1", pts: 0.35 },
      { label: "1–3 ล้านบาท", v: "1-3", pts: 0.7 },
      { label: "มากกว่า 3 ล้านบาท", v: "3p", pts: 1 },
    ],
  },
  {
    id: "health", icon: "health", scored: true, weight: 1.1,
    q: "ประกันสุขภาพของคุณ", sub: "นอกเหนือจากสิทธิ์ประกันสังคม",
    options: [
      { label: "ไม่มีประกันสุขภาพ", v: "none", pts: 0 },
      { label: "มีแค่ประกันกลุ่มของบริษัท", v: "group", pts: 0.4 },
      { label: "มีประกันสุขภาพส่วนตัว", v: "personal", pts: 0.8 },
      { label: "ส่วนตัว + เหมาจ่ายวงเงินสูง", v: "high", pts: 1 },
    ],
  },
  {
    id: "critical", icon: "critical", scored: true, weight: 1.0,
    q: "ความคุ้มครองโรคร้ายแรง", sub: "เงินก้อนเมื่อตรวจพบมะเร็ง โรคหัวใจ ฯลฯ",
    options: [
      { label: "ไม่มีความคุ้มครอง", v: "none", pts: 0 },
      { label: "ต่ำกว่า 1 ล้านบาท", v: "u1", pts: 0.4 },
      { label: "1–3 ล้านบาท", v: "1-3", pts: 0.8 },
      { label: "มากกว่า 3 ล้านบาท", v: "3p", pts: 1 },
    ],
  },
  {
    id: "employer", icon: "debt", scored: true, weight: 0.9, invert: true,
    q: "คุณพึ่งพาประกันกลุ่มของนายจ้างแค่ไหน", sub: "ความคุ้มครองที่จะหายไปเมื่อเปลี่ยนงาน",
    options: [
      { label: "พึ่งพาเกือบทั้งหมด", v: "fully", pts: 0.15 },
      { label: "พึ่งพาเป็นหลัก", v: "mostly", pts: 0.4 },
      { label: "พึ่งพาบางส่วน", v: "partly", pts: 0.75 },
      { label: "มีของตัวเองเพียงพอ ไม่ต้องพึ่ง", v: "none", pts: 1 },
    ],
  },
  {
    id: "emergency", icon: "emergency", scored: true, weight: 0.85,
    q: "เงินสำรองฉุกเฉินของคุณ", sub: "รองรับค่าใช้จ่ายจำเป็นได้กี่เดือน",
    options: [
      { label: "แทบไม่มี", v: "none", pts: 0 },
      { label: "น้อยกว่า 3 เดือน", v: "u3", pts: 0.4 },
      { label: "3–6 เดือน", v: "3-6", pts: 0.8 },
      { label: "มากกว่า 6 เดือน", v: "6p", pts: 1 },
    ],
  },
  {
    id: "concern", icon: "shield", scored: false,
    q: "เรื่องไหนที่คุณกังวลมากที่สุด", sub: "เพื่อจัดลำดับสิ่งที่ควรรู้ก่อน",
    options: [
      { label: "ค่ารักษาพยาบาลก้อนใหญ่", v: "medical" },
      { label: "รายได้หายถ้าทำงานไม่ได้", v: "income" },
      { label: "โรคร้ายแรง", v: "critical" },
      { label: "อนาคตของครอบครัว", v: "family" },
    ],
  },
];

// ---------- SEGMENTS ----------
const TR_SEGMENTS = [
  { min: 0,  max: 40,  key: "high",   th: "ความเสี่ยงสูง",       en: "High Risk",            color: "var(--amber)",  note: "มีช่องว่างสำคัญที่ควรปิดโดยเร็ว" },
  { min: 41, max: 70,  key: "review", th: "ควรทบทวน",            en: "Needs Review",         color: "var(--blue)",   note: "มีพื้นฐานแล้ว แต่ยังมีหลายจุดที่ควรดู" },
  { min: 71, max: 85,  key: "ok",     th: "คุ้มครองพอสมควร",     en: "Reasonably Protected", color: "var(--green)",  note: "ครอบคลุมความเสี่ยงหลักได้ดี" },
  { min: 86, max: 100, key: "well",   th: "คุ้มครองดีมาก",       en: "Well Protected",       color: "var(--green)",  note: "วางแผนได้รัดกุม เหลือเพียงทบทวนเป็นระยะ" },
];

// ---------- 5 MYTHS (Section B) ----------
const TR_MYTHS = [
  {
    n: "01",
    myth: "มีประกันสุขภาพแล้ว แปลว่าทุกอย่างเคลมได้",
    verdict: "ไม่จริง",
    explain: "กรมธรรม์สุขภาพทุกฉบับมีข้อยกเว้นและเงื่อนไข เช่น โรคที่เป็นมาก่อนทำประกัน ระยะเวลารอคอย และรายการที่ไม่คุ้มครอง การมีประกันไม่ได้แปลว่าจ่ายให้ทุกกรณีอัตโนมัติ",
    example: "ตัวอย่าง: ผู้เอาประกันที่มีอาการของโรคก่อนซื้อกรมธรรม์ อาจถูกปฏิเสธการเคลมในส่วนที่เกี่ยวข้อง แม้จะจ่ายเบี้ยมาตลอด",
  },
  {
    n: "02",
    myth: "ประกันกลุ่มของบริษัทเพียงพอแล้ว",
    verdict: "ไม่เสมอไป",
    explain: "ประกันกลุ่มเป็นสวัสดิการที่ดี แต่ผูกกับการเป็นพนักงาน เมื่อคุณลาออก เปลี่ยนงาน หรือเกษียณ ความคุ้มครองมักหายไปทันที และวงเงินมักจำกัดกว่าที่คิด",
    example: "ตัวอย่าง: คนที่พึ่งประกันกลุ่มอย่างเดียว เมื่อออกจากงานในวัย 45 ปีพร้อมโรคประจำตัว อาจซื้อประกันใหม่ได้ยากหรือเบี้ยสูงมาก",
  },
  {
    n: "03",
    myth: "วงเงิน 100 ล้าน หมายถึงจ่ายให้ทุกกรณี",
    verdict: "ยังมีเงื่อนไข",
    explain: "ตัวเลขวงเงินสูงคือ ‘เพดานสูงสุด’ ไม่ใช่จำนวนที่จ่ายทุกครั้ง การจ่ายจริงขึ้นอยู่กับประเภทการรักษา ความจำเป็นทางการแพทย์ และข้อยกเว้นในกรมธรรม์",
    example: "ตัวอย่าง: ค่าห้อง ค่ายาบางประเภท หรือหัตถการเพื่อความงาม อาจมีวงเงินย่อยหรือไม่คุ้มครอง แม้วงเงินรวมจะสูง",
  },
  {
    n: "04",
    myth: "ยังหนุ่มสาว สุขภาพดี ไม่ต้องรีบทำประกัน",
    verdict: "เสี่ยงกว่าที่คิด",
    explain: "ยิ่งอายุน้อยและสุขภาพดี เบี้ยยิ่งถูกและผ่านพิจารณาง่าย การรอจนมีอาการหรืออายุมาก อาจทำให้ซื้อไม่ได้ หรือถูกยกเว้นโรคที่เพิ่งตรวจพบ",
    example: "ตัวอย่าง: การตรวจพบความผิดปกติเพียงเล็กน้อย อาจทำให้บริษัทยกเว้นความคุ้มครองอวัยวะนั้นไปตลอด",
  },
  {
    n: "05",
    myth: "ซื้อประกันเยอะ ๆ ไว้ก่อน ยังไงก็ดี",
    verdict: "ไม่จำเป็นเสมอไป",
    explain: "ความคุ้มครองที่ดีคือความคุ้มครองที่ ‘ตรงกับความเสี่ยงจริง’ ไม่ใช่จำนวนกรมธรรม์ที่มากที่สุด การมีหลายเล่มที่ทับซ้อนกัน อาจทำให้จ่ายเบี้ยเกินจำเป็นโดยไม่ปิดช่องว่างที่แท้จริง",
    example: "ตัวอย่าง: บางคนมีประกันชีวิตซ้อนกัน 4 ฉบับ แต่ไม่มีความคุ้มครองโรคร้ายแรงเลย ซึ่งเป็นความเสี่ยงที่ใหญ่กว่า",
  },
];

// ---------- SPLIT-SCREEN: what ads don't tell you ----------
const TR_CONTRAST = [
  { hear: "“ค่ารักษาสูงสุด 100 ล้านบาท”", know: "ยังมีข้อยกเว้น วงเงินย่อย และเงื่อนไขความจำเป็นทางการแพทย์" },
  { hear: "“คุ้มครองทุกโรค”", know: "โรคที่เป็นก่อนทำประกัน และระยะเวลารอคอย มักไม่รวมอยู่ด้วย" },
  { hear: "“เบี้ยเริ่มต้นวันละไม่กี่บาท”", know: "เบี้ยมักปรับขึ้นตามอายุ และตัวเลขเริ่มต้นคือแผนพื้นฐานสุด" },
  { hear: "“สมัครง่าย ไม่ต้องตรวจสุขภาพ”", know: "อาจมีเงื่อนไขการพิจารณาเมื่อเคลม และความคุ้มครองที่จำกัดกว่า" },
  { hear: "“ได้เงินคืนทุกบาทเมื่อครบสัญญา”", know: "แผนคืนเบี้ยมักมีค่าความคุ้มครองต่อบาทที่ต่ำกว่าแบบคุ้มครองล้วน" },
];

// ---------- ENGINE ----------
function trComputeScore(ans) {
  let s = 0, w = 0;
  TR_QUESTIONS.forEach(q => {
    if (!q.scored) return;
    const a = ans[q.id];
    if (a == null) return;
    const opt = q.options.find(o => o.v === a);
    if (!opt) return;
    s += opt.pts * q.weight;
    w += q.weight;
  });
  return w ? Math.round((s / w) * 100) : 0;
}

function trSegmentFor(score) {
  return TR_SEGMENTS.find(s => score >= s.min && score <= s.max) || TR_SEGMENTS[0];
}

// Blind spots — personalized warnings
function trBlindSpots(ans) {
  const out = [];
  const dep = ans.dependents, life = ans.life;
  if (ans.critical === "none" || ans.critical === "u1")
    out.push({ title: "ความคุ้มครองโรคร้ายแรงยังไม่เพียงพอ", body: "โรคร้ายแรงสร้างทั้งค่ารักษาและการขาดรายได้ระหว่างพักฟื้น เงินก้อนช่วยให้คุณไม่ต้องดึงเงินเก็บหรือขายสินทรัพย์" });
  if (ans.employer === "fully" || ans.employer === "mostly")
    out.push({ title: "พึ่งพาประกันกลุ่มของนายจ้างมากเกินไป", body: "ความคุ้มครองนี้จะหายไปเมื่อคุณเปลี่ยนงานหรือเกษียณ ควรมีความคุ้มครองส่วนตัวเป็นฐานรองรับ" });
  if (ans.emergency === "none" || ans.emergency === "u3")
    out.push({ title: "เงินสำรองฉุกเฉินอยู่ในระดับต่ำ", body: "หากเกิดเหตุไม่คาดฝัน เงินสำรองที่น้อยกว่า 3 เดือนทำให้คุณเปราะบางต่อภาระที่เข้ามากะทันหัน" });
  if ((life === "none" || life === "u1") && (dep === "1-2" || dep === "3-4" || dep === "5p"))
    out.push({ title: "ความคุ้มครองชีวิตอาจไม่พอกับจำนวนผู้ที่ต้องดูแล", body: "เมื่อมีคนพึ่งพารายได้ของคุณ ทุนประกันชีวิตควรครอบคลุมภาระและค่าใช้จ่ายในอนาคตของพวกเขา" });
  if (ans.health === "none" || ans.health === "group")
    out.push({ title: "ยังไม่มีประกันสุขภาพส่วนตัว", body: "เมื่อออกจากงานหรืออายุมากขึ้น การมีเฉพาะประกันกลุ่มอาจทำให้เกิดช่องว่างค่ารักษาที่ต้องจ่ายเอง" });
  if ((ans.income === "hi" || ans.income === "vhi") && (life === "none" || life === "u1"))
    out.push({ title: "การคุ้มครองรายได้อาจไม่สมดุลกับฐานะ", body: "รายได้ที่สูงขึ้นหมายถึงภาระและไลฟ์สไตล์ที่ต้องรักษา ความคุ้มครองควรปรับตามให้ทัน" });
  return out.slice(0, 4);
}

// Things doing well / to review
function trSummary(ans) {
  const well = [], review = [];
  const map = {
    life:     { wellLabel: "มีความคุ้มครองชีวิตที่ดี", revLabel: "ทบทวนทุนประกันชีวิตให้พอกับภาระ" },
    health:   { wellLabel: "มีประกันสุขภาพส่วนตัวรองรับ", revLabel: "พิจารณาประกันสุขภาพส่วนตัวเพิ่ม" },
    critical: { wellLabel: "มีความคุ้มครองโรคร้ายแรง", revLabel: "เพิ่มความคุ้มครองโรคร้ายแรง" },
    emergency:{ wellLabel: "มีเงินสำรองฉุกเฉินเพียงพอ", revLabel: "สร้างเงินสำรองฉุกเฉินให้มากขึ้น" },
    employer: { wellLabel: "ไม่พึ่งพาประกันกลุ่มมากเกินไป", revLabel: "ลดการพึ่งพาประกันกลุ่มของนายจ้าง" },
  };
  TR_QUESTIONS.forEach(q => {
    if (!q.scored) return;
    const a = ans[q.id]; if (a == null) return;
    const opt = q.options.find(o => o.v === a); if (!opt) return;
    const m = map[q.id]; if (!m) return;
    if (opt.pts >= 0.7) well.push(m.wellLabel);
    else if (opt.pts <= 0.45) review.push(m.revLabel);
  });
  // ensure 3 each where possible
  return { well: well.slice(0, 3), review: review.slice(0, 3) };
}

// Questions to ask an agent — personalized
function trQuestionsToAsk(ans) {
  const base = [
    "กรมธรรม์นี้มีข้อยกเว้นอะไรบ้าง และครอบคลุมโรคที่เป็นมาก่อนหรือไม่",
    "ระยะเวลารอคอย (waiting period) ของแต่ละความคุ้มครองนานแค่ไหน",
    "ถ้าฉันต้องเคลมจริง ฉันต้องสำรองจ่ายเองส่วนไหนบ้าง",
  ];
  const extra = [];
  if (ans.employer === "fully" || ans.employer === "mostly")
    extra.push("ถ้าฉันเปลี่ยนงานหรือลาออก ความคุ้มครองนี้จะเป็นอย่างไร");
  if (ans.critical === "none" || ans.critical === "u1")
    extra.push("ความคุ้มครองโรคร้ายแรงจ่ายเมื่อไร และครอบคลุมโรคระยะใดบ้าง");
  if (ans.health === "high" || ans.health === "personal")
    extra.push("วงเงินเหมาจ่ายมีวงเงินย่อยของค่าห้องหรือค่ายาแยกหรือไม่");
  if (ans.life === "none" || ans.life === "u1")
    extra.push("ทุนประกันชีวิตเท่าไรจึงจะเหมาะกับภาระและจำนวนผู้ที่ฉันดูแล");
  return base.concat(extra).slice(0, 5);
}

Object.assign(window, {
  TR_QUESTIONS, TR_SEGMENTS, TR_MYTHS, TR_CONTRAST,
  trComputeScore, trSegmentFor, trBlindSpots, trSummary, trQuestionsToAsk,
});
