// sheet-sync.jsx — sends questionnaire results to the InsureFlow Google Sheet.
//
// HOW IT WORKS
//   The site is fully static (no backend), so we POST to a Google Apps Script
//   Web App that appends a row to the Sheet. Deploy the script in
//   apps-script/Code.gs, then paste the resulting /exec URL below.
//
// Until SHEET_ENDPOINT is filled in, submitToSheet() is a silent no-op so the
// site keeps working normally.

const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycby9UQxfFVeJGAIUDnd3A6ARzayrRlWovx1IorHmJKiwX0ggR6ozveIj52pUlnFpuFSh/exec";

// Fire-and-forget POST. Apps Script Web Apps don't send CORS headers, so we use
// mode:"no-cors" with a text/plain body (avoids a CORS preflight). We can't read
// the response, but the row is written. Never throws — a logging failure must
// never break the questionnaire UX.
async function submitToSheet(payload) {
  try {
    if (!SHEET_ENDPOINT || SHEET_ENDPOINT.indexOf("PASTE_YOUR") === 0) {
      console.info("[sheet-sync] endpoint not configured — skipping", payload);
      return;
    }
    const body = JSON.stringify({
      ...payload,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      submittedAt: new Date().toISOString(),
    });
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      keepalive: true, // let it complete even if the page unloads
    });
  } catch (err) {
    console.warn("[sheet-sync] submit failed (ignored):", err);
  }
}

// ---- Per-question field builders -------------------------------------------
// Each turns a raw answer map into { questionId: readableAnswer } so the Sheet
// can store one column per question. They read the question definitions off
// window at call time (the data files load after this one).

// Truth Report — answers[id] = option value code; labels are Thai.
function trFields(ans) {
  const out = {};
  (window.TR_QUESTIONS || []).forEach((q) => {
    const v = ans ? ans[q.id] : null;
    const opt = v != null ? q.options.find((o) => o.v === v) : null;
    out[q.id] = opt ? opt.label : "";
  });
  return out;
}

// Life Protection Score — answers[id] = option index; use the English label.
function lpsFields(ans) {
  const out = {};
  (window.LPS_QUESTIONS || []).forEach((q) => {
    const i = ans ? ans[q.id] : null;
    out[q.id] = (i != null && q.options[i]) ? q.options[i].en : "";
  });
  return out;
}

// Trust Engine — scored answers = index, choice answers = value code.
function teFields(ans) {
  const out = {};
  (window.TE_STEPS || []).forEach((step) => {
    step.questions.forEach((q) => {
      const a = ans ? ans[q.id] : null;
      let label = "";
      if (a != null) {
        if (q.kind === "scored") label = q.options[a] ? q.options[a].en : "";
        else { const opt = q.options.find((o) => o.v === a); label = opt ? opt.en : ""; }
      }
      out[q.id] = label;
    });
  });
  return out;
}

window.SHEET_ENDPOINT = SHEET_ENDPOINT;
window.submitToSheet = submitToSheet;
window.trFields = trFields;
window.lpsFields = lpsFields;
window.teFields = teFields;
