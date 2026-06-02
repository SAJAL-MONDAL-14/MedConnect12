import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarCheck, Users, LogOut, Bell,
  CheckCircle2, X, Clock, Search, Plus, ChevronRight,
  Phone, AlertCircle, RefreshCw, UserCheck, Hash
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CalendarCheck, label: "Today's Queue" },
  { icon: Users, label: "Walk-ins" },
  { icon: CalendarCheck, label: "Appointments" },
];

const initialQueue = [
  { id: "T001", token: 1,  time: "09:00", name: "Anita Kumar",   age: 34, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: true,  fee: 500, status: "Done",       phone: "+91 98765 11111" },
  { id: "T002", token: 2,  time: "09:30", name: "Rahul Das",     age: 41, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: true,  fee: 300, status: "Done",       phone: "+91 98765 22222" },
  { id: "T003", token: 3,  time: "10:00", name: "Meera Pal",     age: 28, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: false, fee: 500, status: "With Doctor",phone: "+91 98765 33333" },
  { id: "T004", token: 4,  time: "10:30", name: "Vikram Roy",    age: 52, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: false, fee: 500, status: "Waiting",    phone: "+91 98765 44444" },
  { id: "T005", token: 5,  time: "11:00", name: "Sneha Bose",    age: 24, doctor: "Dr. Das",     dept: "Cardiology",   type: "Booked",   paid: true,  fee: 300, status: "Waiting",    phone: "+91 98765 55555" },
  { id: "T006", token: 6,  time: "11:30", name: "Arun Ghosh",    age: 60, doctor: "Dr. Mehta",   dept: "Neurology",    type: "Booked",   paid: false, fee: 700, status: "Waiting",    phone: "+91 98765 66666" },
  { id: "T007", token: 7,  time: "02:00", name: "Priya Sen",     age: 38, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: true,  fee: 500, status: "Scheduled",  phone: "+91 98765 77777" },
  { id: "T008", token: 8,  time: "02:30", name: "Deepak Sharma", age: 45, doctor: "Dr. Das",     dept: "Cardiology",   type: "Walk-in",  paid: false, fee: 500, status: "Scheduled",  phone: "+91 98765 88888" },
  { id: "T009", token: 9,  time: "03:00", name: "Riya Dey",      age: 31, doctor: "Dr. Mehta",   dept: "Neurology",    type: "Booked",   paid: true,  fee: 700, status: "Scheduled",  phone: "+91 98765 99999" },
  { id: "T010", token: 10, time: "05:00", name: "Sanjay Tiwari", age: 55, doctor: "Dr. Sharma",  dept: "Cardiology",   type: "Booked",   paid: false, fee: 300, status: "No-show",    phone: "+91 98765 00000" },
];

const DOCTORS = ["Dr. Sharma", "Dr. Das", "Dr. Mehta"];
const DEPTS   = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"];

function StatusChip({ s }) {
  const map = {
    "Done":        "bg-muted text-muted-foreground",
    "With Doctor": "bg-primary-soft text-primary",
    "Waiting":     "bg-warning-soft text-warning",
    "Scheduled":   "bg-success-soft text-success",
    "No-show":     "bg-emergency-soft text-emergency",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "bg-muted"}`}>{s}</span>;
}

export default function OPDDashboard() {
  const [view, setView]   = useState("Dashboard");
  const [queue, setQueue] = useState(initialQueue);
  const [walkinModal, setWalkinModal] = useState(false);
  const [wName, setWName] = useState("");
  const [wAge,  setWAge]  = useState("");
  const [wDoc,  setWDoc]  = useState(DOCTORS[0]);
  const [wDept, setWDept] = useState(DEPTS[0]);

  useEffect(() => { document.title = "OPD Reception — MedConnect"; }, []);

  const markStatus = (id, status) =>
    setQueue((q) => q.map((x) => x.id === id ? { ...x, status } : x));

  const addWalkin = () => {
    if (!wName || !wAge) return;
    const next = {
      id: `W${Date.now()}`, token: queue.length + 1,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      name: wName, age: Number(wAge), doctor: wDoc, dept: wDept,
      type: "Walk-in", paid: false, fee: 500, status: "Waiting", phone: "—",
    };
    setQueue([...queue, next]);
    setWName(""); setWAge(""); setWalkinModal(false);
  };

  const done        = queue.filter((q) => q.status === "Done").length;
  const withDoc     = queue.filter((q) => q.status === "With Doctor").length;
  const waiting     = queue.filter((q) => q.status === "Waiting").length;
  const noshow      = queue.filter((q) => q.status === "No-show").length;
  const nextPatient = queue.find((q) => q.status === "Waiting");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[210px] shrink-0 text-white bg-gradient-to-b from-primary-dark to-primary">
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">Med<span className="text-white/60">Connect</span></div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">OPD Reception</div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">PR</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Pooja Rao</div>
            <div className="text-[10px] text-white/60">OPD Receptionist</div>
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
        <div className="mx-3 mb-3 rounded-lg bg-white/10 border border-white/15 p-3">
          <div className="text-[10px] text-white/60 uppercase">Next patient</div>
          <div className="text-sm font-bold mt-0.5 truncate">{nextPatient?.name ?? "—"}</div>
          <div className="text-[10px] text-white/60 font-mono">{nextPatient?.time} · Token #{nextPatient?.token}</div>
        </div>
        <Link to="/staff/login" className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">{view === "Dashboard" ? "Good morning, Pooja 👋" : view}</div>
            <div className="text-xs text-muted-foreground">OPD · North Bengal Medical College · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-success"><span className="live-dot" /> OPD Open</span>
            <button onClick={() => setWalkinModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary-dark">
              <Plus className="h-3.5 w-3.5" /> Walk-in
            </button>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
            </button>
          </div>
        </header>

        {/* Mobile tabs */}
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
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total today",   value: queue.length, tone: "primary",   icon: Hash },
              { label: "Done",          value: done,         tone: "success",   icon: CheckCircle2 },
              { label: "Waiting now",   value: waiting,      tone: "warning",   icon: Clock },
              { label: "No-show",       value: noshow,       tone: "emergency", icon: AlertCircle },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
                <div className={`mt-1 text-2xl font-bold text-${s.tone}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Live queue */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-semibold">Live OPD queue</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Click a row to check-in or update status</p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Token</th>
                    <th className="text-left px-4 py-3 font-medium">Time</th>
                    <th className="text-left px-4 py-3 font-medium">Patient</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Doctor</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium">Fee</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {queue.map((p) => (
                    <tr key={p.id} className={`hover:bg-secondary/50 ${p.status === "With Doctor" ? "bg-primary-soft/20" : ""}`}>
                      <td className="px-4 py-3">
                        <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                          {p.token}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{p.time}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">Age {p.age}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{p.doctor}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 uppercase ${p.type === "Walk-in" ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"}`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm font-semibold">₹{p.fee}</div>
                        {!p.paid && <div className="text-[10px] text-warning font-medium">Unpaid</div>}
                        {p.paid  && <div className="text-[10px] text-success font-medium">Paid</div>}
                      </td>
                      <td className="px-4 py-3"><StatusChip s={p.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => markStatus(p.id, "With Doctor")}
                            title="Send to doctor"
                            className="p-1.5 rounded hover:bg-primary-soft text-primary">
                            <UserCheck className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => markStatus(p.id, "Done")}
                            title="Mark done"
                            className="p-1.5 rounded hover:bg-success-soft text-success">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => markStatus(p.id, "No-show")}
                            title="No-show"
                            className="p-1.5 rounded hover:bg-emergency-soft text-emergency">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Walk-in modal */}
      {walkinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setWalkinModal(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-elevated"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Register walk-in patient</h3>
              <button onClick={() => setWalkinModal(false)} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Patient name *</label>
                <input value={wName} onChange={(e) => setWName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Age *</label>
                  <input value={wAge} onChange={(e) => setWAge(e.target.value)}
                    placeholder="e.g. 35" type="number"
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Doctor</label>
                  <select value={wDoc} onChange={(e) => setWDoc(e.target.value)}
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                    {DOCTORS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Department</label>
                <select value={wDept} onChange={(e) => setWDept(e.target.value)}
                  className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                  {DEPTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setWalkinModal(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={addWalkin}
                className="flex-1 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark">
                Add to queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}