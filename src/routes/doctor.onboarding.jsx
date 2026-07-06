// ─────────────────────────────────────────────────────────────────────────────
// doctor.onboarding.jsx
// FLOW: Doctor receives email → clicks activation link → lands here
// Completes 5-step profile → submits to hospital admin for review
// ─────────────────────────────────────────────────────────────────────────────
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Navbar";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Upload,
  User, Mail, Phone, Award, FileText, CreditCard,
  Send, AlertCircle, Building2, Stethoscope, Clock,
} from "lucide-react";

const STEPS = [
  { n:1, label:"Personal"        },
  { n:2, label:"Professional"    },
  { n:3, label:"Bank & ID"       },
  { n:4, label:"Documents"       },
  { n:5, label:"Review & Submit" },
];

const SPECIALTIES = [
  "Cardiologist","Neurologist","Orthopedic","Pediatrician","Dermatologist",
  "Gynecologist","Psychiatrist","Urologist","Ophthalmologist","ENT Specialist",
  "General Physician","Radiologist","Pathologist","Pulmonologist",
  "Gastroenterologist","Endocrinologist","Nephrologist","Oncologist",
  "Dentist","Physiotherapist",
];

// Pre-filled from admin's initial entry (simulates data from activation link)
const PRE_FILLED = {
  fullName:      "Dr. Kavya Reddy",
  email:         "dr.kavya@nbmc.in",
  phone:         "+91 98765 12345",
  specialty:     "Neurologist",
  experience:    "14",
  opdRoom:       "OPD Block, Room 7",
  regNo:         "MCI-2010-88432",
  qualifications:"MBBS, MD Neurology",
  hospital:      "North Bengal Medical College",
};

function StepBar({ current }) {
  return (
    <>
    <div className="sm:hidden mb-6 rounded-xl border border-border bg-card p-3 shadow-card">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">Step {current} of {STEPS.length}</span>
        <span className="text-primary font-medium">{STEPS[current - 1].label}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(current / STEPS.length) * 100}%` }} />
      </div>
    </div>
    <div className="hidden sm:flex items-center mb-8 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center shrink-0">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              current > s.n  ? "bg-success text-success-foreground" :
              current === s.n ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"}`}>
              {current > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
            </div>
            <div className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
              current === s.n ? "text-primary" : current > s.n ? "text-success" : "text-muted-foreground"}`}>
              {s.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 rounded transition-all ${current > s.n ? "bg-success" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type="text", required, icon, readOnly }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
        {label}{required && " *"}
        {readOnly && <span className="ml-1.5 text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground">Pre-filled</span>}
      </label>
      <div className={`flex items-center gap-2 rounded-md border px-3 transition ${readOnly ? "border-border bg-secondary" : "border-border bg-input focus-within:border-primary"}`}>
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <input type={type} value={value} onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder} readOnly={readOnly}
          className={`flex-1 bg-transparent py-2.5 text-sm outline-none ${readOnly ? "text-muted-foreground cursor-default" : ""}`} />
      </div>
    </div>
  );
}

function UploadBox({ label, desc, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{label}{required && " *"}</label>
      <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 cursor-pointer transition ${
        value ? "border-success bg-success-soft" : "border-border hover:border-primary bg-secondary"}`}>
        <input type="file" className="hidden" onChange={e => onChange?.(e.target.files[0]?.name || "")} />
        {value ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div className="text-xs font-medium text-success text-center truncate max-w-full px-2">{value}</div>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-muted-foreground" />
            <div className="text-xs text-muted-foreground text-center">{desc}</div>
            <div className="text-[10px] text-muted-foreground">PDF, JPG, PNG · Max 5MB</div>
          </>
        )}
      </label>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between px-4 py-3 text-sm border-b border-border last:border-0">
      <span className="text-muted-foreground shrink-0 w-40">{label}</span>
      <span className="font-medium text-right">{value || <span className="text-muted-foreground italic">Not provided</span>}</span>
    </div>
  );
}

export default function DoctorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep]         = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Personal (some pre-filled from admin's entry)
  const [fullName, setFullName]   = useState(PRE_FILLED.fullName);
  const [email,    setEmail]      = useState(PRE_FILLED.email);
  const [phone,    setPhone]      = useState(PRE_FILLED.phone);
  const [dob,      setDob]        = useState("");
  const [gender,   setGender]     = useState("Female");
  const [address,  setAddress]    = useState("");

  // Step 2 — Professional (some pre-filled)
  const [specialty,      setSpecialty]      = useState(PRE_FILLED.specialty);
  const [experience,     setExperience]     = useState(PRE_FILLED.experience);
  const [regNo,          setRegNo]          = useState(PRE_FILLED.regNo);
  const [qualifications, setQualifications] = useState(PRE_FILLED.qualifications);
  const [isSurgeon,      setIsSurgeon]      = useState(false);
  const [opdRoom,        setOpdRoom]        = useState(PRE_FILLED.opdRoom);
  const [fee,            setFee]            = useState("");
  const [followupFee,    setFollowupFee]    = useState("");
  const [bio,            setBio]            = useState("");

  // Step 3 — Bank & ID
  const [bankName,   setBankName]   = useState("");
  const [accountNo,  setAccountNo]  = useState("");
  const [ifsc,       setIfsc]       = useState("");
  const [pan,        setPan]        = useState("");
  const [passport,   setPassport]   = useState("");

  // Step 4 — Documents
  const [photo,      setPhoto]      = useState("");
  const [regDoc,     setRegDoc]     = useState("");
  const [degreeDoc,  setDegreeDoc]  = useState("");
  const [idDoc,      setIdDoc]      = useState("");
  const [sigDoc,     setSigDoc]     = useState("");

  useEffect(() => { document.title = "Complete your profile — MedConnect"; }, []);

  const canNext = () => {
    if (step === 1) return fullName.trim() && email.trim() && phone.trim();
    if (step === 2) return specialty && experience && regNo && qualifications;
    if (step === 3) return bankName && accountNo && ifsc && (pan || passport);
    if (step === 4) return photo && regDoc && degreeDoc;
    return true;
  };

  // ── Submitted screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-elevated">
          <div className="h-16 w-16 mx-auto rounded-full bg-success-soft flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Profile submitted!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your profile has been sent to <span className="font-semibold text-foreground">{PRE_FILLED.hospital}</span> for review. You'll be notified by email at each stage.
          </p>

          {/* Status timeline */}
          <div className="mt-6 text-left">
            {[
              { label:"Doctor Added",       done:true  },
              { label:"Invitation Sent",    done:true  },
              { label:"Pending Activation", done:true  },
              { label:"Profile Submitted",  done:true  },
              { label:"Under Review",       done:false, current:true  },
              { label:"Approved / Rejected",done:false },
            ].map((s, i, arr) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    s.done ? "bg-success text-success-foreground" :
                    s.current ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"}`}>
                    {s.done ? "✓" : i + 1}
                  </div>
                  {i < arr.length - 1 && <div className={`w-0.5 h-5 ${s.done ? "bg-success" : "bg-border"}`} />}
                </div>
                <div className={`text-sm py-0.5 leading-relaxed ${
                  s.current ? "text-primary font-semibold" :
                  s.done ? "text-muted-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-primary-soft border border-primary/20 text-xs text-primary text-left">
            You can log in anytime to check your approval status and update your profile if changes are requested.
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link to="/hospital-doctor/login"
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition text-center">
              Back to login
            </Link>
            <Link to="/hospital-doctor/dashboard"
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 text-center">
              View dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1.5 min-w-0 max-w-[210px] sm:max-w-none">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium truncate">{PRE_FILLED.hospital}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            <Stethoscope className="h-3.5 w-3.5 text-primary" /> Doctor account activation
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Complete your doctor profile</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Your profile will be reviewed by the hospital admin before your account is fully activated. Fields marked with <span className="text-warning font-semibold">Pre-filled</span> were entered by the admin — you can update them.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <StepBar current={step} />

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-1">Personal details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Dr. Kavya Reddy" required readOnly icon={<User className="h-4 w-4" />} />
                <Field label="Email address" value={email} onChange={setEmail} type="email" required readOnly icon={<Mail className="h-4 w-4" />} />
                <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" required icon={<Phone className="h-4 w-4" />} />
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary">
                    {["Female","Male","Other"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <Field label="Date of birth" value={dob} onChange={setDob} type="date" />
                <Field label="Residential address" value={address} onChange={setAddress} placeholder="123, Hill Cart Road, Siliguri" />
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-1">Professional details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Specialty *</label>
                  <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary">
                    {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field label="Years of experience" value={experience} onChange={setExperience} placeholder="14" required icon={<Clock className="h-4 w-4" />} />
                <Field label="Medical Council Reg. No." value={regNo} onChange={setRegNo} placeholder="MCI-2010-88432" required readOnly icon={<Award className="h-4 w-4" />} />
                <Field label="OPD room / number" value={opdRoom} onChange={setOpdRoom} placeholder="OPD Block, Room 7" readOnly />
                <Field label="New patient fee (₹)" value={fee} onChange={setFee} placeholder="700" type="number" />
                <Field label="Follow-up fee (₹)" value={followupFee} onChange={setFollowupFee} placeholder="400" type="number" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Qualifications * (comma separated)</label>
                <input value={qualifications} onChange={e => setQualifications(e.target.value)}
                  placeholder="MBBS, MD Neurology, DM Neurology"
                  className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              {/* Surgeon toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border">
                <button onClick={() => setIsSurgeon(s => !s)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition shrink-0 ${isSurgeon ? "bg-success" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${isSurgeon ? "left-[22px]" : "left-0.5"}`} />
                </button>
                <div>
                  <div className="text-sm font-semibold">I am a surgeon</div>
                  <div className="text-xs text-muted-foreground">You'll be tagged with a "Surgeon" badge and can be assigned to OT slots by the admin.</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">About your practice (shown on public profile)</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  placeholder="Brief description of your specialization and clinical approach..."
                  className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              </div>
            </div>
          )}

          {/* ── STEP 3: Bank & ID ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-1">Bank & identity</h2>
              <div className="rounded-lg bg-primary-soft border border-primary/20 px-4 py-3 text-xs text-primary">
                Your bank details are used for consultation fee payouts. This information is encrypted and never shared with patients.
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Bank name" value={bankName} onChange={setBankName} placeholder="State Bank of India" required icon={<Building2 className="h-4 w-4" />} />
                <Field label="Account number" value={accountNo} onChange={setAccountNo} placeholder="Enter account number" required icon={<CreditCard className="h-4 w-4" />} />
                <Field label="IFSC code" value={ifsc} onChange={setIfsc} placeholder="SBIN0001234" required />
                <Field label="Account holder name" value={fullName} readOnly />
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-sm mb-1">Identity proof</h3>
                <p className="text-xs text-muted-foreground mb-3">At least one of PAN or passport is required.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="PAN number" value={pan} onChange={setPan} placeholder="ABCDE1234F" icon={<FileText className="h-4 w-4" />} />
                  <Field label="Passport number" value={passport} onChange={setPassport} placeholder="J1234567" icon={<FileText className="h-4 w-4" />} />
                </div>
                {!pan && !passport && (
                  <p className="text-[11px] text-warning mt-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Please provide either PAN or passport number to continue.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Documents ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-1">Upload documents</h2>
              <p className="text-sm text-muted-foreground">Items marked * are mandatory for approval.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <UploadBox label="Profile photograph" desc="Clear headshot, professional attire" value={photo} onChange={setPhoto} required />
                <UploadBox label="MCI / Council registration" desc="Medical council certificate" value={regDoc} onChange={setRegDoc} required />
                <UploadBox label="Degree certificate" desc="MBBS / MD / MS or highest degree" value={degreeDoc} onChange={setDegreeDoc} required />
                <UploadBox label="Government ID" desc="Aadhar / PAN / Passport" value={idDoc} onChange={setIdDoc} />
                <UploadBox label="Digital signature" desc="Signature on white paper (PNG/JPG)" value={sigDoc} onChange={setSigDoc} />
              </div>
              {(!photo || !regDoc || !degreeDoc) && (
                <p className="text-xs text-warning flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Please upload all required (*) documents to continue.
                </p>
              )}
            </div>
          )}

          {/* ── STEP 5: Review ── */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg mb-1">Review & submit</h2>
              <p className="text-sm text-muted-foreground">Please review all details carefully before submitting.</p>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal</div>
                <ReviewRow label="Full name"  value={fullName}  />
                <ReviewRow label="Email"      value={email}     />
                <ReviewRow label="Phone"      value={phone}     />
                <ReviewRow label="Gender"     value={gender}    />
                <ReviewRow label="Address"    value={address}   />
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional</div>
                <ReviewRow label="Specialty"        value={specialty}      />
                <ReviewRow label="Experience"       value={`${experience} years`} />
                <ReviewRow label="Reg. number"      value={regNo}          />
                <ReviewRow label="Qualifications"   value={qualifications} />
                <ReviewRow label="Surgeon"          value={isSurgeon ? "Yes ✓" : "No"} />
                <ReviewRow label="OPD room"         value={opdRoom}        />
                <ReviewRow label="New patient fee"  value={fee ? `₹${fee}` : ""} />
                <ReviewRow label="Follow-up fee"    value={followupFee ? `₹${followupFee}` : ""} />
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bank & Identity</div>
                <ReviewRow label="Bank"         value={bankName}   />
                <ReviewRow label="Account"      value={accountNo ? `••••${accountNo.slice(-4)}` : ""} />
                <ReviewRow label="IFSC"         value={ifsc}       />
                <ReviewRow label="PAN"          value={pan}        />
                <ReviewRow label="Passport"     value={passport}   />
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Documents</div>
                <ReviewRow label="Profile photo"    value={photo      || "—"} />
                <ReviewRow label="MCI registration" value={regDoc     || "—"} />
                <ReviewRow label="Degree cert"      value={degreeDoc  || "—"} />
                <ReviewRow label="Government ID"    value={idDoc      || "—"} />
              </div>
              <div className="rounded-lg bg-warning-soft border border-warning/20 px-4 py-3 text-xs text-warning flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                By submitting, you confirm all details are accurate. False information may result in account termination.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/hospital-doctor/login")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition">
              <ChevronLeft className="h-4 w-4" /> {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 5 ? (
              <button disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 transition">
                <Send className="h-4 w-4" /> Submit for review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}