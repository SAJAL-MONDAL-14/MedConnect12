// ─────────────────────────────────────────────────────────────────────────────
// hospital-doctor.complete-profile.jsx
// First-time doctor login → profile completion form
// Pre-filled with data the admin entered when adding the doctor
// After submit → goes to hospital-doctor/dashboard with "Under Review" status
// ─────────────────────────────────────────────────────────────────────────────
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Navbar";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Upload,
  User, Mail, Phone, Award, FileText, CreditCard,
  Send, AlertCircle, Building2, Stethoscope, Clock,
  Camera, BookOpen, ShieldCheck,
} from "lucide-react";

// Pre-filled by hospital admin when they added this doctor
const ADMIN_PRE_FILLED = {
  fullName:      "Dr. Kavya Reddy",
  email:         "dr.kavya@nbmc.in",
  phone:         "+91 98765 12345",
  specialty:     "Neurologist",
  experience:    "14",
  opdRoom:       "OPD Block, Room 7",
  regNo:         "MCI-2010-88432",
  qualifications:"MBBS, MD Neurology",
  hospital:      "North Bengal Medical College",
  fee:           "700",
  followupFee:   "400",
};

const SPECIALTIES = [
  "Cardiologist","Neurologist","Orthopedic","Pediatrician","Dermatologist",
  "Gynecologist","Psychiatrist","Urologist","Ophthalmologist","ENT Specialist",
  "General Physician","Radiologist","Pathologist","Pulmonologist",
  "Gastroenterologist","Endocrinologist","Nephrologist","Oncologist",
  "Dentist","Physiotherapist",
];

const STEPS = [
  { n:1, label:"Personal"        },
  { n:2, label:"Professional"    },
  { n:3, label:"Bank & ID"       },
  { n:4, label:"Documents"       },
  { n:5, label:"Review & Submit" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8 overflow-x-auto pb-1 gap-0">
      {STEPS.map((s,i)=>(
        <div key={s.n} className="flex items-center shrink-0">
          <div className="flex flex-col items-center">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              current>s.n  ? "bg-success text-success-foreground ring-2 ring-success/20" :
              current===s.n? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"}`}>
              {current>s.n ? <CheckCircle2 className="h-4 w-4"/> : s.n}
            </div>
            <div className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
              current===s.n?"text-primary":current>s.n?"text-success":"text-muted-foreground"}`}>
              {s.label}
            </div>
          </div>
          {i<STEPS.length-1 && (
            <div className={`h-0.5 w-8 sm:w-14 mx-1 mb-4 rounded transition-all ${current>s.n?"bg-success":"bg-border"}`}/>
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type="text", required, icon, readOnly, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          {label}{required && <span className="text-emergency ml-0.5">*</span>}
        </label>
        {readOnly && (
          <span className="text-[10px] rounded-full bg-primary-soft text-primary px-2 py-0.5 font-semibold">Pre-filled by admin</span>
        )}
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      <div className={`flex items-center gap-2 rounded-md border px-3 transition ${
        readOnly ? "border-border bg-secondary cursor-default" :
        "border-border bg-input focus-within:border-primary"}`}>
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <input
          type={type} value={value}
          onChange={e => !readOnly && onChange?.(e.target.value)}
          placeholder={placeholder} readOnly={readOnly}
          className={`flex-1 bg-transparent py-2.5 text-sm outline-none ${readOnly?"text-muted-foreground":""}`}
        />
      </div>
    </div>
  );
}

function UploadBox({ label, desc, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
        {label}{required && <span className="text-emergency ml-0.5">*</span>}
      </label>
      <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 cursor-pointer transition ${
        value ? "border-success bg-success-soft" : "border-border hover:border-primary bg-secondary"}`}>
        <input type="file" className="hidden" onChange={e=>onChange?.(e.target.files[0]?.name||"")}/>
        {value ? (
          <>
            <CheckCircle2 className="h-6 w-6 text-success"/>
            <span className="text-xs font-semibold text-success text-center truncate max-w-full px-2">{value}</span>
            <span className="text-[10px] text-success/70">Click to change</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground"/>
            <span className="text-xs text-muted-foreground text-center">{desc}</span>
            <span className="text-[10px] text-muted-foreground">PDF, JPG, PNG · Max 5MB</span>
          </>
        )}
      </label>
    </div>
  );
}

function ReviewRow({ label, value, highlight }) {
  return (
    <div className={`flex items-start justify-between px-4 py-3 text-sm border-b border-border last:border-0 ${highlight?"bg-primary-soft/30":""}`}>
      <span className="text-muted-foreground shrink-0 w-40">{label}</span>
      <span className={`font-medium text-right ${!value?"text-muted-foreground italic":""}`}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HospitalDoctorCompleteProfile() {
  const navigate = useNavigate();
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Personal (some pre-filled, some new)
  const [fullName,  setFullName]  = useState(ADMIN_PRE_FILLED.fullName);
  const [email,     setEmail]     = useState(ADMIN_PRE_FILLED.email);
  const [phone,     setPhone]     = useState(ADMIN_PRE_FILLED.phone);
  const [dob,       setDob]       = useState("");
  const [gender,    setGender]    = useState("Female");
  const [address,   setAddress]   = useState("");
  const [altPhone,  setAltPhone]  = useState("");

  // Step 2 — Professional (some pre-filled)
  const [specialty,      setSpecialty]      = useState(ADMIN_PRE_FILLED.specialty);
  const [experience,     setExperience]     = useState(ADMIN_PRE_FILLED.experience);
  const [regNo,          setRegNo]          = useState(ADMIN_PRE_FILLED.regNo);
  const [qualifications, setQualifications] = useState(ADMIN_PRE_FILLED.qualifications);
  const [isSurgeon,      setIsSurgeon]      = useState(false);
  const [opdRoom,        setOpdRoom]        = useState(ADMIN_PRE_FILLED.opdRoom);
  const [fee,            setFee]            = useState(ADMIN_PRE_FILLED.fee);
  const [followupFee,    setFollowupFee]    = useState(ADMIN_PRE_FILLED.followupFee);
  const [bio,            setBio]            = useState("");
  const [languages,      setLanguages]      = useState("English, Hindi, Bengali");

  // Step 3 — Bank & ID
  const [bankName,   setBankName]   = useState("");
  const [accountNo,  setAccountNo]  = useState("");
  const [ifsc,       setIfsc]       = useState("");
  const [pan,        setPan]        = useState("");
  const [passport,   setPassport]   = useState("");
  const [accountType,setAccountType]= useState("Savings");

  // Step 4 — Documents
  const [photo,       setPhoto]        = useState("");
  const [regDoc,      setRegDoc]       = useState("");
  const [degreeDoc,   setDegreeDoc]    = useState("");
  const [idDoc,       setIdDoc]        = useState("");
  const [sigDoc,      setSigDoc]       = useState("");
  const [bankDoc,     setBankDoc]      = useState("");

  useEffect(() => { document.title = "Complete your profile — MedConnect"; }, []);

  const canNext = () => {
    if (step===1) return fullName.trim() && email.trim() && phone.trim();
    if (step===2) return specialty && experience && regNo && qualifications;
    if (step===3) return bankName && accountNo && ifsc && (pan || passport);
    if (step===4) return photo && regDoc && degreeDoc;
    return true;
  };

  // ── Submitted screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 shadow-elevated">
          <div className="text-center mb-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-success-soft flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success"/>
            </div>
            <h1 className="text-2xl font-bold">Profile submitted for review!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your profile has been sent to <span className="font-semibold text-foreground">{ADMIN_PRE_FILLED.hospital}</span>. You'll be notified by email at every stage.
            </p>
          </div>

          {/* Full status timeline */}
          <div className="rounded-xl bg-secondary border border-border p-5 mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Onboarding progress</div>
            {[
              { label:"Doctor Added",        done:true,  note:"Admin added your details"             },
              { label:"Invitation Sent",      done:true,  note:"Activation email sent to you"         },
              { label:"Pending Activation",   done:true,  note:"You clicked the activation link"      },
              { label:"Profile Submitted",    done:true,  note:"Just now — awaiting admin review"     },
              { label:"Under Review",         done:false, current:true, note:"Admin will review soon" },
              { label:"Approved / Rejected",  done:false, note:"You'll be notified by email"          },
            ].map((s,i,arr)=>(
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    s.done    ? "bg-success text-success-foreground" :
                    s.current ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-muted text-muted-foreground"}`}>
                    {s.done ? "✓" : i+1}
                  </div>
                  {i<arr.length-1 && <div className={`w-0.5 h-6 ${s.done?"bg-success":"bg-border"}`}/>}
                </div>
                <div className="pb-2">
                  <div className={`text-sm font-medium ${s.current?"text-primary":s.done?"text-foreground":"text-muted-foreground"}`}>{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-primary-soft border border-primary/20 px-4 py-3 text-xs text-primary mb-5">
            While under review, you can still log in to your dashboard to view your profile and track approval status.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/hospital-doctor/login"
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition text-center">
              Back to login
            </Link>
            <Link to="/hospital-doctor/dashboard"
              className="px-4 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 text-center">
              Go to my dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo/>
          <div className="flex items-center gap-2 rounded-full bg-secondary border border-border px-3 py-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary"/>
            <span className="text-xs font-medium">{ADMIN_PRE_FILLED.hospital}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-success"/> First-time login — account activation
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Complete your doctor profile</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Welcome, {ADMIN_PRE_FILLED.fullName.split(" ").slice(0,2).join(" ")}! Fields marked <span className="rounded-full bg-primary-soft text-primary text-[10px] font-semibold px-2 py-0.5">Pre-filled by admin</span> were entered by your hospital admin — you can update them if needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["5 steps","~5 minutes","Profile sent for admin review"].map(t=>(
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-success"/>{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <StepBar current={step}/>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

          {/* ── STEP 1: Personal ── */}
          {step===1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">Personal details</h2>
                <p className="text-sm text-muted-foreground mt-1">Basic information about you. Some fields are pre-filled by your hospital admin.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" value={fullName} onChange={setFullName} required readOnly icon={<User className="h-4 w-4"/>}/>
                <Field label="Email address" value={email} onChange={setEmail} type="email" required readOnly icon={<Mail className="h-4 w-4"/>}/>
                <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" required icon={<Phone className="h-4 w-4"/>}/>
                <Field label="Alternate phone" value={altPhone} onChange={setAltPhone} placeholder="+91 99999 00000" icon={<Phone className="h-4 w-4"/>}/>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Gender</label>
                  <select value={gender} onChange={e=>setGender(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary">
                    {["Female","Male","Other","Prefer not to say"].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <Field label="Date of birth" value={dob} onChange={setDob} type="date"/>
              </div>
              <Field label="Residential address" value={address} onChange={setAddress} placeholder="123, Hill Cart Road, Siliguri, WB 734001"/>
            </div>
          )}

          {/* ── STEP 2: Professional ── */}
          {step===2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">Professional details</h2>
                <p className="text-sm text-muted-foreground mt-1">Your medical credentials and practice information. Update if any details differ.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Specialty<span className="text-emergency ml-0.5">*</span></label>
                  <select value={specialty} onChange={e=>setSpecialty(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary">
                    {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field label="Years of experience" value={experience} onChange={setExperience} placeholder="14" required icon={<Clock className="h-4 w-4"/>}/>
                <Field label="Medical Council Reg. No." value={regNo} onChange={setRegNo} placeholder="MCI-2010-88432" required readOnly icon={<Award className="h-4 w-4"/>}/>
                <Field label="OPD room / number" value={opdRoom} onChange={setOpdRoom} placeholder="OPD Block, Room 7" readOnly/>
                <Field label="New patient fee (₹)" value={fee} onChange={setFee} placeholder="700" type="number" readOnly hint="Set by admin"/>
                <Field label="Follow-up fee (₹)" value={followupFee} onChange={setFollowupFee} placeholder="400" type="number" readOnly hint="Set by admin"/>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                  Qualifications<span className="text-emergency ml-0.5">*</span>
                  <span className="ml-2 text-[10px] rounded-full bg-primary-soft text-primary px-2 py-0.5 font-semibold">Pre-filled by admin</span>
                </label>
                <input value={qualifications} onChange={e=>setQualifications(e.target.value)}
                  placeholder="MBBS, MD Neurology, DM Neurology, Fellowship"
                  className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary"/>
                <p className="text-[11px] text-muted-foreground mt-1">Comma-separated. Add all relevant degrees and fellowships.</p>
              </div>
              <Field label="Languages spoken" value={languages} onChange={setLanguages} placeholder="English, Hindi, Bengali" icon={<BookOpen className="h-4 w-4"/>}/>
              {/* Surgeon toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border">
                <button onClick={()=>setIsSurgeon(s=>!s)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition shrink-0 ${isSurgeon?"bg-success":"bg-muted"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${isSurgeon?"left-[22px]":"left-0.5"}`}/>
                </button>
                <div>
                  <div className="text-sm font-semibold">I am a surgeon</div>
                  <div className="text-xs text-muted-foreground">Surgeons receive a "Surgeon" badge on their profile and can be assigned to OT slots by the admin.</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">About your practice <span className="text-muted-foreground font-normal">(shown on your public profile)</span></label>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
                  placeholder="Brief description of your specialization, approach and clinical expertise..."
                  className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"/>
              </div>
            </div>
          )}

          {/* ── STEP 3: Bank & ID ── */}
          {step===3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">Bank & identity</h2>
                <p className="text-sm text-muted-foreground mt-1">Used for consultation fee payouts. All data is encrypted and never shared with patients.</p>
              </div>
              <div className="rounded-lg bg-primary-soft border border-primary/20 px-4 py-3 text-xs text-primary flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5"/>
                Your bank details are securely stored and only used by MedConnect finance team for payouts. We never share this with hospitals or patients.
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Bank name" value={bankName} onChange={setBankName} placeholder="State Bank of India" required icon={<Building2 className="h-4 w-4"/>}/>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Account type</label>
                  <select value={accountType} onChange={e=>setAccountType(e.target.value)}
                    className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary">
                    {["Savings","Current"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <Field label="Account number" value={accountNo} onChange={setAccountNo} placeholder="Enter account number" required icon={<CreditCard className="h-4 w-4"/>}/>
                <Field label="IFSC code" value={ifsc} onChange={setIfsc} placeholder="SBIN0001234" required/>
                <Field label="Account holder name" value={fullName} readOnly hint="Auto-filled"/>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-semibold text-sm mb-1">Identity proof</h3>
                <p className="text-xs text-muted-foreground mb-4">Provide at least one identity document. Both PAN and passport are accepted.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="PAN number" value={pan} onChange={setPan} placeholder="ABCDE1234F" icon={<FileText className="h-4 w-4"/>}/>
                  <Field label="Passport number" value={passport} onChange={setPassport} placeholder="J1234567" icon={<FileText className="h-4 w-4"/>}/>
                </div>
                {!pan && !passport && (
                  <p className="text-xs text-warning mt-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5"/> Please provide either PAN or passport number to continue.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Documents ── */}
          {step===4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">Upload documents</h2>
                <p className="text-sm text-muted-foreground mt-1">Required documents for identity and credential verification. Items marked <span className="text-emergency font-semibold">*</span> are mandatory.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <UploadBox label="Profile photograph" desc="Clear headshot on white background, professional attire" value={photo} onChange={setPhoto} required/>
                <UploadBox label="MCI / Council registration certificate" desc="State or national medical council registration" value={regDoc} onChange={setRegDoc} required/>
                <UploadBox label="Highest degree certificate" desc="MBBS, MD, MS, DM or equivalent" value={degreeDoc} onChange={setDegreeDoc} required/>
                <UploadBox label="Government ID proof" desc="Aadhar card, Passport or Voter ID" value={idDoc} onChange={setIdDoc}/>
                <UploadBox label="Bank passbook / cancelled cheque" desc="For payout verification" value={bankDoc} onChange={setBankDoc}/>
                <UploadBox label="Digital signature" desc="Sign on white paper, scan/photograph (PNG/JPG)" value={sigDoc} onChange={setSigDoc}/>
              </div>
              {(!photo||!regDoc||!degreeDoc) && (
                <div className="rounded-lg bg-warning-soft border border-warning/20 px-4 py-3 text-xs text-warning flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0"/>
                  Please upload your profile photograph, registration certificate, and degree certificate to continue.
                </div>
              )}
            </div>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step===5 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">Review & submit</h2>
                <p className="text-sm text-muted-foreground mt-1">Review all your details carefully before submitting for admin review.</p>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5"/> Personal
                </div>
                <ReviewRow label="Full name"    value={fullName}/>
                <ReviewRow label="Email"        value={email}/>
                <ReviewRow label="Phone"        value={phone}/>
                <ReviewRow label="Alt phone"    value={altPhone}/>
                <ReviewRow label="Gender"       value={gender}/>
                <ReviewRow label="Date of birth"value={dob}/>
                <ReviewRow label="Address"      value={address}/>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Stethoscope className="h-3.5 w-3.5"/> Professional
                </div>
                <ReviewRow label="Specialty"        value={specialty}/>
                <ReviewRow label="Experience"       value={`${experience} years`}/>
                <ReviewRow label="Reg. number"      value={regNo}/>
                <ReviewRow label="Qualifications"   value={qualifications}/>
                <ReviewRow label="Surgeon"          value={isSurgeon?"Yes ✓":"No"}/>
                <ReviewRow label="OPD room"         value={opdRoom}/>
                <ReviewRow label="New patient fee"  value={`₹${fee}`}/>
                <ReviewRow label="Follow-up fee"    value={`₹${followupFee}`}/>
                <ReviewRow label="Languages"        value={languages}/>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5"/> Bank & Identity
                </div>
                <ReviewRow label="Bank"         value={bankName}/>
                <ReviewRow label="Account type" value={accountType}/>
                <ReviewRow label="Account no."  value={accountNo ? `••••${accountNo.slice(-4)}` : ""}/>
                <ReviewRow label="IFSC"         value={ifsc}/>
                <ReviewRow label="PAN"          value={pan}/>
                <ReviewRow label="Passport"     value={passport}/>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5"/> Documents
                </div>
                {[
                  {l:"Profile photo",      v:photo,    req:true},
                  {l:"Registration cert",  v:regDoc,   req:true},
                  {l:"Degree cert",        v:degreeDoc,req:true},
                  {l:"Government ID",      v:idDoc,    req:false},
                  {l:"Bank document",      v:bankDoc,  req:false},
                  {l:"Digital signature",  v:sigDoc,   req:false},
                ].map(d=>(
                  <div key={d.l} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 text-sm">
                    <span className="text-muted-foreground">{d.l}{d.req&&<span className="text-emergency ml-0.5">*</span>}</span>
                    {d.v
                      ? <span className="text-success font-medium flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>{d.v}</span>
                      : <span className={`text-xs font-medium ${d.req?"text-emergency":"text-muted-foreground"}`}>{d.req?"Required":"Not uploaded"}</span>}
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-warning-soft border border-warning/20 px-4 py-3 text-xs text-warning flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5"/>
                By submitting, you confirm that all information provided is accurate. False or misleading information may result in rejection or account termination.
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={()=>step>1 ? setStep(s=>s-1) : navigate("/hospital-doctor/login")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition">
              <ChevronLeft className="h-4 w-4"/> {step===1?"Cancel":"Back"}
            </button>
            {step<5 ? (
              <button disabled={!canNext()} onClick={()=>setStep(s=>s+1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition">
                Continue <ChevronRight className="h-4 w-4"/>
              </button>
            ) : (
              <button onClick={()=>setSubmitted(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 transition">
                <Send className="h-4 w-4"/> Submit for admin review
              </button>
            )}
          </div>
        </div>

        {/* Step progress hint */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Step {step} of {STEPS.length} · {STEPS[step-1].label}
          {step < 5 && <span> · Next: {STEPS[step].label}</span>}
        </p>
      </div>
    </div>
  );
}