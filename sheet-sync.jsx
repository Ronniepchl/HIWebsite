// sheet-sync.jsx — sends questionnaire results to the InsureFlow / HIWebapp
// Google Sheet via its Apps Script Web App.
//
// HOW IT WORKS
//   The site is fully static (no backend), so we POST to the Apps Script Web
//   App. The HIWebapp script is an action-based API:
//     - action=logQuestionnaire  -> analytics row in the questionnaire's own
//       tab, one column per question (added by apps-script/logQuestionnaire.gs)
//     - action=addLead           -> a CRM Lead (the script's built-in action)
//   Contact-form submits fire BOTH; anonymous completions fire only the first.
//
// All requests are fire-and-forget no-cors POSTs (the script sends no CORS
// headers). We can't read the response, but the rows are written. Never throws.

const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbw9aRQ-0t89Xk6r1xITS-t0g_ZhBiLtx6ww_RKszN2BNf8xMPbD6qiFKR_B5Y4XYPpBew/exec";

function sheetPost(url, contentType, body) {
  // no-cors avoids a CORS preflight; the action's response is opaque to us.
  return fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": contentType },
    body,
    keepalive: true, // let it complete even if the page unloads
  }).catch((err) => console.warn("[sheet-sync] post failed (ignored):", err));
}

// Split a single "contact" string (email or phone) into structured parts.
function splitContact(payload) {
  const contact = String(payload.contact || "");
  const isEmail = contact.indexOf("@") > -1;
  return {
    email: payload.email || (isEmail ? contact : ""),
    phone: payload.phone || (isEmail ? "" : contact),
  };
}

async function submitToSheet(payload) {
  try {
    if (!SHEET_ENDPOINT || SHEET_ENDPOINT.indexOf("PASTE_YOUR") === 0) {
      console.info("[sheet-sync] endpoint not configured — skipping", payload);
      return;
    }

    // 1) Full analytics row (per-source tab, one column per question).
    //    action goes in the query string (not sensitive); data in the JSON body.
    const body = JSON.stringify({
      ...payload,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      submittedAt: new Date().toISOString(),
    });
    sheetPost(SHEET_ENDPOINT + "?action=logQuestionnaire", "text/plain;charset=utf-8", body);

    // 2) Contact-form submits also create a CRM lead via the built-in action.
    //    Sent form-encoded in the BODY so no personal data lands in the URL.
    if (payload.event === "lead") {
      const c = splitContact(payload);
      const form = new URLSearchParams({
        action: "addLead",
        name: payload.name || "",
        src: "Website",
        note: payload.summary || "",
        email: c.email,
        phone: c.phone,
      }).toString();
      sheetPost(SHEET_ENDPOINT, "application/x-www-form-urlencoded;charset=UTF-8", form);
    }
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
