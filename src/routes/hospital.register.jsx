import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2, FileText, Camera, MapPin, ShieldCheck, Mail, Phone,
  CheckCircle2, Upload, X, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import {
  createApplication, saveApplication, issueOtp, verifyOtp,
  sendMockEmail, EMAIL_TEMPLATES, STATUS,
} from "@/lib/hospitalRegistry";

const HOSPITAL_TYPES = [
  "Government", "Private", "Clinic", "Nursing Home",
  "Diagnostic Center", "Medical College", "Specialty Hospital", "Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const DEPARTMENT_OPTIONS = [
  "Cardiology","Neurology","Orthopedics","Pediatrics","Gynecology","Oncology","Dermatology","Psychiatry",
  "Radiology","Pathology","Emergency Medicine","General Surgery","Internal Medicine","Urology","ENT",
  "Ophthalmology","Nephrology","Pulmonology","Gastroenterology","Endocrinology",
];


const REQUIRED_DOCS = [
  { key: "regCert",      label: "Hospital Registration Certificate", required: true },
  { key: "clinicalCert", label: "Clinical Establishment Certificate", required: true },
  { key: "letterhead",   label: "Hospital Letterhead",               required: true },
  { key: "logo",         label: "Hospital Logo",                     required: true },
  { key: "nabhCert",     label: "NABH Certificate",                  required: false },
  { key: "gstCert",      label: "GST Certificate",                   required: false },
  { key: "panCard",      label: "PAN Card",                          required: false },
  { key: "fireSafety",   label: "Fire Safety Certificate",           required: false },
  { key: "pollution",    label: "Pollution Clearance",               required: false },
  { key: "wasteCert",    label: "Medical Waste Mgmt Certificate",    required: false },
];

const REQUIRED_PHOTOS = [
  "Hospital Front Entrance", "Reception Area", "OPD Waiting Area", "General Ward",
  "Private Cabin Rooms", "ICU Ward", "Emergency Department", "Operation Theatre",
  "Pharmacy", "Laboratory", "Ambulance", "Doctor Consultation Room",
  "Nursing Station", "Hospital Beds", "Washroom Facilities",
];
const OPTIONAL_PHOTOS = ["MRI Room", "CT Scan Room", "Dialysis Unit", "NICU", "PICU", "Blood Bank", "Cafeteria"];

const STEPS = [
  { id: "profile",   label: "Hospital",   icon: Building2 },
  { id: "facility",  label: "Facility",   icon: ShieldCheck },
  { id: "documents", label: "Documents",  icon: FileText },
  { id: "photos",    label: "Photos",     icon: Camera },
  { id: "location",  label: "Location",   icon: MapPin },
  { id: "verify",    label: "Verify",     icon: Mail },
  { id: "review",    label: "Submit",     icon: CheckCircle2 },
];

const MAX_FILE = 10 * 1024 * 1024;

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function HospitalRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [app, setApp]   = useState(() => createApplication());
  const [zoomSrc, setZoomSrc] = useState(null);

  useEffect(() => { document.title = "Register your hospital — MedConnect"; }, []);

  const update = (patch) => {
    const next = { ...app, ...patch, updatedAt: Date.now() };
    setApp(next); saveApplication(next);
  };
  const updateField = (group, field, value) =>
    update({ [group]: { ...app[group], [field]: value } });

  const canNext = useMemo(() => validateStep(STEPS[step].id, app), [step, app]);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const finalApp = { ...app, status: STATUS.PENDING_FACILITY_REVIEW, submittedAt: Date.now() };
    saveApplication(finalApp);
    const t = EMAIL_TEMPLATES.received(finalApp);
    if (finalApp.profile.adminEmail) {
      sendMockEmail({ to: finalApp.profile.adminEmail, subject: t.subject, body: t.body, applicationId: finalApp.id });
    }
    navigate(`/hospital/register/success?id=${finalApp.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold tracking-tight">MedConnect</Link>
          <div className="text-xs text-muted-foreground">Application ID: <span className="font-mono">{app.id}</span></div>
        </div>
      </header>

      {/* Stepper */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const active = i === step, done = i < step;
            return (
              <div key={s.id} className="flex items-center gap-2 shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition ${
                  active ? "bg-primary text-primary-foreground border-primary"
                  : done  ? "bg-success text-success-foreground border-success"
                          : "bg-card text-muted-foreground border-border"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {STEPS[step].id === "profile"   && <ProfileStep   app={app} updateField={updateField} />}
          {STEPS[step].id === "facility"  && <FacilityStep  app={app} updateField={updateField} />}
          {STEPS[step].id === "documents" && <DocumentsStep app={app} update={update} />}
          {STEPS[step].id === "photos"    && <PhotosStep    app={app} update={update} onZoom={setZoomSrc} />}
          {STEPS[step].id === "location"  && <LocationStep  app={app} updateField={updateField} />}
          {STEPS[step].id === "verify"    && <VerifyStep    app={app} update={update} />}
          {STEPS[step].id === "review"    && <ReviewStep    app={app} />}
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={prev} disabled={step === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={!canNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={!canSubmit(app)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-md bg-success text-success-foreground hover:bg-success-dark disabled:opacity-40 disabled:cursor-not-allowed">
              Submit application <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </main>

      {/* Zoom modal */}
      {zoomSrc && (
        <div onClick={() => setZoomSrc(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <img src={zoomSrc} alt="" className="max-h-full max-w-full rounded-lg shadow-elevated" />
          <button className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep(id, app) {
  const p = app.profile, f = app.facility, l = app.location;
  switch (id) {
    case "profile":
      return !!(p.hospitalName && p.hospitalType && p.regNumber && p.clinicalRegNumber
        && p.email && /\S+@\S+\.\S+/.test(p.email) && p.phone && p.address
        && p.state && p.district && p.city && p.pincode
        && p.adminName && p.adminEmail && p.adminPhone);
    case "facility":
      return !!(f.totalBeds && f.icuBeds !== undefined && f.doctors && f.nurses && f.departments);
    case "documents":
      return REQUIRED_DOCS.filter((d) => d.required).every((d) => app.documents[d.key]);
    case "photos": {
      const count = Object.values(app.photos || {}).reduce((s, arr) => s + (arr?.length || 0), 0);
      const required = REQUIRED_PHOTOS.every((label) => (app.photos[label]?.length || 0) > 0);
      return required && count >= 10;
    }
    case "location":
      return !!(l.latitude && l.longitude);
    case "verify":
      return app.emailVerified && app.phoneVerified;
    case "review":
      return canSubmit(app);
    default: return true;
  }
}
function canSubmit(app) {
  return ["profile", "facility", "documents", "photos", "location", "verify"].every((s) => validateStep(s, app));
}

// ─── Step components ──────────────────────────────────────────────────────────
function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label} {required && <span className="text-emergency">*</span>}
      </label>
      {children}
    </div>
  );
}
const inputCls = "w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary";

function ProfileStep({ app, updateField }) {
  const p = app.profile;
  const set = (k) => (e) => updateField("profile", k, e.target.value);
  return (
    <>
      <StepHeader icon={Building2} title="Hospital registration" subtitle="Official identity and contact details." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hospital name" required><input className={inputCls} value={p.hospitalName || ""} onChange={set("hospitalName")} /></Field>
        <Field label="Hospital type" required>
          <select className={inputCls} value={p.hospitalType || ""} onChange={set("hospitalType")}>
            <option value="">Select…</option>
            {HOSPITAL_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Hospital Registration Number" required><input className={inputCls} value={p.regNumber || ""} onChange={set("regNumber")} /></Field>
        <Field label="Clinical Establishment Reg. No." required><input className={inputCls} value={p.clinicalRegNumber || ""} onChange={set("clinicalRegNumber")} /></Field>
        <Field label="NABH Accreditation No."><input className={inputCls} value={p.nabhNumber || ""} onChange={set("nabhNumber")} /></Field>
        <Field label="GST Number"><input className={inputCls} value={p.gstNumber || ""} onChange={set("gstNumber")} /></Field>
        <Field label="PAN Number"><input className={inputCls} value={p.panNumber || ""} onChange={set("panNumber")} /></Field>
        <Field label="Website"><input className={inputCls} placeholder="https://" value={p.website || ""} onChange={set("website")} /></Field>
        <Field label="Official email" required><input type="email" className={inputCls} value={p.email || ""} onChange={set("email")} /></Field>
        <Field label="Official phone" required><input className={inputCls} value={p.phone || ""} onChange={set("phone")} /></Field>
        <div className="sm:col-span-2"><Field label="Complete address" required>
          <textarea rows={2} className={inputCls} value={p.address || ""} onChange={set("address")} /></Field></div>
        <Field label="State" required>
          <select className={inputCls} value={p.state || ""} onChange={set("state")}>
            <option value="">Select…</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="District" required><input className={inputCls} value={p.district || ""} onChange={set("district")} /></Field>
        <Field label="City" required><input className={inputCls} value={p.city || ""} onChange={set("city")} /></Field>
        <Field label="PIN code" required><input className={inputCls} value={p.pincode || ""} onChange={set("pincode")} /></Field>
      </div>
      <h3 className="text-sm font-semibold mt-8 mb-3">Hospital administrator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Name" required><input className={inputCls} value={p.adminName || ""} onChange={set("adminName")} /></Field>
        <Field label="Email" required><input type="email" className={inputCls} value={p.adminEmail || ""} onChange={set("adminEmail")} /></Field>
        <Field label="Phone" required><input className={inputCls} value={p.adminPhone || ""} onChange={set("adminPhone")} /></Field>
      </div>
    </>
  );
}

function FacilityStep({ app, updateField }) {
  const f = app.facility;
  const num = (k) => (e) => updateField("facility", k, e.target.value === "" ? "" : Number(e.target.value));
  const txt = (k) => (e) => updateField("facility", k, e.target.value);
  const bool = (k) => (e) => updateField("facility", k, e.target.checked);
  const numFields = [
    ["totalBeds", "Total beds"], ["icuBeds", "ICU beds"], ["emergencyBeds", "Emergency beds"],
    ["ventilators", "Ventilators"], ["ambulances", "Ambulances"], ["operationTheatres", "OT count"],
    ["doctors", "Doctors"], ["nurses", "Nurses"], ["supportStaff", "Support staff"],
  ];
  const boolFields = [
    ["emergency24x7", "24x7 Emergency"], ["pharmacy", "Pharmacy"], ["laboratory", "Laboratory"],
    ["bloodBank", "Blood bank"], ["icu", "ICU"], ["nicu", "NICU"],
    ["dialysis", "Dialysis"], ["mri", "MRI"], ["ctScan", "CT scan"],
  ];
  return (
    <>
      <StepHeader icon={ShieldCheck} title="Facility information" subtitle="Capacity, staff, and services." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {numFields.map(([k, l]) => (
          <Field key={k} label={l} required={["totalBeds","icuBeds","doctors","nurses"].includes(k)}>
            <input type="number" min={0} className={inputCls} value={f[k] ?? ""} onChange={num(k)} />
          </Field>
        ))}
      </div>
      <div className="mt-6">
        <label className="block text-xs font-medium text-muted-foreground mb-2">
          Available departments <span className="text-emergency">*</span>
        </label>
        {(() => {
          const selected = (f.departments || "").split(",").map((s) => s.trim()).filter(Boolean);
          const toggle = (dep) => {
            const set = new Set(selected);
            set.has(dep) ? set.delete(dep) : set.add(dep);
            updateField("facility", "departments", Array.from(set).join(", "));
          };
          return (
            <div className="flex flex-wrap gap-2">
              {DEPARTMENT_OPTIONS.map((dep) => {
                const on = selected.includes(dep);
                return (
                  <button
                    type="button"
                    key={dep}
                    onClick={() => toggle(dep)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      on
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {dep}
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>
      <h3 className="text-sm font-semibold mt-8 mb-3">Available services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {boolFields.map(([k, l]) => {
          const on = !!f[k];
          return (
            <button
              type="button"
              key={k}
              onClick={() => updateField("facility", k, !on)}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm hover:bg-secondary text-left"
            >
              <span className="font-medium">{l}</span>
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                  on ? "bg-success" : "bg-muted"
                }`}
                aria-hidden
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                    on ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

    </>
  );
}

function DocumentsStep({ app, update }) {
  const onPick = async (key, file) => {
    if (!file) return;
    if (file.size > MAX_FILE) { alert("Max 10 MB per file."); return; }
    if (!/^(application\/pdf|image\/(jpe?g|png))$/.test(file.type)) { alert("PDF, JPG or PNG only."); return; }
    const dataUrl = await fileToDataUrl(file);
    update({ documents: { ...app.documents, [key]: { name: file.name, size: file.size, type: file.type, dataUrl, uploadedAt: Date.now() } } });
  };
  const remove = (key) => {
    const next = { ...app.documents }; delete next[key];
    update({ documents: next });
  };
  return (
    <>
      <StepHeader icon={FileText} title="Documents" subtitle="PDF, JPG or PNG • Max 10 MB each." />
      <div className="space-y-2">
        {REQUIRED_DOCS.map((d) => {
          const file = app.documents[d.key];
          return (
            <div key={d.key} className={`rounded-lg border p-3 flex items-center gap-3 ${file ? "border-success/40 bg-success-soft/30" : "border-border bg-card"}`}>
              <FileText className={`h-5 w-5 ${file ? "text-success" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{d.label} {d.required && <span className="text-emergency">*</span>}</div>
                {file && <div className="text-xs text-muted-foreground truncate">{file.name} • {(file.size/1024).toFixed(0)} KB</div>}
              </div>
              {file ? (
                <button onClick={() => remove(d.key)} className="text-xs text-emergency hover:underline">Remove</button>
              ) : (
                <label className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" /> Upload
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onPick(d.key, e.target.files?.[0])} />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function PhotosStep({ app, update, onZoom }) {
  const onPick = async (label, files) => {
    const arr = [...(app.photos[label] || [])];
    for (const file of files) {
      if (file.size > MAX_FILE) { alert(`${file.name} > 10MB`); continue; }
      if (!/^image\/(jpe?g|png)$/.test(file.type)) { alert("JPG or PNG only"); continue; }
      arr.push({ name: file.name, dataUrl: await fileToDataUrl(file), uploadedAt: Date.now() });
    }
    update({ photos: { ...app.photos, [label]: arr } });
  };
  const remove = (label, i) => {
    const arr = [...(app.photos[label] || [])]; arr.splice(i, 1);
    update({ photos: { ...app.photos, [label]: arr } });
  };
  const total = Object.values(app.photos).reduce((s, a) => s + (a?.length || 0), 0);
  return (
    <>
      <StepHeader icon={Camera} title="Facility photos" subtitle={`JPG/PNG • Max 10MB each • Minimum 10 photos • You have ${total}`} />
      <PhotoGrid title="Required" labels={REQUIRED_PHOTOS} app={app} onPick={onPick} onRemove={remove} onZoom={onZoom} required />
      <h3 className="text-sm font-semibold mt-8 mb-3">Optional</h3>
      <PhotoGrid title="Optional" labels={OPTIONAL_PHOTOS} app={app} onPick={onPick} onRemove={remove} onZoom={onZoom} />
    </>
  );
}

function PhotoGrid({ labels, app, onPick, onRemove, onZoom, required }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {labels.map((label) => {
        const arr = app.photos[label] || [];
        return (
          <div key={label} className={`rounded-lg border p-3 ${arr.length > 0 ? "border-success/40 bg-success-soft/30" : "border-border bg-card"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">{label} {required && arr.length === 0 && <span className="text-emergency">*</span>}</div>
              <label className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" /> Add
                <input type="file" multiple className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => onPick(label, e.target.files || [])} />
              </label>
            </div>
            {arr.length > 0 ? (
              <div className="grid grid-cols-3 gap-1.5">
                {arr.map((p, i) => (
                  <div key={i} className="relative group aspect-square rounded overflow-hidden bg-secondary">
                    <img src={p.dataUrl} alt="" onClick={() => onZoom(p.dataUrl)} className="h-full w-full object-cover cursor-zoom-in" />
                    <button onClick={() => onRemove(label, i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : <div className="text-xs text-muted-foreground">No photos yet</div>}
          </div>
        );
      })}
    </div>
  );
}

function LocationStep({ app, updateField }) {
  const l = app.location;
  const set = (k) => (e) => updateField("location", k, e.target.value);
  const useMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      updateField("location", "latitude",  pos.coords.latitude.toFixed(6));
      updateField("location", "longitude", pos.coords.longitude.toFixed(6));
    });
  };
  const mapLink = l.latitude && l.longitude ? `https://www.google.com/maps?q=${l.latitude},${l.longitude}` : null;
  return (
    <>
      <StepHeader icon={MapPin} title="Location" subtitle="Pin your hospital so patients can find you." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Latitude" required><input className={inputCls} value={l.latitude || ""} onChange={set("latitude")} /></Field>
        <Field label="Longitude" required><input className={inputCls} value={l.longitude || ""} onChange={set("longitude")} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={useMe} className="text-xs font-semibold rounded-md border border-border bg-card px-3 py-2 hover:bg-secondary">Use my current location</button>
        {mapLink && <a target="_blank" rel="noreferrer" href={mapLink} className="text-xs font-semibold rounded-md bg-primary-soft text-primary px-3 py-2 hover:bg-primary-soft/70">Open in Google Maps ↗</a>}
      </div>
      <div className="mt-6 map-bg rounded-lg h-64 border border-border flex items-center justify-center text-sm text-muted-foreground">
        {mapLink ? `Pinned: ${l.latitude}, ${l.longitude}` : "Map preview"}
      </div>
    </>
  );
}

function VerifyStep({ app, update }) {
  return (
    <>
      <StepHeader icon={Mail} title="Verify contact" subtitle="We sent codes to your official email and phone." />
      <div className="grid gap-4">
        <OtpBlock
          icon={Mail} label="Email"
          target={app.profile.email}
          scope="email"
          verified={app.emailVerified}
          onVerified={() => update({ emailVerified: true })}
        />
        <OtpBlock
          icon={Phone} label="Phone"
          target={app.profile.phone}
          scope="phone"
          verified={app.phoneVerified}
          onVerified={() => update({ phoneVerified: true })}
        />
      </div>
    </>
  );
}

function OtpBlock({ icon: Icon, label, target, scope, verified, onVerified }) {
  const [sent, setSent]   = useState(false);
  const [code, setCode]   = useState("");
  const [shown, setShown] = useState(null);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  const send = () => {
    if (!target) { setError(`No ${label.toLowerCase()} on file`); return; }
    setBusy(true);
    setTimeout(() => {
      const c = issueOtp(scope, target);
      setShown(c); setSent(true); setBusy(false); setError("");
    }, 500);
  };
  const check = () => {
    if (verifyOtp(scope, target, code)) onVerified();
    else setError("Incorrect code. Try again.");
  };

  return (
    <div className={`rounded-lg border p-4 ${verified ? "border-success/40 bg-success-soft/30" : "border-border bg-card"}`}>
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${verified ? "bg-success text-success-foreground" : "bg-primary-soft text-primary"}`}>
          {verified ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">{label} verification</div>
          <div className="text-xs text-muted-foreground truncate">{target || "—"}</div>
        </div>
        {verified ? <span className="text-xs font-semibold text-success">Verified</span>
          : !sent ? (
            <button onClick={send} disabled={busy} className="text-xs font-semibold rounded-md bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary-dark disabled:opacity-50">
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send code"}
            </button>
          ) : null}
      </div>
      {sent && !verified && (
        <div className="mt-3 space-y-2">
          <div className="rounded bg-warning-soft text-warning text-[11px] px-2 py-1 inline-block">
            Demo OTP: <span className="font-mono font-bold">{shown}</span>
          </div>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" maxLength={6}
              className={`${inputCls} font-mono tracking-widest`} />
            <button onClick={check} className="text-xs font-semibold rounded-md bg-primary text-primary-foreground px-4 hover:bg-primary-dark">Verify</button>
            <button onClick={send} className="text-xs text-primary hover:underline">Resend</button>
          </div>
          {error && <div className="text-xs text-emergency">{error}</div>}
        </div>
      )}
    </div>
  );
}

function ReviewStep({ app }) {
  const docCount = Object.keys(app.documents).length;
  const photoCount = Object.values(app.photos).reduce((s, a) => s + (a?.length || 0), 0);
  return (
    <>
      <StepHeader icon={CheckCircle2} title="Review & submit" subtitle="Make sure everything looks right before sending to our review team." />
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <Row k="Hospital" v={app.profile.hospitalName} />
        <Row k="Type" v={app.profile.hospitalType} />
        <Row k="Reg #" v={app.profile.regNumber} />
        <Row k="City / State" v={`${app.profile.city || "—"}, ${app.profile.state || "—"}`} />
        <Row k="Admin" v={`${app.profile.adminName || "—"} • ${app.profile.adminEmail || "—"}`} />
        <Row k="Beds (Total / ICU)" v={`${app.facility.totalBeds || 0} / ${app.facility.icuBeds || 0}`} />
        <Row k="Doctors / Nurses" v={`${app.facility.doctors || 0} / ${app.facility.nurses || 0}`} />
        <Row k="Documents uploaded" v={`${docCount} files`} />
        <Row k="Photos uploaded" v={`${photoCount} photos`} />
        <Row k="Location" v={app.location.latitude ? `${app.location.latitude}, ${app.location.longitude}` : "—"} />
        <Row k="Email verified" v={app.emailVerified ? "Yes" : "No"} />
        <Row k="Phone verified" v={app.phoneVerified ? "Yes" : "No"} />
      </dl>
      <div className="mt-6 rounded-lg border border-primary/30 bg-primary-soft p-4 text-sm text-primary">
        On submit, your application enters <span className="font-bold">Pending facility review</span>. Our team will email you the outcome.
      </div>
    </>
  );
}
function Row({ k, v }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className="font-medium truncate">{v || "—"}</div>
    </div>
  );
}