/**
 * InsureFlow — questionnaire intake endpoint
 * -------------------------------------------------------------------------
 * Receives questionnaire submissions from the Human Insurance website.
 *
 *   - Each questionnaire writes to ITS OWN tab:
 *       life-protection-score -> "Life Protection Score"
 *       truth-report          -> "Truth Report"
 *       trust-engine          -> "Trust Engine"
 *       advisor-fit           -> "Advisor Fit"
 *   - Every answer becomes its OWN COLUMN (columns are created automatically
 *     the first time a new question appears — the schema is self-maintaining).
 *   - Contact-form submits ALSO create a row in the central "Leads" tab.
 *
 * SETUP / REDEPLOY
 *   1. Sheet > Extensions > Apps Script. Paste this file. Save.
 *   2. Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy.
 *      (The /exec URL stays the same — no website change needed.)
 */

// Fixed columns every tab starts with; question columns are appended after these.
var BASE_HEADERS = [
  'Timestamp', 'Event', 'Score', 'Segment',
  'Name', 'Email', 'Phone', 'Summary', 'Page',
];

function tabNameFor_(source) {
  switch (source) {
    case 'life-protection-score': return 'Life Protection Score';
    case 'truth-report':          return 'Truth Report';
    case 'trust-engine':          return 'Trust Engine';
    case 'advisor-fit':           return 'Advisor Fit';
    default:                      return 'Other Responses';
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize writes so columns/IDs don't collide

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var now = new Date();
    var c = contactParts_(data);

    logToSourceTab_(ss, data, now, c);

    var leadId = null;
    if (data.event === 'lead' && (data.name || c.email || c.phone)) {
      leadId = createLead_(ss, data, now, c);
    }

    return json_({ ok: true, leadId: leadId });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Simple GET so you can sanity-check the deployment URL in a browser.
function doGet() {
  return json_({ ok: true, service: 'InsureFlow questionnaire intake' });
}

/* ----------------------------------------------------------------------- */

// Writes one row to the questionnaire's own tab, one column per question.
function logToSourceTab_(ss, data, now, c) {
  var tabName = tabNameFor_(data.source);
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(BASE_HEADERS);
    sheet.setFrozenRows(1);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0].map(String);

  // Ensure a column exists for every question in this submission.
  var fields = data.fields || {};
  var missing = Object.keys(fields).filter(function (k) {
    return headers.indexOf(k) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }

  var rowMap = {
    Timestamp: data.submittedAt || now.toISOString(),
    Event: data.event || 'completion',
    Score: (data.score === 0 || data.score) ? data.score : '',
    Segment: data.segment || '',
    Name: data.name || '',
    Email: c.email,
    Phone: c.phone,
    Summary: data.summary || '',
    Page: data.pageUrl || '',
  };
  Object.keys(fields).forEach(function (k) { rowMap[k] = fields[k]; });

  var row = headers.map(function (h) {
    return rowMap.hasOwnProperty(h) ? rowMap[h] : '';
  });
  sheet.appendRow(row);
}

/**
 * Appends a row to the central Leads tab (located by its "LeadID" header so the
 * exact tab name doesn't matter) and returns the generated LeadID.
 */
function createLead_(ss, data, now, c) {
  var leads = findSheetByHeader_(ss, ['LeadID', 'FullName']);
  if (!leads) return null; // no Leads tab — source-tab row is still written above

  var headers = leads.getRange(1, 1, 1, leads.getLastColumn())
    .getValues()[0].map(String);

  var leadId = nextLeadId_(ss);
  var today = isoDate_(now);

  var values = {
    LeadID: leadId,
    FullName: data.name || '',
    Phone: c.phone,
    PhoneSearch: c.digits,
    Email: c.email,
    Source: 'Website',
    Interest: sourceLabel_(data.source) +
      (data.score || data.score === 0 ? ' · score ' + data.score : ''),
    Stage: 'New Lead',
    EstimatedPremium: '',
    FirstContactDate: today,
    LastContactDate: today,
    Owner: '',
    SearchBlob: [data.name, c.email, c.phone, c.digits].filter(String).join(' '),
    Notes: data.summary || '',
    CreatedAt: now.toISOString(),
    UpdatedAt: now.toISOString(),
  };

  var row = headers.map(function (h) {
    return values.hasOwnProperty(h) ? values[h] : '';
  });
  leads.appendRow(row);
  return leadId;
}

/* ----------------------------- helpers --------------------------------- */

// Normalizes contact info: prefers explicit email/phone, else parses "contact".
function contactParts_(data) {
  var contact = String(data.contact || '');
  var email = String(data.email || (contact.indexOf('@') > -1 ? contact : ''));
  var phoneRaw = String(data.phone || (contact.indexOf('@') > -1 ? '' : contact));
  var digits = phoneRaw.replace(/[^\d]/g, '');
  var hasPhone = digits.length >= 7;
  return {
    email: email,
    phone: hasPhone ? phoneRaw : '',
    digits: hasPhone ? digits : '',
  };
}

// Increments Config seq_lead (Category=CONFIG, Value=seq_lead) and formats LED-#####.
// Falls back to counting existing lead rows if the Config row isn't found.
function nextLeadId_(ss) {
  var cfg = findSheetByHeader_(ss, ['Category', 'Value', 'Label']);
  if (cfg) {
    var rows = cfg.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === 'CONFIG' && String(rows[i][1]) === 'seq_lead') {
        var n = parseInt(rows[i][2], 10) || 0;
        n += 1;
        cfg.getRange(i + 1, 3).setValue(n); // Label column = 3rd
        return 'LED-' + padNum_(n, 5);
      }
    }
  }
  var leads = findSheetByHeader_(ss, ['LeadID', 'FullName']);
  var count = leads ? Math.max(0, leads.getLastRow() - 1) + 1 : 1;
  return 'LED-' + padNum_(count, 5);
}

// Returns the first sheet whose header row contains all of the given column names.
function findSheetByHeader_(ss, required) {
  var sheets = ss.getSheets();
  for (var s = 0; s < sheets.length; s++) {
    var sh = sheets[s];
    if (sh.getLastColumn() === 0 || sh.getLastRow() === 0) continue;
    var header = sh.getRange(1, 1, 1, sh.getLastColumn())
      .getValues()[0].map(String);
    var ok = required.every(function (r) { return header.indexOf(r) > -1; });
    if (ok) return sh;
  }
  return null;
}

function sourceLabel_(src) {
  switch (src) {
    case 'life-protection-score': return 'Life Protection Score';
    case 'truth-report': return 'Truth Report';
    case 'trust-engine': return 'Trust Engine';
    case 'advisor-fit':  return 'Advisor Fit';
    default: return src || 'Questionnaire';
  }
}

function padNum_(n, width) {
  var s = String(n);
  while (s.length < width) s = '0' + s;
  return s;
}

function isoDate_(d) {
  return Utilities.formatDate(d, 'Asia/Bangkok', 'yyyy-MM-dd');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* --------------------------------------------------------------------------
 * ONE-TIME CLEANUP — run manually from the Apps Script editor.
 * Select "cleanupTestRows" in the function dropdown and click Run.
 * (Running here uses the saved code directly — no deployment needed.)
 *
 * Removes the test data created during setup:
 *   - the entire legacy "QuizResponses" tab
 *   - the test Leads rows listed below
 *   - resets the seq_lead counter
 * Edit TEST_LEAD_IDS / SEQ_LEAD_RESET below before running if you want to
 * keep any of these.
 * ------------------------------------------------------------------------ */
function cleanupTestRows() {
  var TEST_LEAD_IDS = ['LED-00002', 'LED-00003', 'LED-00004'];
  var SEQ_LEAD_RESET = 1; // real seed lead is LED-00001
  var removed = { quizTab: false, leads: [] };

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Drop the legacy QuizResponses tab (data now lives in per-source tabs).
  var quiz = ss.getSheetByName('QuizResponses');
  if (quiz) { ss.deleteSheet(quiz); removed.quizTab = true; }

  // 2. Delete the test Leads rows (bottom-up so indices stay valid).
  var leads = findSheetByHeader_(ss, ['LeadID', 'FullName']);
  if (leads) {
    var values = leads.getDataRange().getValues(); // includes header at row 0
    for (var r = values.length - 1; r >= 1; r--) {
      if (TEST_LEAD_IDS.indexOf(String(values[r][0])) > -1) {
        leads.deleteRow(r + 1);
        removed.leads.push(String(values[r][0]));
      }
    }
  }

  // 3. Reset the seq_lead counter.
  var cfg = findSheetByHeader_(ss, ['Category', 'Value', 'Label']);
  if (cfg) {
    var rows = cfg.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === 'CONFIG' && String(rows[i][1]) === 'seq_lead') {
        cfg.getRange(i + 1, 3).setValue(SEQ_LEAD_RESET);
        break;
      }
    }
  }

  Logger.log('cleanupTestRows: ' + JSON.stringify(removed));
  return removed;
}
