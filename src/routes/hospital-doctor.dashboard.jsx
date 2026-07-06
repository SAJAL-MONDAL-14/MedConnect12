import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarCheck, Users, Wallet, Star,
  Settings, LogOut, Bell, CheckCircle2, X, Eye, Clock,
  TrendingUp, Stethoscope, FileText, Pill, ChevronRight,
  Phone, AlertCircle, CreditCard, Search, Filter, Download,
  MessageCircle, Activity, ThumbsUp, BarChart3, RefreshCw
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CalendarCheck, label: "My Appointments" },
  { icon: Users, label: "My Patients" },
  { icon: Clock, label: "My Schedule" },
  { icon: CreditCard, label: "Payments" },
  { icon: FileText, label: "Prescriptions" },
  { icon: Star, label: "Reviews" },
  { icon: Settings, label: "Settings" },
];

// Mock data for hospital doctor
const todayAppointments = [
  { id: "A001", time: "09:00 AM", patient: "Anita Kumar", age: 34, type: "New Patient", reason: "Chest pain, breathlessness", paid: true, payMode: "Online", fee: 500, status: "Completed", token: 1 },
  { id: "A002", time: "09:30 AM", patient: "Rahul Das", age: 41, type: "Follow-up", reason: "Post-op checkup after angioplasty", paid: true, payMode: "At clinic", fee: 300, status: "Completed", token: 2 },
  { id: "A003", time: "10:00 AM", patient: "Meera Pal", age: 28, type: "New Patient", reason: "Palpitations, dizziness", paid: false, payMode: "Pending", fee: 500, status: "In Progress", token: 3 },
  { id: "A004", time: "10:30 AM", patient: "Vikram Roy", age: 52, type: "New Patient", reason: "Hypertension management", paid: false, payMode: "Pending", fee: 500, status: "Waiting", token: 4 },
  { id: "A005", time: "11:00 AM", patient: "Sneha Bose", age: 24, type: "Follow-up", reason: "ECG result review", paid: true, payMode: "Online", fee: 300, status: "Waiting", token: 5 },
  { id: "A006", time: "11:30 AM", patient: "Arun Ghosh", age: 60, type: "New Patient", reason: "Chest tightness, left arm pain", paid: false, payMode: "Pending", fee: 500, status: "Booked", token: 6 },
  { id: "A007", time: "02:00 PM", patient: "Priya Sen", age: 38, type: "New Patient", reason: "Shortness of breath", paid: true, payMode: "Online", fee: 500, status: "Booked", token: 7 },
  { id: "A008", time: "02:30 PM", patient: "Deepak Sharma", age: 45, type: "Follow-up", reason: "BP monitoring", paid: false, payMode: "Pending", fee: 300, status: "Booked", token: 8 },
  { id: "A009", time: "03:00 PM", patient: "Riya Dey", age: 31, type: "New Patient", reason: "Irregular heartbeat", paid: true, payMode: "At clinic", fee: 500, status: "Booked", token: 9 },
  { id: "A010", time: "05:00 PM", patient: "Sanjay Tiwari", age: 55, type: "Follow-up", reason: "Post stent checkup", paid: false, payMode: "Pending", fee: 300, status: "No-show", token: 10 },
];

const patientHistory = [
  { id: "P001", name: "Anita Kumar", age: 34, lastVisit: "Today", totalVisits: 4, diagnosis: "Mitral Valve Prolapse", phone: "+91 98765 11111", bloodGroup: "B+", status: "Active" },
  { id: "P002", name: "Rahul Das", age: 41, lastVisit: "Today", totalVisits: 12, diagnosis: "Post-Angioplasty", phone: "+91 98765 22222", bloodGroup: "O+", status: "Active" },
  { id: "P003", name: "Vikram Roy", age: 52, lastVisit: "Yesterday", totalVisits: 8, diagnosis: "Hypertension Stage 2", phone: "+91 98765 33333", bloodGroup: "A+", status: "Active" },
  { id: "P004", name: "Sneha Bose", age: 24, lastVisit: "3 days ago", totalVisits: 2, diagnosis: "Arrhythmia", phone: "+91 98765 44444", bloodGroup: "AB-", status: "Active" },
  { id: "P005", name: "Sanjay Tiwari", age: 55, lastVisit: "1 week ago", totalVisits: 6, diagnosis: "Post-Stent", phone: "+91 98765 55555", bloodGroup: "O-", status: "Inactive" },
];

const weeklyData = [
  { d: "Mon", bookings: 8, revenue: 3800, paid: 6 },
  { d: "Tue", bookings: 11, revenue: 5200, paid: 9 },
  { d: "Wed", bookings: 7, revenue: 3200, paid: 5 },
  { d: "Thu", bookings: 14, revenue: 6800, paid: 11 },
  { d: "Fri", bookings: 10, revenue: 4600, paid: 8 },
  { d: "Sat", bookings: 12, revenue: 5600, paid: 10 },
  { d: "Sun", bookings: 9, revenue: 4200, paid: 7 },
];
const maxBookings = Math.max(...weeklyData.map((d) => d.bookings));

const reviews = [
  { name: "Anita Kumar", rating: 5, date: "2 days ago", comment: "Dr. Sharma explained everything clearly. Best cardiologist in Siliguri." },
  { name: "Vikram Roy", rating: 5, date: "1 week ago", comment: "Very professional. Diagnosed my condition quickly and the treatment worked." },
  { name: "Sneha Bose", rating: 4, date: "2 weeks ago", comment: "Good consultation. Slight wait time but the care was excellent." },
];

const mySlots = [
  { day: "Mon", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "02:00", "02:30", "05:00"] },
  { day: "Tue", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "02:00", "02:30", "05:00"] },
  { day: "Wed", slots: ["09:00", "09:30", "10:00", "10:30"] },
  { day: "Thu", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "02:00", "02:30", "05:00"] },
  { day: "Fri", slots: ["09:00", "09:30", "10:00", "10:30", "11:00"] },
  { day: "Sat", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "02:00"] },
  { day: "Sun", slots: [] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusChip({ s }) {
  const map = {
    Completed: "bg-muted text-muted-foreground",
    "In Progress": "bg-primary-soft text-primary",
    Waiting: "bg-warning-soft text-warning",
    Booked: "bg-success-soft text-success",
    "No-show": "bg-emergency-soft text-emergency",
    Active: "bg-success-soft text-success",
    Inactive: "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "bg-muted"}`}>{s}</span>;
}

function PayChip({ paid, mode }) {
  if (paid) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft text-success px-2 py-0.5 text-[10px] font-bold uppercase">
      <CheckCircle2 className="h-2.5 w-2.5" /> {mode}
    </span>
  );
  return <span className="rounded-full bg-warning-soft text-warning px-2 py-0.5 text-[10px] font-bold uppercase">Unpaid</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HospitalDoctorDashboard() {
  const [view, setView] = useState("Dashboard");

  useEffect(() => {
    document.title = "Dr. Sharma — Hospital Doctor Dashboard · MedConnect";
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 text-white bg-gradient-to-b from-success-dark via-success to-primary">
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">Med<span className="text-white/60">Connect</span></div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Doctor Portal</div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xs font-bold ring-2 ring-white/30">RS</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Dr. Rajesh Sharma</div>
            <div className="text-[10px] text-white/60">Cardiologist · NBMC</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left ${
                view === n.label ? "bg-white/15 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"
              }`}
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
            </button>
          ))}
        </nav>
        {/* Today's quick stat */}
        <div className="mx-3 mb-3 rounded-lg bg-white/10 border border-white/15 p-3">
          <div className="text-[10px] text-white/60 uppercase tracking-wider">Today's earnings</div>
          <div className="text-lg font-bold mt-0.5">₹5,000</div>
          <div className="text-[10px] text-white/60">10 patients · 7 paid</div>
        </div>
        <Link to="/login" className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30">
          <div className="min-w-0">
            <div className="font-semibold">
              {view === "Dashboard" ? "Good morning, Dr. Sharma 🩺" : view}
            </div>
            <div className="text-xs text-muted-foreground truncate">Cardiologist · North Bengal Medical College · OPD Block, Room 4</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-success">
              <span className="live-dot" /> OPD Open
            </span>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
            </button>
            <div className="h-8 w-8 rounded-full bg-success text-success-foreground flex items-center justify-center text-xs font-bold">RS</div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-2 snap-x">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 ${
                view === n.label ? "border-success text-success" : "border-transparent text-muted-foreground"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {view === "Dashboard" && <DashboardView setView={setView} />}
          {view === "My Appointments" && <AppointmentsView />}
          {view === "My Patients" && <PatientsView />}
          {view === "My Schedule" && <ScheduleView />}
          {view === "Payments" && <PaymentsView />}
          {view === "Prescriptions" && <PrescriptionsView />}
          {view === "Reviews" && <ReviewsView />}
          {view === "Settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView({ setView }) {
  const totalToday = todayAppointments.length;
  const completed = todayAppointments.filter((a) => a.status === "Completed").length;
  const waiting = todayAppointments.filter((a) => a.status === "Waiting" || a.status === "Booked").length;
  const paidCount = todayAppointments.filter((a) => a.paid).length;
  const totalRevenue = todayAppointments.filter((a) => a.paid).reduce((s, a) => s + a.fee, 0);
  const nextPatient = todayAppointments.find((a) => a.status === "Waiting" || a.status === "Booked");

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-r from-success-dark via-success to-primary">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/70 font-bold">Friday, 2 May 2025 · OPD Active</div>
            <h2 className="mt-1 text-2xl font-bold">You have {totalToday} patients today</h2>
            {nextPatient && (
              <p className="text-sm text-white/80 mt-1">
                Next: <span className="font-semibold">{nextPatient.patient}</span> at <span className="font-mono">{nextPatient.time}</span> — Token #{nextPatient.token}
              </p>
            )}
            <button onClick={() => setView("My Appointments")} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-success text-sm font-semibold hover:bg-white/90 transition">
              <Eye className="h-4 w-4" /> View today's queue
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
              <div className="text-[10px] uppercase tracking-wider text-white/70">Completed</div>
              <div className="text-2xl font-bold">{completed}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
              <div className="text-[10px] uppercase tracking-wider text-white/70">Waiting</div>
              <div className="text-2xl font-bold">{waiting}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Appointments today", value: totalToday, delta: "+2 vs yesterday", tone: "primary", icon: CalendarCheck },
          { label: "Paid today", value: `₹${totalRevenue.toLocaleString()}`, delta: `${paidCount}/${totalToday} paid`, tone: "success", icon: Wallet },
          { label: "Waiting now", value: waiting, delta: "In queue", tone: "warning", icon: Clock },
          { label: "My rating", value: "4.8", delta: "184 reviews", tone: "emergency", icon: Star },
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
            <div className="text-[11px] text-success mt-1 font-medium">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Today's queue + weekly chart */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <TodayQueue compact setView={setView} />
        <WeeklyChart />
      </div>

      {/* Payment summary + upcoming */}
      <div className="grid lg:grid-cols-2 gap-4">
        <PaymentSummaryCard />
        <UpcomingCard />
      </div>
    </>
  );
}

// ─── Today's Queue (compact & full) ──────────────────────────────────────────

function TodayQueue({ compact = false, setView }) {
  const [appts, setAppts] = useState(todayAppointments);
  const [selected, setSelected] = useState(null);

  const update = (id, status) => {
    setAppts((a) => a.map((x) => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
  };

  const displayList = compact ? appts.slice(0, 5) : appts;

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Today's patient queue</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{appts.filter(a => a.status === "Completed").length} done · {appts.filter(a => a.status === "Waiting" || a.status === "In Progress").length} active</p>
        </div>
        {compact && setView && (
          <button onClick={() => setView("My Appointments")} className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1">
            See all <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Token</th>
              <th className="text-left px-4 py-2.5 font-medium">Time</th>
              <th className="text-left px-4 py-2.5 font-medium">Patient</th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Type</th>
              <th className="text-left px-4 py-2.5 font-medium">Payment</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-right px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayList.map((a) => (
              <tr
                key={a.id}
                className={`hover:bg-secondary/50 cursor-pointer ${a.status === "In Progress" ? "bg-primary-soft/30" : ""}`}
                onClick={() => setSelected(a)}
              >
                <td className="px-4 py-3">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{a.token}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{a.time}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{a.patient}</div>
                  <div className="text-xs text-muted-foreground">Age {a.age}</div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{a.type}</td>
                <td className="px-4 py-3"><PayChip paid={a.paid} mode={a.payMode} /></td>
                <td className="px-4 py-3"><StatusChip s={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); update(a.id, "Completed"); }}
                      className="p-1.5 rounded hover:bg-success-soft text-success" title="Mark complete"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); update(a.id, "No-show"); }}
                      className="p-1.5 rounded hover:bg-emergency-soft text-emergency" title="No-show"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Patient Details</h3>
                <p className="text-xs text-muted-foreground">Token #{selected.token} · {selected.time}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {selected.patient.split(" ").map(s => s[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selected.patient}</div>
                  <div className="text-sm text-muted-foreground">Age {selected.age} · {selected.type}</div>
                </div>
                <StatusChip s={selected.status} />
              </div>

              <div className="rounded-lg bg-secondary p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Chief complaint</span><span className="font-medium text-right max-w-[60%]">{selected.reason}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-mono text-xs">{selected.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-mono font-semibold">₹{selected.fee}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Payment</span><PayChip paid={selected.paid} mode={selected.payMode} /></div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Doctor's notes</label>
                <textarea rows={3} placeholder="Add consultation notes, diagnosis, prescription..." className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success resize-none" />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-1.5">
                  <Pill className="h-4 w-4 text-primary" /> Write prescription
                </button>
                <button className="flex-1 rounded-lg bg-success text-success-foreground py-2 text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Mark complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────────

function WeeklyChart() {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">This week's bookings</h2>
        <span className="text-xs text-success font-semibold">+18% vs last week</span>
      </div>
      <div className="flex items-end justify-between gap-1.5 h-36 mb-3">
        {weeklyData.map((d, i) => (
          <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[9px] font-mono text-muted-foreground">{d.bookings}</div>
            <div
              className="w-full rounded-t-md hover:opacity-80 transition"
              style={{
                height: `${(d.bookings / maxBookings) * 100}%`,
                background: i === 6 ? "var(--color-success)" : "var(--color-primary)",
              }}
            />
            <div className="text-[10px] text-muted-foreground">{d.d}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-3 space-y-1.5">
        {[
          { label: "Total patients", value: weeklyData.reduce((s, d) => s + d.bookings, 0) },
          { label: "Revenue", value: `₹${(weeklyData.reduce((s, d) => s + d.revenue, 0) / 1000).toFixed(1)}k` },
          { label: "Payment collected", value: `${weeklyData.reduce((s, d) => s + d.paid, 0)} paid` },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-semibold font-mono">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Payment Summary Card ─────────────────────────────────────────────────────

function PaymentSummaryCard() {
  const paid = todayAppointments.filter((a) => a.paid);
  const unpaid = todayAppointments.filter((a) => !a.paid);
  const collected = paid.reduce((s, a) => s + a.fee, 0);
  const pending = unpaid.reduce((s, a) => s + a.fee, 0);

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Today's payment summary</h2>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-success-soft p-3 border border-success/20">
          <div className="text-xs text-success font-medium">Collected</div>
          <div className="text-2xl font-bold text-success font-mono mt-1">₹{collected.toLocaleString()}</div>
          <div className="text-[11px] text-success/70">{paid.length} patients paid</div>
        </div>
        <div className="rounded-lg bg-warning-soft p-3 border border-warning/20">
          <div className="text-xs text-warning font-medium">Pending</div>
          <div className="text-2xl font-bold text-warning font-mono mt-1">₹{pending.toLocaleString()}</div>
          <div className="text-[11px] text-warning/70">{unpaid.length} unpaid</div>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: "Online (Razorpay/UPI)", count: paid.filter(a => a.payMode === "Online").length, amount: paid.filter(a => a.payMode === "Online").reduce((s, a) => s + a.fee, 0) },
          { label: "At clinic (cash/card)", count: paid.filter(a => a.payMode === "At clinic").length, amount: paid.filter(a => a.payMode === "At clinic").reduce((s, a) => s + a.fee, 0) },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between text-xs rounded-md bg-secondary px-3 py-2">
            <span className="text-muted-foreground">{r.label} ({r.count})</span>
            <span className="font-mono font-semibold">₹{r.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Upcoming Card ────────────────────────────────────────────────────────────

function UpcomingCard() {
  const upcoming = todayAppointments.filter((a) => a.status === "Booked" || a.status === "Waiting");
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Upcoming patients</h2>
        <span className="text-xs text-muted-foreground">{upcoming.length} in queue</span>
      </div>
      <div className="space-y-2">
        {upcoming.slice(0, 4).map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition">
            <div className="h-8 w-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
              {a.patient.split(" ").map(s => s[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{a.patient}</div>
              <div className="text-[11px] text-muted-foreground truncate">{a.reason}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-semibold">{a.time}</div>
              <PayChip paid={a.paid} mode={a.payMode} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Full Appointments View ───────────────────────────────────────────────────

function AppointmentsView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Completed", "In Progress", "Waiting", "Booked", "No-show"];
  const filtered = filter === "All" ? todayAppointments : todayAppointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Total", v: todayAppointments.length, tone: "primary" },
          { l: "Completed", v: todayAppointments.filter(a => a.status === "Completed").length, tone: "success" },
          { l: "Paid", v: todayAppointments.filter(a => a.paid).length, tone: "warning" },
          { l: "No-show", v: todayAppointments.filter(a => a.status === "No-show").length, tone: "emergency" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`mt-1 text-2xl font-bold text-${s.tone}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold">All appointments — Today</h2>
          <div className="flex gap-1 rounded-md bg-secondary p-1 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition ${
                  filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <TodayQueue />
      </div>
    </div>
  );
}

// ─── Patients View ────────────────────────────────────────────────────────────

function PatientsView() {
  const [q, setQ] = useState("");
  const filtered = patientHistory.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-input border border-border rounded-md px-3 focus-within:border-success">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients by name or diagnosis..." className="bg-transparent py-2 text-sm outline-none flex-1" />
        </div>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">My patients ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Patient</th>
                <th className="text-left px-6 py-3 font-medium">Diagnosis</th>
                <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Blood Group</th>
                <th className="text-left px-6 py-3 font-medium">Visits</th>
                <th className="text-left px-6 py-3 font-medium">Last Visit</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-success-soft text-success flex items-center justify-center text-xs font-bold">
                        {p.name.split(" ").map(s => s[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">Age {p.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{p.diagnosis}</td>
                  <td className="px-6 py-3 hidden sm:table-cell">
                    <span className="rounded-full bg-emergency-soft text-emergency px-2 py-0.5 text-[10px] font-bold">{p.bloodGroup}</span>
                  </td>
                  <td className="px-6 py-3 font-mono">{p.totalVisits}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">{p.lastVisit}</td>
                  <td className="px-6 py-3"><StatusChip s={p.status} /></td>
                  <td className="px-6 py-3 text-right">
                    <a href={`tel:${p.phone}`} className="p-1.5 rounded hover:bg-success-soft text-success inline-flex">
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule View ────────────────────────────────────────────────────────────

function ScheduleView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-lg">My OPD schedule</h2>
            <p className="text-xs text-muted-foreground">Manage your available slots per day</p>
          </div>
          <button className="rounded-md bg-success text-success-foreground px-3 py-1.5 text-xs font-semibold">Save changes</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary">
                <th className="text-left px-4 py-2.5 font-medium">Day</th>
                <th className="text-left px-4 py-2.5 font-medium">Slots available</th>
                <th className="text-left px-4 py-2.5 font-medium">OPD hours</th>
                <th className="text-right px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mySlots.map((row) => (
                <tr key={row.day} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-semibold">{row.day}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.slots.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No slots</span>
                      ) : (
                        row.slots.map((s) => (
                          <span key={s} className="text-[10px] font-mono bg-primary-soft text-primary rounded px-1.5 py-0.5">{s}</span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.slots.length === 0 ? "—" : `${row.slots[0]} – ${row.slots[row.slots.length - 1]}`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.slots.length === 0 ? (
                      <span className="text-xs text-muted-foreground">Off</span>
                    ) : (
                      <span className="text-xs text-success font-medium">Active ({row.slots.length} slots)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick block */}
      <div className="rounded-xl bg-card border border-border p-5">
        <h3 className="font-semibold mb-3">Block a slot / Mark leave</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success">
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
            <option>Thursday</option><option>Friday</option><option>Saturday</option>
          </select>
          <select className="rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success">
            <option>09:00 AM</option><option>09:30 AM</option><option>10:00 AM</option><option>All day</option>
          </select>
          <button className="rounded-md bg-warning text-warning-foreground px-3 py-2 text-sm font-semibold hover:opacity-90">Block slot</button>
        </div>
      </div>
    </div>
  );
}

// ─── Payments View ────────────────────────────────────────────────────────────

function PaymentsView() {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Today collected", v: "₹3,500", tone: "success" },
          { l: "Today pending", v: "₹1,500", tone: "warning" },
          { l: "This week", v: "₹28,600", tone: "primary" },
          { l: "This month", v: "₹1.12L", tone: "primary" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`mt-1 text-2xl font-bold text-${s.tone} font-mono`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Payment table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Payment ledger — Today</h2>
          <button className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Patient</th>
                <th className="text-left px-6 py-3 font-medium">Time</th>
                <th className="text-left px-6 py-3 font-medium">Type</th>
                <th className="text-left px-6 py-3 font-medium">Fee</th>
                <th className="text-left px-6 py-3 font-medium">Mode</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {todayAppointments.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/50">
                  <td className="px-6 py-3 font-medium">{a.patient}</td>
                  <td className="px-6 py-3 font-mono text-xs">{a.time}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">{a.type}</td>
                  <td className="px-6 py-3 font-mono font-semibold">₹{a.fee}</td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">{a.payMode}</td>
                  <td className="px-6 py-3"><PayChip paid={a.paid} mode={a.payMode} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Prescriptions View ───────────────────────────────────────────────────────

function PrescriptionsView() {
  const [selected, setSelected] = useState(null);
  const [meds, setMeds] = useState([{ drug: "", dose: "", freq: "", days: "" }]);

  const addMed = () => setMeds([...meds, { drug: "", dose: "", freq: "", days: "" }]);
  const removeMed = (i) => setMeds(meds.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) => setMeds(meds.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Patient picker */}
        <div className="rounded-xl bg-card border border-border p-4">
          <h3 className="font-semibold text-sm mb-3">Select patient</h3>
          <div className="space-y-2">
            {todayAppointments.filter(a => a.status !== "No-show").map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`w-full text-left rounded-lg p-3 border transition ${selected?.id === a.id ? "border-success bg-success-soft" : "border-border hover:border-success/40"}`}
              >
                <div className="text-sm font-medium">{a.patient}</div>
                <div className="text-[11px] text-muted-foreground">{a.time} · Token #{a.token}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prescription form */}
        <div className="rounded-xl bg-card border border-border p-6">
          {!selected ? (
            <div className="text-center py-12 text-muted-foreground">
              <Pill className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a patient to write a prescription</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Prescription for {selected.patient}</h3>
                  <p className="text-xs text-muted-foreground">{selected.reason} · {new Date().toLocaleDateString()}</p>
                </div>
                <button className="rounded-md bg-success text-success-foreground px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Save & Print
                </button>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Diagnosis</label>
                <input placeholder="e.g. Hypertension Stage 2" className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Medicines</label>
                  <button onClick={addMed} className="text-xs text-success font-semibold hover:underline">+ Add medicine</button>
                </div>
                <div className="space-y-2">
                  {meds.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
                      <input value={m.drug} onChange={(e) => updateMed(i, "drug", e.target.value)} placeholder="Drug name" className="rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                      <input value={m.dose} onChange={(e) => updateMed(i, "dose", e.target.value)} placeholder="Dose" className="w-20 rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                      <input value={m.freq} onChange={(e) => updateMed(i, "freq", e.target.value)} placeholder="Freq" className="w-20 rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                      <input value={m.days} onChange={(e) => updateMed(i, "days", e.target.value)} placeholder="Days" className="w-16 rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                      <button onClick={() => removeMed(i)} className="p-2 text-emergency hover:bg-emergency-soft rounded-md"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Additional instructions</label>
                <textarea rows={2} placeholder="e.g. Take after meals, avoid alcohol, follow-up in 2 weeks..." className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success resize-none" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Lab tests to order</label>
                <input placeholder="e.g. ECG, Lipid profile, HbA1c" className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Follow-up</label>
                <div className="flex gap-2">
                  <select className="rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success">
                    <option>1 week</option><option>2 weeks</option><option>1 month</option><option>3 months</option><option>As needed</option>
                  </select>
                  <input type="date" className="flex-1 rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reviews View ─────────────────────────────────────────────────────────────

function ReviewsView() {
  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
      <div className="rounded-xl bg-card border border-border p-6 text-center">
        <div className="text-5xl font-bold text-warning">4.8</div>
        <div className="flex justify-center gap-0.5 mt-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-warning text-warning" />)}</div>
        <div className="text-sm text-muted-foreground mt-1">Based on 184 reviews</div>
        <div className="mt-5 space-y-2">
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="flex items-center gap-2 text-xs">
              <span className="w-3">{n}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{ width: `${[80, 15, 3, 1, 1][5 - n]}%` }} />
              </div>
              <span className="w-8 text-right text-muted-foreground">{[80, 15, 3, 1, 1][5 - n]}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-success">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Top rated in Siliguri</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="font-semibold">Recent reviews</h2>
        {reviews.map((r, i) => (
          <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{r.name}</div>
              <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
            </div>
            <div className="text-[11px] text-muted-foreground">{r.date}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────

function SettingsView() {
  const [name, setName] = useState("Dr. Rajesh Sharma");
  const [fee, setFee] = useState("500");
  const [followFee, setFollowFee] = useState("300");
  const [room, setRoom] = useState("OPD Block, Room 4");

  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4 max-w-2xl">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-success" /> My profile settings
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">OPD room</label>
          <input value={room} onChange={(e) => setRoom(e.target.value)} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">New patient fee (₹)</label>
          <input value={fee} onChange={(e) => setFee(e.target.value)} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success font-mono" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Follow-up fee (₹)</label>
          <input value={followFee} onChange={(e) => setFollowFee(e.target.value)} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success font-mono" />
        </div>
      </div>
      <button className="rounded-md bg-success text-success-foreground px-4 py-2 text-sm font-semibold">Save changes</button>
    </div>
  );
}

// ─── PROFILE & ONBOARDING STATUS VIEW ────────────────────────────────────────
// Export separately so it can be added as a tab in the existing dashboard
export function DoctorProfileView() {
  const [editMode, setEditMode] = useState(false);
  const [name,        setName]        = useState("Dr. Rajesh Sharma");
  const [phone,       setPhone]       = useState("+91 98765 11111");
  const [specialty,   setSpecialty]   = useState("Cardiologist");
  const [experience,  setExperience]  = useState("18");
  const [fee,         setFee]         = useState("500");
  const [followupFee, setFollowupFee] = useState("300");
  const [room,        setRoom]        = useState("OPD Block, Room 4");
  const [bio,         setBio]         = useState("Senior cardiologist with 18+ years of clinical experience.");
  const [saved,       setSaved]       = useState(false);

  const onboardingStatus = "approved"; // approved | under_review | changes_requested | rejected

  const statusConfig = {
    approved:           { label:"Approved",           bg:"bg-success-soft text-success",    icon:"✓" },
    under_review:       { label:"Under Review",       bg:"bg-warning-soft text-warning",    icon:"⏳" },
    changes_requested:  { label:"Changes Requested",  bg:"bg-primary-soft text-primary",    icon:"✎" },
    rejected:           { label:"Rejected",           bg:"bg-emergency-soft text-emergency",icon:"✗" },
  };
  const sc = statusConfig[onboardingStatus];

  const timeline = [
    { label:"Doctor Added",        done:true  },
    { label:"Invitation Sent",     done:true  },
    { label:"Pending Activation",  done:true  },
    { label:"Profile Submitted",   done:true  },
    { label:"Under Review",        done:true  },
    { label:"Approved",            done:true, current:true },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Onboarding status */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Onboarding status</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${sc.bg}`}>{sc.label}</span>
        </div>
        <div className="flex items-start gap-0">
          {timeline.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${s.done?"bg-success text-success-foreground":s.current?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>
                  {s.done ? "✓" : i+1}
                </div>
                <div className={`text-[9px] mt-1 text-center leading-tight max-w-[56px] ${s.current?"text-success font-semibold":s.done?"text-muted-foreground":"text-muted-foreground"}`}>{s.label}</div>
              </div>
              {i < timeline.length-1 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${s.done?"bg-success":"bg-border"}`} />}
            </div>
          ))}
        </div>
        {onboardingStatus === "approved" && (
          <div className="mt-4 rounded-lg bg-success-soft border border-success/20 px-4 py-3 text-sm text-success flex items-center gap-2">
            <span className="text-lg">🎉</span> Your profile is verified and live. Patients can now find and book you.
          </div>
        )}
        {onboardingStatus === "changes_requested" && (
          <div className="mt-4 rounded-lg bg-warning-soft border border-warning/20 px-4 py-3 text-sm text-warning">
            The hospital admin has requested changes. Please update your profile and resubmit.
          </div>
        )}
      </div>

      {/* Profile card preview */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">My profile</h2>
          <button onClick={() => setEditMode(e => !e)} className="text-xs text-primary font-semibold hover:underline">
            {editMode ? "Cancel editing" : "✎ Edit profile"}
          </button>
        </div>

        {/* Public card preview */}
        <div className="mb-6 p-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">How patients see you</div>
          <div className="bg-card border border-border rounded-2xl p-5 max-w-sm shadow-card">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">RS</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{name}</h3>
                <p className="text-sm text-primary font-medium">{specialty}</p>
                <p className="text-xs text-muted-foreground">MBBS, MD Cardiology, DM Cardiology</p>
                <p className="text-xs text-muted-foreground">{experience} yrs experience</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1"><span className="text-warning">★</span><span className="font-semibold">4.8</span><span className="text-xs text-muted-foreground">(184)</span></div>
              <div className="text-right"><div className="font-bold">₹{fee}</div><div className="text-[10px] text-muted-foreground">Follow-up ₹{followupFee}</div></div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-primary">🏥</span>
              <span>at <span className="text-foreground font-medium">North Bengal Medical College</span></span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-success">
              <span>🕐</span> Next: Today 10:00 AM
            </div>
          </div>
        </div>

        {/* Edit form */}
        {editMode ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { l:"Full name",      v:name,        s:setName       },
                { l:"Phone",          v:phone,       s:setPhone      },
                { l:"Specialty",      v:specialty,   s:setSpecialty  },
                { l:"Experience (yrs)",v:experience, s:setExperience },
                { l:"New patient fee (₹)", v:fee,    s:setFee        },
                { l:"Follow-up fee (₹)",   v:followupFee, s:setFollowupFee },
                { l:"OPD room",       v:room,        s:setRoom       },
              ].map(f=>(
                <div key={f.l}>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{f.l}</label>
                  <input value={f.v} onChange={e=>f.s(e.target.value)} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">About / Bio</label>
              <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-success resize-none" />
            </div>
            <button onClick={()=>{ setEditMode(false); setSaved(true); setTimeout(()=>setSaved(false),3000); }}
              className="rounded-md bg-success text-success-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90">
              Save changes
            </button>
            {saved && <span className="text-xs text-success ml-3">✓ Saved!</span>}
          </div>
        ) : (
          <div className="rounded-xl border border-border divide-y divide-border">
            {[
              { label:"Phone",          value:phone      },
              { label:"Specialty",      value:specialty  },
              { label:"Experience",     value:`${experience} years` },
              { label:"New patient fee",value:`₹${fee}`  },
              { label:"Follow-up fee",  value:`₹${followupFee}` },
              { label:"OPD room",       value:room       },
              { label:"Bio",            value:bio        },
            ].map(r=>(
              <div key={r.label} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium text-right max-w-[60%]">{r.value||"—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-semibold text-lg mb-4">Verification documents</h2>
        <div className="space-y-3">
          {[
            { label:"Profile photograph",         status:"verified", file:"sharma_photo.jpg"    },
            { label:"MCI registration certificate",status:"verified", file:"mci_sharma.pdf"     },
            { label:"Degree certificate",          status:"verified", file:"dm_cardio.pdf"      },
            { label:"Government ID",               status:"verified", file:"pan_card.pdf"       },
            { label:"Digital signature",           status:"missing",  file:""                   },
          ].map(d=>(
            <div key={d.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${d.status==="verified"?"bg-success-soft text-success":"bg-warning-soft text-warning"}`}>
                  {d.status==="verified" ? "✓" : "!"}
                </div>
                <div>
                  <div className="text-sm font-medium">{d.label}</div>
                  {d.file && <div className="text-xs text-muted-foreground">{d.file}</div>}
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${d.status==="verified"?"bg-success-soft text-success":"bg-warning-soft text-warning"}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs text-primary font-medium cursor-pointer hover:underline">
          <input type="file" className="hidden" />
          + Upload additional document
        </label>
      </div>
    </div>
  );
}