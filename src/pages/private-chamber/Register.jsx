import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Logo } from "@/components/Navbar";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  CheckCircle2,
  ChevronLeft,
  Award,
  Clock,
  Send,
  Lock,
  AlertCircle,
} from "lucide-react";

const SPECIALTIES = [
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Neurologist",
  "Gynecologist",
  "Dentist",
  "Psychiatrist",
  "ENT",
  "General Physician",
];

export default function PrivateChamberRegister() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register your private chamber — MedConnect";
  }, []);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    doctorName: "",
    email: "",
    password: "",
    phone: "",
    specialty: "Cardiologist",
    experience: "",
    qualifications: "",
    registrationNo: "",
    clinicName: "",
    address: "",
    city: "",

    fee: "",
    about: "",
  });

  // Security & Validation States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [expError, setExpError] = useState("");
  const [feeError, setFeeError] = useState("");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [shouldVerifyOtp, setShouldVerifyOtp] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // OTP Timer countdown logic
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpTimer]);

  const handleEmailChange = (val) => {
    set("email", val);
    setEmailOtpSent(false);
    setEmailOtpVerified(false);
    setOtpError("");
    setEmailError("");
  };

  const handlePhoneChange = (val) => {
    // Sanitize input to only numbers, + symbol and spaces
    const cleanVal = val.replace(/[^\d+ ]/g, "");
    set("phone", cleanVal);
    const digitsOnly = cleanVal.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setPhoneError("Phone number must contain at least 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handlePasswordChange = (val) => {
    set("password", val);
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleExpChange = (val) => {
    // Sanitize input to numbers only
    const cleanVal = val.replace(/\D/g, "");
    set("experience", cleanVal);
    const num = parseInt(cleanVal, 10);
    if (isNaN(num) || num < 0 || num > 60) {
      setExpError("Enter a valid experience duration (0 to 60 years)");
    } else {
      setExpError("");
    }
  };

  // Effect to verify OTP when shouldVerifyOtp triggers
  useEffect(() => {
    if (!shouldVerifyOtp) return;

    const verifyOtp = async () => {
      setOtpError("");
      try {
        const response = await api.post("/api/clinic/verify-otp", {
          gmail: form.email,
          otp: enteredOtp,
        });

        if (response.data.success) {
          setEmailOtpVerified(true);
          setEmailOtpSent(false);
          setEnteredOtp("");
        } else {
          setOtpError(response.data.error || "Invalid verification code.");
        }
      } catch (err) {
        console.error(err);
        setOtpError(err.response?.data?.error || err.message || "Verification failed.");
      } finally {
        setShouldVerifyOtp(false);
      }
    };

    verifyOtp();
  }, [shouldVerifyOtp, enteredOtp, form.email]);

  // Auto-trigger verification when entered OTP reaches 6 digits
  useEffect(() => {
    if (enteredOtp.length === 6) {
      setShouldVerifyOtp(true);
    }
  }, [enteredOtp]);

  // Effect to handle final submit
  useEffect(() => {
    if (!shouldSubmit) return;

    const performSubmit = async () => {
      setIsSubmitting(true);
      try {
        const payload = {
          owner_doctor_name: form.doctorName,
          gmail: form.email,
          password: form.password,
          phone: form.phone,
          speciality: form.specialty,
          medical_council_reg_no: form.registrationNo,
          experience: parseInt(form.experience, 10) || 0,
          qualification: form.qualifications,
          clinic_name: form.clinicName,
          address: form.address,
          city: form.city,
          consultations_fee: parseFloat(form.fee) || 0,
          about_of_clinic: form.about,
        };

        const response = await api.post("/api/clinic/register", payload);

        if (response.data.success) {
          try {
            const existing = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
            localStorage.setItem(
              "clinic_applications",
              JSON.stringify([response.data.data || payload, ...existing]),
            );
          } catch {}
          setSubmitted(true);
        } else {
          alert(response.data.error || "Submission failed.");
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || err.message || "An error occurred during submission.");
      } finally {
        setIsSubmitting(false);
        setShouldSubmit(false);
      }
    };

    performSubmit();
  }, [shouldSubmit, form]);

  const handleFeeChange = (val) => {
    const cleanVal = val.replace(/\D/g, "");
    set("fee", cleanVal);
    const num = parseInt(cleanVal, 10);
    if (isNaN(num) || num <= 0 || num > 10000) {
      setFeeError("Consultation fee must be between ₹1 and ₹10,000");
    } else {
      setFeeError("");
    }
  };

  const sendEmailOtp = async () => {
    setEmailError("");
    setOtpError("");

    // Standard email verification regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await api.post("/api/clinic/send-otp", {
        gmail: form.email,
      });

      if (response.data.success) {
        setEmailOtpSent(true);
        setOtpTimer(60); // Start 1-minute countdown
      } else {
        setEmailError(response.data.error || "Failed to send verification OTP.");
      }
    } catch (err) {
      console.error(err);
      setEmailError(err.response?.data?.error || err.message || "Failed to send verification OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyEmailOtp = () => {
    if (enteredOtp.length < 6) {
      setOtpError("Please enter a 6-digit OTP code");
      return;
    }
    setShouldVerifyOtp(true);
  };

  const submit = () => {
    // Final check for security
    if (!emailOtpVerified) {
      alert("Please verify your email address before submitting.");
      return;
    }
    setShouldSubmit(true);
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
            Thanks {form.doctorName.split(" ")[0] || "Doctor"}. Our team will review your private
            chamber application within 24–48 hours and email you at{" "}
            <span className="text-foreground font-medium">{form.email}</span>.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              Back home
            </Link>
            <Link
              to="/private-chamber/login"
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Go to chamber login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepValid =
    step === 1
      ? form.doctorName &&
        form.email &&
        emailOtpVerified &&
        form.password &&
        !passwordError &&
        form.phone &&
        !phoneError &&
        form.experience &&
        !expError &&
        form.registrationNo
      : step === 2
        ? form.clinicName && form.address && form.city && form.fee && !feeError
        : true;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link
            to="/private-chamber/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </header>
      <section className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Private chamber registration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Register your private chamber on MedConnect
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Run an independent practice? Reach thousands of patients, manage online bookings, and
            grow your private chamber with our tools — completely free to get started.
          </p>
        </div>
      </section>
      <div className="max-w-[1100px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-8">
            {[
              { n: 1, label: "Doctor" },
              { n: 2, label: "Chamber" },
              { n: 3, label: "Review" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition ${step >= s.n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                </div>
                <div
                  className={`text-sm font-medium ${step >= s.n ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 rounded ${step > s.n ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Doctor details</h2>
              <Field
                icon={<Stethoscope className="h-4 w-4" />}
                label="Full name *"
                value={form.doctorName}
                onChange={(v) => set("doctorName", v)}
                placeholder="Dr. Aanya Kapoor"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Email Verification Box */}
                <div>
                  <Label>Email *</Label>
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 flex items-center gap-2 rounded-md border bg-input px-3 transition ${emailOtpVerified ? "border-success bg-success-soft/10" : emailError ? "border-emergency" : "focus-within:border-primary"}`}
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        disabled={emailOtpVerified}
                        value={form.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="dr.kapoor@example.com"
                        className="flex-1 bg-transparent py-2.5 text-sm outline-none disabled:cursor-not-allowed"
                      />
                      {emailOtpVerified && (
                        <span className="text-success text-xs font-semibold flex items-center gap-1 select-none">
                          <CheckCircle2 className="h-4 w-4" /> Verified
                        </span>
                      )}
                    </div>

                    {!emailOtpVerified && (
                      <button
                        type="button"
                        disabled={!form.email || emailOtpSent || isSendingOtp}
                        onClick={sendEmailOtp}
                        className="px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {isSendingOtp ? "Sending..." : emailOtpSent ? "OTP Sent" : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {emailError && (
                    <p className="text-emergency text-[11px] mt-1 font-medium">{emailError}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <Field
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone *"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="+91 98765 43210"
                  />
                  {phoneError && (
                    <p className="text-emergency text-[11px] mt-1 font-medium">{phoneError}</p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Field
                  icon={<Lock className="h-4 w-4" />}
                  label="Password *"
                  type="password"
                  value={form.password}
                  onChange={handlePasswordChange}
                  placeholder="Choose a secure password (min. 6 characters)"
                />
                {passwordError && (
                  <p className="text-emergency text-[11px] mt-1 font-medium">{passwordError}</p>
                )}
              </div>

              {/* OTP Entry Field */}
              {emailOtpSent && !emailOtpVerified && (
                <div className="rounded-xl border border-primary/20 bg-primary-soft/10 p-4 space-y-3">
                  <div className="text-xs font-semibold text-primary">Enter Verification Code</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      disabled={shouldVerifyOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit code"
                      className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm text-center font-mono font-bold tracking-widest outline-none focus:border-primary disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={shouldVerifyOtp || enteredOtp.length < 6}
                      onClick={verifyEmailOtp}
                      className="px-4 py-2 text-xs font-semibold rounded-md bg-success text-success-foreground hover:bg-success-dark transition shrink-0 disabled:opacity-50"
                    >
                      {shouldVerifyOtp ? "Verifying..." : "Verify Code"}
                    </button>
                  </div>
                  {otpError && <p className="text-emergency text-[11px] font-medium">{otpError}</p>}

                  {/* Timer & Resend */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <div>
                      {otpTimer > 0 ? (
                        <span>
                          Resend code in{" "}
                          <strong className="font-mono text-foreground font-semibold">
                            {otpTimer}s
                          </strong>
                        </span>
                      ) : (
                        <span className="text-primary font-medium">
                          Code expired. You can resend now.
                        </span>
                      )}
                    </div>
                    {otpTimer === 0 && (
                      <button
                        type="button"
                        onClick={sendEmailOtp}
                        className="text-primary font-bold hover:underline transition"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Specialty *</Label>
                  <select
                    value={form.specialty}
                    onChange={(e) => set("specialty", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md border border-border bg-input text-sm outline-none focus:border-primary"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Field
                    icon={<Award className="h-4 w-4" />}
                    label="Years of experience *"
                    value={form.experience}
                    onChange={handleExpChange}
                    placeholder="12"
                  />
                  {expError && (
                    <p className="text-emergency text-[11px] mt-1 font-medium">{expError}</p>
                  )}
                </div>
              </div>

              <Field
                icon={<FileText className="h-4 w-4" />}
                label="Medical Council Reg. No. *"
                value={form.registrationNo}
                onChange={(v) => set("registrationNo", v)}
                placeholder="MCI-2012-45678"
              />
              <Field
                label="Qualifications (comma separated)"
                value={form.qualifications}
                onChange={(v) => set("qualifications", v)}
                placeholder="MBBS, MD Dermatology, Fellowship"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Private Chamber details</h2>
              <Field
                icon={<Building2 className="h-4 w-4" />}
                label="Chamber name *"
                value={form.clinicName}
                onChange={(v) => set("clinicName", v)}
                placeholder="Dr. Kapoor's Private Chamber"
              />
              <Field
                icon={<MapPin className="h-4 w-4" />}
                label="Full address *"
                value={form.address}
                onChange={(v) => set("address", v)}
                placeholder="2nd floor, Sevoke Road"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="City *"
                  value={form.city}
                  onChange={(v) => set("city", v)}
                  placeholder="Siliguri"
                />
                <div>
                  <Field
                    label="Consultation fee (₹) *"
                    value={form.fee}
                    onChange={handleFeeChange}
                    placeholder="600"
                  />
                  {feeError && (
                    <p className="text-emergency text-[11px] mt-1 font-medium">{feeError}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>About your practice</Label>
                <textarea
                  value={form.about}
                  onChange={(e) => set("about", e.target.value)}
                  rows={4}
                  placeholder="Brief description shown on your public profile..."
                  className="w-full px-3 py-2.5 rounded-md border border-border bg-input text-sm outline-none focus:border-primary resize-none"
                />
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
                <Row label="Chamber" value={form.clinicName} />
                <Row label="Location" value={`${form.address}, ${form.city}`} />
                <Row label="Fee" value={`₹${form.fee}`} />
              </div>
              <div className="text-xs text-muted-foreground bg-primary-soft border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  By submitting, you confirm all details are accurate. Our team will verify your
                  registration with the medical council before approval.
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate("/private-chamber/login"))}
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 3 ? (
              <button
                disabled={!stepValid}
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                Continue →
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                onClick={submit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit application
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Why MedConnect?</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Get discovered by 50k+ monthly patients",
                "Real-time booking dashboard & calendar",
                "Automated reminders reduce no-shows",
                "Zero setup fee — pay only per booking",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider opacity-80 font-bold">
              Approval timeline
            </div>
            <div className="text-2xl font-bold mt-1">24–48 hours</div>
            <p className="text-sm opacity-80 mt-2">
              Most private chambers are verified and live within two business days.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{children}</label>
  );
}

function Field({ icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 text-sm outline-none"
        />
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
