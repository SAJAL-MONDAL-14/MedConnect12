import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Navbar";
import { Mail, Lock, Stethoscope, ChevronDown } from "lucide-react";

const HOSPITALS = [
  "North Bengal Medical College",
  "Siliguri District Hospital",
  "CityMed Multispeciality",
  "Neotia Getwel Hospital",
];

export default function HospitalDoctorLogin() {
  const [hospital, setHospital] = useState(HOSPITALS[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Hospital Doctor login — MedConnect";
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden bg-gradient-to-br from-success-dark via-success to-primary">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative">
          <Logo className="text-white" />
        </div>
        <div className="relative">
          <Stethoscope className="h-12 w-12 mb-6 opacity-80" strokeWidth={1.2} />
          <h2 className="text-3xl font-bold leading-tight">Your patients.<br />Your schedule.<br />Your dashboard.</h2>
          <p className="mt-4 text-white/70 max-w-md">See every booking, patient note, payment status, and slot — all in one place built for hospital doctors.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[{ v: "320+", l: "Doctors" }, { v: "1.2k", l: "Bookings/day" }, { v: "4.8★", l: "Avg rating" }].map((s) => (
              <div key={s.l} className="rounded-lg bg-white/10 backdrop-blur border border-white/15 p-3">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/60">{s.l}</div>
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
          <h1 className="text-2xl font-bold">Doctor sign in</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Access your OPD schedule, bookings & patient records.</p>

          <div className="space-y-3">
            {/* Hospital selector */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Your hospital</label>
              <div className="relative">
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="w-full flex items-center justify-between gap-2 rounded-md border border-border bg-input px-3 py-2.5 text-sm focus:border-primary text-left"
                >
                  <span className="truncate">{hospital}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="absolute z-20 top-full mt-1 w-full rounded-md bg-card border border-border shadow-elevated py-1">
                    {HOSPITALS.map((h) => (
                      <button
                        key={h}
                        onClick={() => { setHospital(h); setOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition ${hospital === h ? "text-primary font-medium" : "text-foreground"}`}
                      >
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
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input type="email" defaultValue="dr.sharma@nbmc.in" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Password</label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input type="password" defaultValue="••••••••" className="flex-1 bg-transparent py-2.5 text-sm outline-none font-mono" />
              </div>
            </div>
          </div>

          <Link
            to="/hospital-doctor/dashboard"
            className="mt-5 block text-center rounded-md bg-success text-success-foreground py-2.5 text-sm font-semibold hover:bg-success-dark transition"
          >
            Sign in to my dashboard
          </Link>

          <div className="mt-4 flex justify-between text-xs">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Patient login</Link>
            <a className="text-success hover:underline cursor-pointer">Forgot password?</a>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-success-soft border border-success/20 text-xs">
            <div className="font-semibold text-success mb-1">Not a hospital doctor?</div>
            <div className="flex flex-wrap gap-2 text-muted-foreground">
              <Link to="/staff/login" className="hover:text-foreground underline">Hospital staff</Link>
              <span>·</span>
              <Link to="/clinic/login" className="hover:text-foreground underline">Clinic doctor</Link>
              <span>·</span>
              <Link to="/admin/login" className="hover:text-foreground underline">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}