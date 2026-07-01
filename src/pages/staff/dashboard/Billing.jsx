import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  LogOut,
  Bell,
  CheckCircle2,
  X,
  Download,
  Search,
  Filter,
  TrendingUp,
  Wallet,
  AlertCircle,
  Receipt,
  Clock,
  ChevronDown,
  Printer,
  RefreshCw,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CreditCard, label: "Payment Ledger" },
  { icon: Receipt, label: "Collect Payment" },
  { icon: Download, label: "Reports" },
];

const initialPayments = [
  {
    id: "P001",
    patient: "Anita Kumar",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "09:00 AM",
    type: "New Patient",
    fee: 500,
    paid: true,
    mode: "Online (UPI)",
    ref: "UPI2024001",
  },
  {
    id: "P002",
    patient: "Rahul Das",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "09:30 AM",
    type: "Follow-up",
    fee: 300,
    paid: true,
    mode: "Cash",
    ref: "CASH001",
  },
  {
    id: "P003",
    patient: "Meera Pal",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "10:00 AM",
    type: "New Patient",
    fee: 500,
    paid: false,
    mode: "—",
    ref: "—",
  },
  {
    id: "P004",
    patient: "Vikram Roy",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "10:30 AM",
    type: "New Patient",
    fee: 500,
    paid: false,
    mode: "—",
    ref: "—",
  },
  {
    id: "P005",
    patient: "Sneha Bose",
    doctor: "Dr. Das",
    dept: "Cardiology",
    time: "11:00 AM",
    type: "Follow-up",
    fee: 300,
    paid: true,
    mode: "Online (Card)",
    ref: "CARD2024003",
  },
  {
    id: "P006",
    patient: "Arun Ghosh",
    doctor: "Dr. Mehta",
    dept: "Neurology",
    time: "11:30 AM",
    type: "New Patient",
    fee: 700,
    paid: false,
    mode: "—",
    ref: "—",
  },
  {
    id: "P007",
    patient: "Priya Sen",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "02:00 PM",
    type: "New Patient",
    fee: 500,
    paid: true,
    mode: "Online (UPI)",
    ref: "UPI2024007",
  },
  {
    id: "P008",
    patient: "Deepak Sharma",
    doctor: "Dr. Das",
    dept: "Cardiology",
    time: "02:30 PM",
    type: "Follow-up",
    fee: 300,
    paid: false,
    mode: "—",
    ref: "—",
  },
  {
    id: "P009",
    patient: "Riya Dey",
    doctor: "Dr. Mehta",
    dept: "Neurology",
    time: "03:00 PM",
    type: "New Patient",
    fee: 700,
    paid: true,
    mode: "Cash",
    ref: "CASH009",
  },
  {
    id: "P010",
    patient: "Sanjay Tiwari",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "05:00 PM",
    type: "Follow-up",
    fee: 300,
    paid: false,
    mode: "—",
    ref: "—",
  },
];

const MODES = ["Cash", "Online (UPI)", "Online (Card)", "Insurance"];

function PayChip({ paid, mode }) {
  if (paid)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft text-success px-2 py-0.5 text-[10px] font-bold uppercase">
        <CheckCircle2 className="h-2.5 w-2.5" /> {mode}
      </span>
    );
  return (
    <span className="rounded-full bg-warning-soft text-warning px-2 py-0.5 text-[10px] font-bold uppercase">
      Unpaid
    </span>
  );
}

export default function BillingDashboard() {
  const [view, setView] = useState("Dashboard");
  const [payments, setPayments] = useState(initialPayments);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  // Collect payment state
  const [collectId, setCollectId] = useState(null);
  const [collectMode, setCollectMode] = useState("Cash");
  const [collectRef, setCollectRef] = useState("");

  useEffect(() => {
    document.title = "Billing — MedConnect";
  }, []);

  const collected = payments.filter((p) => p.paid);
  const pending = payments.filter((p) => !p.paid);
  const totalCollected = collected.reduce((s, p) => s + p.fee, 0);
  const totalPending = pending.reduce((s, p) => s + p.fee, 0);

  const filtered = payments.filter((p) => {
    const matchQ =
      !q ||
      p.patient.toLowerCase().includes(q.toLowerCase()) ||
      p.id.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "All" ? true : filter === "Paid" ? p.paid : !p.paid;
    return matchQ && matchF;
  });

  const markPaid = (id) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, paid: true, mode: collectMode, ref: collectRef || `REF${Date.now()}` }
          : p,
      ),
    );
    setCollectId(null);
    setCollectRef("");
    setCollectMode("Cash");
  };

  const collectTarget = payments.find((p) => p.id === collectId);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[210px] shrink-0 text-white"
        style={{ background: "linear-gradient(180deg, #7A0F0F 0%, #E24B4A 100%)" }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">
            Med<span className="text-white/60">Connect</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
            Billing Portal
          </div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            SK
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Sunita Kumari</div>
            <div className="text-[10px] text-white/60">Billing Staff · NBMC</div>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left
                ${view === n.label ? "bg-white/15 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
            </button>
          ))}
        </nav>
        {/* Sidebar summary */}
        <div className="mx-3 mb-3 space-y-2">
          <div className="rounded-lg bg-white/10 border border-white/15 p-3">
            <div className="text-[10px] text-white/60 uppercase">Collected today</div>
            <div className="text-lg font-bold font-mono mt-0.5">
              ₹{totalCollected.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 border border-white/15 p-3">
            <div className="text-[10px] text-white/60 uppercase">Pending</div>
            <div className="text-lg font-bold font-mono mt-0.5 text-yellow-300">
              ₹{totalPending.toLocaleString()}
            </div>
          </div>
        </div>
        <Link
          to="/staff/login"
          className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">
              {view === "Dashboard" ? "Good morning, Sunita 👋" : view}
            </div>
            <div className="text-xs text-muted-foreground">
              Billing Staff · North Bengal Medical College
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pending.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-warning-soft text-warning px-2.5 py-1 text-[10px] font-bold">
                <AlertCircle className="h-3 w-3" /> {pending.length} unpaid
              </span>
            )}
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              {pending.length > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-warning" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-3">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2
                ${view === n.label ? "border-emergency text-emergency" : "border-transparent text-muted-foreground"}`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="p-6 space-y-6">
          {/* ── DASHBOARD ── */}
          {view === "Dashboard" && (
            <>
              {/* Hero */}
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7A0F0F 0%, #E24B4A 100%)" }}
              >
                <div
                  className="absolute right-0 top-0 h-full w-1/3 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/70 font-bold">
                      Today's billing overview
                    </div>
                    <h2 className="mt-1 text-2xl font-bold">
                      ₹{totalCollected.toLocaleString()} collected
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      ₹{totalPending.toLocaleString()} still pending from {pending.length} patients
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
                      <div className="text-[10px] uppercase text-white/70">Paid</div>
                      <div className="text-2xl font-bold">{collected.length}</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
                      <div className="text-[10px] uppercase text-white/70">Pending</div>
                      <div className="text-2xl font-bold">{pending.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total collected",
                    value: `₹${totalCollected.toLocaleString()}`,
                    tone: "success",
                    icon: Wallet,
                  },
                  {
                    label: "Total pending",
                    value: `₹${totalPending.toLocaleString()}`,
                    tone: "warning",
                    icon: Clock,
                  },
                  {
                    label: "Online payments",
                    value: collected.filter((p) => p.mode.includes("Online")).length,
                    tone: "primary",
                    icon: CreditCard,
                  },
                  {
                    label: "Cash payments",
                    value: collected.filter((p) => p.mode === "Cash").length,
                    tone: "emergency",
                    icon: Receipt,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}
                    >
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
                    <div className={`mt-1 text-2xl font-bold text-${s.tone} font-mono`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending payments urgent list */}
              {pending.length > 0 && (
                <div className="rounded-xl bg-warning-soft border border-warning/20 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-warning inline-flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Pending payments
                    </h2>
                    <span className="text-xs text-warning font-medium">
                      {pending.length} patients · ₹{totalPending.toLocaleString()} due
                    </span>
                  </div>
                  <div className="space-y-2">
                    {pending.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-card rounded-lg px-4 py-3 border border-warning/20"
                      >
                        <div>
                          <div className="font-medium text-sm">{p.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.doctor} · {p.time} · {p.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-bold text-warning">₹{p.fee}</div>
                          <button
                            onClick={() => {
                              setCollectId(p.id);
                              setView("Collect Payment");
                            }}
                            className="rounded-md bg-success text-success-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90"
                          >
                            Collect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment breakdown */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl bg-card border border-border p-5">
                  <h2 className="font-semibold mb-4">Payment mode breakdown</h2>
                  {[
                    {
                      label: "Online — UPI",
                      count: collected.filter((p) => p.mode.includes("UPI")).length,
                      amount: collected
                        .filter((p) => p.mode.includes("UPI"))
                        .reduce((s, p) => s + p.fee, 0),
                    },
                    {
                      label: "Online — Card",
                      count: collected.filter((p) => p.mode.includes("Card")).length,
                      amount: collected
                        .filter((p) => p.mode.includes("Card"))
                        .reduce((s, p) => s + p.fee, 0),
                    },
                    {
                      label: "Cash",
                      count: collected.filter((p) => p.mode === "Cash").length,
                      amount: collected
                        .filter((p) => p.mode === "Cash")
                        .reduce((s, p) => s + p.fee, 0),
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between rounded-md bg-secondary px-4 py-3 mb-2 last:mb-0"
                    >
                      <div>
                        <div className="text-sm font-medium">{r.label}</div>
                        <div className="text-xs text-muted-foreground">{r.count} transactions</div>
                      </div>
                      <div className="font-mono font-bold">₹{r.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                  <h2 className="font-semibold mb-4">Department-wise revenue</h2>
                  {["Cardiology", "Neurology"].map((dept) => {
                    const deptPaid = collected.filter((p) => p.dept === dept);
                    const amt = deptPaid.reduce((s, p) => s + p.fee, 0);
                    const max = 3000;
                    return (
                      <div key={dept} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{dept}</span>
                          <span className="font-mono font-semibold">₹{amt.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emergency rounded-full"
                            style={{ width: `${Math.min(100, (amt / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── PAYMENT LEDGER ── */}
          {view === "Payment Ledger" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-input border border-border rounded-md px-3 focus-within:border-emergency">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search patient or ID..."
                    className="bg-transparent py-2 text-sm outline-none flex-1"
                  />
                </div>
                <div className="flex gap-1 rounded-md bg-secondary p-1">
                  {["All", "Paid", "Unpaid"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition
                        ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs text-emergency font-medium border border-emergency/30 rounded-md px-3 py-2 hover:bg-emergency-soft">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </button>
              </div>

              <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium">ID</th>
                        <th className="text-left px-5 py-3 font-medium">Patient</th>
                        <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                          Doctor
                        </th>
                        <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                          Time
                        </th>
                        <th className="text-left px-5 py-3 font-medium">Fee</th>
                        <th className="text-left px-5 py-3 font-medium">Status</th>
                        <th className="text-right px-5 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/50">
                          <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                            {p.id}
                          </td>
                          <td className="px-5 py-3">
                            <div className="font-medium">{p.patient}</div>
                            <div className="text-xs text-muted-foreground">{p.type}</div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                            {p.doctor}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                            {p.time}
                          </td>
                          <td className="px-5 py-3 font-mono font-semibold">₹{p.fee}</td>
                          <td className="px-5 py-3">
                            <PayChip paid={p.paid} mode={p.mode} />
                          </td>
                          <td className="px-5 py-3 text-right">
                            {p.paid ? (
                              <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                                <Printer className="h-3 w-3" /> Receipt
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setCollectId(p.id);
                                  setView("Collect Payment");
                                }}
                                className="text-xs text-success font-semibold hover:underline"
                              >
                                Collect
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── COLLECT PAYMENT ── */}
          {view === "Collect Payment" && (
            <div className="max-w-xl space-y-4">
              <div>
                <h2 className="font-semibold text-lg">Collect payment</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a patient and mark their payment as received.
                </p>
              </div>

              {/* Patient picker */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Select patient (unpaid)
                </h3>
                <div className="space-y-2">
                  {pending.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setCollectId(p.id)}
                      className={`w-full text-left rounded-lg p-3 border transition ${
                        collectId === p.id
                          ? "border-success bg-success-soft"
                          : "border-border hover:border-success/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{p.patient}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {p.doctor} · {p.time} · {p.type}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-warning">₹{p.fee}</div>
                      </div>
                    </button>
                  ))}
                  {pending.length === 0 && (
                    <div className="text-center py-6 text-sm text-success font-medium">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2" /> All payments collected!
                    </div>
                  )}
                </div>
              </div>

              {/* Payment form */}
              {collectTarget && (
                <div className="rounded-xl bg-card border border-border p-5 space-y-4">
                  <div className="rounded-lg bg-secondary p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient</span>
                      <span className="font-medium">{collectTarget.patient}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Fee due</span>
                      <span className="font-mono font-bold text-warning">₹{collectTarget.fee}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                      Payment mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {MODES.map((m) => (
                        <button
                          key={m}
                          onClick={() => setCollectMode(m)}
                          className={`rounded-lg border p-3 text-sm font-medium transition ${
                            collectMode === m
                              ? "border-success bg-success-soft text-success"
                              : "border-border hover:border-success/40"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                      Reference / Transaction ID (optional)
                    </label>
                    <input
                      value={collectRef}
                      onChange={(e) => setCollectRef(e.target.value)}
                      placeholder="e.g. UPI ref, cheque no..."
                      className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success"
                    />
                  </div>
                  <button
                    onClick={() => markPaid(collectTarget.id)}
                    className="w-full rounded-lg bg-success text-success-foreground py-3 text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark ₹{collectTarget.fee} as Paid
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── REPORTS ── */}
          {view === "Reports" && (
            <div className="space-y-4">
              <div className="grid lg:grid-cols-3 gap-4">
                {[
                  {
                    label: "Today",
                    v: `₹${totalCollected.toLocaleString()}`,
                    sub: `${collected.length} transactions`,
                  },
                  { label: "This week", v: "₹28,600", sub: "94 transactions" },
                  { label: "This month", v: "₹1,12,400", sub: "384 transactions" },
                ].map((r) => (
                  <div key={r.label} className="rounded-xl bg-card border border-border p-5">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {r.label}
                    </div>
                    <div className="text-3xl font-bold font-mono text-emergency mt-1">{r.v}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.sub}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Export reports</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {["Today's report", "Weekly report", "Monthly report"].map((r) => (
                    <button
                      key={r}
                      className="rounded-lg border border-border p-4 text-sm font-medium hover:border-emergency hover:text-emergency transition inline-flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" /> {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
