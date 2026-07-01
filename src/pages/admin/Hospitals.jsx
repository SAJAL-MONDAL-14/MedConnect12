import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Pause,
  FileText,
  Image as ImageIcon,
  MapPin,
  Mail,
  Phone,
  Download,
  X,
  Send,
} from "lucide-react";
import {
  listApplications,
  getApplication,
  updateStatus,
  STATUS,
  STATUS_META,
  getAudit,
  listEmails,
  sendMockEmail,
  EMAIL_TEMPLATES,
} from "@/lib/hospitalRegistry";

const FILTERS = ["ALL", ...Object.keys(STATUS)];

export default function AdminHospitals() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const refresh = () => setItems(listApplications());
  useEffect(() => {
    document.title = "Hospital applications — Admin";
    refresh();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((a) => {
        if (filter !== "ALL" && a.status !== filter) return false;
        if (!q) return true;
        const s = q.toLowerCase();
        return [a.id, a.profile.hospitalName, a.profile.city, a.profile.email]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(s));
      }),
    [items, q, filter],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm font-bold">Hospital Applications</span>
          </div>
          <div className="text-xs text-muted-foreground">{items.length} total</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-md border border-border bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent py-2 text-sm outline-none"
              placeholder="Search hospital, city, email, ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            {FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : STATUS_META[s]?.label || s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Building2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No applications match.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2">Hospital</th>
                  <th className="text-left px-4 py-2">Location</th>
                  <th className="text-left px-4 py-2">Submitted</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const meta = STATUS_META[a.status] || { label: a.status, tone: "muted" };
                  return (
                    <tr
                      key={a.id}
                      className="border-t border-border hover:bg-secondary/40 cursor-pointer"
                      onClick={() => setSelectedId(a.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{a.profile.hospitalName || "—"}</div>
                        <div className="text-xs text-muted-foreground font-mono">{a.id}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {[a.profile.city, a.profile.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(a.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge meta={meta} />
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-primary">Review →</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {selectedId && (
        <DetailDrawer
          id={selectedId}
          onClose={() => {
            setSelectedId(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ meta }) {
  const tone = meta.tone;
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wide rounded px-2 py-0.5 bg-${tone}-soft text-${tone}`}
    >
      {meta.label}
    </span>
  );
}

function DetailDrawer({ id, onClose }) {
  const [app, setApp] = useState(() => getApplication(id));
  const [tab, setTab] = useState("overview");
  const [zoom, setZoom] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'info' | 'suspend'
  const [reason, setReason] = useState("");

  const refresh = () => setApp(getApplication(id));

  if (!app) return null;
  const meta = STATUS_META[app.status];

  const applyAction = () => {
    const a = app;
    if (actionModal === "approve") {
      const t = EMAIL_TEMPLATES.approved(a);
      sendMockEmail({
        to: a.profile.adminEmail,
        subject: t.subject,
        body: t.body,
        applicationId: a.id,
      });
      updateStatus(a.id, STATUS.APPROVED, { note: "Approved by admin" });
    } else if (actionModal === "reject") {
      const t = EMAIL_TEMPLATES.rejected(a, reason);
      sendMockEmail({
        to: a.profile.adminEmail,
        subject: t.subject,
        body: t.body,
        applicationId: a.id,
      });
      updateStatus(a.id, STATUS.REJECTED, { rejectionReason: reason });
    } else if (actionModal === "info") {
      const t = EMAIL_TEMPLATES.moreInfo(a, reason);
      sendMockEmail({
        to: a.profile.adminEmail,
        subject: t.subject,
        body: t.body,
        applicationId: a.id,
      });
      updateStatus(a.id, STATUS.UNDER_REVIEW, { requestNotes: reason });
    } else if (actionModal === "suspend") {
      const t = EMAIL_TEMPLATES.suspended(a, reason);
      sendMockEmail({
        to: a.profile.adminEmail,
        subject: t.subject,
        body: t.body,
        applicationId: a.id,
      });
      updateStatus(a.id, STATUS.SUSPENDED, { rejectionReason: reason });
    }
    setActionModal(null);
    setReason("");
    refresh();
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "facility", label: "Facility" },
    { id: "documents", label: "Documents" },
    { id: "photos", label: "Photos" },
    { id: "location", label: "Location" },
    { id: "audit", label: "Audit & emails" },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl h-full bg-background shadow-elevated flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-border p-5 flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold truncate">{app.profile.hospitalName || "—"}</h2>
              <StatusBadge meta={meta} />
            </div>
            <div className="text-xs text-muted-foreground font-mono">{app.id}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-5 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "overview" && <OverviewTab app={app} />}
          {tab === "facility" && <FacilityTab app={app} />}
          {tab === "documents" && <DocumentsTab app={app} />}
          {tab === "photos" && <PhotosTab app={app} onZoom={setZoom} />}
          {tab === "location" && <LocationTab app={app} />}
          {tab === "audit" && <AuditTab app={app} />}
        </div>

        {/* Actions */}
        <div className="border-t border-border p-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActionModal("approve")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md bg-success text-success-foreground hover:bg-success-dark"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={() => setActionModal("info")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md bg-warning text-warning-foreground"
          >
            <AlertTriangle className="h-4 w-4" /> Request info
          </button>
          <button
            onClick={() => setActionModal("reject")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md bg-emergency text-emergency-foreground"
          >
            <XCircle className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => setActionModal("suspend")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md border border-border bg-card"
          >
            <Pause className="h-4 w-4" /> Suspend
          </button>
        </div>

        {actionModal && (
          <div
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setActionModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl bg-card border border-border p-5"
            >
              <h3 className="text-base font-bold mb-1">
                {actionModal === "approve"
                  ? "Approve application"
                  : actionModal === "reject"
                    ? "Reject application"
                    : actionModal === "info"
                      ? "Request more information"
                      : "Suspend hospital"}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                An email will be sent to <span className="font-mono">{app.profile.adminEmail}</span>
                .
              </p>
              {actionModal !== "approve" && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Type message to hospital…"
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary mb-3"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActionModal(null)}
                  className="px-3 py-2 text-xs rounded-md border border-border bg-card"
                >
                  Cancel
                </button>
                <button
                  onClick={applyAction}
                  className="px-3 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Send & save
                </button>
              </div>
            </div>
          </div>
        )}

        {zoom && (
          <div
            onClick={() => setZoom(null)}
            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          >
            <img src={zoom} alt="" className="max-h-full max-w-full rounded-lg" />
          </div>
        )}
      </aside>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className="font-medium truncate">{v || "—"}</div>
    </div>
  );
}

function OverviewTab({ app }) {
  const p = app.profile;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <KV k="Type" v={p.hospitalType} />
        <KV k="Reg #" v={p.regNumber} />
        <KV k="Clinical Reg #" v={p.clinicalRegNumber} />
        <KV k="NABH" v={p.nabhNumber} />
        <KV
          k="Email"
          v={
            <span className="inline-flex items-center gap-1">
              {p.email} {app.emailVerified && <CheckCircle2 className="h-3 w-3 text-success" />}
            </span>
          }
        />
        <KV
          k="Phone"
          v={
            <span className="inline-flex items-center gap-1">
              {p.phone} {app.phoneVerified && <CheckCircle2 className="h-3 w-3 text-success" />}
            </span>
          }
        />
        <KV
          k="Website"
          v={
            p.website ? (
              <a
                href={p.website}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {p.website}
              </a>
            ) : (
              "—"
            )
          }
        />
        <KV k="PIN" v={p.pincode} />
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-1">Address</div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          {p.address}, {p.city}, {p.district}, {p.state}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-1">Administrator</div>
        <div className="grid grid-cols-3 gap-2">
          <KV k="Name" v={p.adminName} />
          <KV k="Email" v={p.adminEmail} />
          <KV k="Phone" v={p.adminPhone} />
        </div>
      </div>
      {app.rejectionReason && (
        <div className="rounded-md border border-emergency/30 bg-emergency-soft p-3 text-xs text-emergency">
          <strong>Rejection reason:</strong> {app.rejectionReason}
        </div>
      )}
      {app.requestNotes && (
        <div className="rounded-md border border-warning/30 bg-warning-soft p-3 text-xs text-warning">
          <strong>Notes to hospital:</strong> {app.requestNotes}
        </div>
      )}
    </div>
  );
}

function FacilityTab({ app }) {
  const f = app.facility;
  const num = [
    ["totalBeds", "Total beds"],
    ["icuBeds", "ICU"],
    ["emergencyBeds", "Emergency"],
    ["ventilators", "Ventilators"],
    ["ambulances", "Ambulances"],
    ["operationTheatres", "OT"],
    ["doctors", "Doctors"],
    ["nurses", "Nurses"],
    ["supportStaff", "Support staff"],
  ];
  const bools = [
    ["emergency24x7", "24x7 Emergency"],
    ["pharmacy", "Pharmacy"],
    ["laboratory", "Lab"],
    ["bloodBank", "Blood bank"],
    ["icu", "ICU"],
    ["nicu", "NICU"],
    ["dialysis", "Dialysis"],
    ["mri", "MRI"],
    ["ctScan", "CT scan"],
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {num.map(([k, l]) => (
          <KV key={k} k={l} v={f[k] ?? "—"} />
        ))}
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-1">Departments</div>
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          {f.departments || "—"}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {bools.map(([k, l]) => (
          <div
            key={k}
            className={`rounded-md border px-3 py-2 text-xs flex items-center justify-between ${f[k] ? "border-success/40 bg-success-soft text-success" : "border-border bg-card text-muted-foreground"}`}
          >
            <span>{l}</span>
            {f[k] ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsTab({ app }) {
  const entries = Object.entries(app.documents);
  if (entries.length === 0)
    return <div className="text-sm text-muted-foreground">No documents uploaded.</div>;
  return (
    <div className="space-y-2">
      {entries.map(([k, f]) => (
        <div
          key={k}
          className="rounded-lg border border-border bg-card p-3 flex items-center gap-3"
        >
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{k}</div>
            <div className="text-xs text-muted-foreground truncate">
              {f.name} • {(f.size / 1024).toFixed(0)} KB
            </div>
          </div>
          <a
            href={f.dataUrl}
            download={f.name}
            className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      ))}
    </div>
  );
}

function PhotosTab({ app, onZoom }) {
  const entries = Object.entries(app.photos).filter(([, arr]) => arr?.length);
  if (entries.length === 0)
    return <div className="text-sm text-muted-foreground">No photos uploaded.</div>;
  return (
    <div className="space-y-4">
      {entries.map(([label, arr]) => (
        <div key={label}>
          <div className="text-xs font-semibold mb-1.5">
            {label} <span className="text-muted-foreground font-normal">({arr.length})</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {arr.map((p, i) => (
              <img
                key={i}
                src={p.dataUrl}
                alt=""
                onClick={() => onZoom(p.dataUrl)}
                className="aspect-square object-cover rounded cursor-zoom-in border border-border"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LocationTab({ app }) {
  const l = app.location;
  if (!l.latitude)
    return <div className="text-sm text-muted-foreground">Location not provided.</div>;
  const link = `https://www.google.com/maps?q=${l.latitude},${l.longitude}`;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <KV k="Latitude" v={l.latitude} />
        <KV k="Longitude" v={l.longitude} />
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <MapPin className="h-4 w-4" /> Open in Google Maps ↗
      </a>
      <div className="map-bg rounded-lg h-64 border border-border" />
    </div>
  );
}

function AuditTab({ app }) {
  const audit = getAudit(app.id);
  const emails = listEmails(app.id);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          Emails sent
        </h3>
        {emails.length === 0 ? (
          <div className="text-xs text-muted-foreground">No emails sent yet.</div>
        ) : (
          <div className="space-y-2">
            {emails.map((e) => (
              <div key={e.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>→ {e.to}</span>
                  <span>{new Date(e.sentAt).toLocaleString()}</span>
                </div>
                <div className="text-sm font-semibold mt-1">{e.subject}</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap mt-1 font-sans">
                  {e.body}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          Audit log
        </h3>
        <div className="space-y-1">
          {audit.map((a) => (
            <div key={a.id} className="text-xs flex gap-3">
              <span className="text-muted-foreground w-36 shrink-0">
                {new Date(a.at).toLocaleString()}
              </span>
              <span className="font-semibold">{a.action}</span>
              <span className="text-muted-foreground">{a.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
