import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Navbar";
import { Building2, Mail, Phone, MapPin, Stethoscope, FileText, CheckCircle2, ChevronLeft, Award, Clock, Send } from "lucide-react";

const SPECIALTIES = ["Cardiologist","Dermatologist","Pediatrician","Orthopedic","Neurologist","Gynecologist","Dentist","Psychiatrist","ENT","General Physician"];

export default function ClinicApply() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Apply your clinic — MedConnect";
  }, []);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    doctorName: "", email: "", phone: "", specialty: "Cardiologist", experience: "",
    qualifications: "", registrationNo: "", clinicName: "", address: "", city: "",
    timings: "Mon–Sat · 9am–8pm", fee: "", about: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    const app = { ...form, id: `app-${Date.now()}`, submittedAt: new Date().toISOString(), status: "pending" };
    try {
      const existing = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
      localStorage.setItem("clinic_applications", JSON.stringify([app, ...existing]));
    } catch {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          <div className="h-16 w-16 mx-auto rounded-full bg-success-soft text-success flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Application submitted!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks {form.doctorName.split(" ")[0] || "Doctor"}. Our team will review your clinic application within 24–48 hours and email you at <span className="text-foreground font-medium">{form.email}</span>.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link to="/" className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition">Back home</Link>
            <Link to="/clinic/login" className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Go to clinic login</Link>
          </div>
        </div>
      </div>
    );
  }

  const stepValid =
    step === 1 ? form.doctorName && form.email && form.phone && form.experience && form.registrationNo
    : step === 2 ? form.clinicName && form.address && form.city && form.fee
    : true;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link to="/clinic/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </header>
      <section className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Clinic registration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Register your clinic on MedConnect</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">Run an independent practice? Reach thousands of patients, manage online bookings, and grow your clinic with our tools — completely free to get started.</p>
        </div>
      </section>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            {[{ n: 1, label: "Doctor" }, { n: 2, label: "Clinic" }, { n: 3, label: "Review" }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition ${step >= s.n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <div className={`text-sm font-medium ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-1 rounded ${step > s.n ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Doctor details</h2>
              <Field icon={<Stethoscope className="h-4 w-4" />} label="Full name *" value={form.doctorName} onChange={(v) => set("doctorName", v)} placeholder="Dr. Aanya Kapoor" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field icon={<Mail className="h-4 w-4" />} label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="dr.kapoor@example.com" />
                <Field icon={<Phone className="h-4 w-4" />} label="Phone *" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 98765 43210" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Specialty *</Label>
                  <select value={form.specialty} onChange={(e) => set("specialty", e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-border bg-input text-sm outline-none focus:border-primary">
                    {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Field icon={<Award className="h-4 w-4" />} label="Years of experience *" value={form.experience} onChange={(v) => set("experience", v)} placeholder="12" />
              </div>
              <Field icon={<FileText className="h-4 w-4" />} label="Medical Council Reg. No. *" value={form.registrationNo} onChange={(v) => set("registrationNo", v)} placeholder="MCI-2012-45678" />
              <Field label="Qualifications (comma separated)" value={form.qualifications} onChange={(v) => set("qualifications", v)} placeholder="MBBS, MD Dermatology, Fellowship" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Clinic details</h2>
              <Field icon={<Building2 className="h-4 w-4" />} label="Clinic name *" value={form.clinicName} onChange={(v) => set("clinicName", v)} placeholder="Kapoor Skin & Hair Clinic" />
              <Field icon={<MapPin className="h-4 w-4" />} label="Full address *" value={form.address} onChange={(v) => set("address", v)} placeholder="2nd floor, Sevoke Road" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="City *" value={form.city} onChange={(v) => set("city", v)} placeholder="Siliguri" />
                <Field label="Consultation fee (₹) *" value={form.fee} onChange={(v) => set("fee", v)} placeholder="600" />
              </div>
              <Field icon={<Clock className="h-4 w-4" />} label="Clinic timings" value={form.timings} onChange={(v) => set("timings", v)} />
              <div>
                <Label>About your practice</Label>
                <textarea value={form.about} onChange={(e) => set("about", e.target.value)} rows={4} placeholder="Brief description shown on your public profile..." className="w-full px-3 py-2.5 rounded-md border border-border bg-input text-sm outline-none focus:border-primary resize-none" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Review your application</h2>
              <div className="rounded-xl border border-border divide-y divide-border">
                <Row label="Doctor name" value={form.doctorName} />
                <Row label="Specialty" value={`${form.specialty} · ${form.experience} yrs exp`} />
                <Row label="Reg. number" value={form.registrationNo} />
                <Row label="Contact" value={`${form.email} · ${form.phone}`} />
                <Row label="Clinic" value={form.clinicName} />
                <Row label="Location" value={`${form.address}, ${form.city}`} />
                <Row label="Fee" value={`₹${form.fee}`} />
                <Row label="Timings" value={form.timings} />
              </div>
              <div className="text-xs text-muted-foreground bg-primary-soft border border-primary/20 rounded-lg p-3">
                By submitting, you confirm all details are accurate. Our team will verify your registration with the medical council before approval.
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => (step > 1 ? setStep(step - 1) : navigate("/clinic/login"))} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition">
              {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 3 ? (
              <button disabled={!stepValid} onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90">Continue →</button>
            ) : (
              <button onClick={submit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                <Send className="h-4 w-4" /> Submit application
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Why MedConnect?</h3>
            <ul className="space-y-3 text-sm">
              {["Get discovered by 50k+ monthly patients", "Real-time booking dashboard & calendar", "Automated reminders reduce no-shows", "Zero setup fee — pay only per booking"].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider opacity-80 font-bold">Approval timeline</div>
            <div className="text-2xl font-bold mt-1">24–48 hours</div>
            <p className="text-sm opacity-80 mt-2">Most clinics are verified and live within two business days.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{children}</label>;
}

function Field({ icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value || "—"}</span>
    </div>
  );
}