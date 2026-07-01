// ─────────────────────────────────────────────────────────────────────────────
// staff.dashboard.admin.jsx  — Hospital Admin Dashboard
// Includes full doctor onboarding flow:
//   Doctors tab: Add doctor → sends invite → tracks status
//   Onboarding tab: Review submitted profiles → Approve / Reject / Request Changes
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Search,
  Stethoscope,
  CreditCard,
  Siren,
  ShieldCheck,
  TrendingUp,
  Building2,
  ChevronDown,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Layers,
  UserPlus,
  User,
  FolderPlus,
  Save,
  Eye,
  MessageSquare,
  Download,
  Clock,
  AlertCircle,
  Send,
  RefreshCw,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const ALL_SPECIALTIES = [
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Dermatologist",
  "Gynecologist",
  "Psychiatrist",
  "Urologist",
  "Ophthalmologist",
  "ENT Specialist",
  "General Physician",
  "Radiologist",
  "Pathologist",
  "Anesthesiologist",
  "Pulmonologist",
  "Gastroenterologist",
  "Endocrinologist",
  "Nephrologist",
  "Rheumatologist",
  "Oncologist",
  "Dentist",
  "Physiotherapist",
];

const DEFAULT_SECTIONS = [
  { id: "s1", name: "OPD Receptionist", color: "primary", desc: "Manage OPD queue & walk-ins" },
  {
    id: "s2",
    name: "Ward / ICU Staff",
    color: "warning",
    desc: "Update bed availability & ICU counts",
  },
  { id: "s3", name: "Billing Staff", color: "emergency", desc: "Collect payments & view ledger" },
];

const SECTION_COLORS = ["primary", "success", "warning", "emergency", "accent"];

// Doctor onboarding status pipeline
// Doctor Added → Invitation Sent → Pending Activation → Profile Submitted → Under Review → Approved/Rejected/Changes Requested
const ONBOARDING_STATUS = {
  doctor_added: { label: "Doctor Added", step: 1, bg: "bg-muted text-muted-foreground" },
  invitation_sent: { label: "Invitation Sent", step: 2, bg: "bg-primary-soft text-primary" },
  pending_activation: { label: "Pending Activation", step: 3, bg: "bg-warning-soft text-warning" },
  profile_submitted: { label: "Profile Submitted", step: 4, bg: "bg-primary-soft text-primary" },
  under_review: { label: "Under Review", step: 5, bg: "bg-warning-soft text-warning" },
  approved: { label: "Approved", step: 6, bg: "bg-success-soft text-success" },
  rejected: { label: "Rejected", step: 6, bg: "bg-emergency-soft text-emergency" },
  changes_requested: {
    label: "Changes Requested",
    step: 6,
    bg: "bg-accent text-accent-foreground",
  },
};

// ── Initial data ──────────────────────────────────────────────────────────────
const initialDoctors = [
  {
    id: "d1",
    name: "Dr. Rajesh Sharma",
    initials: "RS",
    email: "dr.sharma@nbmc.in",
    phone: "+91 98765 11111",
    specialties: ["Cardiologist"],
    isSurgeon: false,
    fee: 500,
    followupFee: 300,
    room: "OPD Block, Room 4",
    regNo: "MCI-2006-11234",
    qualifications: "MBBS, MD Cardiology, DM Cardiology",
    experience: "18",
    active: true,
    today: 10,
    onboardingStatus: "approved",
    profile: {
      photo: "sharma_photo.jpg",
      regDoc: "mci_sharma.pdf",
      degreeDoc: "dm_cardio.pdf",
      idDoc: "pan.pdf",
      bank: "SBI ••••4512",
      pan: "PQRST5678H",
    },
  },
  {
    id: "d2",
    name: "Dr. Priya Das",
    initials: "PD",
    email: "dr.das@nbmc.in",
    phone: "+91 98765 22222",
    specialties: ["Cardiologist", "Pulmonologist"],
    isSurgeon: false,
    fee: 450,
    followupFee: 250,
    room: "OPD Block, Room 5",
    regNo: "MCI-2012-55678",
    qualifications: "MBBS, MD Cardiology",
    experience: "12",
    active: true,
    today: 8,
    onboardingStatus: "approved",
    profile: {
      photo: "das_photo.jpg",
      regDoc: "mci_das.pdf",
      degreeDoc: "md_cardio.pdf",
      idDoc: "",
      bank: "HDFC ••••7823",
      pan: "ABCDE1234F",
    },
  },
  {
    id: "d3",
    name: "Dr. Kavya Reddy",
    initials: "KR",
    email: "dr.kavya@nbmc.in",
    phone: "+91 98765 12345",
    specialties: ["Neurologist"],
    isSurgeon: false,
    fee: 700,
    followupFee: 400,
    room: "OPD Block, Room 7",
    regNo: "MCI-2010-88432",
    qualifications: "MBBS, MD Neurology",
    experience: "14",
    active: false,
    today: 0,
    onboardingStatus: "under_review",
    profile: {
      photo: "kavya_photo.jpg",
      regDoc: "mci_kavya.pdf",
      degreeDoc: "md_neuro.pdf",
      idDoc: "aadhar.pdf",
      bank: "HDFC ••••3892",
      pan: "UVWXY5678Z",
    },
    submittedAt: "2025-05-02T09:30:00Z",
  },
  {
    id: "d4",
    name: "Dr. Amit Banerjee",
    initials: "AB",
    email: "dr.amit@nbmc.in",
    phone: "+91 98765 67890",
    specialties: ["Orthopedic"],
    isSurgeon: true,
    fee: 800,
    followupFee: 500,
    room: "OPD Block, Room 3",
    regNo: "MCI-2004-22890",
    qualifications: "MBBS, MS Orthopaedics",
    experience: "20",
    active: false,
    today: 0,
    onboardingStatus: "pending_activation",
    profile: null,
    invitedAt: "2025-05-01T10:00:00Z",
  },
  {
    id: "d5",
    name: "Dr. Sneha Roy",
    initials: "SR",
    email: "dr.roy@nbmc.in",
    phone: "+91 98765 44444",
    specialties: ["Pediatrician"],
    isSurgeon: false,
    fee: 400,
    followupFee: 200,
    room: "OPD Block, Room 6",
    regNo: "MCI-2015-34521",
    qualifications: "MBBS, MD Pediatrics",
    experience: "9",
    active: true,
    today: 6,
    onboardingStatus: "approved",
    profile: {
      photo: "roy_photo.jpg",
      regDoc: "mci_roy.pdf",
      degreeDoc: "md_peds.pdf",
      idDoc: "pan.pdf",
      bank: "SBI ••••9012",
      pan: "LMNOP3456Q",
    },
  },
];

const initialStaff = [
  {
    id: "st1",
    name: "Pooja Rao",
    email: "pooja@nbmc.in",
    phone: "+91 98765 55555",
    section: "s1",
    shift: "Morning",
    active: true,
  },
  {
    id: "st2",
    name: "Ravi Verma",
    email: "ravi@nbmc.in",
    phone: "+91 98765 66666",
    section: "s2",
    shift: "Morning",
    active: true,
  },
  {
    id: "st3",
    name: "Sunita Kumari",
    email: "sunita@nbmc.in",
    phone: "+91 98765 77777",
    section: "s3",
    shift: "Morning",
    active: true,
  },
  {
    id: "st4",
    name: "Arif Khan",
    email: "arif@nbmc.in",
    phone: "+91 98765 88888",
    section: "s2",
    shift: "Evening",
    active: false,
  },
  {
    id: "st5",
    name: "Deepa Singh",
    email: "deepa@nbmc.in",
    phone: "+91 98765 99999",
    section: "s1",
    shift: "Evening",
    active: true,
  },
];

const sosEvents = [
  {
    id: 1,
    patient: "Anita Kumar",
    time: "10:24 AM",
    eta: "8 min",
    status: "Resolved",
    bed: "ICU Room 2",
  },
  {
    id: 2,
    patient: "Vikram Roy",
    time: "11:42 AM",
    eta: "14 min",
    status: "Resolved",
    bed: "ICU Room 4",
  },
  { id: 3, patient: "Priya Sen", time: "1:08 PM", eta: "22 min", status: "Active", bed: "Pending" },
];

const weeklyBookings = [
  { d: "Mon", v: 42 },
  { d: "Tue", v: 56 },
  { d: "Wed", v: 38 },
  { d: "Thu", v: 71 },
  { d: "Fri", v: 65 },
  { d: "Sat", v: 58 },
  { d: "Sun", v: 48 },
];
const maxV = Math.max(...weeklyBookings.map((d) => d.v));

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusChip({ s }) {
  const map = {
    Resolved: "bg-success-soft text-success",
    Active: "bg-emergency-soft text-emergency",
    Done: "bg-muted text-muted-foreground",
    "With Doctor": "bg-primary-soft text-primary",
    Waiting: "bg-warning-soft text-warning",
    Scheduled: "bg-success-soft text-success",
    Pending: "bg-warning-soft text-warning",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "bg-muted"}`}
    >
      {s}
    </span>
  );
}

function OnboardingBadge({ status }) {
  const cfg = ONBOARDING_STATUS[status] ?? ONBOARDING_STATUS.doctor_added;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}
    >
      {cfg.label}
    </span>
  );
}

function Toggle({ on, setOn }) {
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-6 w-11 rounded-full transition ${on ? "bg-success" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

function SectionBadge({ name, color }) {
  const map = {
    primary: "bg-primary-soft text-primary",
    warning: "bg-warning-soft text-warning",
    emergency: "bg-emergency-soft text-emergency",
    success: "bg-success-soft text-success",
    accent: "bg-accent text-accent-foreground",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[color] ?? "bg-muted text-muted-foreground"}`}
    >
      {name}
    </span>
  );
}

function SpecialtySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-border bg-input px-3 py-2 text-sm text-left focus:border-primary min-h-[38px]"
      >
        <span className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground">Select specialties...</span>
          ) : (
            value.map((s) => (
              <span
                key={s}
                className="rounded-full bg-primary-soft text-primary text-[10px] font-semibold px-2 py-0.5"
              >
                {s}
              </span>
            ))
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 w-full rounded-md bg-card border border-border shadow-elevated max-h-52 overflow-y-auto py-1">
          {ALL_SPECIALTIES.map((s) => {
            const checked = value.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange(checked ? value.filter((x) => x !== s) : [...value, s])}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary transition ${checked ? "text-primary font-medium" : "text-foreground"}`}
              >
                <span
                  className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-primary border-primary" : "border-border"}`}
                >
                  {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HospitalAdminDashboard() {
  const [view, setView] = useState("Dashboard");
  const [general, setGen] = useState(12);
  const [icu, setIcu] = useState(3);
  const [ot, setOt] = useState(true);
  const [amb, setAmb] = useState(true);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [staff, setStaff] = useState(initialStaff);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [saved, setSaved] = useState("2 min ago");
  useEffect(() => {
    document.title = "Hospital Admin — MedConnect";
  }, []);
  const save = () => setSaved("just now");

  const pendingReview = doctors.filter(
    (d) => d.onboardingStatus === "under_review" || d.onboardingStatus === "profile_submitted",
  ).length;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BedDouble, label: "Availability" },
    { icon: CalendarCheck, label: "Appointments" },
    { icon: Stethoscope, label: "Doctors" },
    { icon: Send, label: "Onboarding", badge: pendingReview },
    { icon: Users, label: "Staff" },
    { icon: Layers, label: "Sections" },
    { icon: CreditCard, label: "Revenue" },
    { icon: Siren, label: "SOS Events" },
    { icon: BarChart3, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[220px] shrink-0 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">
            Med<span className="text-white/60">Connect</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
            Hospital Admin
          </div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Admin · NBMC</div>
            <div className="text-[10px] text-white/60">Full access</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left ${view === n.label ? "bg-white/15 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
              {n.badge > 0 && (
                <span className="ml-auto rounded-full bg-warning text-warning-foreground text-[10px] font-bold px-1.5 py-0.5">
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mx-3 mb-3 rounded-lg bg-white/10 border border-white/15 p-3 space-y-1.5">
          <div className="flex justify-between text-[10px] text-white/60">
            <span>General free</span>
            <span className="font-mono font-bold text-white">{general}</span>
          </div>
          <div className="flex justify-between text-[10px] text-white/60">
            <span>ICU free</span>
            <span className={`font-mono font-bold ${icu === 0 ? "text-red-300" : "text-white"}`}>
              {icu}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-white/60">
            <span>Doctors active</span>
            <span className="font-mono font-bold text-white">
              {doctors.filter((d) => d.active).length}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-white/60">
            <span>Pending review</span>
            <span
              className={`font-mono font-bold ${pendingReview > 0 ? "text-yellow-300" : "text-white"}`}
            >
              {pendingReview}
            </span>
          </div>
        </div>
        <Link
          to="/staff/login"
          className="m-4 mt-0 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">
              {view === "Dashboard" ? "Good morning, Admin 👋" : view}
            </div>
            <div className="text-xs text-muted-foreground">
              North Bengal Medical College · Full access
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-success">
              <span className="live-dot" />
              Live connected
            </span>
            {pendingReview > 0 && (
              <button
                onClick={() => setView("Onboarding")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-warning bg-warning-soft rounded-full px-2.5 py-1 hover:opacity-80"
              >
                <AlertCircle className="h-3.5 w-3.5" /> {pendingReview} pending review
              </button>
            )}
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              {pendingReview > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-warning" />
              )}
            </button>
          </div>
        </header>

        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-3">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 relative ${view === n.label ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              {n.label}
              {n.badge > 0 && (
                <span className="absolute top-1.5 right-0 h-2 w-2 rounded-full bg-warning" />
              )}
            </button>
          ))}
        </div>

        <main className="p-6 space-y-6">
          {view === "Dashboard" && (
            <DashboardView
              setView={setView}
              doctors={doctors}
              staff={staff}
              sections={sections}
              general={general}
              icu={icu}
              sosEvents={sosEvents}
              weeklyBookings={weeklyBookings}
              maxV={maxV}
              pendingReview={pendingReview}
            />
          )}
          {view === "Availability" && (
            <AvailabilityView
              general={general}
              setGen={setGen}
              icu={icu}
              setIcu={setIcu}
              ot={ot}
              setOt={setOt}
              amb={amb}
              setAmb={setAmb}
              saved={saved}
              save={save}
            />
          )}
          {view === "Appointments" && <AppointmentsView />}
          {view === "Doctors" && <DoctorsView doctors={doctors} setDoctors={setDoctors} />}
          {view === "Onboarding" && <OnboardingView doctors={doctors} setDoctors={setDoctors} />}
          {view === "Staff" && <StaffView staff={staff} setStaff={setStaff} sections={sections} />}
          {view === "Sections" && (
            <SectionsView sections={sections} setSections={setSections} staff={staff} />
          )}
          {view === "Revenue" && <RevenueView doctors={doctors} />}
          {view === "SOS Events" && <SOSView sosEvents={sosEvents} />}
          {view === "Reports" && <ReportsView weeklyBookings={weeklyBookings} maxV={maxV} />}
          {view === "Settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardView({
  setView,
  doctors,
  staff,
  sections,
  general,
  icu,
  sosEvents,
  weeklyBookings,
  maxV,
  pendingReview,
}) {
  return (
    <>
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
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
              Hospital overview — Today
            </div>
            <h2 className="mt-1 text-2xl font-bold">Everything looks operational 🟢</h2>
            <p className="text-sm text-white/80 mt-1">
              42 bookings · {general} general beds free · {icu} ICU beds free · 2 SOS resolved
            </p>
            {pendingReview > 0 && (
              <button
                onClick={() => setView("Onboarding")}
                className="mt-3 inline-flex items-center gap-1.5 bg-warning/20 border border-warning/30 text-warning text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-warning/30 transition"
              >
                <AlertCircle className="h-3.5 w-3.5" /> {pendingReview} doctor profile
                {pendingReview > 1 ? "s" : ""} pending review
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
              <div className="text-[10px] text-white/70">Active staff</div>
              <div className="text-xl font-bold">{staff.filter((s) => s.active).length}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20 text-center">
              <div className="text-[10px] text-white/70">Doctors active</div>
              <div className="text-xl font-bold">{doctors.filter((d) => d.active).length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Bookings today",
            value: "42",
            delta: "+8 vs yesterday",
            tone: "primary",
            icon: CalendarCheck,
          },
          {
            label: "General beds",
            value: general,
            delta: "of 30 available",
            tone: "success",
            icon: BedDouble,
          },
          {
            label: "ICU beds",
            value: icu,
            delta: "of 8 total",
            tone: icu <= 2 ? "emergency" : "warning",
            icon: Stethoscope,
          },
          {
            label: "Revenue today",
            value: "₹21k",
            delta: "+12%",
            tone: "success",
            icon: CreditCard,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}
              >
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

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Bookings this week</h2>
            <span className="text-xs text-success font-semibold">+14% vs last week</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40 mb-2">
            {weeklyBookings.map((c, i) => (
              <div key={c.d} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="text-[9px] font-mono text-muted-foreground">{c.v}</div>
                <div
                  className="w-full rounded-t-md transition hover:opacity-80"
                  style={{
                    height: `${(c.v / maxV) * 100}%`,
                    background: i === 6 ? "var(--color-success)" : "var(--color-primary)",
                  }}
                />
                <div className="text-[10px] text-muted-foreground">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">SOS events today</h2>
            <button className="text-xs text-primary hover:underline" onClick={() => {}}>
              View all
            </button>
          </div>
          <div className="space-y-3">
            {sosEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition"
              >
                <div className="h-8 w-8 rounded-full bg-emergency-soft text-emergency flex items-center justify-center">
                  <Siren className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.patient}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.time} · ETA {e.eta} · {e.bed}
                  </div>
                </div>
                <StatusChip s={e.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Doctors</h2>
            <button
              onClick={() => setView("Doctors")}
              className="text-xs text-primary hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="space-y-2">
            {doctors.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition"
              >
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                  {d.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {d.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-primary-soft text-primary px-1.5 py-0.5 text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                    {d.isSurgeon && (
                      <span className="rounded bg-warning-soft text-warning px-1.5 py-0.5 text-[10px]">
                        Surgeon
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <OnboardingBadge status={d.onboardingStatus} />
                  <span
                    className={`h-2 w-2 rounded-full ${d.active ? "bg-success" : "bg-muted"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Staff by section</h2>
            <button
              onClick={() => setView("Staff")}
              className="text-xs text-primary hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="space-y-2">
            {sections.map((sec) => {
              const active = staff.filter((s) => s.section === sec.id && s.active).length;
              const total = staff.filter((s) => s.section === sec.id).length;
              return (
                <div
                  key={sec.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary transition"
                >
                  <SectionBadge name={sec.name} color={sec.color} />
                  <span className="text-xs text-muted-foreground">
                    {active} active / {total} total
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Availability ──────────────────────────────────────────────────────────────
function AvailabilityView({ general, setGen, icu, setIcu, ot, setOt, amb, setAmb, saved, save }) {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-lg">Bed availability control</h2>
          <p className="text-xs text-muted-foreground">
            Changes broadcast instantly to patient-facing app.
          </p>
        </div>
        <span className="text-xs text-success inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" /> Saved {saved}
        </span>
      </div>
      <div className="space-y-5">
        {[
          {
            label: "General beds",
            desc: "Available out of 30 total",
            val: general,
            setVal: setGen,
            total: 30,
            color: "primary",
          },
          {
            label: "ICU beds",
            desc: "Critical care · 8 total",
            val: icu,
            setVal: setIcu,
            total: 8,
            color: icu <= 2 ? "emergency" : icu <= 4 ? "warning" : "success",
          },
        ].map((b, i) => (
          <div key={b.label}>
            {i > 0 && <div className="border-t border-border pt-5" />}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
                <div className="mt-2 h-2 w-48 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${b.color} rounded-full transition-all`}
                    style={{ width: `${(b.val / b.total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {b.val}/{b.total} free
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    b.setVal(Math.max(0, b.val - 1));
                    save();
                  }}
                  className="h-9 w-9 rounded-full border border-border hover:border-primary flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className={`text-3xl font-bold font-mono text-${b.color} w-10 text-center`}>
                  {b.val}
                </div>
                <button
                  onClick={() => {
                    b.setVal(Math.min(b.total, b.val + 1));
                    save();
                  }}
                  className="h-9 w-9 rounded-full border border-border hover:border-primary flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-border" />
        {[
          { label: "OT Available", desc: "Operating theatre", on: ot, setOn: setOt },
          { label: "Ambulance", desc: "24/7 dispatch", on: amb, setOn: setAmb },
        ].map((t, i) => (
          <div key={t.label}>
            {i > 0 && <div className="border-t border-border" />}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
              <Toggle
                on={t.on}
                setOn={(v) => {
                  t.setOn(v);
                  save();
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Appointments ──────────────────────────────────────────────────────────────
function AppointmentsView() {
  const appts = [
    {
      time: "09:00",
      patient: "Anita Kumar",
      doctor: "Dr. Sharma",
      type: "New",
      fee: 500,
      status: "Done",
    },
    {
      time: "09:30",
      patient: "Rahul Das",
      doctor: "Dr. Sharma",
      type: "Follow-up",
      fee: 300,
      status: "Done",
    },
    {
      time: "10:00",
      patient: "Meera Pal",
      doctor: "Dr. Sharma",
      type: "New",
      fee: 500,
      status: "With Doctor",
    },
    {
      time: "10:30",
      patient: "Vikram Roy",
      doctor: "Dr. Sharma",
      type: "New",
      fee: 500,
      status: "Waiting",
    },
    {
      time: "11:00",
      patient: "Sneha Bose",
      doctor: "Dr. Das",
      type: "Follow-up",
      fee: 300,
      status: "Waiting",
    },
    {
      time: "11:30",
      patient: "Arun Ghosh",
      doctor: "Dr. Roy",
      type: "New",
      fee: 400,
      status: "Scheduled",
    },
  ];
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold">Today's appointments — All departments</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Time", "Patient", "Doctor", "Type", "Fee", "Status"].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appts.map((a, i) => (
              <tr key={i} className="hover:bg-secondary/50">
                <td className="px-6 py-3 font-mono text-xs">{a.time}</td>
                <td className="px-6 py-3 font-medium">{a.patient}</td>
                <td className="px-6 py-3 text-muted-foreground">{a.doctor}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">{a.type}</td>
                <td className="px-6 py-3 font-mono">₹{a.fee}</td>
                <td className="px-6 py-3">
                  <StatusChip s={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Doctors View (Add doctor + track status) ──────────────────────────────────
function DoctorsView({ doctors, setDoctors }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  // Add form fields
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fSpecs, setFSpecs] = useState([]);
  const [fExp, setFExp] = useState("");
  const [fOPD, setFOPD] = useState("");
  const [fRegNo, setFRegNo] = useState("");
  const [fQuals, setFQuals] = useState("");
  const [fSurgeon, setFSurgeon] = useState(false);
  const [fFee, setFFee] = useState("");
  const [fFUp, setFFUp] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const reset = () => {
    setFName("");
    setFEmail("");
    setFPhone("");
    setFSpecs([]);
    setFExp("");
    setFOPD("");
    setFRegNo("");
    setFQuals("");
    setFSurgeon(false);
    setFFee("");
    setFFUp("");
    setInviteSent(false);
  };

  const addDoctor = () => {
    if (!fName || !fEmail || fSpecs.length === 0) return;
    const initials = fName
      .split(" ")
      .filter((w) => w.length > 0)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newDoc = {
      id: `d${Date.now()}`,
      name: fName,
      initials,
      email: fEmail,
      phone: fPhone,
      specialties: fSpecs,
      isSurgeon: fSurgeon,
      fee: Number(fFee) || 0,
      followupFee: Number(fFUp) || 0,
      room: fOPD,
      regNo: fRegNo,
      qualifications: fQuals,
      experience: fExp,
      active: false,
      today: 0,
      onboardingStatus: "invitation_sent",
      invitedAt: new Date().toISOString(),
      profile: null,
    };
    setDoctors((prev) => [...prev, newDoc]);
    setInviteSent(true);
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-input border border-border rounded-md px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="bg-transparent py-2 text-sm outline-none flex-1"
          />
        </div>
        <button
          onClick={() => {
            reset();
            setShowForm((s) => !s);
          }}
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-primary-dark"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add & invite doctor
        </button>
      </div>

      {/* Add doctor form */}
      {showForm && !inviteSent && (
        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-base">Add new doctor</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the basic details. An email invitation will be sent to the doctor to complete
              their profile.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Full name *
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="Dr. Aanya Kapoor"
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Work email * (invitation sent here)
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)}
                  placeholder="dr.kapoor@nbmc.in"
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Phone
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <input
                  value={fPhone}
                  onChange={(e) => setFPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                OPD room / number
              </label>
              <input
                value={fOPD}
                onChange={(e) => setFOPD(e.target.value)}
                placeholder="OPD Block, Room 4"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Years of experience
              </label>
              <input
                value={fExp}
                onChange={(e) => setFExp(e.target.value)}
                placeholder="12"
                type="number"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Medical Council Reg. No.
              </label>
              <input
                value={fRegNo}
                onChange={(e) => setFRegNo(e.target.value)}
                placeholder="MCI-2012-45678"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                New patient fee (₹)
              </label>
              <input
                value={fFee}
                onChange={(e) => setFFee(e.target.value)}
                placeholder="500"
                type="number"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Follow-up fee (₹)
              </label>
              <input
                value={fFUp}
                onChange={(e) => setFFUp(e.target.value)}
                placeholder="300"
                type="number"
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
              Qualifications (comma separated)
            </label>
            <input
              value={fQuals}
              onChange={(e) => setFQuals(e.target.value)}
              placeholder="MBBS, MD Dermatology, Fellowship"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
              Specialties * (select one or more)
            </label>
            <SpecialtySelect value={fSpecs} onChange={setFSpecs} />
            {fSpecs.length === 0 && (
              <p className="text-[11px] text-warning mt-1">Please select at least one specialty.</p>
            )}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border">
            <Toggle on={fSurgeon} setOn={setFSurgeon} />
            <div>
              <div className="text-sm font-semibold">Is this doctor a surgeon?</div>
              <div className="text-xs text-muted-foreground">
                Surgeons are tagged with a Surgeon badge and can be assigned to OT slots.
              </div>
            </div>
          </div>
          <div className="rounded-md bg-success-soft border border-success/20 px-3 py-2 text-xs text-success flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            An activation email will be sent to{" "}
            <span className="font-semibold">{fEmail || "the doctor's email"}</span> immediately
            after you click "Add & send invite".
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={addDoctor}
              disabled={!fName || !fEmail || fSpecs.length === 0}
              className="rounded-md bg-success text-success-foreground px-5 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-40 inline-flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> Add & send invite
            </button>
          </div>
        </div>
      )}

      {/* Invite sent confirmation */}
      {showForm && inviteSent && (
        <div className="rounded-xl bg-success-soft border border-success/20 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
          <h3 className="font-semibold text-lg text-success">Invitation sent!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            An activation email has been sent to{" "}
            <span className="font-medium text-foreground">{fEmail}</span>. The doctor will appear in
            the Onboarding tab once they submit their profile.
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => {
                reset();
                setShowForm(false);
              }}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
            >
              Done
            </button>
            <button
              onClick={() => setInviteSent(false)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Add another doctor
            </button>
          </div>
        </div>
      )}

      {/* Doctors table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">All doctors ({filtered.length})</h2>
          <div className="text-xs text-muted-foreground">
            {doctors.filter((d) => d.active).length} active ·{" "}
            {doctors.filter((d) => d.isSurgeon).length} surgeons
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Doctor</th>
                <th className="text-left px-6 py-3 font-medium">Specialties</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 font-medium">Fee</th>
                <th className="text-left px-6 py-3 font-medium">Onboarding</th>
                <th className="text-left px-6 py-3 font-medium">Active</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {d.initials}
                      </div>
                      <div>
                        <div className="font-medium">{d.name}</div>
                        {d.isSurgeon && (
                          <span className="text-[10px] rounded-full bg-warning-soft text-warning px-1.5 py-0.5 font-bold">
                            Surgeon
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {d.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    <div className="text-xs text-muted-foreground">{d.email}</div>
                    <div className="text-xs text-muted-foreground font-mono">{d.phone}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-mono text-sm font-semibold">₹{d.fee}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Follow-up ₹{d.followupFee}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <OnboardingBadge status={d.onboardingStatus} />
                  </td>
                  <td className="px-6 py-3">
                    <Toggle
                      on={d.active}
                      setOn={() =>
                        setDoctors((prev) =>
                          prev.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)),
                        )
                      }
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => setDoctors((prev) => prev.filter((x) => x.id !== d.id))}
                      className="p-1.5 rounded hover:bg-emergency-soft text-emergency"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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

// ── Onboarding Review View ────────────────────────────────────────────────────
function OnboardingView({ doctors, setDoctors }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const reviewable = doctors.filter((d) =>
    ["under_review", "profile_submitted", "changes_requested", "approved", "rejected"].includes(
      d.onboardingStatus,
    ),
  );

  const counts = {
    all: reviewable.length,
    under_review: reviewable.filter(
      (d) => d.onboardingStatus === "under_review" || d.onboardingStatus === "profile_submitted",
    ).length,
    approved: reviewable.filter((d) => d.onboardingStatus === "approved").length,
    rejected: reviewable.filter((d) => d.onboardingStatus === "rejected").length,
    changes_requested: reviewable.filter((d) => d.onboardingStatus === "changes_requested").length,
  };

  const filtered =
    filter === "all"
      ? reviewable
      : filter === "under_review"
        ? reviewable.filter(
            (d) =>
              d.onboardingStatus === "under_review" || d.onboardingStatus === "profile_submitted",
          )
        : reviewable.filter((d) => d.onboardingStatus === filter);

  const updateStatus = (id, status) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, onboardingStatus: status, active: status === "approved" } : d,
      ),
    );
    if (selected?.id === id) setSelected((s) => ({ ...s, onboardingStatus: status }));
    setShowFeedback(false);
    setFeedback("");
    setPendingAction(null);
  };

  const handleAction = (action) => {
    if (action === "changes_requested" || action === "rejected") {
      setPendingAction(action);
      setShowFeedback(true);
    } else updateStatus(selected.id, action);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Pending Review", v: counts.under_review, t: "warning" },
          { l: "Approved", v: counts.approved, t: "success" },
          { l: "Rejected", v: counts.rejected, t: "emergency" },
          { l: "Changes Needed", v: counts.changes_requested, t: "primary" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`text-2xl font-bold text-${s.t} mt-1`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold">Doctor onboarding applications</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review submitted profiles and approve, reject, or request changes.
            </p>
          </div>
          <div className="flex gap-1 rounded-md bg-secondary p-1 flex-wrap">
            {["all", "under_review", "approved", "rejected", "changes_requested"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f === "under_review" ? "Pending" : f.replace(/_/g, " ")}
                {f !== "all" && <span className="ml-1 opacity-60">({counts[f]})</span>}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
            <p className="text-sm text-muted-foreground">No applications in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Doctor</th>
                  <th className="text-left px-6 py-3 font-medium">Specialty</th>
                  <th className="text-left px-6 py-3 font-medium hidden md:table-cell">
                    Experience
                  </th>
                  <th className="text-left px-6 py-3 font-medium hidden md:table-cell">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {d.initials}
                        </div>
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground text-xs">
                      <div className="flex flex-wrap gap-1">
                        {d.specialties.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                        {d.isSurgeon && (
                          <span className="rounded-full bg-warning-soft text-warning px-2 py-0.5 text-[10px] font-semibold">
                            Surgeon
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">
                      {d.experience} yrs
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {d.submittedAt ? new Date(d.submittedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <OnboardingBadge status={d.onboardingStatus} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelected(d);
                          setShowFeedback(false);
                          setFeedback("");
                        }}
                        className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => {
            setSelected(null);
            setShowFeedback(false);
          }}
        >
          <div
            className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="font-semibold text-lg">Profile review</h3>
                <p className="text-xs text-muted-foreground">
                  {selected.submittedAt
                    ? `Submitted ${new Date(selected.submittedAt).toLocaleString()}`
                    : "Invitation pending"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setShowFeedback(false);
                }}
                className="p-2 hover:bg-muted rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {selected.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selected.name}</div>
                  <div className="text-sm text-primary">
                    {selected.specialties.join(", ")} {selected.isSurgeon && "· Surgeon"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selected.experience} yrs experience · ₹{selected.fee} fee
                  </div>
                </div>
                <OnboardingBadge status={selected.onboardingStatus} />
              </div>

              {/* Onboarding timeline */}
              <div className="rounded-xl bg-secondary border border-border p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Onboarding progress
                </div>
                <div className="flex items-center">
                  {Object.entries(ONBOARDING_STATUS)
                    .slice(0, 5)
                    .map(([key, cfg], i, arr) => {
                      const currentStep = ONBOARDING_STATUS[selected.onboardingStatus]?.step ?? 1;
                      const done = cfg.step < currentStep;
                      const active = cfg.step === currentStep;
                      return (
                        <div key={key} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            >
                              {done ? "✓" : cfg.step}
                            </div>
                            <div
                              className={`text-[8px] mt-1 text-center max-w-[48px] leading-tight ${active ? "text-primary font-semibold" : done ? "text-success" : "text-muted-foreground"}`}
                            >
                              {cfg.label}
                            </div>
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mx-0.5 mb-3 ${done ? "bg-success" : "bg-border"}`}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Personal */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Personal
                </div>
                {[
                  { l: "Email", v: selected.email },
                  { l: "Phone", v: selected.phone },
                  { l: "Reg. number", v: selected.regNo },
                ].map((r) => (
                  <div
                    key={r.l}
                    className="flex justify-between px-4 py-3 text-sm border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-medium">{r.value || r.v || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Professional */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Professional
                </div>
                {[
                  { l: "Specialty", v: selected.specialties.join(", ") },
                  { l: "Experience", v: `${selected.experience} years` },
                  { l: "Qualifications", v: selected.qualifications },
                  { l: "OPD room", v: selected.room },
                  { l: "Surgeon", v: selected.isSurgeon ? "Yes ✓" : "No" },
                  { l: "New patient fee", v: `₹${selected.fee}` },
                  { l: "Follow-up fee", v: `₹${selected.followupFee}` },
                ].map((r) => (
                  <div
                    key={r.l}
                    className="flex justify-between px-4 py-3 text-sm border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-medium">{r.v || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Documents */}
              {selected.profile && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Documents
                  </div>
                  {[
                    { l: "Profile photo", v: selected.profile.photo },
                    { l: "MCI registration", v: selected.profile.regDoc },
                    { l: "Degree cert", v: selected.profile.degreeDoc },
                    { l: "Government ID", v: selected.profile.idDoc },
                    { l: "Bank details", v: selected.profile.bank },
                    { l: "PAN", v: selected.profile.pan },
                  ].map((r) => (
                    <div
                      key={r.l}
                      className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">{r.l}</span>
                      {r.v ? (
                        <button className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                          <Download className="h-3.5 w-3.5" />
                          {r.v}
                        </button>
                      ) : (
                        <span className="text-xs text-emergency font-medium">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!selected.profile && (
                <div className="rounded-lg bg-warning-soft border border-warning/20 px-4 py-3 text-sm text-warning flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Doctor has not yet completed their profile. Status:{" "}
                  <span className="font-semibold">
                    {ONBOARDING_STATUS[selected.onboardingStatus]?.label}
                  </span>
                </div>
              )}

              {/* Feedback form */}
              {showFeedback && (
                <div className="space-y-3 rounded-xl bg-secondary border border-border p-4">
                  <label className="block text-sm font-semibold">
                    {pendingAction === "rejected"
                      ? "Reason for rejection *"
                      : "What changes are required? *"}
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder={
                      pendingAction === "rejected"
                        ? "e.g. Invalid registration number, documents unclear..."
                        : "e.g. Please upload a clearer copy of your degree certificate..."
                    }
                    className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowFeedback(false);
                        setPendingAction(null);
                      }}
                      className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!feedback.trim()}
                      onClick={() => updateStatus(selected.id, pendingAction)}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-40 ${pendingAction === "rejected" ? "bg-emergency text-emergency-foreground" : "bg-primary text-primary-foreground"}`}
                    >
                      Confirm & notify doctor
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action bar */}
            {!showFeedback && selected.profile && (
              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelected(null);
                    setShowFeedback(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>
                {selected.onboardingStatus !== "approved" && (
                  <>
                    <button
                      onClick={() => handleAction("changes_requested")}
                      className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary-soft inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="h-4 w-4" /> Request changes
                    </button>
                    <button
                      onClick={() => handleAction("rejected")}
                      className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft inline-flex items-center gap-1.5"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction("approved")}
                      className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                  </>
                )}
                {selected.onboardingStatus === "approved" && (
                  <span className="text-xs text-success font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Already approved · Doctor account is active
                  </span>
                )}
              </div>
            )}
            {!showFeedback && !selected.profile && (
              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5 opacity-50 cursor-not-allowed"
                  disabled
                >
                  Awaiting profile submission
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Staff View ────────────────────────────────────────────────────────────────
function StaffView({ staff, setStaff, sections }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [secFilter, setSecFilter] = useState("all");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fSection, setFSection] = useState(sections[0]?.id ?? "");
  const [fShift, setFShift] = useState("Morning");
  const reset = () => {
    setFName("");
    setFEmail("");
    setFPhone("");
    setFSection(sections[0]?.id ?? "");
    setFShift("Morning");
    setEditId(null);
  };
  const openEdit = (s) => {
    setFName(s.name);
    setFEmail(s.email);
    setFPhone(s.phone);
    setFSection(s.section);
    setFShift(s.shift);
    setEditId(s.id);
    setShowForm(true);
  };
  const saveStaff = () => {
    if (!fName || !fEmail) return;
    if (editId)
      setStaff(
        staff.map((s) =>
          s.id === editId
            ? { ...s, name: fName, email: fEmail, phone: fPhone, section: fSection, shift: fShift }
            : s,
        ),
      );
    else
      setStaff([
        ...staff,
        {
          id: `st${Date.now()}`,
          name: fName,
          email: fEmail,
          phone: fPhone,
          section: fSection,
          shift: fShift,
          active: true,
        },
      ]);
    reset();
    setShowForm(false);
  };
  const filtered = staff.filter((s) => {
    const mS =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const mF = secFilter === "all" || s.section === secFilter;
    return mS && mF;
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-input border border-border rounded-md px-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff..."
            className="bg-transparent py-2 text-sm outline-none flex-1"
          />
        </div>
        <div className="flex gap-1 rounded-md bg-secondary p-1 flex-wrap">
          <button
            onClick={() => setSecFilter("all")}
            className={`px-2.5 py-1 text-xs font-medium rounded transition ${secFilter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSecFilter(s.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition ${secFilter === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            reset();
            setShowForm((s) => !s);
          }}
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-primary-dark"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add staff
        </button>
      </div>
      {showForm && (
        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <h3 className="font-semibold text-base">
            {editId ? "Edit staff member" : "Add new staff member"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Full name *
              </label>
              <input
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="Pooja Rao"
                className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Work email *
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)}
                  placeholder="pooja@nbmc.in"
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Phone
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <input
                  value={fPhone}
                  onChange={(e) => setFPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="flex-1 bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Shift
              </label>
              <select
                value={fShift}
                onChange={(e) => setFShift(e.target.value)}
                className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {["Morning", "Evening", "Night", "Rotational"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2 font-medium">
              Assign to section *
            </label>
            <div className="grid sm:grid-cols-3 gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setFSection(sec.id)}
                  className={`rounded-xl border-2 p-3 text-left transition ${fSection === sec.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"}`}
                >
                  <div className="text-sm font-semibold">{sec.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{sec.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-primary-soft border border-primary/20 px-3 py-2 text-xs text-primary">
            An invitation email with login credentials will be sent to the address above.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={saveStaff}
              className="rounded-md bg-success text-success-foreground px-5 py-2 text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> {editId ? "Save changes" : "Add & send invite"}
            </button>
          </div>
        </div>
      )}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Staff ({filtered.length})</h2>
          <div className="text-xs text-muted-foreground">
            {staff.filter((s) => s.active).length} active
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium">Section</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 font-medium">Shift</th>
                <th className="text-left px-6 py-3 font-medium">Active</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const sec = sections.find((x) => x.id === s.section);
                return (
                  <tr key={s.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-bold">
                          {s.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {sec ? <SectionBadge name={sec.name} color={sec.color} /> : "—"}
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.phone}</div>
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">{s.shift}</td>
                    <td className="px-6 py-3">
                      <Toggle
                        on={s.active}
                        setOn={() =>
                          setStaff(
                            staff.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)),
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded hover:bg-primary-soft text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setStaff(staff.filter((x) => x.id !== s.id))}
                          className="p-1.5 rounded hover:bg-emergency-soft text-emergency"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sections View ─────────────────────────────────────────────────────────────
function SectionsView({ sections, setSections, staff }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fName, setFName] = useState("");
  const [fDesc, setFDesc] = useState("");
  const [fColor, setFColor] = useState("primary");
  const reset = () => {
    setFName("");
    setFDesc("");
    setFColor("primary");
    setEditId(null);
  };
  const openEdit = (s) => {
    setFName(s.name);
    setFDesc(s.desc);
    setFColor(s.color);
    setEditId(s.id);
    setShowForm(true);
  };
  const saveSection = () => {
    if (!fName) return;
    if (editId)
      setSections(
        sections.map((s) =>
          s.id === editId ? { ...s, name: fName, desc: fDesc, color: fColor } : s,
        ),
      );
    else
      setSections([
        ...sections,
        { id: `sec${Date.now()}`, name: fName, desc: fDesc, color: fColor },
      ]);
    reset();
    setShowForm(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Staff sections</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create custom sections. Staff are assigned to a section when added.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setShowForm((s) => !s);
          }}
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-primary-dark"
        >
          <FolderPlus className="h-3.5 w-3.5" /> New section
        </button>
      </div>
      {showForm && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h3 className="font-semibold">{editId ? "Edit section" : "Create new section"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Section name *
              </label>
              <input
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="e.g. Pharmacy Staff, Lab Staff"
                className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">
                Description
              </label>
              <input
                value={fDesc}
                onChange={(e) => setFDesc(e.target.value)}
                placeholder="What does this section handle?"
                className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2 font-medium">
              Badge color
            </label>
            <div className="flex gap-2 flex-wrap">
              {SECTION_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFColor(c)}
                  className={`rounded-full transition ${fColor === c ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                >
                  <SectionBadge name={c} color={c} />
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Preview: <SectionBadge name={fName || "Section name"} color={fColor} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={saveSection}
              className="rounded-md bg-success text-success-foreground px-5 py-2 text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> {editId ? "Save" : "Create section"}
            </button>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const secStaff = staff.filter((s) => s.section === sec.id);
          const active = secStaff.filter((s) => s.active).length;
          return (
            <div key={sec.id} className="rounded-xl bg-card border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <SectionBadge name={sec.name} color={sec.color} />
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(sec)}
                    className="p-1.5 rounded hover:bg-primary-soft text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSections(sections.filter((x) => x.id !== sec.id))}
                    className="p-1.5 rounded hover:bg-emergency-soft text-emergency"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{sec.desc || "No description."}</p>
              <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground text-xs">Staff assigned</span>
                <span className="font-semibold">
                  {active} active{" "}
                  <span className="text-muted-foreground font-normal">
                    / {secStaff.length} total
                  </span>
                </span>
              </div>
              {secStaff.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {secStaff.slice(0, 4).map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground"
                    >
                      {s.name.split(" ")[0]}
                    </span>
                  ))}
                  {secStaff.length > 4 && (
                    <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                      +{secStaff.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Revenue ───────────────────────────────────────────────────────────────────
function RevenueView({ doctors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Today", v: "₹21,000", d: "+12%" },
          { l: "This week", v: "₹1.2L", d: "+8%" },
          { l: "This month", v: "₹4.8L", d: "+18%" },
          { l: "Pending", v: "₹6,500", d: "5 unpaid" },
        ].map((r) => (
          <div key={r.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{r.l}</div>
            <div className="text-2xl font-bold font-mono text-primary mt-1">{r.v}</div>
            <div className="text-xs text-success mt-1">{r.d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-semibold mb-4">Doctor-wise revenue today</h2>
        {doctors
          .filter((d) => d.active)
          .map((d) => (
            <div key={d.id} className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <div>
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground ml-2">({d.today} patients)</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {d.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-primary-soft text-primary px-1.5 py-0.5 text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="font-mono font-semibold">
                  ₹{(d.today * d.fee).toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, (d.today / 12) * 100)}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ── SOS ───────────────────────────────────────────────────────────────────────
function SOSView({ sosEvents }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total", v: sosEvents.length, t: "primary" },
          {
            l: "Resolved",
            v: sosEvents.filter((e) => e.status === "Resolved").length,
            t: "success",
          },
          { l: "Active", v: sosEvents.filter((e) => e.status === "Active").length, t: "emergency" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`text-2xl font-bold text-${s.t} mt-1`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">SOS events today</h2>
        </div>
        <div className="divide-y divide-border">
          {sosEvents.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-secondary transition"
            >
              <div className="h-10 w-10 rounded-full bg-emergency-soft text-emergency flex items-center justify-center shrink-0">
                <Siren className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{e.patient}</div>
                <div className="text-xs text-muted-foreground">
                  {e.time} · ETA {e.eta} · Bed: {e.bed}
                </div>
              </div>
              <StatusChip s={e.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────
function ReportsView({ weeklyBookings, maxV }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="font-semibold mb-4">Weekly bookings</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyBookings.map((c, i) => (
            <div key={c.d} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[9px] font-mono text-muted-foreground">{c.v}</div>
              <div
                className="w-full rounded-t-md hover:opacity-80 transition"
                style={{
                  height: `${(c.v / maxV) * 100}%`,
                  background: i === 6 ? "var(--color-success)" : "var(--color-primary)",
                }}
              />
              <div className="text-[10px] text-muted-foreground">{c.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-card border border-border p-5 space-y-3">
        <h2 className="font-semibold">Revenue snapshot</h2>
        {[
          { l: "Today", v: "₹21,000", d: "+12%" },
          { l: "Week", v: "₹1.2L", d: "+8%" },
          { l: "Month", v: "₹4.8L", d: "+18%" },
        ].map((r) => (
          <div
            key={r.l}
            className="flex items-center justify-between rounded-md bg-secondary px-4 py-3"
          >
            <div>
              <div className="text-xs text-muted-foreground">{r.l}</div>
              <div className="text-lg font-bold font-mono">{r.v}</div>
            </div>
            <span className="text-xs font-semibold text-success">{r.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4 max-w-2xl">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" /> Hospital settings
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { l: "Hospital name", v: "North Bengal Medical College" },
          { l: "Contact phone", v: "+91 353 256 5000" },
          { l: "Emergency phone", v: "+91 353 256 5100" },
          { l: "Address", v: "Hill Cart Road, Siliguri, WB" },
        ].map((f) => (
          <div key={f.l}>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{f.l}</label>
            <input
              defaultValue={f.v}
              className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>
      <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
        Save changes
      </button>
    </div>
  );
}
