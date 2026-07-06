// ─────────────────────────────────────────────────────────────────────────────
// hospital-doctor.login.jsx
// TWO scenarios handled:
//   1. Normal login → goes to dashboard
//   2. First-time login (activation link) → goes to /hospital-doctor/complete-profile
// ─────────────────────────────────────────────────────────────────────────────
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Navbar";
import { Mail, Lock, Stethoscope, ChevronDown, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";

const HOSPITALS = [
  "North Bengal Medical College",
  "Siliguri District Hospital",
  "CityMed Multispeciality",
  "Neotia Getwel Hospital",
];

export default function HospitalDoctorLogin() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(HOSPITALS[0]);
  const [open,     setOpen]     = useState(false);
  const [email,    setEmail]    = useState("dr.kavya@nbmc.in");
  const [password, setPassword] = useState("");
  // Simulate: isFirstLogin = true when coming via activation link
  // In production this would be detected from a token in the URL
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [tab, setTab] = useState("login"); // "login" | "activate"

  useEffect(() => { document.title = "Hospital Doctor login — MedConnect"; }, []);

  const handleLogin = () => {
    // First-time login → redirect to profile completion
    if (isFirstLogin) {
      navigate("/hospital-doctor/complete-profile");
    } else {
      navigate("/hospital-doctor/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden bg-gradient-to-br from-success-dark via-success to-primary">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative"><Logo className="text-white" /></div>
        <div className="relative">
          <Stethoscope className="h-12 w-12 mb-6 opacity-80" strokeWidth={1.2} />
          <h2 className="text-3xl font-bold leading-tight">Your patients.<br />Your schedule.<br />Your dashboard.</h2>
          <p className="mt-4 text-white/70 max-w-md">See every booking, patient note, payment status, and slot — all in one place built for hospital doctors.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[{ v:"320+", l:"Doctors" },{ v:"1.2k", l:"Bookings/day" },{ v:"4.8★", l:"Avg rating" }].map(s=>(
              <div key={s.l} className="rounded-lg bg-white/10 backdrop-blur border border-white/15 p-3">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
          {/* Status flow */}
          <div className="mt-8 space-y-2">
            <div className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-3">Onboarding flow</div>
            {["Doctor Added","Invitation Sent","Pending Activation","Profile Submitted","Under Review","Approved ✓"].map((s,i)=>(
              <div key={s} className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i===5?"bg-success text-success-foreground":i<3?"bg-white/20 text-white":"bg-white/10 text-white/50"}`}>
                  {i < 3 ? "✓" : i+1}
                </div>
                <span className={`text-xs ${i===5?"text-success font-semibold":i<3?"text-white":"text-white/50"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/50">© 2025 MedConnect Health</div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6"><Logo /></div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-success font-bold mb-2">Hospital Doctor Portal</div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            <button onClick={()=>setTab("login")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${tab==="login"?"bg-card text-foreground shadow-sm":"text-muted-foreground"}`}>
              Sign in
            </button>
            <button onClick={()=>setTab("activate")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${tab==="activate"?"bg-card text-foreground shadow-sm":"text-muted-foreground"}`}>
              Activate account
            </button>
          </div>

          {tab === "login" && (
            <>
              <h1 className="text-2xl font-bold">Doctor sign in</h1>
              <p className="text-sm text-muted-foreground mt-1 mb-5">Access your OPD schedule, bookings & patient records.</p>

              <div className="space-y-3">
                {/* Hospital */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Your hospital</label>
                  <div className="relative">
                    <button onClick={()=>setOpen(o=>!o)}
                      className="w-full flex items-center justify-between gap-2 rounded-md border border-border bg-input px-3 py-2.5 text-sm text-left focus:border-primary">
                      <span className="truncate">{hospital}</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition ${open?"rotate-180":""}`}/>
                    </button>
                    {open && (
                      <div className="absolute z-20 top-full mt-1 w-full rounded-md bg-card border border-border shadow-elevated py-1">
                        {HOSPITALS.map(h=>(
                          <button key={h} onClick={()=>{setHospital(h);setOpen(false);}}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition ${hospital===h?"text-primary font-medium":"text-foreground"}`}>
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Work email</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <Mail className="h-4 w-4 text-muted-foreground"/>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 bg-transparent py-2.5 text-sm outline-none"/>
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Password</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <Lock className="h-4 w-4 text-muted-foreground"/>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent py-2.5 text-sm outline-none font-mono"/>
                  </div>
                </div>
              </div>

              {/* First-time login toggle (simulates activation link scenario) */}
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-warning-soft border border-warning/20">
                <button onClick={()=>setIsFirstLogin(f=>!f)}
                  className={`relative inline-flex h-5 w-9 rounded-full transition shrink-0 ${isFirstLogin?"bg-warning":"bg-muted"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all ${isFirstLogin?"left-[18px]":"left-0.5"}`}/>
                </button>
                <span className="text-xs text-warning font-medium">
                  {isFirstLogin ? "First-time login (activation link) → will show profile completion" : "Returning doctor → goes to dashboard"}
                </span>
              </div>

              <button onClick={handleLogin}
                className="mt-5 w-full block text-center rounded-md bg-success text-success-foreground py-2.5 text-sm font-semibold hover:bg-success-dark transition">
                {isFirstLogin ? "Activate & complete profile →" : "Sign in to my dashboard"}
              </button>
              <div className="mt-4 flex justify-between text-xs">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">Patient login</Link>
                <a className="text-success hover:underline cursor-pointer">Forgot password?</a>
              </div>
            </>
          )}

          {tab === "activate" && (
            <>
              <h1 className="text-2xl font-bold">Activate your account</h1>
              <p className="text-sm text-muted-foreground mt-1 mb-5">Use the activation link sent to your email, or enter your token below.</p>
              <div className="rounded-lg bg-primary-soft border border-primary/20 px-4 py-3 text-xs text-primary mb-4 flex items-start gap-2">
                <Mail className="h-4 w-4 shrink-0 mt-0.5"/>
                Check your inbox for an email from <span className="font-semibold mx-1">MedConnect</span> with your activation link. The link will automatically log you in and redirect you to complete your profile.
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Work email</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <Mail className="h-4 w-4 text-muted-foreground"/>
                    <input type="email" placeholder="dr.kavya@nbmc.in" className="flex-1 bg-transparent py-2.5 text-sm outline-none"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Activation token</label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <KeyRound className="h-4 w-4 text-muted-foreground"/>
                    <input placeholder="Paste token from email..." className="flex-1 bg-transparent py-2.5 text-sm outline-none font-mono"/>
                  </div>
                </div>
              </div>
              <button onClick={()=>navigate("/hospital-doctor/complete-profile")}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition">
                <ArrowRight className="h-4 w-4"/> Activate & complete profile
              </button>
              <p className="mt-3 text-xs text-center text-muted-foreground">
                Already activated? <button onClick={()=>setTab("login")} className="text-primary font-semibold hover:underline">Sign in</button>
              </p>
            </>
          )}

          <div className="mt-6 p-3 rounded-lg bg-secondary border border-border text-xs">
            <div className="font-semibold text-foreground mb-1">Not a hospital doctor?</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
              <Link to="/staff/login" className="hover:text-foreground underline">Hospital staff</Link>
              <Link to="/clinic/login" className="hover:text-foreground underline">Clinic doctor</Link>
              <Link to="/admin/login" className="hover:text-foreground underline">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}