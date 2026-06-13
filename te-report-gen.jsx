// te-report-gen.jsx — derive personalized report content from answers + category scores

// Returns { strengths:[], areas:[], hiddenRisks:[], questions:[], learning:[] }
function teGenerateReport(answers, cats) {
  const A = answers;
  const strengths = [], areas = [];

  const push = (arr, cond, item) => { if (cond) arr.push(item); };

  // ---- Strengths (cat >= 0.7) ----
  push(strengths, cats.health >= 0.7, { th:"ความคุ้มครองสุขภาพ", note:"คุณมีประกันสุขภาพที่ครอบคลุมระดับดี" });
  push(strengths, cats.emergency >= 0.7, { th:"เงินสำรองฉุกเฉิน", note:"คุณมีกันชนทางการเงินที่แข็งแรง" });
  push(strengths, cats.future >= 0.7, { th:"การวางแผนอนาคต", note:"คุณวางแผนเกษียณและระยะยาวไว้ชัดเจน" });
  push(strengths, cats.income >= 0.7, { th:"คุ้มครองรายได้", note:"รายได้ของครอบครัวมีหลักประกันรองรับ" });
  push(strengths, cats.family >= 0.7, { th:"คุ้มครองครอบครัว", note:"คนที่คุณดูแลมีหลักประกันเพียงพอ" });

  // ---- Areas to review (cat < 0.6) ----
  push(areas, cats.income < 0.6, { th:"ช่องว่างประกันชีวิต", note:"ทุนประกันชีวิตอาจไม่พอกับภาระที่ครอบครัวต้องแบกรับ" });
  push(areas, cats.health < 0.6, { th:"ความคุ้มครองสุขภาพ", note:"ค่ารักษาก้อนใหญ่อาจกระทบเงินเก็บโดยตรง" });
  push(areas, (A.ci === 0 || A.ci === 1), { th:"ความคุ้มครองโรคร้ายแรง", note:"ยังไม่มีเงินก้อนทดแทนรายได้หากต้องหยุดรักษาตัวนาน" });
  push(areas, cats.emergency < 0.6, { th:"เงินสำรองฉุกเฉิน", note:"กันชนทางการเงินยังบางเกินไปสำหรับเหตุไม่คาดฝัน" });
  push(areas, cats.future < 0.6, { th:"การวางแผนเกษียณ", note:"ยังไม่มีแผนระยะยาวที่ชัดเจนพอ" });
  push(areas, A.health === 1, { th:"พึ่งพาประกันกลุ่มของบริษัท", note:"ความคุ้มครองอาจหายไปทันทีเมื่อเปลี่ยนงาน" });

  // ---- Hidden Risk Analysis (narrative, personalized) ----
  const hiddenRisks = [];
  if (A.health === 1) hiddenRisks.push({
    icon:"health", level:"high",
    th:"คุณพึ่งพาประกันกลุ่มของบริษัทเป็นหลัก",
    note:"การเปลี่ยนงานหรือออกจากงานอาจทำให้เกิดช่องว่างความคุ้มครองโดยไม่ทันตั้งตัว และโรคที่เพิ่งตรวจพบอาจถูกยกเว้นในกรมธรรม์ใหม่",
  });
  if ((A.dependents === "12" || A.dependents === "34" || A.dependents === "4p") && cats.income < 0.6) hiddenRisks.push({
    icon:"family", level:"high",
    th:"คุณมีคนที่ต้องดูแล แต่คุ้มครองรายได้ยังจำกัด",
    note:"หากรายได้หลักหยุดลง ภาระค่าใช้จ่ายและหนี้สินอาจตกอยู่กับคนข้างหลังทันที",
  });
  if (A.ci === 0 || A.ci === 1) hiddenRisks.push({
    icon:"critical", level:"medium",
    th:"ยังไม่มีเงินก้อนรับมือโรคร้ายแรง",
    note:"ประกันสุขภาพจ่ายค่ารักษา แต่ไม่ทดแทนรายได้ที่หายไประหว่างหยุดงานพักฟื้นหลายเดือน",
  });
  if (cats.emergency < 0.5) hiddenRisks.push({
    icon:"emergency", level:"medium",
    th:"เงินสำรองบางเกินกว่าจะรองรับเหตุยืดเยื้อ",
    note:"เมื่อเกิดหลายเรื่องพร้อมกัน เงินสำรองที่น้อยอาจบีบให้ต้องตัดสินใจเรื่องการรักษาด้วยข้อจำกัดทางการเงิน",
  });
  if (cats.future < 0.5) hiddenRisks.push({
    icon:"retirement", level:"low",
    th:"ความเสี่ยงระยะยาวยังไม่ถูกวางแผน",
    note:"ยิ่งเริ่มช้า ต้นทุนของการสร้างความมั่นคงหลังเกษียณยิ่งสูงขึ้นทุกปี",
  });
  if (hiddenRisks.length === 0) hiddenRisks.push({
    icon:"shield", level:"low",
    th:"ความเสี่ยงหลักของคุณถูกจัดการได้ดี",
    note:"สิ่งที่เหลือคือการทบทวนเป็นระยะ เพื่อให้ความคุ้มครองเดินไปพร้อมชีวิตที่เปลี่ยน",
  });

  // ---- Questions you should ask ----
  const questions = [
    "ข้อยกเว้นสำคัญของกรมธรรม์ที่ฉันมี มีอะไรบ้าง",
    "ถ้าฉันจากไป ครอบครัวจะได้รับเงินเท่าไร และเพียงพอกับภาระจริงหรือไม่",
  ];
  if (A.health === 1) questions.push("ถ้าฉันเปลี่ยนงาน ความคุ้มครองสุขภาพจะเป็นอย่างไร");
  if (A.ci === 0 || A.ci === 1) questions.push("ความคุ้มครองโรคร้ายแรงที่เหมาะกับฉันควรมีทุนเท่าไร");
  questions.push("จริง ๆ แล้วฉันต้องการความคุ้มครองมากแค่ไหน ไม่ใช่มากที่สุด");

  // ---- Recommended learning path (knowledge, not products) ----
  const learning = [];
  const addL = (cond, item) => { if (cond && learning.length < 4) learning.push(item); };
  addL(A.ci === 0 || A.ci === 1, { th:"ทำความเข้าใจประกันโรคร้ายแรง", min:"6 นาที" });
  addL(A.health === 1, { th:"ข้อจำกัดของประกันกลุ่มบริษัท", min:"5 นาที" });
  addL(cats.health < 0.7, { th:"ระยะเวลารอคอย และข้อยกเว้นที่ควรรู้", min:"7 นาที" });
  addL(cats.future < 0.7, { th:"พื้นฐานการวางแผนเกษียณ", min:"8 นาที" });
  addL(cats.income < 0.7, { th:"ทุนประกันชีวิตที่ \"พอดี\" คำนวณอย่างไร", min:"6 นาที" });
  while (learning.length < 3) {
    const pool = [
      { th:"ทำความเข้าใจระยะเวลารอคอย", min:"5 นาที" },
      { th:"อ่านกรมธรรม์ให้เข้าใจใน 10 นาที", min:"10 นาที" },
      { th:"วางแผนภาษีกับความคุ้มครอง", min:"6 นาที" },
    ];
    learning.push(pool[learning.length % pool.length]);
  }

  return { strengths: strengths.slice(0,4), areas: areas.slice(0,4), hiddenRisks: hiddenRisks.slice(0,4), questions: questions.slice(0,5), learning };
}

Object.assign(window, { teGenerateReport });
