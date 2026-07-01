import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { clinicDoctors, timeSlots } from "@/lib/mockData";
import {
  Search,
  Star,
  Clock,
  Stethoscope,
  Filter,
  MapPin,
  Languages,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SPECIALTIES = [
  "All",
  "Dermatologist",
  "Gynecologist",
  "Dentist",
  "Pediatrician",
  "Physiotherapist",
  "ENT Specialist",
];

function DoctorCard({ d }) {
  const navigate = useNavigate();
  const initialSelected = timeSlots.find((s) => s.state === "next")?.time ?? timeSlots[0].time;
  const [selected, setSelected] = useState(initialSelected);
  const [dayOffset, setDayOffset] = useState(0);
  const dateLabel = ["Today, 2 May", "Sat, 3 May", "Sun, 4 May", "Mon, 5 May"][
    Math.max(0, Math.min(3, dayOffset))
  ];

  const avatarBg =
    d.avatarColor === "primary"
      ? "bg-primary"
      : d.avatarColor === "success"
        ? "bg-success"
        : d.avatarColor === "warning"
          ? "bg-warning"
          : "bg-emergency";

  return (
    <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-elevated transition flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 ${avatarBg}`}
          >
            {d.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition truncate">
              {d.name}
            </h3>
            <p className="text-sm text-primary font-medium">{d.specialty}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {d.experience} yrs experience · {d.qualifications?.join(", ")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">₹{d.fee}</div>
            <div className="text-[10px] text-muted-foreground">per visit</div>
          </div>
        </div>

        {/* Chamber Info */}
        <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">{d.clinicName}</span>
              <p className="mt-0.5">
                {d.address}, {d.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{d.timings}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Languages className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Speaks: {d.languages?.join(", ")}</span>
          </div>
        </div>

        {/* Live Slot Picker inside card */}
        <div className="mt-5 rounded-xl bg-secondary border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Select Booking Slot
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDayOffset(Math.max(0, dayOffset - 1));
                }}
                disabled={dayOffset === 0}
                className="p-1 hover:bg-card rounded disabled:opacity-30"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <span className="text-[10px] font-bold text-foreground">{dateLabel}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setDayOffset(Math.min(3, dayOffset + 1));
                }}
                disabled={dayOffset === 3}
                className="p-1 hover:bg-card rounded disabled:opacity-30"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {timeSlots.slice(0, 6).map((s) => {
              if (s.state === "taken")
                return (
                  <button
                    key={s.time}
                    disabled
                    className="rounded bg-muted text-text-muted py-1 text-[10px] line-through cursor-not-allowed text-center"
                  >
                    {s.time}
                  </button>
                );
              const isSel = selected === s.time;
              return (
                <button
                  key={s.time}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(s.time);
                  }}
                  className={`rounded py-1 text-[10px] font-medium transition text-center ${isSel ? "bg-primary text-primary-foreground" : "bg-card border border-primary/20 text-primary hover:bg-primary-soft"}`}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 pt-3 border-t border-border">
        <Link
          to={`/doctors/${d.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-border text-xs font-medium hover:border-primary hover:text-primary transition"
        >
          View Profile
        </Link>
        <Link
          to={`/booking?docId=${d.id}&time=${encodeURIComponent(selected)}&date=${encodeURIComponent(dateLabel)}`}
          className="flex-1 text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-dark transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");

  useEffect(() => {
    document.title = "Find Chamber Doctors — MedConnect";
  }, []);

  const list = useMemo(() => {
    return clinicDoctors.filter((d) => {
      const matchQ =
        !q.trim() ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.specialty.toLowerCase().includes(q.toLowerCase()) ||
        d.clinicName.toLowerCase().includes(q.toLowerCase());
      const matchS = spec === "All" || d.specialty === spec;
      return matchQ && matchS;
    });
  }, [q, spec]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar active="doctors" />
      <section className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-card border border-border text-muted-foreground mb-3">
            <Stethoscope className="h-3.5 w-3.5 text-primary" />
            {clinicDoctors.length} private chamber doctors available
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Find Private Chamber Doctors
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Search independent chamber practitioners, pick a preferred booking slot, and confirm in
            seconds.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by doctor name, specialty or chamber name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary transition">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpec(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${spec === s ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{list.length}</span> doctors found
          </p>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No chamber doctors match your search.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d) => (
              <DoctorCard key={d.id} d={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
