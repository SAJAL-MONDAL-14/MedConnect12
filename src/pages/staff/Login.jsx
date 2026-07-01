import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Navbar";
import {
  Mail,
  Lock,
  Building2,
  BedDouble,
  CreditCard,
  ClipboardList,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const ROLES = [
  {
    id: "admin",
    label: "Hospital Admin",
    desc: "Full access — beds, doctors, staff, revenue, reports",
    icon: ShieldCheck,
    color: "primary",
    route: "/staff/dashboard/admin",
  },
  {
    id: "opd",
    label: "OPD Receptionist",
    desc: "Manage OPD queue, walk-ins and patient check-in",
    icon: ClipboardList,
    color: "success",
    route: "/staff/dashboard/opd",
  },
  {
    id: "ward",
    label: "Ward / ICU Staff",
    desc: "Update bed availability, ICU counts, OT and ambulance",
    icon: BedDouble,
    color: "warning",
    route: "/staff/dashboard/ward",
  },
  {
    id: "billing",
    label: "Billing Staff",
    desc: "Collect payments, view ledger and export reports",
    icon: CreditCard,
    color: "emergency",
    route: "/staff/dashboard/billing",
  },
];

export default function StaffLogin() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = "Staff login — MedConnect";
  }, []);

  const role = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative">
          <Logo className="text-white" />
        </div>
        <div className="relative">
          <Building2 className="h-12 w-12 mb-6 opacity-80" strokeWidth={1.2} />
          <h2 className="text-3xl font-bold leading-tight">
            {role ? `${role.label} Portal` : "Real-time hospital\noperations portal."}
          </h2>
          <p className="mt-4 text-white/70 max-w-md">
            Each role sees only what they need — no clutter, just the right tools.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { v: "48", l: "Hospitals" },
              { v: "1.2k", l: "Bookings/day" },
              { v: "<2s", l: "Update lag" },
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
        <div className="relative text-xs text-white/50">© 2025 MedConnect Health</div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
            Hospital Portal
          </div>

          {!showForm ? (
            <>
              <h1 className="text-2xl font-bold">Staff sign in</h1>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Select your role to continue.
              </p>
              <div className="space-y-2 mb-5">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full text-left rounded-xl border-2 p-4 flex items-center gap-3 transition ${
                      selectedRole === r.id
                        ? `border-${r.color} bg-${r.color}-soft`
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition ${
                        selectedRole === r.id
                          ? `bg-${r.color} text-${r.color}-foreground`
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <r.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                    {selectedRole === r.id && (
                      <ChevronRight className={`h-4 w-4 text-${r.color} shrink-0`} />
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedRole}
                onClick={() => setShowForm(true)}
                className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
              <div className="mt-4 flex justify-between text-xs">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">
                  Patient login
                </Link>
                <Link to="/hospital-doctor/login" className="text-primary hover:underline">
                  Hospital doctor
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1"
              >
                ← Change role
              </button>
              {role && (
                <div
                  className={`mb-5 rounded-lg bg-${role.color}-soft border border-${role.color}/20 px-3 py-2 text-xs font-semibold text-${role.color}`}
                >
                  Signing in as: {role.label}
                </div>
              )}
              <h1 className="text-2xl font-bold mb-5">Enter credentials</h1>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Work email
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      defaultValue="staff@nbmc.in"
                      className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                    Password
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      defaultValue="••••••••"
                      className="flex-1 bg-transparent py-2.5 text-sm outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => role && navigate(role.route)}
                className="mt-5 w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
              >
                Sign in to dashboard
              </button>
              <div className="mt-3 text-center">
                <a className="text-xs text-primary hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
