// Admin-side: Hospital Admin reviews pending doctor onboarding applications
import { useState, useEffect } from "react";
import {
  CheckCircle2, X, AlertCircle, ChevronRight,
  Mail, Phone, Award, FileText, CreditCard,
  Building2, Clock, Star, User, MessageSquare, Eye,
  Stethoscope, Download
} from "lucide-react";

const INITIAL_APPLICATIONS = [
  {
    id: "app1",
    status: "under_review",
    submittedAt: "2025-05-02T09:30:00Z",
    // Personal
    fullName: "Dr. Kavya Reddy",
    email: "dr.kavya@nbmc.in",
    phone: "+91 98765 12345",
    dob: "1988-04-15",
    gender: "Female",
    // Professional
    specialty: "Neurologist",
    experience: "14",
    regNo: "MCI-2010-88432",
    qualifications: "MBBS, MD Neurology, DM Neurology",
    isSurgeon: false,
    opdRoom: "OPD Block, Room 7",
    fee: "700",
    followupFee: "400",
    bio: "Senior neurologist specialising in epilepsy and movement disorders.",
    // Bank
    bankName: "HDFC Bank",
    accountNo: "••••••••3892",
    ifsc: "HDFC0001234",
    pan: "ABCDE1234F",
    // Docs
    photo: "kavya_photo.jpg",
    regDoc: "mci_registration.pdf",
    degreeDoc: "dm_neurology.pdf",
    idDoc: "aadhar_card.pdf",
  },
  {
    id: "app2",
    status: "under_review",
    submittedAt: "2025-05-01T14:20:00Z",
    fullName: "Dr. Amit Banerjee",
    email: "dr.amit@nbmc.in",
    phone: "+91 98765 67890",
    dob: "1980-11-22",
    gender: "Male",
    specialty: "Orthopedic",
    experience: "20",
    regNo: "MCI-2004-22890",
    qualifications: "MBBS, MS Orthopaedics, Fellowship Joint Replacement",
    isSurgeon: true,
    opdRoom: "OPD Block, Room 3",
    fee: "800",
    followupFee: "500",
    bio: "Orthopaedic surgeon with expertise in knee and hip replacement.",
    bankName: "SBI",
    accountNo: "••••••••7721",
    ifsc: "SBIN0002345",
    pan: "XYZAB9876G",
    photo: "amit_photo.jpg",
    regDoc: "mci_reg_amit.pdf",
    degreeDoc: "ms_ortho.pdf",
    idDoc: "",
  },
  {
    id: "app3",
    status: "approved",
    submittedAt: "2025-04-28T11:10:00Z",
    fullName: "Dr. Rajesh Sharma",
    email: "dr.sharma@nbmc.in",
    phone: "+91 98765 11111",
    specialty: "Cardiologist",
    experience: "18",
    regNo: "MCI-2006-11234",
    qualifications: "MBBS, MD Cardiology, DM Cardiology",
    isSurgeon: false,
    opdRoom: "OPD Block, Room 4",
    fee: "500",
    followupFee: "300",
    bio: "",
    bankName: "SBI",
    accountNo: "••••••••4512",
    ifsc: "SBIN0001234",
    pan: "PQRST5678H",
    photo: "sharma_photo.jpg",
    regDoc: "mci_sharma.pdf",
    degreeDoc: "dm_cardio.pdf",
    idDoc: "pan_card.pdf",
  },
];

const STATUS_CONFIG = {
  under_review:       { label: "Under Review",        bg: "bg-warning-soft text-warning"    },
  approved:           { label: "Approved",             bg: "bg-success-soft text-success"    },
  rejected:           { label: "Rejected",             bg: "bg-emergency-soft text-emergency"},
  changes_requested:  { label: "Changes Requested",   bg: "bg-primary-soft text-primary"    },
  pending_activation: { label: "Pending Activation",  bg: "bg-muted text-muted-foreground"  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.under_review;
  return <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}>{cfg.label}</span>;
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 text-sm border-b border-border last:border-0">
      <span className="text-muted-foreground shrink-0 w-36">{label}</span>
      <span className="font-medium text-foreground text-right">{value || "—"}</span>
    </div>
  );
}

export default function DoctorOnboardingReview() {
  const [apps, setApps]       = useState(INITIAL_APPLICATIONS);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]   = useState("all");
  const [feedback, setFeedback]= useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => { document.title = "Doctor onboarding review — MedConnect"; }, []);

  const counts = {
    all:               apps.length,
    under_review:      apps.filter(a => a.status === "under_review").length,
    approved:          apps.filter(a => a.status === "approved").length,
    rejected:          apps.filter(a => a.status === "rejected").length,
    changes_requested: apps.filter(a => a.status === "changes_requested").length,
  };

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  const updateStatus = (id, status) => {
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
    setShowFeedback(false); setFeedback(""); setPendingAction(null);
  };

  const handleAction = (action) => {
    if (action === "changes_requested" || action === "rejected") {
      setPendingAction(action); setShowFeedback(true);
    } else {
      updateStatus(selected.id, action);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Inline header — used inside admin dashboard as a sub-view */}
      <div className="space-y-4 p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { l: "Total",            v: counts.all,               t: "primary"   },
            { l: "Under Review",     v: counts.under_review,      t: "warning"   },
            { l: "Approved",         v: counts.approved,          t: "success"   },
            { l: "Rejected",         v: counts.rejected,          t: "emergency" },
            { l: "Changes Needed",   v: counts.changes_requested, t: "primary"   },
          ].map(s => (
            <div key={s.l} className="rounded-xl bg-card border border-border p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className={`text-2xl font-bold text-${s.t} mt-1`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold">Doctor onboarding applications</h2>
            <div className="flex gap-1 rounded-md bg-secondary p-1 flex-wrap">
              {["all","under_review","approved","rejected","changes_requested"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition ${filter===f?"bg-card text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
                  {f === "all" ? "All" : f.replace(/_/g," ")}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Stethoscope className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
              <p className="text-sm text-muted-foreground">No applications in this category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Doctor</th>
                    <th className="text-left px-6 py-3 font-medium">Specialty</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Experience</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Submitted</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {a.fullName.split(" ").map(w=>w[0]).join("").slice(1,3)}
                          </div>
                          <div>
                            <div className="font-medium">{a.fullName}</div>
                            <div className="text-xs text-muted-foreground">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {a.specialty}
                        {a.isSurgeon && <span className="ml-1.5 rounded-full bg-warning-soft text-warning px-1.5 py-0.5 text-[10px] font-bold">Surgeon</span>}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{a.experience} yrs</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground hidden md:table-cell">{new Date(a.submittedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => setSelected(a)} className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => { setSelected(null); setShowFeedback(false); }}>
          <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Application review</h3>
                <p className="text-xs text-muted-foreground">Submitted {new Date(selected.submittedAt).toLocaleString()}</p>
              </div>
              <button onClick={() => { setSelected(null); setShowFeedback(false); }} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {selected.fullName.split(" ").map(w=>w[0]).join("").slice(1,3)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selected.fullName}</div>
                  <div className="text-sm text-primary">{selected.specialty} {selected.isSurgeon && "· Surgeon"}</div>
                  <div className="text-xs text-muted-foreground">{selected.experience} yrs experience · ₹{selected.fee} fee</div>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              {/* Info sections */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal</div>
                <Row label="Email"   value={selected.email}  />
                <Row label="Phone"   value={selected.phone}  />
                <Row label="Gender"  value={selected.gender} />
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional</div>
                <Row label="Specialty"       value={selected.specialty}      />
                <Row label="Experience"      value={`${selected.experience} years`} />
                <Row label="Reg. number"     value={selected.regNo}          />
                <Row label="Qualifications"  value={selected.qualifications} />
                <Row label="OPD room"        value={selected.opdRoom}        />
                <Row label="New patient fee" value={`₹${selected.fee}`}     />
                <Row label="Follow-up fee"   value={`₹${selected.followupFee}`} />
                <Row label="Surgeon"         value={selected.isSurgeon ? "Yes" : "No"} />
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bank & Identity</div>
                <Row label="Bank"        value={selected.bankName}   />
                <Row label="Account"     value={selected.accountNo}  />
                <Row label="IFSC"        value={selected.ifsc}       />
                <Row label="PAN"         value={selected.pan}        />
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Documents</div>
                {[
                  { label:"Profile photo",  value: selected.photo    },
                  { label:"MCI registration", value: selected.regDoc },
                  { label:"Degree cert",    value: selected.degreeDoc },
                  { label:"Government ID",  value: selected.idDoc     },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{d.label}</span>
                    {d.value ? (
                      <button className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        <Download className="h-3.5 w-3.5" /> {d.value}
                      </button>
                    ) : (
                      <span className="text-xs text-emergency font-medium">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Feedback box */}
              {showFeedback && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    {pendingAction === "rejected" ? "Reason for rejection *" : "What changes are required? *"}
                  </label>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3}
                    placeholder={pendingAction === "rejected" ? "e.g. Invalid registration number, documents unclear..." : "e.g. Please upload a clearer copy of your degree certificate..."}
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => { setShowFeedback(false); setPendingAction(null); }} className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted">Cancel</button>
                    <button disabled={!feedback.trim()} onClick={() => updateStatus(selected.id, pendingAction)}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-40 ${pendingAction==="rejected"?"bg-emergency text-emergency-foreground":"bg-primary text-primary-foreground"}`}>
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action bar */}
            {!showFeedback && (
              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2 flex-wrap">
                <button onClick={() => { setSelected(null); setShowFeedback(false); }}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Close</button>
                {selected.status !== "approved" && (
                  <>
                    <button onClick={() => handleAction("changes_requested")}
                      className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary-soft inline-flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" /> Request changes
                    </button>
                    <button onClick={() => handleAction("rejected")}
                      className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft inline-flex items-center gap-1.5">
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button onClick={() => handleAction("approved")}
                      className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                  </>
                )}
                {selected.status === "approved" && (
                  <span className="text-xs text-success font-semibold inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Already approved</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}