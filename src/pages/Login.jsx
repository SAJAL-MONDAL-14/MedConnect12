import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/Navbar";
import { ChevronLeft, Pencil, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginWithPassword } from "@/services/authService";
import { ToastContainer, useToast } from "@/components/Toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function sendLoginOtp(email) {
  const res = await fetch(`${BASE}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to send OTP");
  return data;
}

async function verifyLoginOtp(email, otp) {
  const res = await fetch(`${BASE}/api/auth/verify-login-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Invalid OTP");
  return data;
}

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login — MedConnect";
  }, []);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  // "otp" | "password"
  const [mode, setMode] = useState("password");
  // step 1 = enter email(/password), step 2 = enter OTP
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // OTP resend countdown
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Password login ──────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast("Please enter your email.", "error"); return; }
    if (!password) { toast("Please enter your password.", "error"); return; }
    setLoading(true);
    try {
      const data = await loginWithPassword({ email: email.trim().toLowerCase(), password });
      login(data.user || { email }, data.token);
      toast("Welcome back!", "success");
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      toast(err.message || "Login failed. Check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP login — step 1: send OTP ───────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address.", "error");
      return;
    }
    setLoading(true);
    try {
      await sendLoginOtp(email.trim().toLowerCase());
      setStep(2);
      setCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      toast("OTP sent to your email.", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP login — step 2: verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { toast("Enter the complete 6-digit OTP.", "error"); return; }
    setLoading(true);
    try {
      const data = await verifyLoginOtp(email.trim().toLowerCase(), code);
      login(data.user || { email }, data.token);
      toast("Logged in successfully!", "success");
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      toast(err.message || "Invalid OTP.", "error");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await sendLoginOtp(email.trim().toLowerCase());
      setCooldown(60);
      toast("OTP resent!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace") {
      if (otp[i]) { const n = [...otp]; n[i] = ""; setOtp(n); }
      else if (i > 0) otpRefs.current[i - 1]?.focus();
    }
  };

  const formatCd = (s) => `0:${String(s).padStart(2, "0")}`;

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[380px] bg-card rounded-2xl border border-border shadow-elevated p-7">

          {/* Step 1 — Email / Password */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <Logo />
              </div>
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground mt-1 mb-5">
                {mode === "password" ? "Sign in with your email & password" : "Sign in with a one-time code"}
              </p>

              {/* Mode toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden mb-5 text-xs font-semibold">
                <button
                  onClick={() => setMode("password")}
                  className={`flex-1 py-2 transition ${mode === "password" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  Password
                </button>
                <button
                  onClick={() => setMode("otp")}
                  className={`flex-1 py-2 transition ${mode === "otp" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  Email OTP
                </button>
              </div>

              <form onSubmit={mode === "password" ? handlePasswordLogin : handleSendOtp} noValidate className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="xyz@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input px-3 py-2.5 text-sm outline-none rounded-md border border-border focus:border-primary transition"
                    autoComplete="email"
                  />
                </div>

                {/* Password field (only in password mode) */}
                {mode === "password" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs text-muted-foreground font-medium">Password</label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-input px-3 py-2.5 pr-10 text-sm outline-none rounded-md border border-border focus:border-primary transition"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                        aria-label={showPassword ? "Hide" : "Show"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? (mode === "password" ? "Signing in…" : "Sending OTP…") : (mode === "password" ? "Sign In" : "Send OTP")}
                </button>
              </form>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Register
                </Link>
              </p>

              {/* Language switcher */}
              <div className="mt-6 flex justify-center">
                <div className="inline-flex rounded-full border border-border p-0.5 bg-secondary">
                  {["EN", "हि", "বা"].map((l, i) => (
                    <button
                      key={l}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2 — OTP Verification (login OTP mode) */}
          {step === 2 && (
            <>
              <button
                onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm mb-4 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-xl font-bold">Verify your email</h1>
              <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-2">
                <span className="font-mono text-primary">{email}</span>
                <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground transition">
                  <Pencil className="h-3 w-3" />
                </button>
              </p>
              <p className="text-sm text-muted-foreground mt-3 mb-5">Enter the 6-digit code sent to your email.</p>

              <div className="flex justify-between gap-1.5 mb-1">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    id={`login-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className={`h-14 w-12 text-center font-mono text-lg font-semibold rounded-md border bg-card outline-none transition ${
                      v ? "border-primary text-primary" : "border-border focus:border-primary"
                    }`}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs text-center">
                {cooldown > 0 ? (
                  <span className="text-muted-foreground font-mono">Resend OTP in {formatCd(cooldown)}</span>
                ) : (
                  <button onClick={handleResendOtp} className="text-primary hover:underline text-xs font-medium">
                    Resend OTP
                  </button>
                )}
              </p>

              <button
                id="login-verify-otp"
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className="mt-5 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Verifying…" : "Verify & Login"}
              </button>
            </>
          )}
        </div>

        {/* All portal links */}
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
