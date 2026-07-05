import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Logo } from "@/components/Navbar";
import { Mail, Lock, Stethoscope } from "lucide-react";

export default function PrivateChamberLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dr.kapoor@skincare.in");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [shouldLogin, setShouldLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Private chamber login — MedConnect";
  }, []);

  // Email validation effect
  useEffect(() => {
    if (!email) {
      setEmailError("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }, [email]);

  // Password validation effect
  useEffect(() => {
    if (!password) {
      setPasswordError("");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  }, [password]);

  // Login API effect
  useEffect(() => {
    if (!shouldLogin) return;

    const performLogin = async () => {
      setIsSubmitting(true);
      try {
        const response = await api.post("/api/private-chamber/login", {
          gmail: email,
          password: password,
        });

        if (response.data.success) {
          const { clinic, accessToken } = response.data.data;
          localStorage.setItem("clinic_doctor", JSON.stringify(clinic));
          localStorage.setItem("accessToken", accessToken);
          navigate("/private-chamber/dashboard");
        } else {
          alert(response.data.error || "Login failed.");
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || err.message || "An error occurred during login.");
      } finally {
        setIsSubmitting(false);
        setShouldLogin(false);
      }
    };

    performLogin();
  }, [shouldLogin, email, password, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-foreground">
        <Logo className="text-white" />
        <div>
          <Stethoscope className="h-12 w-12 mb-6 opacity-80" strokeWidth={1.2} />
          <h2 className="text-3xl font-bold leading-tight">
            Run your clinic.
            <br />
            Grow your practice.
          </h2>
          <p className="mt-4 text-white/70 max-w-md">
            Manage appointments, patients, and earnings from one beautiful dashboard built for
            independent doctors.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { v: "320+", l: "Chamber doctors" },
              { v: "12k", l: "Bookings/mo" },
              { v: "4.8★", l: "Avg rating" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg bg-white/10 backdrop-blur border border-white/15 p-3"
              >
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-white/50">© 2025 MedConnect Health</div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
            Private Chamber Portal
          </div>
          <h1 className="text-2xl font-bold">Doctor sign in</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Manage your private chamber appointments and patients.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Email
              </label>
              <div
                className={`flex items-center gap-2 rounded-md border bg-input px-3 transition ${emailError ? "border-emergency" : "focus-within:border-primary"}`}
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.kapoor@skincare.in"
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                />
              </div>
              {emailError && (
                <p className="text-emergency text-[11px] mt-1 font-medium">{emailError}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Password
              </label>
              <div
                className={`flex items-center gap-2 rounded-md border bg-input px-3 transition ${passwordError ? "border-emergency" : "focus-within:border-primary"}`}
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none font-mono"
                />
              </div>
              {passwordError && (
                <p className="text-emergency text-[11px] mt-1 font-medium">{passwordError}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting || !email || !password || emailError || passwordError}
            onClick={() => setShouldLogin(true)}
            className="mt-5 w-full block text-center rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign in to chamber"}
          </button>
          <div className="mt-4 flex justify-between text-xs">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              Patient login
            </Link>
            <Link to="/staff/login" className="text-muted-foreground hover:text-foreground">
              Hospital staff
            </Link>
          </div>
          <div className="mt-6 p-3 rounded-lg bg-primary-soft text-xs">
            <div className="font-semibold text-primary mb-1">New to MedConnect?</div>
            <span className="text-muted-foreground">
              Register your private chamber to start receiving online bookings.{" "}
            </span>
            <Link
              to="/private-chamber/register"
              className="text-primary font-semibold hover:underline"
            >
              Register now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
