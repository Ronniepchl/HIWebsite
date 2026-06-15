/*****************************************************************
 * InsureFlow — COMBINED backend (one file, two services)
 *
 * This single Apps Script project serves BOTH:
 *   1) CRM dashboard  (formerly Code-Webapp.gs)
 *   2) Questionnaire intake from the marketing site (formerly Code-Website.gs)
 *
 * Both already read/write the SAME spreadsheet, so they can live in one
 * project and one deployment. Routing is by HTTP verb + ?action=… :
 *
 *   GET  (no action)          -> window.DATA payload for the dashboard
 *   GET  ?action=login        -> { ok, user, role, token }
 *   GET  ?action=addCustomer  -> CRM write (dashboard, JSONP-friendly)
 *   GET  ?action=addLead      -> CRM lead    (dashboard manual entry)
 *   GET  ?action=addAgent     -> CRM agent
 *   GET  ?action=addNote      -> CRM activity note
 *
 *   POST ?action=addLead      -> Website lead intake (form params)
 *   POST ?action=logQuestionnaire -> Website analytics row (JSON body)
 *   POST (JSON body, no action)   -> Website legacy: analytics + lead
 *   POST ?action=login/addCustomer/addAgent/addNote -> CRM write
 *
 * Why verb-based routing for addLead: the dashboard calls writes via
 * GET+JSONP (cross-origin, no CORS), while the static website POSTs a form.
 * Keeping that split means neither service's existing client code changes.
 *
 * DEPLOY: Extensions -> Apps Script -> paste this file -> Save ->
 *   Deploy -> Manage deployments -> New version. Execute as: Me.
 *   Who has access: Anyone. The /exec URL stays the same for both clients.
 *****************************************************************/

/* ============================== Config ============================== */
const SPREADSHEET_ID = '1qewWj4RQVVbhvCmqR5M4V3C30V_p4hDgvC42SIjkp-4';
const TZ = 'Asia/Bangkok';

/* Tab names in the spreadsheet. Adjust here if you rename tabs. */
const TAB = {
  customers: 'Customers',
  leads: 'Leads',
  agents: 'AgentLeads',
  tasks: 'Tasks',
  activities: 'Activities',
  config: 'Config',
  users: 'Users',
};

/* Auth: secret pepper for password hashing. CHANGE THIS to a long random
   string and keep it secret. If changed after users exist, re-hash them. */
const PEPPER = 'insureflow-change-this-pepper-7f3a';

/* Defaults mirror the Config tab; overridden by CONFIG rows when present. */
const CFG = {
  renewalHigh: 7,       // days -> "due" tone
  renewalMedium: 30,    // days -> "warn" tone
  birthdayWindow: 7,    // days
  followupGrace: 0,     // days overdue grace
  appName: 'InsureFlow',
  company: 'Human Insurance',
};

const NOW = new Date();

/* Headers for the per-source questionnaire analytics tabs (Website). */
const BASE_HEADERS = ['Timestamp', 'Event', 'Score', 'Segment', 'Name', 'Email', 'Phone', 'Summary', 'Page'];

/* ============================== Web entry ============================== */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = p.action ? String(p.action) : '';
  let out;
  try {
    if (action === 'login') out = login(p.user, p.pass);
    else if (action === 'logQuestionnaire') out = { ok: true, service: 'InsureFlow questionnaire intake' };
    else if (action) out = handleWrite(action, p); // addCustomer/addLead/addAgent/addNote
    else out = buildData();
  } catch (err) {
    out = { error: String(err && err.message || err), stack: err && err.stack };
  }
  return respond(out, e);
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const action = p.action ? String(p.action) : '';

  // CRM dashboard writes (also accepted over POST for convenience).
  if (action === 'login') {
    try { return respond(login(p.user, p.pass), e); }
    catch (err) { return respond({ error: String(err && err.message || err) }, e); }
  }
  if (action === 'addCustomer' || action === 'addAgent' || action === 'addNote') {
    try { return respond(handleWrite(action, p), e); }
    catch (err) { return respond({ error: String(err && err.message || err) }, e); }
  }

  // Everything else over POST is Website questionnaire intake.
  // (addLead via POST = website lead; logQuestionnaire = analytics only;
  //  no action + JSON body = legacy analytics + lead.)
  return websiteIntake(e, action);
}

function respond(obj, e) {
  const json = JSON.stringify(obj);
  const cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService
      .createTextOutput(cb + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/* Run this once from the editor to verify mapping without deploying. */
function testBuild() {
  const d = buildData();
  Logger.log('Customers: %s, Leads: %s, Agents: %s, Tasks: %s, Activities: %s',
    d.CUSTOMERS.length, d.LEADS.length, d.AGENTS.length, d.TASKS.length, d.ACTIVITIES.length);
  return d;
}

/* ====================================================================== *
 *  SECTION A — CRM DASHBOARD  (was Code-Webapp.gs)
 * ====================================================================== */

/* ------------------------------ Writes ------------------------------ */
function handleWrite(action, p) {
  loadConfig();
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (action === 'addCustomer') return addCustomerRow(p);
    if (action === 'addLead') return addLeadRow(p);
    if (action === 'addAgent') return addAgentRow(p);
    if (action === 'addNote') return addNoteRow(p);
    return { error: 'Unknown action: ' + action };
  } finally {
    lock.releaseLock();
  }
}

function addCustomerRow(p) {
  const id = nextId(TAB.customers, 'CustomerID', 'CUS-');
  const premium = p.premium ? String(p.premium).replace(/[^0-9.]/g, '') : '';
  const obj = {
    CustomerID: id,
    FullNameTH: p.name || '',
    FullNameEN: p.en || '',
    Phone: p.phone || '',
    PhoneSearch: digitsOnly(p.phone),
    Tier: p.tier || 'Standard',
    Status: 'Active',
    Source: p.source || 'Manual',
    NextFollowUpDate: p.next || '',
    Notes: p.remark || p.note || '',
    PrimaryPlanName: p.policy || '',
    TotalAnnualPremium: premium,
    TotalPolicies: premium ? 1 : 0,
    LastInteractionDate: today(),
    RelationshipStatus: 'Active',
    BirthDate: p.birthdate || '',
    BirthdayMMDD: p.bdaymmdd || '',
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
  };
  appendMapped(TAB.customers, obj);
  return { ok: true, type: 'customer', id: id, record: buildCustomers([obj], [])[0] };
}

function addLeadRow(p) {
  const id = nextId(TAB.leads, 'LeadID', 'LED-');
  const obj = {
    LeadID: id,
    FullName: p.name || '',
    Phone: p.phone || '',
    PhoneSearch: digitsOnly(p.phone),
    Source: p.src || p.source || 'Manual',
    Interest: p.note || '',
    Stage: 'New Lead',
    EstimatedPremium: p.value ? String(p.value).replace(/[^0-9.]/g, '') : '',
    FirstContactDate: today(),
    LastContactDate: today(),
    Notes: p.note || '',
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
  };
  appendMapped(TAB.leads, obj);
  return { ok: true, type: 'lead', id: id, record: buildLeads([obj])[0] };
}

function addAgentRow(p) {
  const id = nextId(TAB.agents, 'AgentLeadID', 'AGT-');
  const obj = {
    AgentLeadID: id,
    FullName: p.name || '',
    Phone: p.phone || '',
    PhoneSearch: digitsOnly(p.phone),
    CurrentOccupation: p.job || p.src || '',
    Source: p.source || p.src || 'Manual',
    Stage: 'Interested',
    Notes: p.note || '',
    CreatedAt: nowIso(),
    UpdatedAt: nowIso(),
  };
  appendMapped(TAB.agents, obj);
  return { ok: true, type: 'agent', id: id, record: buildAgents([obj])[0] };
}

function addNoteRow(p) {
  const id = nextId(TAB.activities, 'ActivityID', 'ACT-');
  const relMap = { customer: 'Customer', lead: 'Lead', agent: 'AgentLead' };
  const obj = {
    ActivityID: id,
    ActivityDate: today(),
    ActivityTime: Utilities.formatDate(new Date(), TZ, 'HH:mm'),
    RelatedType: relMap[String(p.relatedType || '').toLowerCase()] || 'Customer',
    RelatedID: p.relatedId || '',
    RelatedName: p.relatedName || '',
    ActivityType: p.activityType || 'Manual Note',
    Channel: p.channel || 'Other',
    Subject: p.subject || 'Note',
    Notes: p.text || '',
    Outcome: p.outcome || 'Neutral',
    CreatedBy: 'CEO',
    CreatedAt: nowIso(),
  };
  appendMapped(TAB.activities, obj);
  return { ok: true, type: 'note', id: id, record: buildActivities([obj])[0] };
}

/* Append `obj` to `name`, placing values under their matching header columns. */
function appendMapped(name, obj) {
  const sh = sheetByName(name);
  if (!sh) throw new Error('Sheet not found: ' + name);
  const headers = headersOf(sh);
  const row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : '';
  });
  sh.appendRow(row);
  return headers;
}

function nextId(name, idCol, prefix) {
  const sh = sheetByName(name);
  if (!sh) return prefix + '00001';
  const headers = headersOf(sh);
  const ci = headers.indexOf(idCol);
  let max = 0;
  if (ci >= 0 && sh.getLastRow() > 1) {
    const vals = sh.getRange(2, ci + 1, sh.getLastRow() - 1, 1).getValues();
    vals.forEach(function (r) {
      const m = String(r[0]).match(/(\d+)\s*$/);
      if (m) { const n = parseInt(m[1], 10); if (n > max) max = n; }
    });
  }
  return prefix + ('00000' + (max + 1)).slice(-5);
}

function sheetByName(name) { return ss_().getSheetByName(name); }
function headersOf(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
}
function nowIso() { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ssXXX"); }
function today() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }
function digitsOnly(s) { return String(s || '').replace(/\D/g, ''); }

/* ------------------------------ Build (reads) ------------------------------ */
function buildData() {
  loadConfig();

  const custRows = readSheet(TAB.customers);
  const leadRows = readSheet(TAB.leads);
  const agentRows = readSheet(TAB.agents);
  const taskRows = readSheet(TAB.tasks);
  const actRows = readSheet(TAB.activities);

  const activities = buildActivities(actRows);
  const customers = buildCustomers(custRows, actRows);
  const leads = buildLeads(leadRows);
  const agents = buildAgents(agentRows);

  const custById = indexBy(customers, 'id');
  const leadById = indexBy(leads, 'id');
  const agentById = indexBy(agents, 'id');

  const tasks = buildTasks(taskRows, custById, leadById, agentById);

  const upcoming = buildUpcoming(custRows, agentRows);
  const pulse = buildPulse(custRows, customers, leads, agents);
  const summary = buildSummary(custRows, customers, leads, agents, actRows);
  const monthly = buildMonthly(customers, leads);
  const ceo = buildCeoFocus(customers, leads, tasks);
  const priority = buildPriority(tasks);
  const premiumTrend = ramp(pulseNumber(customers), 8);

  return {
    CUSTOMERS: customers,
    LEADS: leads,
    AGENTS: agents,
    TASKS: tasks,
    ACTIVITIES: activities,
    PRIORITY: priority,
    UPCOMING: upcoming,
    SUMMARY: summary,
    PREMIUM_TREND: premiumTrend,
    CEO_FOCUS: ceo,
    PULSE: pulse,
    MONTHLY: monthly,
    _meta: {
      generatedAt: Utilities.formatDate(NOW, TZ, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      source: 'google-sheets',
    },
  };
}

/* ------------------------------ Sheet IO ------------------------------ */
function ss_() { return SpreadsheetApp.openById(SPREADSHEET_ID); }

function readSheet(name) {
  const sh = ss_().getSheetByName(name);
  if (!sh) return [];
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(function (h) { return String(h).trim(); });
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (r.every(function (c) { return c === '' || c === null; })) continue;
    const o = {};
    for (let j = 0; j < headers.length; j++) o[headers[j]] = r[j];
    rows.push(o);
  }
  return rows;
}

function loadConfig() {
  try {
    const rows = readSheet(TAB.config);
    rows.forEach(function (r) {
      const cat = String(r.Category || '').trim();
      if (cat !== 'CONFIG') return;
      const key = String(r.Value || '').trim();
      const val = r.Label;
      if (!key) return;
      if (key === 'renewal_high_days') CFG.renewalHigh = num(val);
      else if (key === 'renewal_medium_days') CFG.renewalMedium = num(val);
      else if (key === 'birthday_window_days') CFG.birthdayWindow = num(val);
      else if (key === 'followup_overdue_grace_days') CFG.followupGrace = num(val);
      else if (key === 'app_name') CFG.appName = String(val || CFG.appName);
      else if (key === 'company') CFG.company = String(val || CFG.company);
    });
  } catch (e) { /* keep defaults */ }
}

/* ------------------------------ Entities ------------------------------ */
function buildCustomers(rows, actRows) {
  const remarks = groupRemarks(actRows || [], 'Customer');
  return rows.map(function (c) {
    const id = String(c.CustomerID || '');
    const tier = String(c.Tier || 'Standard');
    const bi = bdayInfo(c.BirthdayMMDD, c.BirthDate);
    const renewalDays = c.NearestRenewalDate ? daysFromNow(c.NearestRenewalDate) : null;
    const followDays = c.NextFollowUpDate ? daysFromNow(c.NextFollowUpDate) : null;
    const created = toDate(c.CreatedAt);
    return {
      id: id,
      name: String(c.FullNameTH || c.FullNameEN || id),
      en: String(c.FullNameEN || ''),
      policy: String(c.PrimaryPlanName || '—'),
      premium: premiumYr(c.TotalAnnualPremium),
      phone: String(c.Phone || '—'),
      email: String(c.Email || '—'),
      bday: bi.label || '—',
      bdayDays: bi.days == null ? 99 : bi.days,
      tier: tier,
      preferred: c.LineID ? 'LINE' : 'Call',
      last: relativeFrom(c.LastInteractionDate) || '—',
      next: custNext(bi, renewalDays, c.NearestRenewalDate, followDays, c.NextFollowUpDate),
      status: custStatus(tier, renewalDays, followDays, bi.days, c.RelationshipStatus),
      mono: mono(c.FullNameTH || c.FullNameEN),
      years: created ? Math.max(0, NOW.getFullYear() - created.getFullYear()) : 0,
      remarks: remarks[id] || (c.Notes ? [{ date: fmtLong(c.UpdatedAt || NOW), text: String(c.Notes) }] : []),
    };
  });
}

function custStatus(tier, renewalDays, followDays, bdayDays, rel) {
  if (renewalDays != null && renewalDays >= 0 && renewalDays <= CFG.renewalHigh) return 'due';
  if (tier === 'VIP') return 'flame';
  if (followDays != null && followDays <= 7) return 'warn';
  if (bdayDays != null && bdayDays <= CFG.birthdayWindow) return 'warn';
  if (renewalDays != null && renewalDays >= 0 && renewalDays <= CFG.renewalMedium) return 'warn';
  if (String(rel || '').toLowerCase() === 'dormant') return 'warn';
  return 'ok';
}

function custNext(bi, renewalDays, renewalDate, followDays, followDate) {
  const c = [];
  if (bi.days != null && bi.days >= 0) c.push({ d: bi.days, label: bi.days === 0 ? 'Birthday · today' : 'Birthday · ' + bi.label });
  if (renewalDays != null && renewalDays >= 0) c.push({ d: renewalDays, label: 'Renewal · ' + fmtShort(renewalDate) });
  if (followDays != null && followDays >= 0) c.push({ d: followDays, label: followDays === 0 ? 'Follow-up · today' : 'Follow-up · ' + fmtShort(followDate) });
  if (!c.length) return 'Active';
  c.sort(function (a, b) { return a.d - b.d; });
  return c[0].label;
}

function buildLeads(rows) {
  return rows.map(function (l) {
    const val = num(l.EstimatedPremium);
    return {
      id: String(l.LeadID || ''),
      name: String(l.FullName || l.LeadID || ''),
      en: '',
      src: String(l.Source || '—'),
      phone: String(l.Phone || '—'),
      email: String(l.Email || '—'),
      date: relativeFrom(l.LastContactDate || l.FirstContactDate || l.CreatedAt) || '—',
      stage: mapLeadStage(l.Stage),
      note: String(l.Interest || l.Notes || l.LostReason || ''),
      value: val > 0 ? compactBaht(val) : '฿—',
      mono: mono(l.FullName),
    };
  });
}

function mapLeadStage(s) {
  s = String(s || '').toLowerCase();
  if (s.indexOf('new') >= 0) return 'new';
  if (s.indexOf('contact') >= 0) return 'contacted';
  if (s.indexOf('propos') >= 0 || s.indexOf('quote') >= 0) return 'proposal';
  if (s.indexOf('won') >= 0 || s.indexOf('clos') >= 0 || s.indexOf('convert') >= 0 || s.indexOf('sign') >= 0 || s.indexOf('lost') >= 0) return 'closed';
  return 'new';
}

function buildAgents(rows) {
  return rows.map(function (a) {
    const stage = mapAgentStage(a.Stage);
    let date;
    if (a.InterviewDate) date = 'Interview · ' + fmtShort(a.InterviewDate) + (a.InterviewTime ? ' ' + fmtTime(a.InterviewTime) : '');
    else if (a.LicenseDate && stage === 'licensed') date = 'Licensed · ' + fmtShort(a.LicenseDate);
    else if (a.NextFollowUpDate) date = 'Follow-up · ' + fmtShort(a.NextFollowUpDate);
    else date = relativeFrom(a.UpdatedAt || a.CreatedAt) || '—';
    return {
      id: String(a.AgentLeadID || ''),
      name: String(a.FullName || a.AgentLeadID || ''),
      job: String(a.CurrentOccupation || '—'),
      phone: String(a.Phone || '—'),
      email: String(a.Email || '—'),
      date: date,
      nextAction: date,
      stage: stage,
      note: String(a.Notes || a.Experience || ''),
      mono: mono(a.FullName),
    };
  });
}

function mapAgentStage(s) {
  s = String(s || '').toLowerCase();
  if (s.indexOf('licen') >= 0) return 'licensed';
  if (s.indexOf('train') >= 0) return 'training';
  if (s.indexOf('interview') >= 0) return 'interview';
  return 'interested';
}

/* ------------------------------ Tasks ------------------------------ */
const TYPE_META = {
  birthday: { tone: 'warn', icon: 'gift', action: 'Send birthday wish', actionIcon: 'gift', cat: 'Birthday' },
  renewal: { tone: 'due', icon: 'renew', action: 'Call today', actionIcon: 'phone', cat: 'Customer Renewal' },
  lead: { tone: 'info', icon: 'leads', action: 'Contact lead', actionIcon: 'phone', cat: 'New Lead' },
  agent: { tone: 'ok', icon: 'user', action: 'Review profile', actionIcon: 'doc', cat: 'Agent Interview' },
  proposal: { tone: 'warn', icon: 'doc', action: 'Send proposal', actionIcon: 'doc', cat: 'Proposal Follow-up' },
};

function buildTasks(rows, custById, leadById, agentById) {
  return rows.map(function (t) {
    const type = mapTaskType(t.TaskType, t.RelatedType);
    const meta = TYPE_META[type];
    const relType = relTypeNorm(t.RelatedType, type);
    const due = toDate(t.DueDate);
    const dDays = due ? daysFromNow(due) : null;
    const snooze = toDate(t.SnoozeUntil);

    let dueState = 'scheduled';
    if (snooze && daysFromNow(snooze) > 0) dueState = 'snoozed';
    else if (dDays != null) dueState = dDays < 0 ? 'overdue' : (dDays === 0 ? 'today' : 'scheduled');

    const statusRaw = String(t.Status || '').toLowerCase();
    const status = (statusRaw.indexOf('complet') >= 0 || statusRaw.indexOf('done') >= 0) ? 'Completed' : 'Open';

    let sub = meta.cat, metric = '', metricLabel = '';
    if (relType === 'customer') {
      const c = custById[t.RelatedID];
      sub = c ? c.policy : meta.cat;
      metric = c ? c.premium : ''; metricLabel = 'premium';
    } else if (relType === 'lead') {
      const l = leadById[t.RelatedID];
      sub = l ? ('Lead · ' + l.src) : 'Lead';
      if (dDays != null && dDays < 0) { metric = (-dDays) + ' days'; metricLabel = 'waiting'; }
      else { metric = l ? l.value : ''; metricLabel = 'value'; }
    } else if (relType === 'agent') {
      const a = agentById[t.RelatedID];
      sub = a ? a.job : 'Candidate';
      metric = fmtTime(t.DueTime) || ''; metricLabel = 'today';
    }

    let cat = meta.cat;
    if (type === 'birthday' && dueState === 'today') cat = 'Birthday Today';

    const task = {
      id: String(t.TaskID || ''),
      type: type,
      relatedType: relType,
      relatedId: String(t.RelatedID || ''),
      name: displayName(t.RelatedName) || (custById[t.RelatedID] && custById[t.RelatedID].name) || String(t.Title || ''),
      cat: cat,
      tone: meta.tone,
      icon: meta.icon,
      sub: sub,
      context: t.Notes ? String(t.Notes) : dueContext(dDays),
      metric: metric,
      metricLabel: metricLabel,
      action: meta.action,
      actionIcon: meta.actionIcon,
      priority: String(t.Priority || '').toLowerCase() === 'high' ? 'high' : 'normal',
      due: dueState,
      status: status,
    };
    if (type === 'lead' && dueState === 'overdue') task.risk = 'May go cold';
    return task;
  });
}

function mapTaskType(t, rel) {
  t = String(t || '').toLowerCase();
  rel = String(rel || '').toLowerCase();
  if (t.indexOf('birthday') >= 0) return 'birthday';
  if (t.indexOf('renew') >= 0) return 'renewal';
  if (t.indexOf('propos') >= 0) return 'proposal';
  if (t.indexOf('interview') >= 0 || rel.indexOf('agent') >= 0) return 'agent';
  if (t.indexOf('lead') >= 0 || rel === 'lead') return 'lead';
  if (t.indexOf('follow') >= 0) return rel.indexOf('agent') >= 0 ? 'agent' : (rel === 'lead' ? 'lead' : 'renewal');
  return 'renewal';
}

function relTypeNorm(rel, type) {
  rel = String(rel || '').toLowerCase();
  if (rel.indexOf('agent') >= 0) return 'agent';
  if (rel.indexOf('lead') >= 0) return 'lead';
  if (rel.indexOf('customer') >= 0) return 'customer';
  return type === 'agent' ? 'agent' : (type === 'lead' ? 'lead' : 'customer');
}

function dueContext(dDays) {
  if (dDays == null) return '';
  if (dDays < 0) return 'Overdue by ' + (-dDays) + ' day' + ((-dDays) > 1 ? 's' : '');
  if (dDays === 0) return 'Due today';
  if (dDays === 1) return 'Due tomorrow';
  return 'Due in ' + dDays + ' days';
}

/* ---------------------------- Activities ---------------------------- */
function buildActivities(rows) {
  const list = rows.map(function (a) {
    const d = toDate(a.ActivityDate);
    return {
      _sort: (d ? d.getTime() : 0) + tseconds(a.ActivityTime),
      id: String(a.ActivityID || ''),
      icon: actIcon(a.ActivityType, a.Channel),
      tone: actTone(a.Outcome),
      title: String(a.Subject || a.ActivityType || 'Activity'),
      who: displayName(a.RelatedName),
      when: (relativeFrom(a.ActivityDate) || '') + (a.ActivityTime ? ' · ' + fmtTime(a.ActivityTime) : ''),
      note: String(a.Notes || ''),
    };
  });
  list.sort(function (x, y) { return y._sort - x._sort; });
  return list.map(function (o) { delete o._sort; return o; }).slice(0, 40);
}

function actIcon(type, channel) {
  const t = String(type || '').toLowerCase(), c = String(channel || '').toLowerCase();
  if (t.indexOf('propos') >= 0) return 'doc';
  if (t.indexOf('call') >= 0 || c.indexOf('phone') >= 0) return 'phone';
  if (c.indexOf('line') >= 0 || c.indexOf('chat') >= 0) return 'chat';
  if (c.indexOf('mail') >= 0 || c.indexOf('email') >= 0) return 'mail';
  if (t.indexOf('note') >= 0) return 'note';
  if (t.indexOf('complete') >= 0 || t.indexOf('renew') >= 0) return 'check';
  return 'note';
}

function actTone(outcome) {
  const o = String(outcome || '').toLowerCase();
  if (o.indexOf('positive') >= 0 || o.indexOf('won') >= 0 || o.indexOf('complete') >= 0) return 'ok';
  if (o.indexOf('follow') >= 0) return 'warn';
  if (o.indexOf('lost') >= 0 || o.indexOf('negative') >= 0) return 'due';
  return 'info';
}

function groupRemarks(actRows, relType) {
  const out = {};
  actRows.forEach(function (a) {
    if (String(a.RelatedType || '').toLowerCase().indexOf(relType.toLowerCase()) < 0) return;
    const id = String(a.RelatedID || '');
    if (!id) return;
    const text = (a.Subject ? a.Subject + ' — ' : '') + String(a.Notes || '');
    if (!text.trim()) return;
    (out[id] = out[id] || []).push({
      _t: (toDate(a.ActivityDate) ? toDate(a.ActivityDate).getTime() : 0) + tseconds(a.ActivityTime),
      date: fmtLong(a.ActivityDate || NOW),
      text: text,
    });
  });
  Object.keys(out).forEach(function (k) {
    out[k].sort(function (x, y) { return y._t - x._t; });
    out[k] = out[k].map(function (r) { return { date: r.date, text: r.text }; });
  });
  return out;
}

/* ============================== Aggregates ==============================
   The sheet has no historical time-series, so sparkline arrays and deltas
   below are deterministic placeholders derived from the current value
   (visual only). The headline values/counts ARE real. */
function buildPulse(custRows, customers, leads, agents) {
  const premium = sumPremium(customers);
  const renewalsDue = custRows.filter(function (c) {
    const d = c.NearestRenewalDate ? daysFromNow(c.NearestRenewalDate) : null;
    return d != null && d >= 0 && d <= 30;
  }).length;
  const openLeads = leads.filter(function (l) { return l.stage !== 'closed'; }).length;
  const toContact = leads.filter(function (l) { return l.stage === 'new'; }).length;
  const pipeline = agents.filter(function (a) { return a.stage !== 'licensed'; }).length;
  const interviews = agents.filter(function (a) { return a.stage === 'interview'; }).length;
  return {
    health: renewalsDue > 8 ? 'Attention' : 'Healthy',
    healthNote: 'Retention and lead pipeline are on track.',
    kpis: [
      { id: 'summary', icon: 'dollar', value: compactBaht(premium), label: 'Premium written', sub: 'in force', tone: 'ok' },
      { id: 'customers', icon: 'renew', value: String(renewalsDue), label: 'Renewals due', sub: 'next 30 days', tone: 'due' },
      { id: 'leads', icon: 'target', value: String(openLeads), label: 'Open leads', sub: toContact + ' to contact', tone: 'info' },
      { id: 'agents', icon: 'agents', value: String(pipeline), label: 'Agent pipeline', sub: interviews + ' interviews', tone: 'warn' },
    ],
  };
}

function buildSummary(custRows, customers, leads, agents, actRows) {
  const thisMonth = NOW.getMonth(), thisYear = NOW.getFullYear();
  const renewalsThisMonth = custRows.filter(function (c) {
    const d = toDate(c.NearestRenewalDate);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const pendingFollowup = custRows.filter(function (c) {
    const d = c.NextFollowUpDate ? daysFromNow(c.NextFollowUpDate) : null;
    return d != null && d <= 7;
  }).length;
  const newLeads = leads.filter(function (l) { return l.stage === 'new'; }).length;
  const proposals = leads.filter(function (l) { return l.stage === 'proposal'; }).length;
  const closed = leads.filter(function (l) { return l.stage === 'closed'; }).length;
  const interviews = agents.filter(function (a) { return a.stage === 'interview'; }).length;
  const newAgents = agents.filter(function (a) { return a.stage === 'licensed'; }).length;

  function g(label, value) { return { label: label, value: value, delta: '', spark: ramp(value, 7) }; }
  return {
    customers: [g('Total customers', customers.length), g('Renewals this month', renewalsThisMonth), g('Pending follow-up', pendingFollowup)],
    business: [g('New leads', newLeads), g('Proposals sent', proposals), g('Closed cases', closed)],
    recruit: [g('Agent leads', agents.length), g('Interviews', interviews), g('New agents', newAgents)],
  };
}

function buildMonthly(customers, leads) {
  const premium = sumPremium(customers);
  const newBiz = leads.filter(function (l) { return l.stage === 'closed'; })
    .reduce(function (s, l) { return s + parseCompact(l.value); }, 0);
  return {
    premium: compactBaht(premium),
    delta: '',
    vs: 'in force',
    trend: ramp(premium, 8),
    stats: [
      { label: 'New business', value: compactBaht(newBiz), tone: 'ok' },
      { label: 'Renewals', value: compactBaht(premium - newBiz), tone: 'info' },
      { label: 'Closed cases', value: String(leads.filter(function (l) { return l.stage === 'closed'; }).length), tone: 'warn' },
    ],
  };
}

function buildCeoFocus(customers, leads, tasks) {
  const followThisWeek = customers.filter(function (c) { return c.status === 'warn' || c.status === 'flame'; }).length;
  const renewals7 = customers.filter(function (c) { return c.status === 'due'; }).length;
  const proposalsOpen = tasks.filter(function (t) { return t.type === 'proposal' && t.status === 'Open'; }).length;
  const overdue = tasks.filter(function (t) { return t.due === 'overdue' && t.status === 'Open'; }).length;
  const score = Math.max(50, Math.min(98, 95 - overdue * 4));
  const alerts = [];
  if (followThisWeek) alerts.push(followThisWeek + ' customers require follow-up this week');
  if (renewals7) alerts.push(renewals7 + ' policy renewals due within 7 days');
  if (proposalsOpen) alerts.push(proposalsOpen + ' proposal' + (proposalsOpen > 1 ? 's have' : ' has') + ' not been sent yet');
  if (!alerts.length) alerts.push('No urgent items — pipeline is clear');
  return {
    name: CFG.company,
    score: score,
    status: score >= 80 ? 'On Track' : (score >= 65 ? 'Watch' : 'Action'),
    alerts: alerts,
    insight: 'Focus on customer retention today — ' + renewals7 + ' renewal' + (renewals7 === 1 ? '' : 's') +
      ' are due this week. ' + (leads.filter(function (l) { return l.stage === 'new'; }).length) + ' new leads remain uncontacted.',
  };
}

function buildUpcoming(custRows, agentRows) {
  const ev = [];
  custRows.forEach(function (c) {
    const bi = bdayInfo(c.BirthdayMMDD, c.BirthDate);
    if (bi.days != null && bi.days >= 0 && bi.days <= 30) ev.push({ d: bi.days, date: bi.date, tone: 'warn', kind: 'Birthday', name: nameOf(c), icon: 'gift', bday: true });
    const rd = c.NearestRenewalDate ? daysFromNow(c.NearestRenewalDate) : null;
    if (rd != null && rd >= 0 && rd <= 45) ev.push({ d: rd, date: toDate(c.NearestRenewalDate), tone: 'due', kind: 'Renewal', name: nameOf(c), icon: 'renew' });
    const fd = c.NextFollowUpDate ? daysFromNow(c.NextFollowUpDate) : null;
    if (fd != null && fd >= 0 && fd <= 30) ev.push({ d: fd, date: toDate(c.NextFollowUpDate), tone: 'ok', kind: 'Check-in', name: nameOf(c), icon: 'phone' });
  });
  agentRows.forEach(function (a) {
    const id = a.InterviewDate ? daysFromNow(a.InterviewDate) : null;
    if (id != null && id >= 0 && id <= 30) ev.push({ d: id, date: toDate(a.InterviewDate), tone: 'info', kind: 'Interview', name: nameOf(a), icon: 'user' });
  });
  ev.sort(function (x, y) { return x.d - y.d; });
  return ev.slice(0, 6).map(function (e, i) {
    return {
      id: 'u' + i, tone: e.tone, kind: e.kind, name: e.name, icon: e.icon,
      when: e.date ? Utilities.formatDate(e.date, TZ, 'EEE · d MMM') : '',
      bday: !!e.bday,
    };
  });
}

function buildPriority(tasks) {
  return tasks.filter(function (t) { return t.status === 'Open' && t.priority === 'high'; })
    .slice(0, 3)
    .map(function (t, i) {
      const p = { id: 'p' + (i + 1), tone: t.tone, icon: t.actionIcon, title: t.action + ' ' + t.name, sub: t.sub, meta: t.context };
      if (t.relatedType === 'customer') p.cust = t.relatedId;
      if (t.relatedType === 'agent') p.agent = t.relatedId;
      return p;
    });
}

/* ============================== Helpers ============================== */
function indexBy(arr, key) { const m = {}; arr.forEach(function (o) { m[o[key]] = o; }); return m; }

function nameOf(row) {
  return String(row.Nickname || row.FullNameTH || row.FullName || '').split(/\s+/)[0] || String(row.FullName || row.FullNameTH || '');
}

function sumPremium(customers) { return customers.reduce(function (s, c) { return s + parseCompact(c.premium); }, 0); }
function pulseNumber(customers) { return Math.max(1, Math.round(sumPremium(customers) / 1000)); }

function num(v) {
  if (v === '' || v == null) return 0;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseCompact(v) {
  const s = String(v || '');
  const n = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
  if (/m/i.test(s)) return n * 1e6;
  if (/k/i.test(s)) return n * 1e3;
  return n;
}

function commas(n) {
  n = Math.round(n);
  let s = String(Math.abs(n)), out = '';
  while (s.length > 3) { out = ',' + s.slice(-3) + out; s = s.slice(0, -3); }
  return (n < 0 ? '-' : '') + s + out;
}
function premiumYr(v) { const n = num(v); return n > 0 ? '฿' + commas(n) + '/yr' : '฿—'; }
function compactBaht(n) {
  n = Math.round(n);
  if (n >= 1e6) return '฿' + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (n >= 1e3) return '฿' + Math.round(n / 1e3) + 'k';
  return '฿' + commas(n);
}

function mono(name) {
  name = String(name || '').trim();
  if (!name) return '?';
  const parts = name.split(/\s+/);
  const a = Array.from(parts[0])[0] || '';
  const b = parts[1] ? (Array.from(parts[1])[0] || '') : '';
  return (a + b) || a || '?';
}

function displayName(s) { s = String(s || '').trim(); const i = s.indexOf('('); return (i > 0 ? s.slice(0, i) : s).trim() || s; }

function toDate(v) {
  if (v === '' || v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function daysFromNow(v) { const d = toDate(v); if (!d) return null; return Math.round((startOfDay(d) - startOfDay(NOW)) / 86400000); }

function relativeFrom(v) {
  const d = toDate(v); if (!d) return '';
  const diff = -daysFromNow(d);
  if (diff < 0) { const f = -diff; return f === 1 ? 'Tomorrow' : 'In ' + f + ' days'; }
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return diff + ' days ago';
  if (diff < 14) return 'Last week';
  if (diff < 60) return Math.round(diff / 7) + ' weeks ago';
  return Math.round(diff / 30) + ' months ago';
}

function bdayInfo(mmdd, birth) {
  let mm, dd;
  if (mmdd && String(mmdd).indexOf('-') >= 0) {
    const p = String(mmdd).split('-'); mm = +p[0]; dd = +p[1];
  } else {
    const b = toDate(birth);
    if (!b) return { days: null, label: '', date: null };
    mm = b.getMonth() + 1; dd = b.getDate();
  }
  if (!mm || !dd) return { days: null, label: '', date: null };
  let next = new Date(NOW.getFullYear(), mm - 1, dd);
  if (Math.round((startOfDay(next) - startOfDay(NOW)) / 86400000) < 0) next = new Date(NOW.getFullYear() + 1, mm - 1, dd);
  const days = Math.round((startOfDay(next) - startOfDay(NOW)) / 86400000);
  return { days: days, label: Utilities.formatDate(next, TZ, 'd MMM'), date: next };
}

function fmtShort(v) { const d = toDate(v); return d ? Utilities.formatDate(d, TZ, 'd MMM') : ''; }
function fmtLong(v) { const d = toDate(v) || NOW; return Utilities.formatDate(d, TZ, 'd MMM yyyy'); }
function fmtTime(v) { if (v instanceof Date) return Utilities.formatDate(v, TZ, 'HH:mm'); return String(v || '').trim(); }
function tseconds(v) { const s = String(v || ''); const m = s.match(/(\d{1,2}):(\d{2})/); return m ? (+m[1] * 3600 + +m[2] * 60) * 1000 : 0; }

function ramp(end, n) {
  n = n || 7; end = Math.max(0, Math.round(end));
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(Math.round(end * (0.55 + 0.45 * (i / (n - 1)))));
  return arr;
}

/* ============================== Auth (login) ==============================
   Validates ?action=login&user=&pass= against the "Users" tab and returns
   { ok, user, role, token }. Run setupUsers() once to create the tab + seed
   an admin (Panupong / Aa12345*). Passwords are SHA-256 + PEPPER hashed.
   SECURITY: JSONP puts credentials in the URL — fine for low-stakes internal
   use over HTTPS; not for sensitive accounts. */
function login(user, pass) {
  user = String(user || '').trim();
  pass = String(pass || '');
  if (!user || !pass) return { ok: false, error: 'Enter your username and password.' };
  if (!ss_().getSheetByName(TAB.users)) return { ok: false, error: 'Users tab not set up — run setupUsers() once.' };
  const rows = readSheet(TAB.users);
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (String(r.Username || '').trim().toLowerCase() !== user.toLowerCase()) continue;
    if (isFalsey(r.Active)) return { ok: false, error: 'This account is disabled.' };
    if (!passwordMatches(r, user, pass)) return { ok: false, error: 'Incorrect username or password.' };
    return {
      ok: true,
      user: String(r.Name || r.Username || user),
      role: String(r.Role || 'user'),
      token: Utilities.getUuid(),
    };
  }
  return { ok: false, error: 'Incorrect username or password.' };
}

function passwordMatches(r, user, pass) {
  const hash = String(r.PasswordHash || '').trim();
  if (hash) return safeEquals(hash, hashPw(user, pass));
  const plain = String(r.Password || ''); // optional plaintext fallback column
  return plain !== '' && safeEquals(plain, pass);
}

function hashPw(user, pass) {
  const raw = String(user).toLowerCase() + ':' + String(pass) + ':' + PEPPER;
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  return bytes.map(function (b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function safeEquals(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

function isFalsey(v) {
  const s = String(v).trim().toLowerCase();
  return s === 'false' || s === 'no' || s === '0' || s === 'inactive' || s === 'disabled';
}

/* ---- editor helpers (run once / as needed, not via the web) ---- */
function setupUsers() {
  const ss = ss_();
  let sh = ss.getSheetByName(TAB.users);
  if (!sh) {
    sh = ss.insertSheet(TAB.users);
    sh.getRange(1, 1, 1, 5).setValues([['Username', 'PasswordHash', 'Name', 'Role', 'Active']]);
    sh.setFrozenRows(1);
  }
  if (sh.getLastRow() < 2) addUser('Panupong', 'Aa12345', 'Panupong', 'admin');
  return 'Users tab ready: ' + TAB.users;
}

function addUser(username, password, name, role) {
  const ss = ss_();
  let sh = ss.getSheetByName(TAB.users);
  if (!sh) {
    sh = ss.insertSheet(TAB.users);
    sh.getRange(1, 1, 1, 5).setValues([['Username', 'PasswordHash', 'Name', 'Role', 'Active']]);
    sh.setFrozenRows(1);
  }
  sh.appendRow([username, hashPw(username, password), name || username, role || 'user', true]);
  return 'Added user: ' + username;
}

function hashFor(username, password) { const h = hashPw(username, password); Logger.log(h); return h; }
function testLogin() { Logger.log(JSON.stringify(login('Panupong', 'Aa12345*'))); }

/* ====================================================================== *
 *  SECTION B — WEBSITE QUESTIONNAIRE INTAKE  (was Code-Website.gs)
 *  Handles POST traffic from the marketing site:
 *    ?action=addLead          (form params)  -> Leads row
 *    ?action=logQuestionnaire (JSON body)    -> per-source analytics tab
 *    plain JSON POST (no action)             -> both (legacy)
 * ====================================================================== */
function websiteIntake(e, action) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const ss = ss_();
    const now = new Date();

    // action=addLead : create a CRM lead from form params
    if (action === 'addLead') {
      const ld = {
        name: e.parameter.name || '', email: e.parameter.email || '',
        phone: e.parameter.phone || '', summary: e.parameter.note || '',
        source: e.parameter.source || e.parameter.src || 'Website',
      };
      const lc = contactParts_(ld);
      return respond({ ok: true, leadId: createLead_(ss, ld, now, lc) }, e);
    }

    // questionnaire payload (JSON body)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (ignore) {}
    }
    const c = contactParts_(data);
    logToSourceTab_(ss, data, now, c);

    // logQuestionnaire = analytics only (leads come via addLead).
    // no action (legacy) = also create the lead.
    let leadId = null;
    if (action !== 'logQuestionnaire' && data.event === 'lead' &&
        (data.name || c.email || c.phone)) {
      leadId = createLead_(ss, data, now, c);
    }
    return respond({ ok: true, leadId: leadId }, e);
  } catch (err) {
    return respond({ ok: false, error: String(err) }, e);
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function tabNameFor_(source) {
  switch (source) {
    case 'life-protection-score': return 'Life Protection Score';
    case 'truth-report': return 'Truth Report';
    case 'trust-engine': return 'Trust Engine';
    case 'advisor-fit': return 'Advisor Fit';
    default: return 'Other Responses';
  }
}

function logToSourceTab_(ss, data, now, c) {
  if (!data || (!data.source && !data.fields && !data.event)) return;
  const tabName = tabNameFor_(data.source);
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(BASE_HEADERS);
    sheet.setFrozenRows(1);
  }
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const fields = data.fields || {};
  const missing = Object.keys(fields).filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  const rowMap = {
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
  sheet.appendRow(headers.map(function (h) { return rowMap.hasOwnProperty(h) ? rowMap[h] : ''; }));
}

function createLead_(ss, data, now, c) {
  const leads = findSheetByHeader_(ss, ['LeadID', 'FullName']);
  if (!leads) return null;
  const headers = leads.getRange(1, 1, 1, leads.getLastColumn()).getValues()[0].map(String);
  const leadId = nextLeadId_(ss), today = isoDate_(now);
  const values = {
    LeadID: leadId,
    FullName: data.name || '',
    Phone: c.phone,
    PhoneSearch: c.digits,
    Email: c.email,
    Source: 'Website',
    Interest: sourceLabel_(data.source) + (data.score || data.score === 0 ? ' · score ' + data.score : ''),
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
  leads.appendRow(headers.map(function (h) { return values.hasOwnProperty(h) ? values[h] : ''; }));
  return leadId;
}

function contactParts_(data) {
  const contact = String(data.contact || '');
  const email = String(data.email || (contact.indexOf('@') > -1 ? contact : ''));
  const phoneRaw = String(data.phone || (contact.indexOf('@') > -1 ? '' : contact));
  const digits = phoneRaw.replace(/[^\d]/g, ''), hasPhone = digits.length >= 7;
  return { email: email, phone: hasPhone ? phoneRaw : '', digits: hasPhone ? digits : '' };
}

function nextLeadId_(ss) {
  const cfg = findSheetByHeader_(ss, ['Category', 'Value', 'Label']);
  if (cfg) {
    const rows = cfg.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === 'CONFIG' && String(rows[i][1]) === 'seq_lead') {
        const n = (parseInt(rows[i][2], 10) || 0) + 1;
        cfg.getRange(i + 1, 3).setValue(n);
        return 'LED-' + padNum_(n, 5);
      }
    }
  }
  const leads = findSheetByHeader_(ss, ['LeadID', 'FullName']);
  return 'LED-' + padNum_(leads ? Math.max(0, leads.getLastRow() - 1) + 1 : 1, 5);
}

function findSheetByHeader_(ss, required) {
  const sheets = ss.getSheets();
  for (let s = 0; s < sheets.length; s++) {
    const sh = sheets[s];
    if (sh.getLastColumn() === 0 || sh.getLastRow() === 0) continue;
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
    if (required.every(function (r) { return header.indexOf(r) > -1; })) return sh;
  }
  return null;
}

function sourceLabel_(src) {
  switch (src) {
    case 'life-protection-score': return 'Life Protection Score';
    case 'truth-report': return 'Truth Report';
    case 'trust-engine': return 'Trust Engine';
    case 'advisor-fit': return 'Advisor Fit';
    default: return src || 'Questionnaire';
  }
}

function padNum_(n, width) { let s = String(n); while (s.length < width) s = '0' + s; return s; }
function isoDate_(d) { return Utilities.formatDate(d, 'Asia/Bangkok', 'yyyy-MM-dd'); }
