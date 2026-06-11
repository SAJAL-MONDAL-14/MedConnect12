// import { Link, useParams } from "react-router-dom";
// import { useEffect } from "react";
// import { Navbar } from "@/components/Navbar";
// import { doctors, hospitals, clinicDoctors, timeSlots, reviews } from "@/lib/mockData";
// import { Star, MapPin, Phone, Clock, Award, Languages, ChevronLeft, CheckCircle2, Calendar, Stethoscope } from "lucide-react";

// export default function DoctorProfile() {
//   const { id } = useParams();

//   useEffect(() => {
//     document.title = "Doctor profile — MedConnect";
//   }, []);
//   const hosDoc = doctors.find((d) => d.id === id);
//   const clinic = clinicDoctors.find((d) => d.id === id);

//   if (!hosDoc && !clinic) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
//           <h1 className="text-2xl font-bold">Doctor not found</h1>
//           <Link to="/doctors" className="mt-4 inline-block text-primary hover:underline">← Back to all doctors</Link>
//         </div>
//       </div>
//     );
//   }

//   const isClinic = !!clinic;
//   const d = clinic ?? hosDoc;
//   const hospital = hosDoc ? hospitals.find((h) => h.id === hosDoc.hospitalId) : null;
//   const placeName = clinic ? clinic.clinicName : hospital?.name ?? "";
//   const placeAddress = clinic ? clinic.address : hospital?.address ?? "";

//   const avatarBg = d.avatarColor === "primary" ? "bg-primary" : d.avatarColor === "success" ? "bg-success" : d.avatarColor === "warning" ? "bg-warning" : "bg-emergency";

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar active="doctors" />
//       <section className="bg-gradient-to-br from-primary-soft via-background to-background border-b border-border">
//         <div className="max-w-[1100px] mx-auto px-6 py-8">
//           <Link to={isClinic ? "/clinics" : "/doctors"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
//             <ChevronLeft className="h-4 w-4" /> Back to {isClinic ? "clinics" : "doctors"}
//           </Link>
//           <div className="mt-4 flex flex-col md:flex-row gap-6 items-start">
//             <div className={`h-28 w-28 rounded-2xl ${avatarBg} text-white flex items-center justify-center text-3xl font-bold shrink-0 shadow-lg`}>{d.initials}</div>
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <h1 className="text-3xl font-bold tracking-tight">{d.name}</h1>
//                 <CheckCircle2 className="h-5 w-5 text-primary" />
//               </div>
//               <p className="text-primary font-medium mt-1">{d.specialty}</p>
//               <p className="text-sm text-muted-foreground">{d.experience} years experience</p>
//               <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
//                 <span className="inline-flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-warning text-warning" />
//                   <span className="font-semibold">{d.rating}</span>
//                   <span className="text-muted-foreground">({d.reviews ?? 128} reviews)</span>
//                 </span>
//                 <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {placeName}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-xs text-muted-foreground">Consultation fee</div>
//               <div className="text-3xl font-bold text-foreground">₹{d.fee}</div>
//               <Link to="/booking" className="mt-3 inline-block px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">Book appointment</Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="max-w-[1100px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-6">
//         <div className="space-y-6">
//           <div className="bg-card border border-border rounded-2xl p-6">
//             <h2 className="font-semibold text-lg mb-3">About</h2>
//             <p className="text-sm text-muted-foreground leading-relaxed">
//               {clinic?.about ?? `${d.name} is a senior ${d.specialty.toLowerCase()} with ${d.experience}+ years of clinical experience, known for compassionate patient care and evidence-based treatment.`}
//             </p>
//           </div>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <div className="bg-card border border-border rounded-2xl p-6">
//               <div className="flex items-center gap-2 mb-3"><Award className="h-4 w-4 text-primary" /><h3 className="font-semibold">Qualifications</h3></div>
//               <ul className="space-y-1.5 text-sm text-muted-foreground">
//                 {(clinic?.qualifications ?? ["MBBS", "MD/MS in " + d.specialty, "Fellowship"]).map((q) => (
//                   <li key={q} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {q}</li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-card border border-border rounded-2xl p-6">
//               <div className="flex items-center gap-2 mb-3"><Languages className="h-4 w-4 text-primary" /><h3 className="font-semibold">Languages</h3></div>
//               <div className="flex flex-wrap gap-2">
//                 {(clinic?.languages ?? ["English", "Hindi", "Bengali"]).map((l) => (
//                   <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-primary-soft text-primary font-medium">{l}</span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><h2 className="font-semibold text-lg">Available slots today</h2></div>
//               <span className="text-xs text-success inline-flex items-center gap-1"><span className="live-dot" /> Live</span>
//             </div>
//             <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
//               {timeSlots.map((s) => (
//                 <button key={s.time} disabled={s.state === "taken"} className={`px-2 py-2.5 rounded-lg text-xs font-medium border transition ${s.state === "taken" ? "bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed line-through" : s.state === "next" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary hover:text-primary"}`}>{s.time}</button>
//               ))}
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-6">
//             <h2 className="font-semibold text-lg mb-4">Patient reviews</h2>
//             <div className="space-y-4">
//               {reviews.map((r) => (
//                 <div key={r.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="h-8 w-8 rounded-full bg-secondary text-foreground text-xs font-bold flex items-center justify-center">{r.name.split(" ").map((n) => n[0]).join("")}</div>
//                       <div><div className="text-sm font-medium">{r.name}</div><div className="text-[11px] text-muted-foreground">{r.date}</div></div>
//                     </div>
//                     <div className="flex items-center gap-0.5">
//                       {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />))}
//                     </div>
//                   </div>
//                   <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <aside className="space-y-4">
//           <div className="bg-card border border-border rounded-2xl p-6">
//             <h3 className="font-semibold mb-3">{isClinic ? "Clinic" : "Hospital"}</h3>
//             <div className="flex items-start gap-3">
//               <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0"><Stethoscope className="h-5 w-5" /></div>
//               <div><div className="font-semibold text-sm">{placeName}</div><div className="text-xs text-muted-foreground mt-0.5">{placeAddress}</div></div>
//             </div>
//             <div className="mt-4 space-y-2 text-sm">
//               <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {clinic?.timings ?? "Mon–Sat · 9am–8pm"}</div>
//               {clinic?.phone && (<a href={`tel:${clinic.phone}`} className="flex items-center gap-2 text-primary hover:underline"><Phone className="h-4 w-4" /> {clinic.phone}</a>)}
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-6">
//             <div className="flex items-center gap-2 text-success mb-2"><Clock className="h-4 w-4" /><span className="text-sm font-semibold">Next available</span></div>
//             <div className="text-2xl font-bold">{d.nextSlot}</div>
//             <Link to="/booking" className="mt-4 block text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">Book this slot</Link>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }



import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HospitalTypeBadge, VerifiedBadge, LiveDot, StarRating } from "@/components/HospitalCard";
import { hospitals, doctors, reviews, timeSlots } from "@/lib/mockData";
import { ChevronRight, Phone, Siren, Ambulance, Droplet, MapPin, Navigation, MessageCircle, CheckCircle2, ChevronLeft } from "lucide-react";

function DoctorCard({ d }) {
  const initialSelected = timeSlots.find((s) => s.state === "next")?.time ?? timeSlots[0].time;
  const [selected, setSelected] = useState(initialSelected);
  const [dayOffset, setDayOffset] = useState(0);
  const dateLabel = ["Today, 2 May", "Sat, 3 May", "Sun, 4 May", "Mon, 5 May"][Math.max(0, Math.min(3, dayOffset))];

  return (
    <div className="rounded-xl bg-card border border-border p-5 hover:shadow-lift transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-full bg-${d.avatarColor} text-${d.avatarColor}-foreground flex items-center justify-center font-bold`}>{d.initials}</div>
          <div>
            <h3 className="font-semibold text-foreground">{d.name}</h3>
            <p className="text-xs text-muted-foreground">{d.specialty} · {d.experience} years</p>
            <div className="mt-1"><StarRating rating={d.rating} /></div>
          </div>
        </div>
        <div className="text-right">
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
        <div className="max-w-[1200px] mx-auto px-6 pt-6 pb-10">
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
          <h1 className="text-[28px] font-bold text-white tracking-tight">{hospital.name}</h1>
          <p className="text-sm text-white/70 mt-1">{hospital.address} · {hospital.distanceKm} km away</p>
          <div className="mt-2 inline-flex items-center gap-1 text-warning">
            <span>★★★★</span><span className="text-warning/40">★</span>
            <span className="text-white text-sm ml-1 font-semibold">{hospital.rating}</span>
            <span className="text-white/60 text-xs">({hospital.reviews} reviews)</span>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3 max-w-2xl">
            {[
              { value: hospital.beds.general, label: "General beds" },
              { value: hospital.beds.icu, label: "ICU beds" },
              { value: hospital.beds.ot ? "Yes" : "No", label: "OT available" },
            ].map((b) => (
              <div key={b.label} className="rounded-lg bg-white/10 backdrop-blur border border-white/20 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{b.value}</span>
                  <span className="live-dot" />
                </div>
                <div className="text-xs text-white/70 mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-success-soft border-b border-success/20">
        <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex items-center justify-between text-xs">
          <LiveDot label={`Live data · Updated ${hospital.updatedMinAgo} min ago`} />
          <span className="text-success/80 hidden sm:inline">Auto-refreshing via Socket.io</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          <div className="rounded-xl bg-card border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3">Hospital info</h2>
            <div className="divide-y divide-border">
              {[
                { icon: Phone, label: "Phone", value: hospital.phone },
                { icon: Siren, label: "Emergency", value: hospital.emergencyPhone },
                { icon: Ambulance, label: "Ambulance", value: hospital.beds.ambulance ? "Available 24/7" : "Not available" },
                { icon: Droplet, label: "Blood bank", value: hospital.bloodBank ? "On-site" : "Not on-site" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <row.icon className="h-4 w-4" strokeWidth={1.5} /> {row.label}
                  </span>
                  <span className="font-medium font-mono text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-foreground mb-4">Doctors at this hospital</h2>
            <div className="space-y-4">
              {hospitalDoctors.map((d) => (<DoctorCard key={d.id} d={d} />))}
            </div>
          </div>

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