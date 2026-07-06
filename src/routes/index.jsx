import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HospitalCard, StarRating, LiveDot } from "@/components/HospitalCard";
import { MapPanel } from "@/components/MapPanel";
import { hospitals, doctors } from "@/lib/mockData";
import {
  Search, MapPin, ChevronRight, Siren, Sparkles,
  ShieldCheck, Clock, ArrowRight, BedDouble,
  Star, Phone, Activity, CheckCircle2, Stethoscope,
  Building2, FlaskConical, Zap,
} from "lucide-react";

// ─── Filter pills ─────────────────────────────────────────────────────────────
const filterPills = [
  { label: "Near me", icon: "📍" },
  { label: "Has ICU beds", icon: "🛏" },
  { label: "Government", icon: "🏛" },
  { label: "Open now", icon: "🟢" },
  { label: "Rating 4+", icon: "⭐" },
];

// ─── Trust stats ──────────────────────────────────────────────────────────────
const stats = [
  { value: "48",    label: "Hospitals",      icon: Building2  },
  { value: "320+",  label: "Doctors",        icon: Stethoscope},
  { value: "1.2k+", label: "Bookings/day",   icon: CheckCircle2},
  { value: "24/7",  label: "SOS Emergency",  icon: Siren      },
];

// ─── Service cards ────────────────────────────────────────────────────────────
const services = [
  { icon: Building2, label: "Hospitals", desc: "Live beds", to: "/search" },
  { icon: Stethoscope, label: "Doctors", desc: "Book now", to: "/doctors" },
  { icon: FlaskConical, label: "Labs", desc: "Home tests", to: "/labs" },
  { icon: Activity, label: "Clinics", desc: "Near you", to: "/clinics" },
  { icon: Siren, label: "Emergency", desc: "SOS", to: "/sos" },
];

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  { n:"01", icon: MapPin,     title: "Allow location",      desc: "We find the closest hospitals using your GPS — no signup needed to browse." },
  { n:"02", icon: Activity,   title: "See live beds",       desc: "Real-time bed counts updated by hospital staff every few minutes." },
  { n:"03", icon: CheckCircle2,title: "Book & confirm",     desc: "Pick a slot, pay at clinic. WhatsApp confirmation sent instantly." },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [activeFilters, setActiveFilters] = useState(["Near me"]);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    document.title = "MedConnect — Find hospitals. Book instantly. Save lives.";
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleFilter = (label) =>
    setActiveFilters(f => f.includes(label) ? f.filter(x => x !== label) : [...f, label]);

  const submit = (e) => {
    e?.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}&filters=${encodeURIComponent(activeFilters.join(","))}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar active="hospitals" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.12 0.04 250) 0%, oklch(0.18 0.08 250) 40%, oklch(0.22 0.10 260) 100%)",
        }}
      >
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.18 250), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.18 162), transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 sm:pt-20 lg:pt-24 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-16 items-center min-w-0">
            {/* Left */}
            <div className="min-w-0" style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold"
                style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)", color: "oklch(0.75 0.12 162)" }}>
                <span className="live-dot" />
                Real-time bed availability · Siliguri, WB
              </div>

              {/* Headline */}
              <h1 className="font-bold tracking-tight text-white leading-[1.05]"
                style={{ fontSize: "clamp(2.2rem, 10vw, 3.8rem)" }}>
                Find hospitals
                <br />
                <span style={{ color: "oklch(0.75 0.18 250)" }}>book instantly.</span>
                <br />
                Save lives.
              </h1>

              <p className="mt-5 text-base leading-relaxed max-w-lg"
                style={{ color: "oklch(0.75 0 0)" }}>
                See real-time bed availability across 48 hospitals. No more calling around.
                Book a doctor slot in under 60 seconds.
              </p>

              {/* Search bar */}
              <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-2xl max-w-[580px]"
                style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-2 w-full min-w-0 px-2 sm:px-0">
                  <MapPin className="h-5 w-5 shrink-0" style={{ color: "oklch(0.65 0.18 250)" }} />
                  <input
                    value={q} onChange={e => setQ(e.target.value)}
                    placeholder="Search hospitals, doctors..."
                    className="min-w-0 flex-1 bg-transparent text-sm py-2.5 outline-none text-white placeholder:text-white/40 font-medium"
                  />
                </div>
                <button type="submit"
                  className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "oklch(0.55 0.18 250)", color: "white" }}>
                  <Search className="h-4 w-4 inline mr-1.5" />Search
                </button>
              </form>

              {/* Filter pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {filterPills.map(p => {
                  const on = activeFilters.includes(p.label);
                  return (
                    <button key={p.label} type="button" onClick={() => toggleFilter(p.label)}
                      className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: on ? "oklch(0.55 0.18 250)" : "oklch(1 0 0 / 0.07)",
                        border: `1px solid ${on ? "oklch(0.55 0.18 250)" : "oklch(1 0 0 / 0.15)"}`,
                        color: on ? "white" : "oklch(0.75 0 0)",
                      }}>
                      {p.icon} {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Quick service icons */}
              <div className="mt-8 grid grid-cols-3 sm:flex sm:items-center gap-2 max-w-md sm:max-w-none">
                {services.map((s, i) => (
                  <Link key={s.label} to={s.to}
                    className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3 transition-all hover:scale-105 group min-w-0"
                    style={{
                      background: "oklch(1 0 0 / 0.06)",
                      border: "1px solid oklch(1 0 0 / 0.10)",
                      animationDelay: `${i * 80}ms`,
                    }}>
                    <s.icon className="h-5 w-5 text-white/80" />
                    <span className="text-[10px] font-bold text-white/80 group-hover:text-white transition">{s.label}</span>
                    <span className="text-[9px] text-white/40">{s.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Live hospital dashboard panel */}
            <div className="hidden lg:block relative"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>

              {/* Main card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: "oklch(0.16 0.04 250)", border: "1px solid oklch(1 0 0 / 0.12)", backdropFilter: "blur(24px)" }}>

                {/* Card header */}
                <div className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}>
                  <div className="flex items-center gap-2">
                    <span className="live-dot" />
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Live · Siliguri</span>
                  </div>
                  <span className="text-white/30 text-[10px] font-mono">Updated 2 min ago</span>
                </div>

                {/* Hospital rows */}
                <div className="divide-y" style={{ borderColor: "oklch(1 0 0 / 0.06)" }}>
                  {[
                    { name: "North Bengal MC",     type: "Govt",    general: 12, icu: 3,  status: "good"    },
                    { name: "CityMed Multispeciality", type: "Pvt", general: 18, icu: 4,  status: "good"    },
                    { name: "Siliguri District H", type: "Govt",    general: 5,  icu: 0,  status: "low"     },
                    { name: "Neotia Getwel",       type: "Pvt",     general: 0,  icu: 0,  status: "full"    },
                  ].map((h, i) => (
                    <div key={h.name} className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.03] transition">
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ background: "oklch(1 0 0 / 0.08)", color: "oklch(0.75 0 0)" }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{h.name}</div>
                        <div className="text-white/40 text-[10px]">{h.type}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-white/40 uppercase tracking-wide">Gen</div>
                          <div className={`text-sm font-bold ${h.general === 0 ? "text-red-400" : "text-white"}`}>{h.general}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-white/40 uppercase tracking-wide">ICU</div>
                          <div className={`text-sm font-bold ${h.icu === 0 ? "text-red-400" : "text-emerald-400"}`}>{h.icu}</div>
                        </div>
                        <div className={`h-2 w-2 rounded-full ml-1 ${
                          h.status === "good" ? "bg-emerald-400" :
                          h.status === "low"  ? "bg-yellow-400"  : "bg-red-400"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom quick stats */}
                <div className="px-5 py-4 grid grid-cols-3 gap-3"
                  style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}>
                  {[
                    { label: "Beds free",    value: "35",  color: "text-emerald-400" },
                    { label: "Bookings/day", value: "1.2k",color: "text-blue-400"   },
                    { label: "Doctors live", value: "42",  color: "text-purple-400"  },
                  ].map(s => (
                    <div key={s.label} className="text-center rounded-xl py-2.5"
                      style={{ background: "oklch(1 0 0 / 0.05)" }}>
                      <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-white/40 text-[9px] uppercase tracking-wide mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent booking notification */}
              <div className="mt-3 rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: "oklch(0.20 0.08 162 / 0.6)", border: "1px solid oklch(0.55 0.18 162 / 0.3)", backdropFilter: "blur(16px)" }}>
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "oklch(0.65 0.18 162)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold">Booking confirmed</div>
                  <div className="text-white/50 text-[10px]">Anita Kumar · Dr. Sharma · 10:00 AM</div>
                </div>
                <span className="text-[10px] font-mono" style={{ color: "oklch(0.65 0.18 162)" }}>Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
              fill="var(--color-background)" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x divide-border">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-card md:bg-transparent border border-border md:border-0 p-3 sm:px-6 sm:py-2 md:first:pl-0 md:last:pr-0">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-soft">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOSPITALS NEAR YOU ───────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-success mb-2">
              <span className="live-dot" /> Live availability
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Hospitals near you</h2>
            <p className="text-muted-foreground mt-1">Siliguri, West Bengal · Updated in real-time</p>
          </div>
          <Link to="/search"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6 min-w-0">
          <div className="space-y-4 min-w-0">
            {hospitals.slice(0, 3).map((h, i) => (
              <HospitalCard key={h.id} hospital={h} index={i} />
            ))}
            <Link to="/search"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
              View all 48 hospitals <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:sticky lg:top-20 lg:h-[600px]">
            <MapPanel hospitals={hospitals} selectedId={hospitals[0].id} />
          </div>
        </div>
      </section>

      {/* ── SOS EMERGENCY BANNER ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 my-4">
        <div className="max-w-[1200px] mx-auto rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, oklch(0.32 0.16 25), oklch(0.20 0.12 25))" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative px-5 sm:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 sos-pulse">
                <Siren className="h-8 w-8 text-white" strokeWidth={2} />
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">Emergency</div>
                <h3 className="text-2xl font-bold text-white">One-tap SOS</h3>
                <p className="text-white/70 text-sm mt-1">
                  Instantly finds nearest ICU beds · Auto-alerts your emergency contacts via WhatsApp
                </p>
              </div>
            </div>
            <Link to="/sos"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-red-600 px-6 py-3 text-sm font-bold hover:bg-white/90 transition shadow-xl shrink-0">
              <Siren className="h-4 w-4" /> Activate SOS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="h-3.5 w-3.5" /> Fast & simple
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">How MedConnect works</h2>
            <p className="text-muted-foreground mt-2">Three steps. Under 60 seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-0.5 bg-border" />
            {steps.map((s, i) => (
              <div key={s.n}
                className="rounded-2xl bg-card border border-border p-7 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group relative">
                <div className="absolute -top-4 left-7 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                  {s.n}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center mb-5 mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <s.icon className="h-6 w-6 text-primary group-hover:text-white transition-all" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DOCTORS ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-secondary border-y border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-success mb-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> Available today
              </div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Featured doctors</h2>
              <p className="text-muted-foreground mt-1">Top-rated · Verified · Book instantly</p>
            </div>
            <Link to="/doctors"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition">
              All doctors <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory">
            {doctors.map((d) => {
              const avatarBg = d.avatarColor === "primary" ? "bg-primary" : d.avatarColor === "success" ? "bg-success" : d.avatarColor === "warning" ? "bg-warning" : "bg-emergency";
              return (
                <div key={d.id}
                  className="snap-start shrink-0 w-[280px] rounded-2xl bg-card border border-border p-5 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-14 w-14 rounded-2xl ${avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform`}>
                      {d.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">{d.name}</h3>
                      <p className="text-xs text-primary font-medium">{d.specialty}</p>
                      <p className="text-xs text-muted-foreground">{d.experience} yrs exp</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-bold">{d.rating}</span>
                    </div>
                    <span className="font-bold text-foreground">₹{d.fee}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs rounded-xl bg-success-soft text-success px-3 py-2 mb-4">
                    <Clock className="h-3.5 w-3.5" /> Next: {d.nextSlot}
                  </div>
                  <Link to="/booking"
                    className="block text-center rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold hover:opacity-90 transition">
                    Book consultation
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 250) 0%, oklch(0.20 0.08 260) 100%)" }}>
            <div className="px-6 sm:px-10 py-10 sm:py-14 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "oklch(0.65 0.18 250)" }}>
                  Why MedConnect?
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Healthcare access,<br />simplified.
                </h2>
                <p className="text-white/60 mt-4 text-sm leading-relaxed">
                  We connect patients with hospitals and doctors in real-time, eliminating the chaos of finding healthcare in an emergency.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: "🔴", text: "Real-time bed availability — no guessing" },
                    { icon: "📱", text: "WhatsApp confirmations in seconds" },
                    { icon: "✅", text: "Verified doctors & hospitals only" },
                    { icon: "🆓", text: "Free to use for patients · Always" },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-white/80 text-sm">{f.text}</span>
                    </div>
                  ))}
                </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link to="/search"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: "oklch(0.55 0.18 250)", color: "white" }}>
                    Find a hospital <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/doctors"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all"
                    style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(1 0 0 / 0.15)", color: "white" }}>
                    Find a doctor
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v:"48",    l:"Hospitals",        sub:"In Siliguri, WB",    c:"oklch(0.55 0.18 250)" },
                  { v:"320+",  l:"Verified doctors", sub:"All specialties",    c:"oklch(0.55 0.18 162)" },
                  { v:"1.2k+", l:"Bookings/day",     sub:"& growing",          c:"oklch(0.55 0.14 60)"  },
                  { v:"99.9%", l:"Uptime",           sub:"Always available",   c:"oklch(0.55 0.18 25)"  },
                ].map(s => (
                  <div key={s.l} className="rounded-2xl p-5 flex flex-col"
                    style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.10)" }}>
                    <div className="text-3xl font-bold text-white">{s.v}</div>
                    <div className="text-white/80 text-sm font-semibold mt-1">{s.l}</div>
                    <div className="text-white/40 text-xs mt-0.5">{s.sub}</div>
                    <div className="mt-3 h-1 rounded-full w-2/3" style={{ background: s.c }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: "oklch(0.10 0.02 250)", color: "oklch(0.75 0 0)" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="text-xl font-bold text-white mb-3">
              Med<span style={{ color: "oklch(0.65 0.18 250)" }}>Connect</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0 0)" }}>
              Find hospitals. Book instantly. Save lives.<br />
              Built for healthcare access in India.
            </p>
            <div className="mt-5 flex gap-2">
              {["App Store", "Google Play"].map(a => (
                <span key={a} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition"
                  style={{ border: "1px solid oklch(1 0 0 / 0.12)", color: "oklch(0.65 0 0)" }}>
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-5 text-xs" style={{ color: "oklch(0.45 0 0)" }}>
              Made with care in India 🇮🇳
            </div>
          </div>
          {[
            { title:"Patients",  links:["Find hospitals","Book a doctor","Lab tests","SOS Emergency"] },
            { title:"Hospitals", links:["Partner with us","Staff portal","Pricing","Documentation"]  },
            { title:"Company",   links:["About","Privacy","Terms","Contact"]                          },
          ].map(c => (
            <div key={c.title}>
              <h4 className="font-bold mb-4 text-white text-sm">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map(l => (
                  <li key={l} className="text-sm cursor-pointer hover:text-white transition"
                    style={{ color: "oklch(0.50 0 0)" }}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid oklch(1 0 0 / 0.06)" }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-1 sm:justify-between text-xs" style={{ color: "oklch(0.40 0 0)" }}>
            <span>© 2025 MedConnect Health Pvt Ltd</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}