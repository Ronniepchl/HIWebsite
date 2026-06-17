// data.jsx — all content for Human Insurance (bilingual TH/EN)
// Exposed on window for other babel scripts.

// ---- Life Protection Score questions ----
// Each option carries `pts` (0..1 of that question's weight). Final = sum(weighted)/sum(weights)*100
const LPS_QUESTIONS = [
  {
    id: "income",
    weight: 1.1,
    icon: "income",
    en: "Income protection",
    th: "ถ้าคุณทำงานไม่ได้กะทันหัน รายได้ครอบครัวจะ...",
    qEn: "If you suddenly couldn't work, your family's income would…",
    sub: "หากคุณเสียความสามารถในการหารายได้พรุ่งนี้",
    subEn: "If you lost your ability to earn tomorrow",
    options: [
      { th: "หยุดทันที ไม่มีรายได้สำรอง", en: "Stops immediately", pts: 0 },
      { th: "พอประคองได้ 1–3 เดือน", en: "Lasts 1–3 months", pts: 0.35 },
      { th: "มีประกันรายได้/ทุนพอ 1 ปีขึ้นไป", en: "Covered 1+ year", pts: 0.75 },
      { th: "มีแผนทดแทนรายได้ระยะยาวชัดเจน", en: "Long-term plan in place", pts: 1 },
    ],
  },
  {
    id: "family",
    weight: 1.2,
    icon: "family",
    en: "Family dependents",
    th: "ถ้าคุณจากไปวันนี้ คนข้างหลังจะ...",
    qEn: "If you passed away today, those left behind would…",
    sub: "ทุนประกันชีวิตเทียบกับภาระที่ต้องดูแล",
    subEn: "Life coverage vs. the responsibilities you carry",
    options: [
      { th: "ไม่มีทุนรองรับเลย", en: "No coverage", pts: 0 },
      { th: "มีบ้าง แต่ไม่พอภาระจริง", en: "Some, not enough", pts: 0.3 },
      { th: "ครอบคลุม ~5 เท่าของรายได้ต่อปี", en: "~5× annual income", pts: 0.7 },
      { th: "ครอบคลุม 10 เท่าขึ้นไป + การศึกษาบุตร", en: "10×+ incl. education", pts: 1 },
    ],
  },
  {
    id: "debt",
    weight: 1.0,
    icon: "debt",
    en: "Debt & liabilities",
    th: "หนี้สินก้อนใหญ่ (บ้าน รถ ธุรกิจ) ของคุณ...",
    qEn: "Your major debts (home, car, business) would…",
    sub: "ใครจะรับภาระต่อถ้าคุณไม่อยู่",
    subEn: "Who carries them if you're gone",
    options: [
      { th: "ตกเป็นภาระคนข้างหลังทั้งหมด", en: "Falls to family", pts: 0 },
      { th: "มีประกันคุ้มครองบางส่วน", en: "Partly covered", pts: 0.45 },
      { th: "มีประกันคุ้มครองหนี้เต็มจำนวน", en: "Fully covered", pts: 1 },
      { th: "ไม่มีหนี้สิน", en: "No debt", pts: 1 },
    ],
  },
  {
    id: "health",
    weight: 1.15,
    icon: "health",
    en: "Health protection",
    th: "ค่ารักษาพยาบาลก้อนใหญ่ คุณจ่ายด้วย...",
    qEn: "A major medical bill — how would you pay it?",
    sub: "นอกเหนือจากประกันกลุ่มของบริษัท",
    subEn: "Beyond your company group plan",
    options: [
      { th: "เงินเก็บตัวเอง ไม่มีประกันสุขภาพ", en: "Out of pocket", pts: 0 },
      { th: "ประกันกลุ่มบริษัทอย่างเดียว", en: "Group plan only", pts: 0.4 },
      { th: "มีประกันสุขภาพส่วนตัวเสริม", en: "Personal plan added", pts: 0.8 },
      { th: "ประกันสุขภาพ + เหมาจ่ายวงเงินสูง", en: "High lump-sum cover", pts: 1 },
    ],
  },
  {
    id: "critical",
    weight: 0.95,
    icon: "critical",
    en: "Critical illness",
    th: "ถ้าตรวจพบโรคร้ายแรง (มะเร็ง หัวใจ)...",
    qEn: "If diagnosed with a critical illness (cancer, heart)…",
    sub: "เงินก้อนทดแทนรายได้ช่วงรักษาตัว",
    subEn: "A lump sum to replace income during treatment",
    options: [
      { th: "ไม่มีความคุ้มครองโรคร้ายแรง", en: "None", pts: 0 },
      { th: "มีทุน แต่ต่ำกว่า 1 ล้าน", en: "Under ฿1M", pts: 0.45 },
      { th: "ทุน 1–3 ล้านบาท", en: "฿1–3M", pts: 0.8 },
      { th: "ทุนเกิน 3 ล้าน ครอบคลุมหลายระยะ", en: "฿3M+ multi-stage", pts: 1 },
    ],
  },
  {
    id: "emergency",
    weight: 0.85,
    icon: "emergency",
    en: "Emergency fund",
    th: "เงินสำรองฉุกเฉินของคุณ รองรับได้...",
    qEn: "Your emergency fund could cover…",
    sub: "ค่าใช้จ่ายจำเป็นกี่เดือน",
    subEn: "How many months of essential expenses",
    options: [
      { th: "ไม่มีเงินสำรอง", en: "None", pts: 0 },
      { th: "น้อยกว่า 3 เดือน", en: "< 3 months", pts: 0.4 },
      { th: "3–6 เดือน", en: "3–6 months", pts: 0.8 },
      { th: "มากกว่า 6 เดือน", en: "6+ months", pts: 1 },
    ],
  },
  {
    id: "retirement",
    weight: 0.9,
    icon: "retirement",
    en: "Retirement readiness",
    th: "แผนเกษียณของคุณตอนนี้...",
    qEn: "Your retirement plan right now is…",
    sub: "ความมั่นใจว่าจะมีพอใช้หลังเลิกทำงาน",
    subEn: "Confidence you'll have enough after you stop working",
    options: [
      { th: "ยังไม่ได้เริ่มวางแผน", en: "Not started", pts: 0 },
      { th: "ออมบ้างแต่ไม่มีเป้าหมาย", en: "Saving, no target", pts: 0.4 },
      { th: "มีแผนชัดเจน ลงทุนสม่ำเสมอ", en: "Clear, on track", pts: 0.8 },
      { th: "มั่นใจว่าเพียงพอแน่นอน", en: "Fully secure", pts: 1 },
    ],
  },
];

const LPS_SEGMENTS = [
  { min: 0,  max: 40,  key: "under",   th: "ยังคุ้มครองไม่พอ",   en: "Underprotected",      color: "var(--c-under)",   note: "มีช่องว่างความเสี่ยงสำคัญที่ควรปิดก่อน", noteEn: "Significant risk gaps to close first" },
  { min: 41, max: 70,  key: "partial", th: "คุ้มครองบางส่วน",     en: "Partially Protected", color: "var(--c-partial)", note: "มีพื้นฐานแล้ว แต่ยังมีจุดเปราะบางอยู่", noteEn: "Good foundation, but vulnerable spots remain" },
  { min: 71, max: 85,  key: "well",    th: "คุ้มครองดี",          en: "Well Protected",      color: "var(--c-well)",    note: "ครอบคลุมความเสี่ยงหลักได้ดี", noteEn: "Core risks are well covered" },
  { min: 86, max: 100, key: "optimal", th: "คุ้มครองครบ",         en: "Optimized",           color: "var(--c-optimal)", note: "วางแผนได้รัดกุม เหลือเพียงทบทวนเป็นระยะ", noteEn: "Tightly planned — just review periodically" },
];

// ---- Section 3: The Truth (what you hear vs what to know) ----
const TRUTH_CONTRAST = [
  { hear: "“วงเงินค่ารักษา 100 ล้านบาท”", know: "ยังมีเงื่อนไขและข้อยกเว้นที่ควรเข้าใจ" },
  { hear: "“มีประกันกลุ่มแล้ว”", know: "ความคุ้มครองอาจหายไปเมื่อเปลี่ยนงาน" },
  { hear: "“ซื้อแล้ว เคลมได้ทุกอย่าง”", know: "ทุกกรมธรรม์มีข้อยกเว้นและระยะเวลารอคอย" },
  { hear: "“เบี้ยเริ่มต้นวันละไม่กี่บาท”", know: "เบี้ยปรับขึ้นตามอายุ และตัวเลขคือแผนพื้นฐานสุด" },
  { hear: "“ยังหนุ่มสาว ยังไม่ต้องรีบ”", know: "ยิ่งทำตอนสุขภาพดี ยิ่งคุ้มเบี้ยและผ่านพิจารณาง่าย" },
];

// ---- Section 3: The Truth (legacy 4-card, kept for reference) ----
const TRUTH_CARDS = [
  { tag: "COVERED",     th: "สิ่งที่คุ้มครอง",          en: "What's covered",
    body: "เราอ่านกรมธรรม์ของคุณจริง แล้วบอกชัดว่ากรณีไหนเคลมได้ วงเงินเท่าไร เงื่อนไขอะไร",
    bodyEn: "We actually read your policy and tell you exactly what's claimable, the limits, and the conditions.", sign: "+" },
  { tag: "NOT_COVERED", th: "สิ่งที่ไม่คุ้มครอง",        en: "What's NOT covered",
    body: "ข้อยกเว้นที่คนขายมักไม่พูด — โรคที่ต้องรอคอย เงื่อนไขที่ทำให้เคลมไม่ได้ เราบอกก่อนคุณซื้อ",
    bodyEn: "The exclusions sellers skip — waiting periods, conditions that void a claim. We tell you before you buy.", sign: "−" },
  { tag: "MISUNDERSTOOD", th: "สิ่งที่คนมักเข้าใจผิด",    en: "Common misconceptions",
    body: "“ประกันกลุ่มก็พอแล้ว” “ซื้อแล้วเคลมได้ทุกอย่าง” — เราแยกความจริงออกจากความเข้าใจผิด",
    bodyEn: "“Group cover is enough,” “I can claim anything” — we separate truth from myth.", sign: "?" },
  { tag: "BEFORE_BUYING", th: "สิ่งที่ควรรู้ก่อนซื้อ",     en: "Know before you buy",
    body: "คำถามที่คุณควรถามตัวเองและบริษัทประกัน ก่อนเซ็นสัญญาผูกพันระยะยาว",
    bodyEn: "The questions to ask yourself and the insurer before signing a long-term contract.", sign: "→" },
];

// ---- Section 4: comparison ----
const COMPARE = {
  agent: {
    title: "ตัวแทนแบบเดิม",
    en: "Traditional agent",
    points: [
      "เริ่มจากผลิตภัณฑ์ที่อยากขาย",
      "พูดถึงสิ่งที่คุ้มครองเป็นหลัก",
      "วัดความสำเร็จที่ยอดขาย",
      "ข้อยกเว้นมักถูกพูดทีหลัง",
      "ความสัมพันธ์จบเมื่อปิดการขาย",
    ],
  },
  human: {
    title: "Human Insurance",
    en: "Advisory platform",
    points: [
      "เริ่มจากความเสี่ยงและความจริงของคุณ",
      "บอกทั้งที่คุ้มครองและไม่คุ้มครอง",
      "วัดความสำเร็จที่การตัดสินใจที่ดีของคุณ",
      "อธิบายข้อยกเว้นก่อนตัดสินใจ",
      "ทบทวนแผนกับคุณต่อเนื่องทุกปี",
    ],
  },
};

// ---- Section 5: How we work ----
const STEPS = [
  { no: "01", th: "เข้าใจชีวิต", en: "Understand", glyph: "target",
    body: "ฟังเป้าหมาย ภาระ ความรับผิดชอบ และความกังวลจริง ก่อนพูดถึงผลิตภัณฑ์ใด ๆ",
    points: ["เข้าใจเป้าหมายชีวิต", "ครอบครัวและคนที่ต้องดูแล", "ความกังวลที่แท้จริง"], out: "เข้าใจ", stmt: "เข้าใจชีวิตของคุณ" },
  { no: "02", th: "ค้นหาช่องว่าง", en: "Identify", glyph: "scan",
    body: "วิเคราะห์สิ่งที่คุณมีอยู่แล้ว ค้นหาช่องว่างความคุ้มครองและความเสี่ยงที่อาจมองไม่เห็น ด้วย Life Protection Score™",
    points: ["ตรวจความคุ้มครองที่มีอยู่", "ค้นหาความเสี่ยงที่ซ่อนอยู่", "ระบุช่องว่างความคุ้มครอง"], out: "เห็นช่องว่าง", stmt: "เห็นช่องว่างความเสี่ยง" },
  { no: "03", th: "ตัดสินใจอย่างมั่นใจ", en: "Decide", glyph: "idea",
    body: "อธิบายทางเลือกอย่างตรงไปตรงมา แสดงทั้งข้อดี ข้อจำกัด และทางเลือกอื่น โดยไม่กดดันการตัดสินใจ",
    points: ["อธิบายทางเลือกอย่างตรงไปตรงมา", "บอกทั้งข้อดีและข้อจำกัด", "ไม่ผลักดันการขาย"], out: "ตัดสินใจอย่างมั่นใจ", stmt: "ตัดสินใจอย่างมั่นใจ" },
  { no: "04", th: "ปรับตามชีวิต", en: "Adapt", glyph: "cycle",
    body: "ชีวิตเปลี่ยน ความเสี่ยงเปลี่ยน ความคุ้มครองควรเปลี่ยนตาม และได้รับการทบทวนอย่างต่อเนื่อง",
    points: ["ชีวิตเปลี่ยน ความเสี่ยงเปลี่ยน", "ปรับแผนให้ทันสถานการณ์", "ทบทวนต่อเนื่องทุกปี"], out: "ปรับตามชีวิต", stmt: "ปรับตามชีวิตที่เปลี่ยนไป" },
];

// ---- Section 6: Protection areas ----
const AREAS = [
  { th: "คุ้มครองชีวิต", en: "Life Protection", icon: "life", body: "ดูแลคนข้างหลังให้เดินต่อได้", tone: "blue" },
  { th: "คุ้มครองสุขภาพ", en: "Health Protection", icon: "health", body: "ค่ารักษาไม่ทำลายเงินเก็บ", tone: "teal" },
  { th: "โรคร้ายแรง", en: "Critical Illness", icon: "critical", body: "เงินก้อนทดแทนช่วงรักษาตัว", tone: "coral" },
  { th: "วางแผนเกษียณ", en: "Retirement", icon: "retirement", body: "มั่นใจว่ามีพอหลังเลิกทำงาน", tone: "green" },
  { th: "วางแผนภาษี", en: "Tax Planning", icon: "tax", body: "ใช้สิทธิลดหย่อนอย่างคุ้มค่า", tone: "gold" },
  { th: "ส่งต่อมรดก", en: "Legacy Planning", icon: "legacy", body: "ส่งต่อความมั่งคั่งอย่างตั้งใจ", tone: "violet" },
  { th: "วางแผนนิติบุคคล", en: "Business Planning", icon: "corporate", body: "ปกป้องธุรกิจ หุ้นส่วน และความต่อเนื่องขององค์กร", tone: "navy" },
];

// ---- Section 7: What We Learned (risk-chain timelines) ----
const STORIES = [
  { tag: "เปลี่ยนงาน",
    chain: ["เปลี่ยนงาน", "ประกันกลุ่มหาย", "ไม่มีประกันส่วนตัว", "เข้าโรงพยาบาล"],
    learned: "ควรมีความคุ้มครองส่วนตัวเป็นฐาน ไม่ฝากชีวิตไว้กับสวัสดิการที่อาจหายไปในวันเดียว" },
  { tag: "โรคร้ายแรง",
    chain: ["ตรวจพบมะเร็ง", "ค่ารักษาเบิกได้บางส่วน", "ต้องหยุดงานพักรักษา", "รายได้หายไปหลายเดือน"],
    learned: "ประกันโรคร้ายแรงไม่ได้ทดแทนแค่ค่ารักษา แต่ทดแทนรายได้ที่หายไประหว่างรักษาตัว" },
  { tag: "เบี้ยซ้ำซ้อน",
    chain: ["มีประกันหลายฉบับ", "จ่ายเบี้ยสูงทุกปี", "ความคุ้มครองทับซ้อน", "ช่องว่างสุขภาพยังเปิดอยู่"],
    learned: "จำนวนกรมธรรม์ไม่สำคัญเท่าความครอบคลุมของความเสี่ยงจริง" },
];

// ---- Testimonials (เสียงจากลูกค้า) — sample voices, replace with real ones ----
// To add a short clip to any card, add ONE of these fields:
//   video: "assets/testimonial-1.mp4"   // local/hosted .mp4 (optional: poster: "assets/poster-1.jpg")
//   youtube: "dQw4w9WgXcQ"              // YouTube video ID only
const TESTIMONIALS = [
  { quote: "ครั้งแรกที่มีคนอธิบายกรมธรรม์ให้ฟังจนเข้าใจจริง ๆ ว่าอะไรคุ้มครอง อะไรไม่คุ้มครอง โดยไม่กดดันให้ซื้อเลย",
    name: "คุณศิริพร ว.", role: "พนักงานบริษัท · กรุงเทพฯ", initial: "ศ",
    youtube: "aqz-KE-bpKQ" }, // placeholder clip — replace with the real testimonial video ID
  { quote: "หลังทำ Life Protection Score เพิ่งรู้ว่าประกันกลุ่มของบริษัทมีช่องว่างตรงไหน ทำให้วางแผนเสริมได้ตรงจุดขึ้นมาก",
    name: "คุณธนกร พ.", role: "เจ้าของธุรกิจ · เชียงใหม่", initial: "ธ" },
  { quote: "ชอบที่เขาบอกตรง ๆ ทั้งสิ่งที่คุ้มครองและข้อจำกัด ไม่ใช่แค่เชียร์ให้ซื้อ ทำให้ตัดสินใจได้อย่างมั่นใจ",
    name: "คุณพิมพ์ชนก ร.", role: "คุณแม่ลูกสอง · นนทบุรี", initial: "พ" },
];

// ---- Team (advisors) ----
const TEAM = [
  { name: "คุณมงคล ตั้งมั่นในกิต", en: "Mongkol T.", role: "หัวหน้าทีมวิเคราะห์ความคุ้มครอง", roleEn: "Head of Protection Analysis",
    bio: "ช่วยให้ผู้คนเข้าใจว่าความคุ้มครองที่มีอยู่ เพียงพอกับชีวิตที่ต้องการหรือไม่ — กว่า 25 ปีในวงการประกันชีวิตและการวางแผนความเสี่ยง", lic: "25+ ปี · Protection & Risk Planning", focus: "Trust" },
  { name: "คุณเกศริน ตั้งมั่นในกิต", en: "Kesarin T.", role: "หัวหน้าวางแผนเกษียณ & ลูกค้าสินทรัพย์สูง", roleEn: "Head of Retirement & HNW Planning",
    bio: "ช่วยให้ลูกค้าวางแผนเกษียณและส่งต่อความมั่งคั่งอย่างมีระบบ — กว่า 20 ปีในการดูแลลูกค้าทุกช่วงของชีวิต", lic: "20+ ปี · Retirement & Legacy", focus: "Confidence" },
  { name: "คุณภานุพงศ์ ศรีโสภา", en: "Panupong S.", role: "ผู้ก่อตั้งเพจ ประกันภาษาคน™\nหัวหน้าวิเคราะห์โรคร้ายแรง ประกันกลุ่ม และการวางแผนความคุ้มครอง", roleEn: "Founder, Human Insurance™\nHead of Critical Illness, Group Insurance & Protection Planning",
    photo: "assets/team-panupong-v2.png",
    bio: "ช่วยวิเคราะห์ความเสี่ยงด้านสุขภาพและช่องว่างความคุ้มครองที่หลายคนมองข้าม — กว่า 8 ปีในสายงานประกันสุขภาพและสวัสดิการกลุ่ม", lic: "8+ ปี · Health & Group Benefits", focus: "Clarity" },
  { name: "คุณธัญญาณัฐ อลิอัสซ์", en: "Thanyanat A.", role: "หัวหน้าสนับสนุนการเคลม & กรมธรรม์", roleEn: "Head of Claims & Policy Support",
    bio: "ช่วยแปลภาษากรมธรรม์และทำให้กระบวนการเคลมเป็นเรื่องที่เข้าใจง่าย — ผู้เชี่ยวชาญด้านสิทธิประโยชน์ เงื่อนไขกรมธรรม์ และการสนับสนุนการเคลม", lic: "Claims · Policy & Benefits", focus: "Transparency" },
];

// ---- Section 9: FAQ (hard questions) ----
const FAQS = [
  { q: "เคลมไม่ได้จริงไหม?", a: "เคลมได้ — ถ้าเข้าเงื่อนไข ปัญหาส่วนใหญ่เกิดจากการไม่เข้าใจข้อยกเว้นตั้งแต่แรก เราอ่านเงื่อนไขจริงให้คุณก่อนซื้อ และอธิบายว่ากรณีไหนเคลมได้ กรณีไหนไม่ได้ เพื่อไม่ให้เกิดความคาดหวังที่ผิด" },
  { q: "มีข้อยกเว้นอะไรบ้าง?", a: "ทุกกรมธรรม์มีข้อยกเว้น เช่น โรคที่เป็นมาก่อน ระยะเวลารอคอย หรือกิจกรรมเสี่ยงบางอย่าง เราจะสรุปข้อยกเว้นสำคัญของแผนที่คุณสนใจเป็นภาษาคน ก่อนการตัดสินใจเสมอ" },
  { q: "ต้องเปิดเผยโรคเก่าหรือไม่?", a: "ต้องเปิดเผยตามจริง การปกปิดประวัติสุขภาพคือสาเหตุอันดับต้น ๆ ที่ทำให้เคลมไม่ได้ภายหลัง เราช่วยคุณกรอกใบคำขออย่างถูกต้อง เพื่อปกป้องสิทธิ์ของคุณเอง" },
  { q: "ประกันสุขภาพจำเป็นไหม?", a: "ขึ้นอยู่กับความเสี่ยงและความคุ้มครองที่คุณมีอยู่ ถ้าคุณมีประกันกลุ่มที่วงเงินสูงและเงินสำรองมาก อาจยังไม่ต้องรีบ แต่ถ้าพึ่งประกันกลุ่มอย่างเดียว มักมีช่องว่าง — Life Protection Score จะบอกคุณได้" },
  { q: "ประกันกลุ่มเพียงพอหรือยัง?", a: "ส่วนใหญ่ยังไม่พอ เพราะประกันกลุ่มจะหายไปเมื่อคุณออกจากงาน และมักมีวงเงินจำกัด เราช่วยประเมินว่าคุณควรเสริมส่วนตัวตรงไหน โดยไม่จ่ายเกินจำเป็น" },
];

Object.assign(window, {
  LPS_QUESTIONS, LPS_SEGMENTS, TRUTH_CARDS, TRUTH_CONTRAST, COMPARE,
  STEPS, AREAS, STORIES, TESTIMONIALS, TEAM, FAQS,
});
