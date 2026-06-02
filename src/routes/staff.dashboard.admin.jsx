import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users,
  BarChart3, Settings, LogOut, Bell, Plus, Minus,
  CheckCircle2, X, Eye, Search, Stethoscope,
  CreditCard, Siren, ShieldCheck, TrendingUp,
  Clock, AlertCircle, Building2, RefreshCw
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BedDouble,       label: "Availability" },
  { icon: CalendarCheck,   label: "Appointments" },
  { icon: Users,           label: "Doctors" },
  { icon: Users,           label: "Staff" },
  { icon: CreditCard,      label: "Revenue" },
  { icon: Siren,           label: "SOS Events" },
  { icon: BarChart3,       label: "Reports" },
  { icon: Settings,        label: "Settings" },
];

const initialDocs = [
  { id: 1, name: "Dr. Rajesh Sharma", initials: "RS", specialty: "Cardiologist",  fee: 500, active: true,  today: 10 },
  { id: 2, name: "Dr. Priya Das",     initials: "PD", specialty: "Cardiologist",  fee: 450, active: true,  today: 8  },
  { id: 3, name: "Dr. Arjun Mehta",   initials: "AM", specialty: "Neurologist",   fee: 700, active: false, today: 0  },
  { id: 4, name: "Dr. Sneha Roy",     initials: "SR", specialty: "Pediatrician",  fee: 400, active: true,  today: 6  },
];

const initialStaff = [
  { id: 1, name: "Pooja Rao",      role: "OPD Receptionist", shift: "Morning",   active: true  },
  { id: 2, name: "Ravi Verma",     role: "Ward Staff",       shift: "Morning",   active: true  },
  { id: 3, name: "Sunita Kumari",  role: "Billing Staff",    shift: "Morning",   active: true  },
  { id: 4, name: "Arif Khan",      role: "Ward Staff",       shift: "Evening",   active: false },
  { id: 5, name: "Deepa Singh",    role: "OPD Receptionist", shift: "Evening",   active: true  },
];

const sosEvents = [
  { id: 1, patient: "Anita Kumar",  time: "10:24 AM", eta: "8 min",  status: "Resolved", bed: "ICU Room 2" },
  { id: 2, patient: "Vikram Roy",   time: "11:42 AM", eta: "14 min", status: "Resolved", bed: "ICU Room 4" },
  { id: 3, patient: "Priya Sen",    time: "1:08 PM",  eta: "22 min", status: "Active",   bed: "Pending"    },
];

const weeklyBookings = [
  { d: "Mon", v: 42 }, { d: "Tue", v: 56 }, { d: "Wed", v: 38 },
  { d: "Thu", v: 71 }, { d: "Fri", v: 65 }, { d: "Sat", v: 58 }, { d: "Sun", v: 48 },
];
const maxV = Math.max(...weeklyBookings.map((d) => d.v));

function StatusChip({ s }) {
  const map = {
    Active:   "bg-primary-soft text-primary",
    Resolved: "bg-success-soft text-success",
    Pending:  "bg-warning-soft text-warning",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "bg-muted"}`}>{s}</span>;
}

function ToggleRow({ label, desc, on, setOn }) {
  return (
    <div className="flex items-center justify-between">
      <div><div className="font-semibold text-sm">{label}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
      <button onClick={() => setOn(!on)} className={`relative inline-flex h-7 w-12 rounded-full transition ${on ? "bg-success" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function HospitalAdminDashboard() {
  const [view,    setView]  = useState("Dashboard");
  const [general, setGen]   = useState(12);
  const [icu,     setIcu]   = useState(3);
  const [ot,      setOt]    = useState(true);
  const [amb,     setAmb]   = useState(true);
  const [docs,    setDocs]  = useState(initialDocs);
  const [staff,   setStaff] = useState(initialStaff);
  const [saved,   setSaved] = useState("2 min ago");

  useEffect(() => { document.title = "Hospital Admin — MedConnect"; }, []);

  const save = () => setSaved("just now");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 text-white" style={{ background: "var(--gradient-hero)" }}>
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">Med<span className="text-white/60">Connect</span></div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Hospital Admin</div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold ring-2 ring-white/30">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Admin · NBMC</div>
            <div className="text-[10px] text-white/60">Full access</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((n) => (
            <button key={n.label} onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left
                ${view === n.label ? "bg-white/15 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}>
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="mx-3 mb-3 rounded-lg bg-white/10 border border-white/15 p-3 space-y-1.5">
          <div className="flex justify-between text-[10px] text-white/60"><span>General free</span><span className="font-mono font-bold text-white">{general}</span></div>
          <div className="flex justify-between text-[10px] text-white/60"><span>ICU free</span><span className={`font-mono font-bold ${icu === 0 ? "text-red-300" : "text-white"}`}>{icu}</span></div>
          <div className="flex justify-between text-[10px] text-white/60"><span>OT</span><span className={`font-semibold ${ot ? "text-green-300" : "text-red-300"}`}>{ot ? "Open" : "Closed"}</span></div>
        </div>
        <Link to="/staff/login" className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">{view === "Dashboard" ? "Good morning, Admin 👋" : view}</div>
            <div className="text-xs text-muted-foreground">North Bengal Medical College · Full access</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-success"><span className="live-dot" /> Live connected</span>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-3">
          {navItems.map((n) => (
            <button key={n.label} onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2
                ${view === n.label ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
              {n.label}
            </button>
          ))}
        </div>

        <main className="p-6 space-y-6">

          {/* ── DASHBOARD ── */}
          {view === "Dashboard" && (
            <>
              {/* Hero */}
              <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                <div className="relative flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/70 font-bold">Hospital overview — Today</div>
                    <h2 className="mt-1 text-2xl font-bold">Everything looks operational 🟢</h2>
                    <p className="text-sm text-white/80 mt-1">42 bookings · 12 general beds free · 3 ICU beds free · 2 SOS resolved</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
                      <div className="text-[10px] text-white/70">Active staff</div>
                      <div className="text-xl font-bold">{staff.filter(s=>s.active).length}</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
                      <div className="text-[10px] text-white/70">Doctors on duty</div>
                      <div className="text-xl font-bold">{docs.filter(d=>d.active).length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Bookings today", value: "42",  delta: "+8 vs yesterday", tone: "primary",   icon: CalendarCheck },
                  { label: "General beds",   value: general, delta: `of 30 available`, tone: "success",   icon: BedDouble     },
                  { label: "ICU beds",        value: icu,   delta: `of 8 total`,       tone: icu<=2?"emergency":"warning", icon: Stethoscope },
                  { label: "Revenue today",  value: "₹21k", delta: "+12%",             tone: "success",   icon: CreditCard    },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="flex items-center justify-between">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
                    <div className={`mt-1 text-2xl font-bold text-${s.tone}`}>{s.value}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{s.delta}</div>
                  </div>
                ))}
              </div>

              {/* Chart + SOS */}
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
                {/* Bookings chart */}
                <div className="rounded-xl bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Bookings this week</h2>
                    <span className="text-xs text-success font-semibold">+14% vs last week</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-40 mb-2">
                    {weeklyBookings.map((c, i) => (
                      <div key={c.d} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="text-[9px] font-mono text-muted-foreground">{c.v}</div>
                        <div className="w-full rounded-t-md transition hover:opacity-80" style={{ height: `${(c.v/maxV)*100}%`, background: i===6?"var(--color-success)":"var(--color-primary)" }} />
                        <div className="text-[10px] text-muted-foreground">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SOS events */}
                <div className="rounded-xl bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">SOS events today</h2>
                    <span className="text-xs text-primary cursor-pointer hover:underline" onClick={() => setView("SOS Events")}>View all</span>
                  </div>
                  <div className="space-y-3">
                    {sosEvents.map((e) => (
                      <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition">
                        <div className="h-8 w-8 rounded-full bg-emergency-soft text-emergency flex items-center justify-center">
                          <Siren className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{e.patient}</div>
                          <div className="text-xs text-muted-foreground">{e.time} · ETA {e.eta} · {e.bed}</div>
                        </div>
                        <StatusChip s={e.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctors + Staff quick view */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Doctors on duty</h2>
                    <button onClick={() => setView("Doctors")} className="text-xs text-primary hover:underline">Manage</button>
                  </div>
                  <div className="space-y-2">
                    {docs.map((d) => (
                      <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{d.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.specialty} · {d.today} patients today</div>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${d.active ? "bg-success" : "bg-muted"}`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Staff on duty</h2>
                    <button onClick={() => setView("Staff")} className="text-xs text-primary hover:underline">Manage</button>
                  </div>
                  <div className="space-y-2">
                    {staff.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition">
                        <div className="h-8 w-8 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-bold">
                          {s.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.role} · {s.shift} shift</div>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${s.active ? "bg-success" : "bg-muted"}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── AVAILABILITY ── */}
          {view === "Availability" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-lg">Bed availability control</h2>
                    <p className="text-xs text-muted-foreground">Changes broadcast instantly to patient-facing app.</p>
                  </div>
                  <span className="text-xs text-success inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved {saved}
                  </span>
                </div>
                <div className="space-y-5">
                  {/* General beds */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">General beds</div>
                      <div className="text-xs text-muted-foreground">Available out of 30 total</div>
                      <div className="mt-2 h-2 w-48 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(general/30)*100}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono">{general}/30 free</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setGen(Math.max(0,general-1)); save(); }} className="h-9 w-9 rounded-full border border-border hover:border-primary flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                      <div className="text-3xl font-bold font-mono text-primary w-10 text-center">{general}</div>
                      <button onClick={() => { setGen(Math.min(30,general+1)); save(); }} className="h-9 w-9 rounded-full border border-border hover:border-primary flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="border-t border-border" />
                  {/* ICU */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">ICU beds</div>
                      <div className="text-xs text-muted-foreground">Critical care · 8 total</div>
                      <div className="mt-2 h-2 w-48 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${icu<=2?"bg-emergency":icu<=4?"bg-warning":"bg-success"}`} style={{ width: `${(icu/8)*100}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono">{icu}/8 free</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setIcu(Math.max(0,icu-1)); save(); }} className="h-9 w-9 rounded-full border border-border hover:border-warning flex items-center justify-center"><Minus className="h-4 w-4" /></button>
                      <div className={`text-3xl font-bold font-mono w-10 text-center ${icu===0?"text-emergency":icu<=2?"text-warning":"text-success"}`}>{icu}</div>
                      <button onClick={() => { setIcu(Math.min(8,icu+1)); save(); }} className="h-9 w-9 rounded-full border border-border hover:border-warning flex items-center justify-center"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="border-t border-border" />
                  <ToggleRow label="OT Available"  desc="Operating theatre status" on={ot}  setOn={(v)=>{setOt(v);save();}} />
                  <div className="border-t border-border" />
                  <ToggleRow label="Ambulance"     desc="24/7 dispatch ready"      on={amb} setOn={(v)=>{setAmb(v);save();}} />
                </div>
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {view === "Appointments" && (
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">Today's appointments — All departments</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Time</th>
                      <th className="text-left px-6 py-3 font-medium">Patient</th>
                      <th className="text-left px-6 py-3 font-medium">Doctor</th>
                      <th className="text-left px-6 py-3 font-medium">Type</th>
                      <th className="text-left px-6 py-3 font-medium">Fee</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { time:"09:00",patient:"Anita Kumar",doctor:"Dr. Sharma",type:"New",fee:500,status:"Done" },
                      { time:"09:30",patient:"Rahul Das",doctor:"Dr. Sharma",type:"Follow-up",fee:300,status:"Done" },
                      { time:"10:00",patient:"Meera Pal",doctor:"Dr. Sharma",type:"New",fee:500,status:"With Doctor" },
                      { time:"10:30",patient:"Vikram Roy",doctor:"Dr. Sharma",type:"New",fee:500,status:"Waiting" },
                      { time:"11:00",patient:"Sneha Bose",doctor:"Dr. Das",type:"Follow-up",fee:300,status:"Waiting" },
                      { time:"11:30",patient:"Arun Ghosh",doctor:"Dr. Mehta",type:"New",fee:700,status:"Scheduled" },
                    ].map((a,i)=>(
                      <tr key={i} className="hover:bg-secondary/50">
                        <td className="px-6 py-3 font-mono text-xs">{a.time}</td>
                        <td className="px-6 py-3 font-medium">{a.patient}</td>
                        <td className="px-6 py-3 text-muted-foreground">{a.doctor}</td>
                        <td className="px-6 py-3 text-xs text-muted-foreground">{a.type}</td>
                        <td className="px-6 py-3 font-mono">₹{a.fee}</td>
                        <td className="px-6 py-3"><StatusChip s={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DOCTORS ── */}
          {view === "Doctors" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold">Doctors ({docs.length})</h2>
                  <button className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add doctor
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Doctor</th>
                      <th className="text-left px-6 py-3 font-medium">Specialty</th>
                      <th className="text-left px-6 py-3 font-medium">Fee</th>
                      <th className="text-left px-6 py-3 font-medium">Today</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-right px-6 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {docs.map((d) => (
                      <tr key={d.id} className="hover:bg-secondary/50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{d.initials}</div>
                            <span className="font-medium">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{d.specialty}</td>
                        <td className="px-6 py-3 font-mono">₹{d.fee}</td>
                        <td className="px-6 py-3 font-mono">{d.today} pts</td>
                        <td className="px-6 py-3">
                          <button onClick={() => setDocs(docs.map(x=>x.id===d.id?{...x,active:!x.active}:x))}
                            className={`relative inline-flex h-6 w-11 rounded-full transition ${d.active?"bg-success":"bg-muted"}`}>
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${d.active?"left-[22px]":"left-0.5"}`} />
                          </button>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={()=>setDocs(docs.filter(x=>x.id!==d.id))} className="p-1.5 rounded hover:bg-emergency-soft text-emergency">
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STAFF ── */}
          {view === "Staff" && (
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Staff accounts ({staff.length})</h2>
                <button className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add staff
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Role</th>
                    <th className="text-left px-6 py-3 font-medium">Shift</th>
                    <th className="text-left px-6 py-3 font-medium">Active</th>
                    <th className="text-right px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-3 font-medium">{s.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{s.role}</td>
                      <td className="px-6 py-3 text-muted-foreground">{s.shift}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => setStaff(staff.map(x=>x.id===s.id?{...x,active:!x.active}:x))}
                          className={`relative inline-flex h-6 w-11 rounded-full transition ${s.active?"bg-success":"bg-muted"}`}>
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${s.active?"left-[22px]":"left-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={()=>setStaff(staff.filter(x=>x.id!==s.id))} className="p-1.5 rounded hover:bg-emergency-soft text-emergency">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── REVENUE ── */}
          {view === "Revenue" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { l:"Today",       v:"₹21,000",  d:"+12%" },
                  { l:"This week",   v:"₹1.2L",    d:"+8%"  },
                  { l:"This month",  v:"₹4.8L",    d:"+18%" },
                  { l:"Pending",     v:"₹6,500",   d:"5 unpaid" },
                ].map((r)=>(
                  <div key={r.l} className="rounded-xl bg-card border border-border p-4">
                    <div className="text-xs text-muted-foreground">{r.l}</div>
                    <div className="text-2xl font-bold font-mono text-primary mt-1">{r.v}</div>
                    <div className="text-xs text-success mt-1">{r.d}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <h2 className="font-semibold mb-4">Doctor-wise revenue today</h2>
                {docs.filter(d=>d.active).map((d)=>(
                  <div key={d.id} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{d.name} ({d.today} patients)</span>
                      <span className="font-mono font-semibold">₹{(d.today*d.fee).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100,(d.today/12)*100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SOS ── */}
          {view === "SOS Events" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l:"Total today", v: sosEvents.length, tone:"primary" },
                  { l:"Resolved",    v: sosEvents.filter(e=>e.status==="Resolved").length, tone:"success" },
                  { l:"Active",      v: sosEvents.filter(e=>e.status==="Active").length,   tone:"emergency" },
                ].map((s)=>(
                  <div key={s.l} className="rounded-xl bg-card border border-border p-4">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className={`text-2xl font-bold text-${s.tone} mt-1`}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">SOS events today</h2></div>
                <div className="divide-y divide-border">
                  {sosEvents.map((e)=>(
                    <div key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-secondary transition">
                      <div className="h-10 w-10 rounded-full bg-emergency-soft text-emergency flex items-center justify-center shrink-0">
                        <Siren className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{e.patient}</div>
                        <div className="text-xs text-muted-foreground">{e.time} · ETA {e.eta} · Bed: {e.bed}</div>
                      </div>
                      <StatusChip s={e.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {view === "Reports" && (
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-xl bg-card border border-border p-5">
                <h2 className="font-semibold mb-4">Weekly bookings</h2>
                <div className="flex items-end justify-between gap-2 h-40">
                  {weeklyBookings.map((c,i)=>(
                    <div key={c.d} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="text-[9px] font-mono text-muted-foreground">{c.v}</div>
                      <div className="w-full rounded-t-md hover:opacity-80 transition" style={{ height:`${(c.v/maxV)*100}%`, background: i===6?"var(--color-success)":"var(--color-primary)" }} />
                      <div className="text-[10px] text-muted-foreground">{c.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-card border border-border p-5 space-y-3">
                <h2 className="font-semibold">Revenue snapshot</h2>
                {[{l:"Today",v:"₹21,000",d:"+12%"},{l:"Week",v:"₹1.2L",d:"+8%"},{l:"Month",v:"₹4.8L",d:"+18%"}].map(r=>(
                  <div key={r.l} className="flex items-center justify-between rounded-md bg-secondary px-4 py-3">
                    <div><div className="text-xs text-muted-foreground">{r.l}</div><div className="text-lg font-bold font-mono">{r.v}</div></div>
                    <span className="text-xs font-semibold text-success">{r.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {view === "Settings" && (
            <div className="rounded-xl bg-card border border-border p-6 space-y-4 max-w-2xl">
              <h2 className="font-semibold text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Hospital settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { l:"Hospital name",    v:"North Bengal Medical College" },
                  { l:"Contact phone",    v:"+91 353 256 5000" },
                  { l:"Emergency phone",  v:"+91 353 256 5100" },
                  { l:"Address",          v:"Hill Cart Road, Siliguri, WB" },
                ].map((f)=>(
                  <div key={f.l}>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{f.l}</label>
                    <input defaultValue={f.v} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
              <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Save changes</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}