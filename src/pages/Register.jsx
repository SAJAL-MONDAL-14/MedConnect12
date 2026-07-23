import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Navbar";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { registerUser } from "@/services/authService";
import { ToastContainer, useToast } from "@/components/Toast";

// ─── Validation helpers ────────────────────────────────────────────────────────
const rules = {
  firstName: (v) => (!v.trim() ? "First name is required" : ""),
  lastName: (v) => (!v.trim() ? "Last name is required" : ""),
  email: (v) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address" : "",
  password: (v) => {
    if (v.length < 8) return "At least 8 characters required";
    if (!/[A-Z]/.test(v)) return "Must include an uppercase letter";
    if (!/[a-z]/.test(v)) return "Must include a lowercase letter";
    if (!/[0-9]/.test(v)) return "Must include a number";
    if (!/[^A-Za-z0-9]/.test(v)) return "Must include a special character";
    return "";
  },
  confirmPassword: (v, pwd) => (v !== pwd ? "Passwords do not match" : ""),
  terms: (v) => (!v ? "You must agree to the terms" : ""),
};

// ─── Password strength meter ──────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const strength = passed <= 1 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";
  const barColor =
    passed <= 1 ? "bg-destructive" : passed <= 3 ? "bg-warning" : passed === 4 ? "bg-primary" : "bg-success";

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passed ? barColor : "bg-border"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${passed <= 1 ? "text-destructive" : passed <= 3 ? "text-warning" : "text-success"}`}>
        Password strength: {strength}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? "text-success" : "text-muted-foreground"}`}>
            {c.ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3 opacity-40" />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Field with error helper ──────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-destructive flex items-center gap-1">
      <XCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  );
}

// ─── Input wrapper ────────────────────────────────────────────────────────────
function FormInput({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Register component ─────────────────────────────────────────────────
export default function RegisterPage() {
  useEffect(() => {
    document.title = "Create Account — MedConnect";
  }, []);

  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    // Live validation for touched fields
    if (touched[key]) {
      const err =
        key === "confirmPassword"
          ? rules.confirmPassword(val, key === "confirmPassword" ? form.password : val)
          : rules[key]?.(val) ?? "";
      setErrors((prev) => ({ ...prev, [key]: err }));
    }
  };

  const blur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const err =
      key === "confirmPassword"
        ? rules.confirmPassword(form.confirmPassword, form.password)
        : rules[key]?.(form[key]) ?? "";
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const validate = () => {
    const e = {
      firstName: rules.firstName(form.firstName),
      lastName: rules.lastName(form.lastName),
      email: rules.email(form.email),
      password: rules.password(form.password),
      confirmPassword: rules.confirmPassword(form.confirmPassword, form.password),
      terms: rules.terms(form.terms),
    };
    setErrors(e);
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true, terms: true });
    return Object.values(e).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix the errors before continuing.", "error");
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast("Account created! Check your email for the OTP.", "success");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: form.email.trim().toLowerCase() } });
      }, 800);
    } catch (err) {
      toast(err.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full bg-input px-3 py-2.5 text-sm outline-none rounded-md border transition ${
      errors[key] && touched[key]
        ? "border-destructive focus:border-destructive"
        : "border-border focus:border-primary"
    }`;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] bg-card rounded-2xl border border-border shadow-elevated p-7">
          {/* Logo */}
          <div className="text-center mb-5">
            <Logo />
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Join MedConnect — your health, simplified.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="First Name" error={touched.firstName && errors.firstName} required>
                <input
                  id="register-firstName"
                  type="text"
                  placeholder="Rohan"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  onBlur={() => blur("firstName")}
                  className={inputClass("firstName")}
                  autoComplete="given-name"
                />
              </FormInput>

              <FormInput label="Last Name" error={touched.lastName && errors.lastName} required>
                <input
                  id="register-lastName"
                  type="text"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  onBlur={() => blur("lastName")}
                  className={inputClass("lastName")}
                  autoComplete="family-name"
                />
              </FormInput>
            </div>

            {/* Email */}
            <FormInput label="Email Address" error={touched.email && errors.email} required>
              <input
                id="register-email"
                type="email"
                placeholder="rohan@gmail.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => blur("email")}
                className={inputClass("email")}
                autoComplete="email"
              />
            </FormInput>

            {/* Password */}
            <FormInput label="Password" error={touched.password && errors.password} required>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  onBlur={() => blur("password")}
                  className={`${inputClass("password")} pr-10`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </FormInput>

            {/* Confirm Password */}
            <FormInput label="Confirm Password" error={touched.confirmPassword && errors.confirmPassword} required>
              <div className="relative">
                <input
                  id="register-confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  onBlur={() => blur("confirmPassword")}
                  className={`${inputClass("confirmPassword")} pr-10`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showConfirm ? "Hide" : "Show"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormInput>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    id="register-terms"
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.terms}
                    onChange={(e) => { set("terms", e.target.checked); blur("terms"); }}
                  />
                  <div className={`h-4 w-4 rounded border-2 transition-all peer-focus:ring-2 peer-focus:ring-primary/30 ${
                    form.terms ? "bg-primary border-primary" : errors.terms && touched.terms ? "border-destructive" : "border-border"
                  }`}>
                    {form.terms && (
                      <svg viewBox="0 0 12 12" fill="none" className="absolute inset-0 m-auto w-2.5 h-2.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>
              <FieldError msg={touched.terms && errors.terms} />
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-5 text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Portal links */}
        <div className="mt-6 text-xs text-text-muted text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link to="/private-chamber/login" className="hover:text-foreground">Chamber doctor</Link>
            <span>·</span>
            <Link to="/hospital-doctor/login" className="hover:text-foreground">Hospital doctor</Link>
            <span>·</span>
            <Link to="/staff/login" className="hover:text-foreground">Hospital staff</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </>
  );
}
