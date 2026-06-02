import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, BedDouble, LogOut, Bell,
  Plus, Minus, CheckCircle2, X, AlertCircle,
  Activity, Ambulance, Droplet, Stethoscope,
  RefreshCw, Clock, ArrowUpDown
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BedDouble,       label: "Bed Management" },
  { icon: Activity,        label: "ICU Monitor" },
  { icon: Ambulance,       label: "Emergency" },
];

const initialWards = [
  { id: "w1", name: "General Ward A", total: 20, occupied: 14, type: "general" },
  { id: "w2", name: "General Ward B", total: 20, occupied: 18, type: "general" },
  { id: "w3", name: "Male Ward",      total: 15, occupied: 10, type: "general" },
  { id: "w4", name: "Female Ward",    total: 15, occupied: 12, type: "general" },
  { id: "w5", name: "Pediatric Ward", total: 10, occupied: 6,  type: "general" },
];

const initialICU = [
  { id: "i1", name: "Cardiac ICU",   total: 4, occupied: 3, critical: true  },
  { id: "i2", name: "Neuro ICU",     total: 4, occupied: 2, critical: false },
  { id: "i3", name: "General ICU",   total: 4, occupied: 4, critical: true  },
  { id: "i4", name: "Neonatal ICU",  total: 4, occupied: 1, critical: false },
];

function BedCounter({ label, desc, occupied, total, color, onChange }) {
  const free = total - occupied;
  const pct  = Math.round((occupied / total) * 100);
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-semibold text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden w-full max-w-[200px]">
            <div
              className={`h-full rounded-full transition-all ${
                pct >= 90 ? "bg-emergency" : pct >= 70 ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 font-mono">
            {occupied}/{total} occupied · <span className={free === 0 ? "text-emergency font-bold" : "text-success font-semibold"}>{free === 0 ? "FULL" : `${free} free`}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onChange(Math.max(0, occupied - 1))}
            className="h-9 w-9 rounded-full border border-border bg-card hover:border-success flex items-center justify-center transition"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className={`text-3xl font-bold font-mono w-10 text-center text-${color}`}>{free}</div>
          <button
            onClick={() => onChange(Math.min(total, occupied + 1))}
            className="h-9 w-9 rounded-full border border-border bg-card hover:border-emergency flex items-center justify-center transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, setOn }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-7 w-12 rounded-full transition ${on ? "bg-success" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function WardDashboard() {
  const [view,    setView]   = useState("Dashboard");
  const [wards,   setWards]  = useState(initialWards);
  const [icus,    setIcus]   = useState(initialICU);
  const [ot,      setOt]     = useState(true);
  const [amb,     setAmb]    = useState(true);
  const [blood,   setBlood]  = useState(true);
  const [savedAt, setSaved]  = useState("2 min ago");

  useEffect(() => { document.title = "Ward & ICU — MedConnect"; }, []);

  const save = () => setSaved("just now");

  const updateWard = (id, occ) => { setWards((w) => w.map((x) => x.id === id ? { ...x, occupied: occ } : x)); save(); };
  const updateIcu  = (id, occ) => { setIcus((i)  => i.map((x) => x.id === id ? { ...x, occupied: occ } : x)); save(); };

  const totalGenFree = wards.reduce((s, w) => s + (w.total - w.occupied), 0);
  const totalIcuFree = icus.reduce((s,  i) => s + (i.total - i.occupied), 0);
  const criticalIcu  = icus.filter((i) => i.critical && (i.total - i.occupied) === 0).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[210px] shrink-0 text-white bg-gradient-to-b from-warning-soft/0 to-warning-soft/0" style={{ background: "linear-gradient(180deg, #7a4f1a 0%, #ba7517 100%)" }}>
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">Med<span className="text-white/60">Connect</span></div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Ward & ICU Portal</div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">RV</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Ravi Verma</div>
            <div className="text-[10px] text-white/60">Ward Staff · NBMC</div>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map((n) => (
            <button key={n.label} onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left
                ${view === n.label ? "bg-white/15 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}>
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
            </button>
          ))}
        </nav>
        {/* Quick stats */}
        <div className="mx-3 mb-3 space-y-2">
          <div className="rounded-lg bg-white/10 border border-white/15 p-3">
            <div className="text-[10px] text-white/60 uppercase">General beds free</div>
            <div className="text-xl font-bold mt-0.5">{totalGenFree}</div>
          </div>
          <div className="rounded-lg bg-white/10 border border-white/15 p-3">
            <div className="text-[10px] text-white/60 uppercase">ICU beds free</div>
            <div className={`text-xl font-bold mt-0.5 ${totalIcuFree === 0 ? "text-red-300" : ""}`}>{totalIcuFree}</div>
          </div>
        </div>
        <Link to="/staff/login" className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">{view === "Dashboard" ? "Good morning, Ravi 👋" : view}</div>
            <div className="text-xs text-muted-foreground">Ward Staff · North Bengal Medical College</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-success inline-flex items-center gap-1.5"><span className="live-dot" /> Live connected</span>
            {criticalIcu > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emergency-soft text-emergency px-2.5 py-1 text-[10px] font-bold">
                <AlertCircle className="h-3 w-3" /> {criticalIcu} ICU full
              </span>
            )}
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              {criticalIcu > 0 && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />}
            </button>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-3">
          {navItems.map((n) => (
            <button key={n.label} onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2
                ${view === n.label ? "border-warning text-warning" : "border-transparent text-muted-foreground"}`}>
              {n.label}
            </button>
          ))}
        </div>

        {/* Broadcast banner */}
        <div className="bg-success-soft border-b border-success/20">
          <div className="max-w-full px-6 py-2 flex items-center justify-between text-xs">
            <span className="text-success inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Patients see your updates in real-time · Last sync: {savedAt}
            </span>
            <button onClick={save} className="inline-flex items-center gap-1 text-success font-medium hover:underline">
              <RefreshCw className="h-3 w-3" /> Sync now
            </button>
          </div>
        </div>

        <main className="p-6 space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "General beds free", value: totalGenFree, total: wards.reduce((s,w)=>s+w.total,0), tone: totalGenFree <= 5 ? "emergency" : "success", icon: BedDouble },
              { label: "ICU beds free",     value: totalIcuFree, total: icus.reduce((s,i)=>s+i.total,0),  tone: totalIcuFree === 0 ? "emergency" : totalIcuFree <= 2 ? "warning" : "success", icon: Activity },
              { label: "OT status",         value: ot ? "Open" : "Closed",   total: null, tone: ot ? "success" : "emergency", icon: Stethoscope },
              { label: "Ambulance",         value: amb ? "Ready" : "Busy",   total: null, tone: amb ? "success" : "warning",   icon: Ambulance },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-card border border-border p-4 hover:shadow-lg transition">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
                <div className={`mt-1 text-2xl font-bold text-${s.tone}`}>{s.value}</div>
                {s.total && <div className="text-[11px] text-muted-foreground font-mono">of {s.total} total</div>}
              </div>
            ))}
          </div>

          {/* General beds */}
          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">General ward beds</h2>
                <p className="text-xs text-muted-foreground">Use +/− to update occupied count. Changes broadcast instantly.</p>
              </div>
              <span className="text-xs text-success inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Saved {savedAt}</span>
            </div>
            <div className="space-y-3">
              {wards.map((w) => (
                <BedCounter
                  key={w.id}
                  label={w.name}
                  desc={`Ward capacity: ${w.total} beds`}
                  occupied={w.occupied}
                  total={w.total}
                  color="success"
                  onChange={(occ) => updateWard(w.id, occ)}
                />
              ))}
            </div>
          </div>

          {/* ICU */}
          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">ICU beds</h2>
                <p className="text-xs text-muted-foreground">Critical care units — update immediately when a patient is admitted or discharged.</p>
              </div>
            </div>
            <div className="space-y-3">
              {icus.map((i) => (
                <div key={i.id}>
                  <BedCounter
                    label={i.name}
                    desc={`${i.critical ? "⚠ Critical unit" : "Standard ICU"} · Capacity: ${i.total}`}
                    occupied={i.occupied}
                    total={i.total}
                    color="warning"
                    onChange={(occ) => updateIcu(i.id, occ)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="font-semibold mb-3">Hospital services status</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <ToggleRow label="OT Available"  desc="Operating theatre"    on={ot}    setOn={(v) => { setOt(v);    save(); }} />
              <ToggleRow label="Ambulance"     desc="24/7 dispatch ready"  on={amb}   setOn={(v) => { setAmb(v);   save(); }} />
              <ToggleRow label="Blood Bank"    desc="On-site availability" on={blood} setOn={(v) => { setBlood(v); save(); }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}