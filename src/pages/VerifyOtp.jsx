import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/Navbar";
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import { verifyOtp, resendOtp } from "@/services/authService";
import { ToastContainer, useToast } from "@/components/Toast";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const { toasts, toast, removeToast } = useToast();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  useEffect(() => {
    document.title = "Verify Email — MedConnect";
    // Auto-focus first box
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate("/register");
  }, [email]);

  const handleChange = (index, value) => {
    // Accept only single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      toast("Please enter the complete 6-digit OTP.", "error");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otp: code });
      toast("Email verified successfully! Please login.", "success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast(err.message || "Invalid OTP. Please try again.", "error");
      // Shake: clear and refocus
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      await resendOtp({ email });
      toast("OTP resent! Check your inbox.", "success");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast(err.message || "Failed to resend OTP.", "error");
    } finally {
      setResending(false);
    }
  };

  const formatCooldown = (s) => `0:${String(s).padStart(2, "0")}`;

  const allFilled = otp.every((d) => d !== "");

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[380px] bg-card rounded-2xl border border-border shadow-elevated p-7">
          {/* Back */}
          <button
            onClick={() => navigate("/register")}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm mb-5 transition"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {/* Logo */}
          <div className="text-center mb-5">
            <Logo />
          </div>

          {/* Header */}
          <h1 className="text-xl font-bold">Verify your email</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-1">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-semibold text-primary font-mono mb-5 break-all">{email}</p>

          {/* OTP Boxes */}
          <div className="flex justify-between gap-2 mb-1" onPaste={handlePaste}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                id={`otp-box-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={v}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-14 w-12 text-center font-mono text-xl font-bold rounded-lg border outline-none transition-all duration-150 bg-card
                  ${v ? "border-primary text-primary shadow-[0_0_0_3px_var(--color-primary-soft)]" : "border-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)]"}
                `}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              id="otp-resend"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`flex items-center gap-1.5 text-xs font-medium transition ${
                cooldown > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline cursor-pointer"
              }`}
            >
              {resending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {cooldown > 0 ? `Resend OTP in ${formatCooldown(cooldown)}` : "Resend OTP"}
            </button>
          </div>

          {/* Verify Button */}
          <button
            id="otp-verify"
            onClick={handleVerify}
            disabled={loading || !allFilled}
            className="mt-5 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Login link */}
          <p className="mt-5 text-xs text-center text-muted-foreground">
            Already verified?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
