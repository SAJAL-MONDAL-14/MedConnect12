import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { clinicDoctors, timeSlots, reviews } from "@/lib/mockData";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Award,
  Languages,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Stethoscope,
} from "lucide-react";

export default function DoctorProfile() {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Doctor Profile — MedConnect";
  }, []);

  const d = clinicDoctors.find((doc) => doc.id === id);

  const initialSelected = timeSlots.find((s) => s.state === "next")?.time ?? timeSlots[0].time;
  const [selected, setSelected] = useState(initialSelected);
  const [dayOffset, setDayOffset] = useState(0);

  if (!d) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">Doctor not found</h1>
          <Link to="/doctors" className="mt-4 inline-block text-primary hover:underline">
            ← Back to all doctors
          </Link>
        </div>
      </div>
    );
  }

  const avatarBg =
    d.avatarColor === "primary"
      ? "bg-primary"
      : d.avatarColor === "success"
        ? "bg-success"
        : d.avatarColor === "warning"
          ? "bg-warning"
          : "bg-emergency";

  const dateLabel = ["Today, 2 May", "Sat, 3 May", "Sun, 4 May", "Mon, 5 May"][
    Math.max(0, Math.min(3, dayOffset))
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar active="doctors" />
      <section className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-8">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back to chamber doctors
          </Link>
          <div className="mt-4 flex flex-col md:flex-row gap-6 items-start">
            <div
              className={`h-28 w-28 rounded-2xl ${avatarBg} text-white flex items-center justify-center text-3xl font-bold shrink-0 shadow-lg`}
            >
              {d.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{d.name}</h1>
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-primary font-medium mt-1">{d.specialty}</p>
              <p className="text-sm text-muted-foreground">{d.experience} years experience</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{d.rating}</span>
                  <span className="text-muted-foreground">({d.reviews ?? 128} reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {d.clinicName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Consultation fee</div>
              <div className="text-3xl font-bold text-foreground">₹{d.fee}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">per visit</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-base mb-3">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {d.about ??
                `${d.name} is a senior ${d.specialty.toLowerCase()} with ${d.experience}+ years of clinical experience, known for compassionate patient care and evidence-based treatment.`}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Qualifications</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {(d.qualifications ?? ["MBBS", "MD/MS in " + d.specialty, "Fellowship"]).map(
                  (q) => (
                    <li key={q} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {q}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(d.languages ?? ["English", "Hindi", "Bengali"]).map((l) => (
                  <span
                    key={l}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary-soft text-primary font-medium"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-base">Available slots</h2>
              </div>
              <span className="text-[10px] text-success inline-flex items-center gap-1">
                <span className="live-dot" /> Live
              </span>
            </div>

            {/* Day Selector */}
            <div className="flex items-center justify-between mb-4 max-w-xs bg-secondary border border-border p-2 rounded-lg">
              <button
                onClick={() => setDayOffset(Math.max(0, dayOffset - 1))}
                disabled={dayOffset === 0}
                className="p-1 hover:bg-card rounded disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-xs font-semibold">{dateLabel} 2025</div>
              <button
                onClick={() => setDayOffset(Math.min(3, dayOffset + 1))}
                disabled={dayOffset === 3}
                className="p-1 hover:bg-card rounded disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeSlots.map((s) => {
                if (s.state === "taken")
                  return (
                    <button
                      key={s.time}
                      disabled
                      className="px-2 py-2.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border opacity-50 cursor-not-allowed line-through"
                    >
                      {s.time}
                    </button>
                  );
                const isSel = selected === s.time;
                return (
                  <button
                    key={s.time}
                    onClick={() => setSelected(s.time)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-medium border transition ${isSel ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary hover:text-primary"}`}
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-base mb-4">Patient reviews</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-secondary text-foreground text-xs font-bold flex items-center justify-center">
                        {r.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-3">Chamber Information</h3>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{d.clinicName}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {d.address}, {d.city}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> {d.timings}
              </div>
              {d.phone && (
                <a
                  href={`tel:${d.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Phone className="h-4 w-4" /> {d.phone}
                </a>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 text-success mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-semibold">Next available slot</span>
            </div>
            <div className="text-xl font-bold">{d.nextSlot}</div>
            <Link
              to={`/booking?docId=${d.id}&time=${encodeURIComponent(selected)}&date=${encodeURIComponent(dateLabel)}`}
              className="mt-4 block text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Book Selected Slot ({selected})
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
