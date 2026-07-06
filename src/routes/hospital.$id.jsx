import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HospitalTypeBadge, VerifiedBadge, LiveDot, StarRating } from "@/components/HospitalCard";
import { hospitals, doctors, reviews, timeSlots, labTests } from "@/lib/mockData";
import { ChevronRight, Phone, Siren, Ambulance, Droplet, MapPin, Navigation, MessageCircle, CheckCircle2, ChevronLeft, BedDouble, Activity, FlaskConical, Stethoscope, Star, Info, Pill, Heart, Baby, Brain, Bone, Eye, Building2, Clock, Shield } from "lucide-react";

function DoctorCard({ d }) {
  const initialSelected = timeSlots.find((s) => s.state === "next")?.time ?? timeSlots[0].time;
  const [selected, setSelected] = useState(initialSelected);
  const [dayOffset, setDayOffset] = useState(0);
  const dateLabel = ["Today, 2 May", "Sat, 3 May", "Sun, 4 May", "Mon, 5 May"][Math.max(0, Math.min(3, dayOffset))];

  return (
    <div className="rounded-xl bg-card border border-border p-4 sm:p-5 hover:shadow-lift transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-12 w-12 rounded-full bg-${d.avatarColor} text-${d.avatarColor}-foreground flex items-center justify-center font-bold`}>{d.initials}</div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{d.name}</h3>
            <p className="text-xs text-muted-foreground">{d.specialty} · {d.experience} years</p>
            <div className="mt-1"><StarRating rating={d.rating} /></div>
          </div>
        </div>
        <div className="self-start sm:text-right shrink-0">
          <div className="font-mono text-lg font-semibold">₹{d.fee}</div>
          <div className="text-xs text-muted-foreground">/ visit</div>
        </div>
      </div>
      <div className="rounded-md bg-secondary border border-border p-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setDayOffset(Math.max(0, dayOffset - 1))} disabled={dayOffset === 0} className="p-1 hover:bg-card rounded disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
          <div className="text-sm font-semibold">{dateLabel} 2025</div>
          <button onClick={() => setDayOffset(Math.min(3, dayOffset + 1))} disabled={dayOffset === 3} className="p-1 hover:bg-card rounded disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {timeSlots.map((s) => {
            if (s.state === "taken") return <button key={s.time} disabled className="rounded-md bg-muted text-text-muted py-1.5 text-xs line-through cursor-not-allowed">{s.time}</button>;
            const isSel = selected === s.time;
            return (
              <button key={s.time} onClick={() => setSelected(s.time)} className={`rounded-md py-1.5 text-xs font-medium transition inline-flex items-center justify-center gap-1 ${isSel ? "bg-primary text-primary-foreground" : "bg-card border border-primary/30 text-primary hover:bg-primary-soft"}`}>
                {isSel && <CheckCircle2 className="h-3 w-3" />} {s.time}
              </button>
            );
          })}
        </div>
      </div>
      <Link to="/booking" className="mt-3 block text-center rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition">Book {selected}</Link>
    </div>
  );
}

const SPEC_ICONS = { Cardiology: Heart, Neurology: Brain, Orthopedics: Bone, Pediatrics: Baby, Emergency: Siren, Oncology: Activity, Transplant: Activity, "General Medicine": Stethoscope, Gynecology: Baby, Ophthalmology: Eye };

function TabBtn({ active, onClick, icon: Icon, label, count }) {
  return (
    <button onClick={onClick} className={`snap-start flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
      <Icon className="h-4 w-4" /> {label}
      {count != null && <span className={`text-xs rounded-full px-1.5 py-0.5 ${active ? "bg-primary-soft text-primary" : "bg-muted text-text-muted"}`}>{count}</span>}
    </button>
  );
}

function StatBox({ value, total, label, tone = "primary", icon: Icon }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-${tone}`}><Icon className="h-3.5 w-3.5" /> {label}</span>
        <LiveDot />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {total != null && <span className="text-sm text-muted-foreground">/ {total}</span>}
      </div>
      {total != null && (
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full bg-${tone} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="text-[11px] text-text-muted mt-1.5">{total ? `${value} available of ${total}` : "Status"}</div>
    </div>
  );
}

function HospitalTabs({ hospital, hospitalDoctors }) {
  const [tab, setTab] = useState("overview");
  const services = [
    { label: "24/7 Emergency", on: true, icon: Siren },
    { label: "Ambulance", on: hospital.beds.ambulance, icon: Ambulance },
    { label: "Operation Theatre", on: hospital.beds.ot, icon: Activity },
    { label: "Blood Bank", on: hospital.bloodBank, icon: Droplet },
    { label: "Pharmacy", on: true, icon: Pill },
    { label: "ICU/CCU", on: hospital.beds.icuTotal > 0, icon: Heart },
    { label: "Diagnostics & Lab", on: true, icon: FlaskConical },
    { label: "Insurance / Cashless", on: hospital.type === "Private", icon: Shield },
  ];

  return (
    <div>
      <div className="w-full max-w-full flex gap-1 overflow-x-auto snap-x border-b border-border mb-5 -mx-4 px-4 sm:mx-0 sm:px-1">
        <TabBtn active={tab==="overview"} onClick={() => setTab("overview")} icon={Info} label="Overview" />
        <TabBtn active={tab==="doctors"} onClick={() => setTab("doctors")} icon={Stethoscope} label="Doctors" count={hospitalDoctors.length} />
        <TabBtn active={tab==="beds"} onClick={() => setTab("beds")} icon={BedDouble} label="Beds & ICU" />
        <TabBtn active={tab==="services"} onClick={() => setTab("services")} icon={Activity} label="Services" />
        <TabBtn active={tab==="lab"} onClick={() => setTab("lab")} icon={FlaskConical} label="Lab Tests" />
        <TabBtn active={tab==="specialties"} onClick={() => setTab("specialties")} icon={Heart} label="Specialties" count={hospital.specialties.length} />
      </div>

      {tab === "overview" && (
        <div className="space-y-5">
          <div className="rounded-xl bg-card border border-border p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> About this hospital</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {hospital.name} is a {hospital.type.toLowerCase()} {hospital.beds.icuTotal > 8 ? "multi-specialty" : "general"} hospital located in {hospital.city}.
              The facility offers round-the-clock emergency care, {hospital.specialties.length}+ specialties, and {hospital.beds.generalTotal + hospital.beds.icuTotal} total inpatient beds with live availability updates.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox value={hospital.beds.general} total={hospital.beds.generalTotal} label="General Beds" tone="primary" icon={BedDouble} />
            <StatBox value={hospital.beds.icu} total={hospital.beds.icuTotal} label="ICU Beds" tone="emergency" icon={Heart} />
            <StatBox value={hospital.specialties.length} label="Specialties" tone="success" icon={Stethoscope} />
            <StatBox value={hospital.rating} label="Patient Rating" tone="warning" icon={Star} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3 min-w-0">
            {services.slice(0, 6).map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 min-w-0">
                <div className={`h-9 w-9 rounded-md flex items-center justify-center ${s.on ? "bg-success-soft text-success" : "bg-muted text-text-muted"}`}><s.icon className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground">{s.on ? "Available" : "Not available"}</div>
                </div>
                {s.on && <CheckCircle2 className="h-4 w-4 text-success" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "doctors" && (
        <div className="space-y-4">
          {hospitalDoctors.length > 0 ? hospitalDoctors.map((d) => (<DoctorCard key={d.id} d={d} />)) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No doctors listed yet for this hospital.</div>
          )}
        </div>
      )}

      {tab === "beds" && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <StatBox value={hospital.beds.general} total={hospital.beds.generalTotal} label="General Ward Beds" tone="primary" icon={BedDouble} />
            <StatBox value={hospital.beds.icu} total={hospital.beds.icuTotal} label="ICU / CCU Beds" tone="emergency" icon={Heart} />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3">Reserve a bed</h3>
            <p className="text-xs text-muted-foreground mb-4">Bed availability updates in real time. For emergencies, reserve instantly — no payment needed upfront.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/booking" className="rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold text-center hover:bg-primary-dark">Reserve general bed</Link>
              <Link to="/sos" className="rounded-md border border-emergency text-emergency py-2.5 text-sm font-semibold text-center hover:bg-emergency-soft">Reserve ICU bed (SOS)</Link>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Updated {hospital.updatedMinAgo} min ago</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex justify-between"><span>Ambulance service</span><span className={hospital.beds.ambulance ? "text-success font-medium" : "text-text-muted"}>{hospital.beds.ambulance ? "Available 24/7" : "Unavailable"}</span></li>
              <li className="flex justify-between"><span>Operation theatre</span><span className={hospital.beds.ot ? "text-success font-medium" : "text-text-muted"}>{hospital.beds.ot ? "Active" : "Closed"}</span></li>
              <li className="flex justify-between"><span>Blood bank</span><span className={hospital.bloodBank ? "text-success font-medium" : "text-text-muted"}>{hospital.bloodBank ? "On-site" : "Not on-site"}</span></li>
            </ul>
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {services.map((s) => {
            const routeMap = {
              "24/7 Emergency": "/sos",
              "Ambulance": "/sos",
              "Operation Theatre": "/booking",
              "Blood Bank": "/booking",
              "Pharmacy": "/booking",
              "ICU/CCU": "/booking",
              "Diagnostics & Lab": "/labs",
              "Insurance / Cashless": "/booking",
            };
            const ctaMap = {
              "24/7 Emergency": "Call SOS",
              "Ambulance": "Request ambulance",
              "Diagnostics & Lab": "Book test",
            };
            const to = routeMap[s.label] ?? "/booking";
            const cta = ctaMap[s.label] ?? "Book / Enquire";
            const Wrap = s.on ? Link : "div";
            const wrapProps = s.on ? { to } : {};
            return (
              <Wrap key={s.label} {...wrapProps} className={`flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition min-w-0 ${s.on ? "hover:border-primary hover:shadow-card cursor-pointer" : "opacity-70"}`}>
                <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${s.on ? "bg-success-soft text-success" : "bg-muted text-text-muted"}`}><s.icon className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{s.on ? "Available" : "Not available"}</div>
                </div>
                {s.on ? (
                  <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <span className="text-xs text-text-muted shrink-0">—</span>
                )}
              </Wrap>

            );
          })}
        </div>
      )}

      {tab === "lab" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><FlaskConical className="h-4 w-4 text-primary" /> In-house Diagnostics</h3>
              <p className="text-xs text-muted-foreground mt-0.5">NABL-accredited lab · Reports within 4–24 hrs</p>
            </div>
            <Link to="/labs" className="self-start sm:self-auto text-sm font-medium text-primary hover:underline">View all →</Link>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs text-muted-foreground">
                <tr><th className="text-left p-3 font-medium">Test</th><th className="text-left p-3 font-medium hidden sm:table-cell">Sample</th><th className="text-left p-3 font-medium">Report</th><th className="text-right p-3 font-medium">Price</th><th className="p-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {labTests.slice(0, 6).map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/50 cursor-pointer group" onClick={() => window.location.assign(`/labs?test=${encodeURIComponent(t.name)}`)}>
                    <td className="p-3 font-medium group-hover:text-primary">{t.name}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{t.sample}</td>
                    <td className="p-3 text-muted-foreground">{t.reportHrs} hrs</td>
                    <td className="p-3 text-right font-mono font-semibold">₹{t.price}</td>
                    <td className="p-3 text-right">
                      <Link to={`/labs?test=${encodeURIComponent(t.name)}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary-dark">Book</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "specialties" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hospital.specialties.map((sp) => {
            const Icon = SPEC_ICONS[sp] || Stethoscope;
            return (
              <div key={sp} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3 hover:shadow-card transition">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold">{sp}</div>
                  <div className="text-[11px] text-muted-foreground">Consult available</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HospitalDetail() {
  const { id } = useParams();
  const hospital = hospitals.find((h) => h.id === id) ?? hospitals[0];
  const hospitalDoctors = doctors.filter((d) => d.hospitalId === hospital.id);

  useEffect(() => {
    if (hospital) {
      document.title = `${hospital.name} — MedConnect`;
    }
  }, [hospital]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar active="hospitals" />
      <section className="relative" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-10">
          <nav className="flex items-center gap-1 text-xs text-white/70 mb-5">
            <Link to="/search" className="hover:text-white">Search</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-white">Hospitals</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{hospital.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 px-2.5 py-1 text-xs font-medium text-white">
              <HospitalTypeBadge type={hospital.type} />
              <VerifiedBadge />
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">{hospital.name}</h1>
          <p className="text-sm text-white/70 mt-1">{hospital.address} · {hospital.distanceKm} km away</p>
          <div className="mt-2 inline-flex items-center gap-1 text-warning">
            <span>★★★★</span><span className="text-warning/40">★</span>
            <span className="text-white text-sm ml-1 font-semibold">{hospital.rating}</span>
            <span className="text-white/60 text-xs">({hospital.reviews} reviews)</span>
          </div>
          <div className="mt-6 sm:mt-7 grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
            {[
              { value: hospital.beds.general, label: "General beds" },
              { value: hospital.beds.icu, label: "ICU beds" },
              { value: hospital.beds.ot ? "Yes" : "No", label: "OT available" },
            ].map((b) => (
              <div key={b.label} className="rounded-lg bg-white/10 backdrop-blur border border-white/20 p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-3xl font-bold text-white">{b.value}</span>
                  <span className="live-dot" />
                </div>
                <div className="text-xs text-white/70 mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-success-soft border-b border-success/20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <LiveDot label={`Live data · Updated ${hospital.updatedMinAgo} min ago`} />
          <span className="text-success/80 hidden sm:inline">Auto-refreshing via Socket.io</span>
        </div>
      </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 min-w-0">
        <div className="space-y-6 sm:space-y-8 min-w-0">
          <div className="rounded-xl bg-card border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3">Hospital info</h2>
            <div className="divide-y divide-border">
              {[
                { icon: Phone, label: "Phone", value: hospital.phone },
                { icon: Siren, label: "Emergency", value: hospital.emergencyPhone },
                { icon: Ambulance, label: "Ambulance", value: hospital.beds.ambulance ? "Available 24/7" : "Not available" },
                { icon: Droplet, label: "Blood bank", value: hospital.bloodBank ? "On-site" : "Not on-site" },
              ].map((row) => (
                <div key={row.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <row.icon className="h-4 w-4" strokeWidth={1.5} /> {row.label}
                  </span>
                  <span className="font-medium font-mono text-foreground break-all">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <HospitalTabs hospital={hospital} hospitalDoctors={hospitalDoctors} />


          <div>
            <h2 className="font-semibold text-foreground mb-4">Patient reviews</h2>
            <div className="rounded-xl bg-card border border-border p-5 mb-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">{hospital.rating}</div>
                  <div className="text-warning text-sm">★★★★★</div>
                  <div className="text-xs text-muted-foreground mt-1">{hospital.reviews} reviews</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star, i) => {
                    const w = [78, 16, 4, 1, 1][i];
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-muted-foreground">{star}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning rounded-full" style={{ width: `${w}%` }} />
                        </div>
                        <span className="w-8 text-right text-text-muted font-mono">{w}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{r.name}</span>
                      {r.verified && <VerifiedBadge />}
                    </div>
                    <span className="text-xs text-text-muted">{r.date}</span>
                  </div>
                  <div className="text-warning text-xs mb-2">{"★".repeat(r.rating)}<span className="text-warning/30">{"★".repeat(5 - r.rating)}</span></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl bg-card border border-border p-5 shadow-card">
            <h3 className="font-semibold text-foreground mb-1">Book an appointment</h3>
            <p className="text-xs text-muted-foreground mb-4">Free cancellation up to 2 hours before</p>
            <div className="rounded-md bg-secondary p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{hospitalDoctors[0]?.name ?? "Select"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Slot</span><span className="font-medium font-mono">Today 10:00 AM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-mono font-semibold">₹{hospitalDoctors[0]?.fee ?? 500}</span></div>
            </div>
            <Link to="/booking" className="mt-4 block text-center rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary-dark transition">Continue to booking</Link>
            <Link to="/sos" className="mt-2 block text-center rounded-md border border-emergency text-emergency py-2.5 text-sm font-semibold hover:bg-emergency-soft transition">Reserve a bed (emergency)</Link>
          </div>

          <div className="rounded-xl bg-card border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Location</h3>
            <div className="map-bg h-[180px] rounded-md border border-border relative overflow-hidden">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <MapPin className="h-7 w-7 text-primary fill-primary/30" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{hospital.address}</p>
            <a className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"><Navigation className="h-3.5 w-3.5" /> Get directions</a>
          </div>

          <div className="rounded-xl bg-card border border-border p-5 space-y-2">
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-success text-success-foreground py-2.5 text-sm font-semibold hover:opacity-90"><Phone className="h-4 w-4" /> Call hospital</button>
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-muted"><MessageCircle className="h-4 w-4 text-success" /> WhatsApp</button>
          </div>
        </aside>
      </div>
    </div>
  );
}