// Mock hospital registration store — localStorage only (no backend).
// Persists applications, audit log, and "sent" emails so the admin can review them.

const APPS_KEY = "mc.hospitalApps.v1";
const AUDIT_KEY = "mc.hospitalAudit.v1";
const EMAILS_KEY = "mc.hospitalEmails.v1";
const OTP_KEY = "mc.hospitalOtp.v1";

export const ADMIN_EMAIL = "admin@medconnect.in";

export const STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  PENDING_FACILITY_REVIEW: "PENDING_FACILITY_REVIEW",
  FACILITY_VERIFIED: "FACILITY_VERIFIED",
  FACILITY_REJECTED: "FACILITY_REJECTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
};

export const STATUS_META = {
  PENDING: { label: "Pending", tone: "warning" },
  UNDER_REVIEW: { label: "Needs more info", tone: "warning" },
  PENDING_FACILITY_REVIEW: { label: "Pending facility review", tone: "primary" },
  FACILITY_VERIFIED: { label: "Facility verified", tone: "primary" },
  FACILITY_REJECTED: { label: "Facility rejected", tone: "emergency" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "emergency" },
  SUSPENDED: { label: "Suspended", tone: "emergency" },
};

const read = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ─── Applications ────────────────────────────────────────────────────────────
export function listApplications() {
  return read(APPS_KEY, []).sort((a, b) => b.createdAt - a.createdAt);
}
export function getApplication(id) {
  return read(APPS_KEY, []).find((a) => a.id === id) || null;
}
export function saveApplication(app) {
  const all = read(APPS_KEY, []);
  const idx = all.findIndex((a) => a.id === app.id);
  if (idx >= 0) all[idx] = app;
  else all.push(app);
  write(APPS_KEY, all);
  return app;
}
export function createApplication(initial = {}) {
  const id = `H${Date.now().toString(36).toUpperCase()}`;
  const app = {
    id,
    status: STATUS.PENDING,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    emailVerified: false,
    phoneVerified: false,
    profile: {},
    facility: {},
    documents: {}, // { key: { name, size, type, dataUrl } }
    photos: {}, // { key: [ { name, dataUrl, uploadedAt } ] }
    location: {},
    rejectionReason: "",
    requestNotes: "",
    ...initial,
  };
  saveApplication(app);
  logAudit(id, "Hospital Registered", `Application ${id} created`);
  return app;
}
export function updateStatus(id, status, meta = {}) {
  const app = getApplication(id);
  if (!app) return null;
  app.status = status;
  app.updatedAt = Date.now();
  if (meta.rejectionReason !== undefined) app.rejectionReason = meta.rejectionReason;
  if (meta.requestNotes !== undefined) app.requestNotes = meta.requestNotes;
  saveApplication(app);
  logAudit(id, `Status → ${status}`, meta.note || "");
  return app;
}

// ─── Audit log ───────────────────────────────────────────────────────────────
export function logAudit(applicationId, action, detail = "") {
  const all = read(AUDIT_KEY, []);
  all.push({
    id: `A${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    applicationId,
    action,
    detail,
    at: Date.now(),
  });
  write(AUDIT_KEY, all);
}
export function getAudit(applicationId) {
  return read(AUDIT_KEY, [])
    .filter((a) => a.applicationId === applicationId)
    .sort((a, b) => b.at - a.at);
}

// ─── Mock emails ─────────────────────────────────────────────────────────────
export function sendMockEmail({ to, subject, body, applicationId }) {
  const all = read(EMAILS_KEY, []);
  const email = {
    id: `E${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    to,
    subject,
    body,
    applicationId,
    sentAt: Date.now(),
  };
  all.push(email);
  write(EMAILS_KEY, all);
  if (applicationId) logAudit(applicationId, "Email sent", `${subject} → ${to}`);
  return email;
}
export function listEmails(applicationId) {
  const all = read(EMAILS_KEY, []);
  return (applicationId ? all.filter((e) => e.applicationId === applicationId) : all).sort(
    (a, b) => b.sentAt - a.sentAt,
  );
}

// ─── Mock OTP ────────────────────────────────────────────────────────────────
export function issueOtp(scope, key) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const all = read(OTP_KEY, {});
  all[`${scope}:${key}`] = { code, at: Date.now() };
  write(OTP_KEY, all);
  return code;
}
export function verifyOtp(scope, key, code) {
  const all = read(OTP_KEY, {});
  const rec = all[`${scope}:${key}`];
  return !!rec && rec.code === String(code).trim();
}

// ─── Templated email bodies ──────────────────────────────────────────────────
export const EMAIL_TEMPLATES = {
  approved: (app) => ({
    subject: `Welcome to MedConnect — ${app.profile.hospitalName} is approved`,
    body: `Hi ${app.profile.adminName || "team"},\n\nGreat news! Your hospital "${app.profile.hospitalName}" has been approved on MedConnect.\nYou can now sign in and start managing your workspace.\n\n— MedConnect Team`,
  }),
  rejected: (app, reason) => ({
    subject: `Your MedConnect application was not approved`,
    body: `Hi ${app.profile.adminName || "team"},\n\nWe reviewed your application for "${app.profile.hospitalName}" and could not approve it at this time.\n\nReason:\n${reason || "Not specified."}\n\nYou may re-apply with corrected information.\n\n— MedConnect Team`,
  }),
  moreInfo: (app, notes) => ({
    subject: `Additional information needed for ${app.profile.hospitalName}`,
    body: `Hi ${app.profile.adminName || "team"},\n\nOur reviewers need a few more details before we can approve "${app.profile.hospitalName}":\n\n${notes || "Please re-check your submission."}\n\nLog back in to update and resubmit.\n\n— MedConnect Team`,
  }),
  suspended: (app, reason) => ({
    subject: `Your MedConnect account has been suspended`,
    body: `Hi ${app.profile.adminName || "team"},\n\nAccess to "${app.profile.hospitalName}" on MedConnect has been suspended.\n\nReason:\n${reason || "Not specified."}\n\nContact support to resolve.\n\n— MedConnect Team`,
  }),
  received: (app) => ({
    subject: `We received your MedConnect application`,
    body: `Hi ${app.profile.adminName || "team"},\n\nThanks for applying to MedConnect with "${app.profile.hospitalName}". Application ID: ${app.id}.\n\nOur team will review your documents and facility photos and get back to you soon.\n\n— MedConnect Team`,
  }),
};
