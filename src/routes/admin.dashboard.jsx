// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   LayoutDashboard, BarChart3, Building2, FlaskConical,
//   Stethoscope, Users, UserCog, Siren, CalendarCheck,
//   Settings, CreditCard, Search, Bell, ShieldCheck,
//   ChevronRight, LogOut, Plus, X, ClipboardList,
//   Mail, Phone, MapPin, Award, Check, Eye, Download,
//   MessageSquare, AlertCircle, FileText, Camera,
//   Globe, Hash, CheckCircle2, RefreshCw, ZoomIn,
// } from "lucide-react";

// // ── Nav sections ──────────────────────────────────────────────────────────────
// const sections = [
//   { label: "Overview", items: [
//     { icon: LayoutDashboard, label: "Dashboard" },
//     { icon: BarChart3,       label: "Analytics"  },
//   ]},
//   { label: "Tenants", items: [
//     { icon: Building2,     label: "Hospitals"             },
//     { icon: Building2,     label: "Hospital Applications" },
//     { icon: FlaskConical,  label: "Labs"                  },
//     { icon: Stethoscope,   label: "Doctors"               },
//     { icon: ClipboardList, label: "Clinic Applications"   },
//   ]},
//   { label: "Users", items: [
//     { icon: Users,   label: "Patients" },
//     { icon: UserCog, label: "Staff"    },
//   ]},
//   { label: "System", items: [
//     { icon: Siren,         label: "SOS Events" },
//     { icon: CalendarCheck, label: "Bookings"   },
//     { icon: Settings,      label: "Settings"   },
//     { icon: CreditCard,    label: "Billing"    },
//   ]},
// ];

// // ── Hospital application mock data ────────────────────────────────────────────
// const INITIAL_HOSPITAL_APPS = [
//   {
//     id: "ha1",
//     hospitalName:    "City Care Hospital",
//     hospitalType:    "Private",
//     regNumber:       "HRN-2024-7821",
//     estNumber:       "CER-2024-4521",
//     nabhNumber:      "",
//     gstNumber:       "27ABCDE1234F1Z5",
//     panNumber:       "ABCDE1234F",
//     hospEmail:       "admin@citycare.in",
//     hospPhone:       "+91 98765 11111",
//     website:         "https://citycare.in",
//     address:         "22, Sevoke Road",
//     state:           "West Bengal",
//     district:        "Darjeeling",
//     city:            "Siliguri",
//     pincode:         "734001",
//     latitude:        "26.7271",
//     longitude:       "88.3953",
//     adminName:       "Dr. Ramesh Kumar",
//     adminEmail:      "ramesh@citycare.in",
//     adminPhone:      "+91 98765 22222",
//     totalBeds:       120,
//     icuBeds:         12,
//     emergencyBeds:   10,
//     ventilators:     8,
//     ambulances:      4,
//     otCount:         3,
//     doctorCount:     35,
//     nurseCount:      60,
//     staffCount:      40,
//     departments:     ["Cardiology","Neurology","Orthopedics","Pediatrics","Emergency Medicine"],
//     services:        { has24x7:true, hasPharmacy:true, hasLab:true, hasBloodBank:true, hasICU:true, hasNICU:false, hasDialysis:false, hasMRI:true, hasCT:true },
//     docs: {
//       reg_cert:   "hospital_reg_cert.pdf",
//       est_cert:   "clinical_est_cert.pdf",
//       letterhead: "hospital_letterhead.pdf",
//       logo:       "hospital_logo.png",
//       nabh:       "",
//       gst_cert:   "gst_cert.pdf",
//       pan_card:   "pan_card.pdf",
//     },
//     photos: {
//       entrance:"entrance.jpg", reception:"reception.jpg", opd_waiting:"opd.jpg",
//       general_ward:"ward.jpg", icu_ward:"icu.jpg", emergency:"emergency.jpg",
//       ot:"ot.jpg", pharmacy:"pharmacy.jpg", laboratory:"lab.jpg",
//       ambulance:"ambulance.jpg", consultation:"consultation.jpg",
//     },
//     emailVerified: true,
//     phoneVerified: true,
//     submittedAt:   "2025-05-01T10:30:00Z",
//     status:        "under_review",
//     auditLog: [
//       { action:"Registration submitted", at:"2025-05-01T10:30:00Z", by:"Hospital" },
//       { action:"Email verified",          at:"2025-05-01T10:31:00Z", by:"System"   },
//       { action:"Phone verified",          at:"2025-05-01T10:32:00Z", by:"System"   },
//     ],
//     adminNotes: "",
//     changeRequest: "",
//   },
//   {
//     id: "ha2",
//     hospitalName:  "NovaCare Medical Centre",
//     hospitalType:  "Specialty Hospital",
//     regNumber:     "HRN-2024-5543",
//     estNumber:     "CER-2024-3312",
//     nabhNumber:    "NABH/H/2023/001",
//     gstNumber:     "",
//     panNumber:     "FGHIJ5678K",
//     hospEmail:     "info@novacare.in",
//     hospPhone:     "+91 98765 33333",
//     website:       "https://novacare.in",
//     address:       "45, Hill Cart Road",
//     state:         "West Bengal",
//     district:      "Darjeeling",
//     city:          "Siliguri",
//     pincode:       "734002",
//     latitude:      "26.7300",
//     longitude:     "88.3900",
//     adminName:     "Dr. Priya Mehta",
//     adminEmail:    "priya@novacare.in",
//     adminPhone:    "+91 98765 44444",
//     totalBeds:     80,
//     icuBeds:       8,
//     emergencyBeds: 6,
//     ventilators:   5,
//     ambulances:    2,
//     otCount:       2,
//     doctorCount:   22,
//     nurseCount:    40,
//     staffCount:    25,
//     departments:   ["Cardiology","Gynecology","Dermatology","Psychiatry"],
//     services:      { has24x7:true, hasPharmacy:true, hasLab:true, hasBloodBank:false, hasICU:true, hasNICU:true, hasDialysis:false, hasMRI:false, hasCT:true },
//     docs: {
//       reg_cert:"reg.pdf", est_cert:"est.pdf", letterhead:"lh.pdf", logo:"logo.png",
//       nabh:"nabh.pdf", gst_cert:"", pan_card:"pan.pdf",
//     },
//     photos: {
//       entrance:"e.jpg", reception:"r.jpg", opd_waiting:"o.jpg",
//       general_ward:"gw.jpg", icu_ward:"icu.jpg", emergency:"em.jpg",
//       ot:"ot.jpg", pharmacy:"ph.jpg", laboratory:"lab.jpg",
//       ambulance:"amb.jpg", consultation:"con.jpg", nursing:"ns.jpg",
//     },
//     emailVerified: true,
//     phoneVerified: true,
//     submittedAt:   "2025-05-02T09:00:00Z",
//     status:        "pending",
//     auditLog: [
//       { action:"Registration submitted", at:"2025-05-02T09:00:00Z", by:"Hospital" },
//       { action:"Email verified",          at:"2025-05-02T09:05:00Z", by:"System"   },
//       { action:"Phone verified",          at:"2025-05-02T09:06:00Z", by:"System"   },
//     ],
//     adminNotes:    "",
//     changeRequest: "",
//   },
//   {
//     id: "ha3",
//     hospitalName:  "Sunrise Nursing Home",
//     hospitalType:  "Nursing Home",
//     regNumber:     "HRN-2024-9901",
//     estNumber:     "CER-2024-7788",
//     nabhNumber:    "",
//     gstNumber:     "",
//     panNumber:     "",
//     hospEmail:     "sunrise@nursing.in",
//     hospPhone:     "+91 98765 55555",
//     website:       "",
//     address:       "12, Pradhan Nagar",
//     state:         "West Bengal",
//     district:      "Darjeeling",
//     city:          "Siliguri",
//     pincode:       "734003",
//     adminName:     "Mr. Suresh Das",
//     adminEmail:    "suresh@sunrise.in",
//     adminPhone:    "+91 98765 66666",
//     totalBeds:     40,
//     icuBeds:       4,
//     emergencyBeds: 2,
//     ventilators:   2,
//     ambulances:    1,
//     otCount:       1,
//     doctorCount:   10,
//     nurseCount:    18,
//     staffCount:    12,
//     departments:   ["General Medicine","Gynecology","Pediatrics"],
//     services:      { has24x7:false, hasPharmacy:true, hasLab:false, hasBloodBank:false, hasICU:true, hasNICU:false, hasDialysis:false, hasMRI:false, hasCT:false },
//     docs:          { reg_cert:"reg.pdf", est_cert:"est.pdf", letterhead:"lh.pdf", logo:"logo.png" },
//     photos:        { entrance:"e.jpg", reception:"r.jpg", opd_waiting:"o.jpg", general_ward:"gw.jpg", icu_ward:"icu.jpg", emergency:"em.jpg", ot:"ot.jpg", pharmacy:"ph.jpg", laboratory:"lab.jpg", ambulance:"amb.jpg" },
//     emailVerified: true,
//     phoneVerified: true,
//     submittedAt:   "2025-04-28T14:00:00Z",
//     status:        "approved",
//     auditLog: [
//       { action:"Registration submitted", at:"2025-04-28T14:00:00Z", by:"Hospital"   },
//       { action:"Email verified",          at:"2025-04-28T14:01:00Z", by:"System"     },
//       { action:"Phone verified",          at:"2025-04-28T14:02:00Z", by:"System"     },
//       { action:"Admin approved",          at:"2025-04-29T10:00:00Z", by:"Super Admin"},
//       { action:"Welcome email sent",      at:"2025-04-29T10:01:00Z", by:"System"     },
//     ],
//     adminNotes:    "All documents verified. Facility photos look good.",
//     changeRequest: "",
//   },
// ];

// const STATUS_CONFIG = {
//   pending:                  { label:"Pending",                bg:"bg-muted text-muted-foreground"              },
//   under_review:             { label:"Under Review",           bg:"bg-warning-soft text-warning"                },
//   pending_facility_review:  { label:"Facility Review",        bg:"bg-primary-soft text-primary"                },
//   facility_verified:        { label:"Facility Verified",      bg:"bg-success-soft text-success"                },
//   facility_rejected:        { label:"Facility Rejected",      bg:"bg-emergency-soft text-emergency"            },
//   approved:                 { label:"Approved",               bg:"bg-success-soft text-success"                },
//   rejected:                 { label:"Rejected",               bg:"bg-emergency-soft text-emergency"            },
//   suspended:                { label:"Suspended",              bg:"bg-emergency-soft text-emergency"            },
//   changes_requested:        { label:"Changes Requested",      bg:"bg-accent text-accent-foreground"            },
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function HospitalStatusBadge({ status }) {
//   const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
//   return <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}>{cfg.label}</span>;
// }

// function Row({ label, value }) {
//   return (
//     <div className="flex items-start justify-between px-4 py-2.5 text-sm border-b border-border last:border-0">
//       <span className="text-muted-foreground shrink-0 w-40">{label}</span>
//       <span className="font-medium text-right">{value || "—"}</span>
//     </div>
//   );
// }

// function DocRow({ label, value }) {
//   return (
//     <div className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0">
//       <span className="text-sm text-muted-foreground">{label}</span>
//       {value
//         ? <button className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"><Download className="h-3 w-3"/>{value}</button>
//         : <span className="text-xs text-muted-foreground italic">Not uploaded</span>}
//     </div>
//   );
// }

// // ── Main dashboard ────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   useEffect(() => { document.title = "Admin dashboard — MedConnect"; }, []);
//   const [view, setView] = useState("Dashboard");

//   return (
//     <div className="min-h-screen bg-background flex">
//       <aside className="hidden md:flex flex-col w-[210px] shrink-0 bg-foreground text-background">
//         <div className="p-5 border-b border-white/10">
//           <div className="text-base font-bold">Med<span className="text-primary">Connect</span></div>
//           <div className="inline-flex items-center gap-1 mt-2 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
//             <ShieldCheck className="h-3 w-3" /> Super Admin
//           </div>
//         </div>
//         <div className="p-4 border-b border-white/10 flex items-center gap-2">
//           <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">AS</div>
//           <div className="min-w-0">
//             <div className="text-xs font-semibold truncate">Aman Singh</div>
//             <div className="text-[10px] text-white/60">Platform admin</div>
//           </div>
//         </div>
//         <nav className="flex-1 py-3 overflow-y-auto">
//           {sections.map((sec) => (
//             <div key={sec.label} className="mb-3">
//               <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-white/40 font-semibold">{sec.label}</div>
//               {sec.items.map((n) => (
//                 <button key={n.label} onClick={() => setView(n.label)}
//                   className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium border-l-2 transition text-left ${
//                     view === n.label ? "bg-primary/15 border-primary text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}>
//                   <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </nav>
//         <Link to="/login" className="m-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
//           <LogOut className="h-4 w-4" /> Logout
//         </Link>
//       </aside>

//       <div className="flex-1 min-w-0">
//         <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
//           <div>
//             <div className="font-semibold">{view}</div>
//             <div className="text-xs text-muted-foreground">All tenants · India</div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-input px-3 w-64">
//               <Search className="h-4 w-4 text-muted-foreground" />
//               <input placeholder="Search tenants, users..." className="bg-transparent py-1.5 text-sm outline-none flex-1" />
//             </div>
//             <button className="relative p-2 rounded-md hover:bg-muted">
//               <Bell className="h-4 w-4" />
//               <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
//             </button>
//             <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">AS</div>
//           </div>
//         </header>

//         <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-2">
//           {sections.flatMap(s => s.items).map(n => (
//             <button key={n.label} onClick={() => setView(n.label)}
//               className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 ${
//                 view === n.label ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
//               {n.label}
//             </button>
//           ))}
//         </div>

//         <main className="p-6 space-y-6">
//           {view === "Dashboard"             && <DashboardView />}
//           {view === "Analytics"             && <AnalyticsView />}
//           {view === "Hospitals"             && <HospitalsView />}
//           {view === "Hospital Applications" && <HospitalApplicationsView />}
//           {view === "Labs"                  && <PlaceholderView title="Labs" desc="Manage lab tenants and home-collection availability." />}
//           {view === "Doctors"               && <PlaceholderView title="Doctors" desc="All registered doctors across the platform." />}
//           {view === "Clinic Applications"   && <ClinicApplicationsView />}
//           {view === "Patients"              && <PlaceholderView title="Patients" desc="Search and manage patient accounts." />}
//           {view === "Staff"                 && <PlaceholderView title="Staff accounts" desc="Hospital staff users with portal access." />}
//           {view === "SOS Events"            && <PlaceholderView title="SOS Events" desc="Emergency SOS events across the platform." />}
//           {view === "Bookings"              && <PlaceholderView title="All bookings" desc="Cross-tenant bookings ledger." />}
//           {view === "Billing"               && <BillingView />}
//           {view === "Settings"              && <PlaceholderView title="Platform settings" desc="Global config, integrations, branding." />}
//         </main>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // HOSPITAL APPLICATIONS VIEW  — full review system
// // ─────────────────────────────────────────────────────────────────────────────
// function HospitalApplicationsView() {
//   const [apps, setApps]         = useState(INITIAL_HOSPITAL_APPS);
//   const [filter, setFilter]     = useState("all");
//   const [search, setSearch]     = useState("");
//   const [selected, setSelected] = useState(null);
//   const [activeTab, setActiveTab] = useState("info");
//   const [showAction, setShowAction] = useState(null); // "approve"|"reject"|"changes"|"suspend"
//   const [actionNote, setActionNote] = useState("");
//   const [zoomPhoto, setZoomPhoto] = useState(null);

//   const counts = {
//     all:              apps.length,
//     pending:          apps.filter(a => a.status === "pending").length,
//     under_review:     apps.filter(a => a.status === "under_review").length,
//     approved:         apps.filter(a => a.status === "approved").length,
//     rejected:         apps.filter(a => a.status === "rejected").length,
//     changes_requested:apps.filter(a => a.status === "changes_requested").length,
//     suspended:        apps.filter(a => a.status === "suspended").length,
//   };

//   const filtered = apps
//     .filter(a => filter === "all" || a.status === filter)
//     .filter(a =>
//       !search ||
//       a.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
//       a.city.toLowerCase().includes(search.toLowerCase()) ||
//       a.adminEmail.toLowerCase().includes(search.toLowerCase())
//     );

//   const applyAction = (id, status, note) => {
//     const entry = { action: `Status → ${STATUS_CONFIG[status]?.label}`, at: new Date().toISOString(), by: "Super Admin", note };
//     setApps(prev => prev.map(a => a.id === id
//       ? { ...a, status, adminNotes: note, auditLog: [...a.auditLog, entry] }
//       : a));
//     if (selected?.id === id) setSelected(s => ({ ...s, status, adminNotes: note, auditLog: [...s.auditLog, entry] }));
//     setShowAction(null);
//     setActionNote("");
//   };

//   const photoCount = (app) => Object.values(app.photos || {}).filter(Boolean).length;
//   const docCount   = (app) => Object.values(app.docs   || {}).filter(Boolean).length;

//   return (
//     <div className="space-y-4">
//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
//         {[
//           { l:"Total",             v:counts.all,               t:"primary"   },
//           { l:"Pending",           v:counts.pending,           t:"muted"     },
//           { l:"Under Review",      v:counts.under_review,      t:"warning"   },
//           { l:"Approved",          v:counts.approved,          t:"success"   },
//           { l:"Rejected",          v:counts.rejected,          t:"emergency" },
//           { l:"Changes Requested", v:counts.changes_requested, t:"primary"   },
//         ].map(s => (
//           <div key={s.l} className="rounded-xl bg-card border border-border p-4">
//             <div className="text-xs text-muted-foreground">{s.l}</div>
//             <div className={`text-2xl font-bold text-${s.t} mt-1`}>{s.v}</div>
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="rounded-xl bg-card border border-border overflow-hidden">
//         <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
//           <div>
//             <h2 className="font-semibold">Hospital registration applications</h2>
//             <p className="text-xs text-muted-foreground mt-0.5">Review hospital documents, facility photos, and approve or reject applications.</p>
//           </div>
//           <div className="flex items-center gap-2 flex-wrap">
//             <div className="flex items-center gap-2 rounded-md border border-border bg-input px-3 focus-within:border-primary">
//               <Search className="h-3.5 w-3.5 text-muted-foreground" />
//               <input value={search} onChange={e => setSearch(e.target.value)}
//                 placeholder="Search hospital, city..." className="bg-transparent py-1.5 text-xs outline-none w-40" />
//             </div>
//             <div className="flex gap-1 rounded-md bg-secondary p-1 flex-wrap">
//               {["all","pending","under_review","approved","rejected","changes_requested"].map(f => (
//                 <button key={f} onClick={() => setFilter(f)}
//                   className={`px-2.5 py-1 text-xs font-medium rounded transition capitalize ${
//                     filter===f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
//                   {f.replace(/_/g," ")}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {filtered.length === 0 ? (
//           <div className="px-6 py-16 text-center">
//             <Building2 className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
//             <p className="text-sm text-muted-foreground">No applications found.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
//                 <tr>
//                   <th className="text-left px-6 py-3 font-medium">Hospital</th>
//                   <th className="text-left px-6 py-3 font-medium">Type</th>
//                   <th className="text-left px-6 py-3 font-medium hidden md:table-cell">City</th>
//                   <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Beds</th>
//                   <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Docs</th>
//                   <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Photos</th>
//                   <th className="text-left px-6 py-3 font-medium">Verified</th>
//                   <th className="text-left px-6 py-3 font-medium">Status</th>
//                   <th className="text-right px-6 py-3 font-medium">Review</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filtered.map(a => (
//                   <tr key={a.id} className="hover:bg-secondary/50">
//                     <td className="px-6 py-3">
//                       <div className="font-semibold">{a.hospitalName}</div>
//                       <div className="text-xs text-muted-foreground">{a.adminEmail}</div>
//                     </td>
//                     <td className="px-6 py-3 text-xs text-muted-foreground">{a.hospitalType}</td>
//                     <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{a.city}</td>
//                     <td className="px-6 py-3 font-mono hidden md:table-cell">{a.totalBeds}</td>
//                     <td className="px-6 py-3 hidden lg:table-cell">
//                       <span className={`text-xs font-semibold ${docCount(a) >= 4 ? "text-success" : "text-warning"}`}>{docCount(a)} files</span>
//                     </td>
//                     <td className="px-6 py-3 hidden lg:table-cell">
//                       <span className={`text-xs font-semibold ${photoCount(a) >= 10 ? "text-success" : "text-warning"}`}>{photoCount(a)} photos</span>
//                     </td>
//                     <td className="px-6 py-3">
//                       <div className="flex items-center gap-1">
//                         <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${a.emailVerified ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>Email</span>
//                         <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${a.phoneVerified ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>Phone</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-3"><HospitalStatusBadge status={a.status} /></td>
//                     <td className="px-6 py-3 text-right">
//                       <button onClick={() => { setSelected(a); setActiveTab("info"); setShowAction(null); }}
//                         className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
//                         <Eye className="h-3.5 w-3.5" /> Review
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ── Detail Drawer ── */}
//       {selected && (
//         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
//           onClick={() => setSelected(null)}>
//           <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col"
//             onClick={e => e.stopPropagation()}>

//             {/* Drawer header */}
//             <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
//               <div>
//                 <h3 className="font-semibold text-lg">{selected.hospitalName}</h3>
//                 <p className="text-xs text-muted-foreground">Submitted {new Date(selected.submittedAt).toLocaleString()} · {selected.hospitalType}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <HospitalStatusBadge status={selected.status} />
//                 <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4" /></button>
//               </div>
//             </div>

//             {/* Tab bar */}
//             <div className="flex overflow-x-auto bg-secondary border-b border-border px-4">
//               {["info","facility","documents","photos","audit"].map(t => (
//                 <button key={t} onClick={() => setActiveTab(t)}
//                   className={`shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 capitalize transition ${
//                     activeTab===t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
//                   {t === "audit" ? "Audit Log" : t.charAt(0).toUpperCase()+t.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 space-y-4">

//               {/* ── INFO TAB ── */}
//               {activeTab === "info" && (
//                 <div className="space-y-4">
//                   {/* Verification badges */}
//                   <div className="flex gap-2 flex-wrap">
//                     {[
//                       { l:"Email verified",  ok:selected.emailVerified },
//                       { l:"Phone verified",  ok:selected.phoneVerified },
//                       { l:"Docs uploaded",   ok:docCount(selected) >= 4  },
//                       { l:"Photos uploaded", ok:photoCount(selected) >= 10 },
//                     ].map(b => (
//                       <span key={b.l} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${b.ok ? "bg-success-soft text-success" : "bg-emergency-soft text-emergency"}`}>
//                         {b.ok ? <CheckCircle2 className="h-3.5 w-3.5"/> : <AlertCircle className="h-3.5 w-3.5"/>} {b.l}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Hospital details</div>
//                     <Row label="Hospital name"   value={selected.hospitalName}  />
//                     <Row label="Type"            value={selected.hospitalType}  />
//                     <Row label="Reg. number"     value={selected.regNumber}     />
//                     <Row label="Est. cert. no."  value={selected.estNumber}     />
//                     <Row label="NABH number"     value={selected.nabhNumber}    />
//                     <Row label="GST number"      value={selected.gstNumber}     />
//                     <Row label="PAN number"      value={selected.panNumber}     />
//                     <Row label="Website"         value={selected.website}       />
//                   </div>

//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact & address</div>
//                     <Row label="Email"    value={selected.hospEmail}  />
//                     <Row label="Phone"    value={selected.hospPhone}  />
//                     <Row label="Address"  value={selected.address}    />
//                     <Row label="City"     value={`${selected.city}, ${selected.district}`} />
//                     <Row label="State"    value={`${selected.state} – ${selected.pincode}`} />
//                     {selected.latitude && <Row label="Coordinates" value={`${selected.latitude}, ${selected.longitude}`} />}
//                   </div>

//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Administrator</div>
//                     <Row label="Name"   value={selected.adminName}  />
//                     <Row label="Email"  value={selected.adminEmail} />
//                     <Row label="Phone"  value={selected.adminPhone} />
//                   </div>

//                   {/* Map link */}
//                   {selected.latitude && (
//                     <a href={`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`} target="_blank" rel="noreferrer"
//                       className="inline-flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
//                       <MapPin className="h-3.5 w-3.5" /> Open in Google Maps
//                     </a>
//                   )}
//                 </div>
//               )}

//               {/* ── FACILITY TAB ── */}
//               {activeTab === "facility" && (
//                 <div className="space-y-4">
//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bed & staff count</div>
//                     {[
//                       { l:"Total beds",       v:selected.totalBeds      },
//                       { l:"ICU beds",         v:selected.icuBeds        },
//                       { l:"Emergency beds",   v:selected.emergencyBeds  },
//                       { l:"Ventilators",      v:selected.ventilators    },
//                       { l:"Ambulances",       v:selected.ambulances     },
//                       { l:"Operation theatres",v:selected.otCount       },
//                       { l:"Doctors",          v:selected.doctorCount    },
//                       { l:"Nurses",           v:selected.nurseCount     },
//                       { l:"Support staff",    v:selected.staffCount     },
//                     ].map(r => <Row key={r.l} label={r.l} value={r.v} />)}
//                   </div>

//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Departments</div>
//                     <div className="px-4 py-3 flex flex-wrap gap-2">
//                       {selected.departments?.map(d => (
//                         <span key={d} className="rounded-full bg-primary-soft text-primary text-xs px-2.5 py-1 font-medium">{d}</span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Services</div>
//                     <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
//                       {Object.entries(selected.services || {}).map(([k,v]) => {
//                         const labels = { has24x7:"24×7 Emergency", hasPharmacy:"Pharmacy", hasLab:"Laboratory", hasBloodBank:"Blood Bank", hasICU:"ICU", hasNICU:"NICU", hasDialysis:"Dialysis", hasMRI:"MRI", hasCT:"CT Scan" };
//                         return (
//                           <span key={k} className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 ${v ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
//                             {v ? <CheckCircle2 className="h-3 w-3"/> : <X className="h-3 w-3"/>} {labels[k] || k}
//                           </span>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── DOCUMENTS TAB ── */}
//               {activeTab === "documents" && (
//                 <div className="space-y-4">
//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Required documents</div>
//                     {[
//                       { l:"Hospital Registration Certificate", k:"reg_cert"   },
//                       { l:"Clinical Establishment Certificate",k:"est_cert"   },
//                       { l:"Hospital Letterhead",               k:"letterhead" },
//                       { l:"Hospital Logo",                     k:"logo"       },
//                     ].map(d => <DocRow key={d.k} label={d.l} value={selected.docs?.[d.k]} />)}
//                   </div>
//                   <div className="rounded-xl border border-border overflow-hidden">
//                     <div className="bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Optional documents</div>
//                     {[
//                       { l:"NABH Certificate",                  k:"nabh"       },
//                       { l:"GST Certificate",                   k:"gst_cert"   },
//                       { l:"PAN Card",                          k:"pan_card"   },
//                       { l:"Fire Safety Certificate",           k:"fire_safety"},
//                       { l:"Pollution Clearance",               k:"pollution"  },
//                       { l:"Medical Waste Management",          k:"waste_mgmt" },
//                     ].map(d => <DocRow key={d.k} label={d.l} value={selected.docs?.[d.k]} />)}
//                   </div>
//                 </div>
//               )}

//               {/* ── PHOTOS TAB ── */}
//               {activeTab === "photos" && (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold">Facility photographs</h3>
//                     <span className={`text-xs font-semibold ${photoCount(selected)>=10?"text-success":"text-warning"}`}>
//                       {photoCount(selected)}/15 uploaded
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                     {[
//                       {k:"entrance",     l:"Front Entrance"   },
//                       {k:"reception",    l:"Reception"        },
//                       {k:"opd_waiting",  l:"OPD Waiting"      },
//                       {k:"general_ward", l:"General Ward"     },
//                       {k:"private_cabin",l:"Private Cabin"    },
//                       {k:"icu_ward",     l:"ICU Ward"         },
//                       {k:"emergency",    l:"Emergency Dept."  },
//                       {k:"ot",           l:"Operation Theatre"},
//                       {k:"pharmacy",     l:"Pharmacy"         },
//                       {k:"laboratory",   l:"Laboratory"       },
//                       {k:"ambulance",    l:"Ambulance"        },
//                       {k:"consultation", l:"Consultation Room"},
//                       {k:"nursing",      l:"Nursing Station"  },
//                       {k:"beds",         l:"Hospital Beds"    },
//                       {k:"washroom",     l:"Washroom"         },
//                     ].map(p => {
//                       const uploaded = selected.photos?.[p.k];
//                       return (
//                         <div key={p.k} className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2 relative ${uploaded?"border-success bg-success-soft":"border-dashed border-border bg-secondary"}`}>
//                           <Camera className={`h-6 w-6 ${uploaded?"text-success":"text-muted-foreground"}`}/>
//                           <span className="text-[10px] font-medium text-center">{p.l}</span>
//                           {uploaded
//                             ? <span className="text-[10px] text-success truncate w-full text-center">{uploaded}</span>
//                             : <span className="text-[10px] text-muted-foreground">Not uploaded</span>}
//                           {uploaded && (
//                             <button onClick={() => setZoomPhoto(p.l)}
//                               className="absolute top-2 right-2 p-1 rounded bg-success/20 text-success hover:bg-success/30">
//                               <ZoomIn className="h-3 w-3"/>
//                             </button>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* ── AUDIT LOG TAB ── */}
//               {activeTab === "audit" && (
//                 <div className="space-y-3">
//                   <h3 className="font-semibold">Audit log</h3>
//                   <div className="space-y-0">
//                     {selected.auditLog?.map((e, i) => (
//                       <div key={i} className="flex items-start gap-3">
//                         <div className="flex flex-col items-center">
//                           <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
//                           {i < selected.auditLog.length-1 && <div className="w-0.5 h-5 bg-border" />}
//                         </div>
//                         <div className="pb-2">
//                           <div className="text-sm font-medium">{e.action}</div>
//                           <div className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()} · by {e.by}</div>
//                           {e.note && <div className="text-xs text-primary mt-0.5 italic">"{e.note}"</div>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {/* Admin notes */}
//                   {selected.adminNotes && (
//                     <div className="rounded-lg bg-primary-soft border border-primary/20 px-4 py-3 text-xs text-primary">
//                       <div className="font-semibold mb-1">Admin notes</div>
//                       {selected.adminNotes}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Action feedback box */}
//               {showAction && (
//                 <div className="rounded-xl bg-secondary border border-border p-4 space-y-3">
//                   <div className="font-semibold text-sm">
//                     {showAction === "approve"   && "Approve this hospital"}
//                     {showAction === "reject"    && "Reject this application"}
//                     {showAction === "changes"   && "Request additional information"}
//                     {showAction === "suspend"   && "Suspend this hospital"}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {showAction === "approve"   && "An approval email with login credentials will be sent to the hospital admin."}
//                     {showAction === "reject"    && "A rejection email with the reason will be sent to the hospital admin."}
//                     {showAction === "changes"   && "The hospital will be notified by email and can re-upload documents and resubmit."}
//                     {showAction === "suspend"   && "The hospital's access will be immediately blocked and a suspension email will be sent."}
//                   </p>
//                   <div>
//                     <label className="block text-xs font-medium text-muted-foreground mb-1.5">
//                       {showAction === "approve" ? "Approval note (sent in email)" : "Reason / message to hospital *"}
//                     </label>
//                     <textarea value={actionNote} onChange={e => setActionNote(e.target.value)} rows={3}
//                       placeholder={
//                         showAction === "approve"  ? "e.g. All documents verified. Welcome to MedConnect!" :
//                         showAction === "reject"   ? "e.g. Registration documents are invalid or expired." :
//                         showAction === "changes"  ? "e.g. Please re-upload a clearer copy of the establishment certificate." :
//                         "e.g. Pending investigation into reported irregularities."
//                       }
//                       className="w-full rounded-md bg-input border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"/>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => { setShowAction(null); setActionNote(""); }}
//                       className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted">Cancel</button>
//                     <button
//                       disabled={showAction !== "approve" && !actionNote.trim()}
//                       onClick={() => applyAction(
//                         selected.id,
//                         showAction === "approve"  ? "approved"          :
//                         showAction === "reject"   ? "rejected"          :
//                         showAction === "changes"  ? "changes_requested" : "suspended",
//                         actionNote
//                       )}
//                       className={`flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed ${
//                         showAction === "approve"  ? "bg-success text-success-foreground"   :
//                         showAction === "suspend"  ? "bg-emergency text-emergency-foreground" :
//                         showAction === "reject"   ? "bg-emergency text-emergency-foreground" :
//                         "bg-primary text-primary-foreground"}`}>
//                       Confirm & send email
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action bar */}
//             {!showAction && (
//               <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2 flex-wrap">
//                 <button onClick={() => setSelected(null)}
//                   className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Close</button>

//                 {selected.status !== "suspended" && selected.status !== "rejected" && (
//                   <button onClick={() => setShowAction("suspend")}
//                     className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft">
//                     Suspend
//                   </button>
//                 )}
//                 {selected.status !== "rejected" && selected.status !== "approved" && (
//                   <button onClick={() => setShowAction("reject")}
//                     className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft inline-flex items-center gap-1.5">
//                     <X className="h-4 w-4"/> Reject
//                   </button>
//                 )}
//                 {selected.status !== "changes_requested" && selected.status !== "approved" && (
//                   <button onClick={() => setShowAction("changes")}
//                     className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary-soft inline-flex items-center gap-1.5">
//                     <MessageSquare className="h-4 w-4"/> Request changes
//                   </button>
//                 )}
//                 {selected.status !== "approved" && (
//                   <button onClick={() => setShowAction("approve")}
//                     className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5">
//                     <CheckCircle2 className="h-4 w-4"/> Approve
//                   </button>
//                 )}
//                 {selected.status === "approved" && (
//                   <span className="text-xs text-success font-semibold inline-flex items-center gap-1">
//                     <CheckCircle2 className="h-4 w-4"/> Approved · Hospital is active
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Photo zoom modal */}
//       {zoomPhoto && (
//         <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6" onClick={() => setZoomPhoto(null)}>
//           <div className="bg-card rounded-2xl p-6 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
//             <div className="h-48 bg-secondary rounded-xl flex items-center justify-center mb-3">
//               <Camera className="h-12 w-12 text-muted-foreground opacity-30"/>
//             </div>
//             <div className="font-semibold">{zoomPhoto}</div>
//             <div className="text-xs text-muted-foreground mt-1">Photo preview (demo mode)</div>
//             <button onClick={() => setZoomPhoto(null)} className="mt-4 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // EXISTING VIEWS (unchanged)
// // ─────────────────────────────────────────────────────────────────────────────
// const stats = [
//   { label:"Hospitals",       value:"48",    delta:"+3 this month",  tone:"primary",   icon:Building2     },
//   { label:"Bookings today",  value:"1,284", delta:"+18%",           tone:"success",   icon:CalendarCheck },
//   { label:"SOS today",       value:"7",     delta:"All resolved",   tone:"emergency", icon:Siren         },
//   { label:"Revenue",         value:"₹2.4L", delta:"+12%",           tone:"success",   icon:CreditCard    },
// ];

// function DashboardView() {
//   return (
//     <>
//       <div className="rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-foreground">
//         <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" style={{ backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"16px 16px" }}/>
//         <div className="relative flex items-start justify-between flex-wrap gap-4">
//           <div>
//             <div className="text-xs uppercase tracking-wider text-white/70 font-bold">Platform overview</div>
//             <h2 className="mt-1 text-2xl font-bold">Everything looks healthy 🟢</h2>
//             <p className="text-sm text-white/80 mt-1">48 hospitals, 1,284 bookings today, 7 SOS events resolved.</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20">
//               <div className="text-[10px] uppercase tracking-wider text-white/70">Uptime</div>
//               <div className="text-lg font-bold">99.98%</div>
//             </div>
//             <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20">
//               <div className="text-[10px] uppercase tracking-wider text-white/70">Active staff</div>
//               <div className="text-lg font-bold">312</div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map(s => (
//           <div key={s.label} className="rounded-xl bg-card border border-border p-5 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition">
//             <div className="flex items-center justify-between">
//               <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}><s.icon className="h-5 w-5"/></div>
//               <span className="text-[10px] font-bold text-success uppercase">Live</span>
//             </div>
//             <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
//             <div className={`mt-1 text-3xl font-bold text-${s.tone}`}>{s.value}</div>
//             <div className="text-[11px] text-success mt-1 font-medium">{s.delta}</div>
//           </div>
//         ))}
//       </div>
//       <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
//         <BookingsChart />
//         <SOSEventsCard />
//       </div>
//       <HospitalsView />
//       <div className="grid lg:grid-cols-2 gap-4">
//         <PendingApprovals />
//         <RevenueCard />
//       </div>
//     </>
//   );
// }

// function BookingsChart() {
//   const days = [{d:"Mon",v:60},{d:"Tue",v:78},{d:"Wed",v:52},{d:"Thu",v:88},{d:"Fri",v:95},{d:"Sat",v:70},{d:"Sun",v:100,today:true}];
//   return (
//     <div className="rounded-xl bg-card border border-border p-5">
//       <div className="flex items-center justify-between mb-5">
//         <h2 className="font-semibold">Bookings this week</h2>
//         <span className="text-xs text-muted-foreground">Last 7 days</span>
//       </div>
//       <div className="flex items-end justify-between gap-2 h-48">
//         {days.map(c => (
//           <div key={c.d} className="flex-1 flex flex-col items-center gap-2">
//             <div className="text-[10px] font-mono text-muted-foreground">{Math.round(c.v*14)}</div>
//             <div className="w-full rounded-t-md transition hover:opacity-80" style={{ height:`${c.v}%`, background:c.today?"var(--color-success)":"var(--color-primary)" }}/>
//             <div className="text-xs text-muted-foreground">{c.d}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const initialSosEvents = [
//   { id:1, name:"Anita Kumar",  time:"10:24 AM", hospital:"North Bengal MC",  eta:"8 min",  status:"Resolved" },
//   { id:2, name:"Vikram Roy",   time:"11:42 AM", hospital:"CityMed",          eta:"14 min", status:"Resolved" },
//   { id:3, name:"Priya Sen",    time:"1:08 PM",  hospital:"Neotia Getwel",    eta:"22 min", status:"Pending"  },
// ];

// function SOSEventsCard() {
//   const [events] = useState(initialSosEvents);
//   return (
//     <div className="rounded-xl bg-card border border-border p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="font-semibold">SOS events today</h2>
//         <span className="text-xs text-primary cursor-pointer hover:underline">View all</span>
//       </div>
//       <div className="space-y-3">
//         {events.map(e => (
//           <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition">
//             <div className="h-8 w-8 rounded-full bg-emergency-soft text-emergency flex items-center justify-center"><Siren className="h-4 w-4"/></div>
//             <div className="flex-1 min-w-0">
//               <div className="text-sm font-medium truncate">{e.name}</div>
//               <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
//                 <span className="font-mono">{e.time}</span><ChevronRight className="h-3 w-3"/>{e.hospital} · {e.eta}
//               </div>
//             </div>
//             <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${e.status==="Resolved"?"bg-success-soft text-success":"bg-warning-soft text-warning"}`}>{e.status}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const initialTenants = [
//   { id:1, name:"North Bengal MC",       type:"Govt",    beds:12, icu:3, bookings:284, status:"Active"  },
//   { id:2, name:"Siliguri District Hosp",type:"Govt",    beds:5,  icu:0, bookings:178, status:"Active"  },
//   { id:3, name:"CityMed Multispeciality",type:"Private",beds:18, icu:4, bookings:312, status:"Active"  },
//   { id:4, name:"CityMed Clinic",         type:"Private",beds:null,icu:null,bookings:null,status:"Pending"},
// ];

// function HospitalsView() {
//   const [tenants, setTenants] = useState(initialTenants);
//   const [showOnboard, setShowOnboard] = useState(false);
//   const [name, setName] = useState(""); const [type, setType] = useState("Private");
//   const onboard = () => {
//     if(!name)return;
//     setTenants([...tenants,{id:Date.now(),name,type,beds:null,icu:null,bookings:null,status:"Pending"}]);
//     setName("");setType("Private");setShowOnboard(false);
//   };
//   const approve = id => setTenants(tenants.map(t=>t.id===id?{...t,status:"Active",beds:0,icu:0,bookings:0}:t));
//   return (
//     <div className="rounded-xl bg-card border border-border overflow-hidden">
//       <div className="px-6 py-4 border-b border-border flex items-center justify-between">
//         <h2 className="font-semibold">Tenant hospitals</h2>
//         <button onClick={()=>setShowOnboard(s=>!s)} className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary-dark inline-flex items-center gap-1">
//           <Plus className="h-3.5 w-3.5"/> Onboard hospital
//         </button>
//       </div>
//       {showOnboard && (
//         <div className="px-6 py-4 bg-secondary border-b border-border grid sm:grid-cols-3 gap-3">
//           <input value={name} onChange={e=>setName(e.target.value)} placeholder="Hospital name" className="rounded-md bg-card border border-border px-3 py-2 text-sm outline-none focus:border-primary"/>
//           <select value={type} onChange={e=>setType(e.target.value)} className="rounded-md bg-card border border-border px-3 py-2 text-sm outline-none focus:border-primary">
//             <option>Private</option><option>Govt</option>
//           </select>
//           <div className="flex gap-2">
//             <button onClick={onboard} className="flex-1 rounded-md bg-success text-success-foreground px-3 py-2 text-xs font-semibold">Submit</button>
//             <button onClick={()=>setShowOnboard(false)} className="rounded-md border border-border px-3 py-2 text-xs">Cancel</button>
//           </div>
//         </div>
//       )}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
//             <tr>
//               {["Hospital","Type","Beds","ICU","Bookings today","Status","Action"].map((h,i)=>(
//                 <th key={h} className={`${i===6?"text-right":"text-left"} px-6 py-3 font-medium`}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-border">
//             {tenants.map(t=>(
//               <tr key={t.id} className="hover:bg-secondary/50">
//                 <td className="px-6 py-3 font-medium">{t.name}</td>
//                 <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.type==="Govt"?"bg-primary-soft text-primary":"bg-accent text-accent-foreground"}`}>{t.type}</span></td>
//                 <td className="px-6 py-3 font-mono">{t.beds??"—"}</td>
//                 <td className="px-6 py-3 font-mono">{t.icu??"—"}</td>
//                 <td className="px-6 py-3 font-mono">{t.bookings??"—"}</td>
//                 <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${t.status==="Active"?"bg-success-soft text-success":"bg-warning-soft text-warning"}`}>{t.status}</span></td>
//                 <td className="px-6 py-3 text-right">{t.status==="Pending"?<button onClick={()=>approve(t.id)} className="text-success font-semibold text-xs hover:underline">Approve</button>:<button className="text-primary font-medium text-xs hover:underline">Manage</button>}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const initialApprovals=[
//   {id:1,name:"CityMed Clinic",type:"Private",city:"Siliguri",ago:"2 hrs ago"},
//   {id:2,name:"Apollo Diagnostics",type:"Lab",city:"Darjeeling",ago:"5 hrs ago"},
// ];

// function PendingApprovals() {
//   const [pending,setPending]=useState(initialApprovals);
//   const remove=id=>setPending(p=>p.filter(x=>x.id!==id));
//   return (
//     <div className="rounded-xl bg-card border border-border p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="font-semibold">Pending approvals</h2>
//         <span className="rounded-full bg-warning-soft text-warning px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{pending.length} pending</span>
//       </div>
//       {pending.length===0?<div className="text-center py-8 text-sm text-muted-foreground">No pending approvals 🎉</div>:(
//         <div className="space-y-3">
//           {pending.map(p=>(
//             <div key={p.id} className="rounded-lg bg-warning-soft border border-warning/20 p-4">
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <div className="font-semibold text-sm">{p.name}</div>
//                   <div className="text-xs text-muted-foreground mt-0.5">{p.type} · {p.city} · Submitted {p.ago}</div>
//                 </div>
//               </div>
//               <div className="mt-3 flex gap-2">
//                 <button onClick={()=>remove(p.id)} className="flex-1 rounded-md bg-success text-success-foreground py-1.5 text-xs font-semibold hover:opacity-90">Approve</button>
//                 <button onClick={()=>remove(p.id)} className="flex-1 rounded-md border border-emergency text-emergency py-1.5 text-xs font-semibold hover:bg-emergency-soft">Reject</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function RevenueCard() {
//   const data=[
//     {name:"CityMed Multispeciality",amount:84200,pct:95},
//     {name:"Neotia Getwel",amount:62800,pct:72},
//     {name:"North Bengal MC",amount:48400,pct:55},
//     {name:"Siliguri District Hospital",amount:26100,pct:30},
//   ];
//   return (
//     <div className="rounded-xl bg-card border border-border p-5">
//       <h2 className="font-semibold mb-4">Revenue this month</h2>
//       <div className="space-y-4">
//         {data.map(r=>(
//           <div key={r.name}>
//             <div className="flex items-center justify-between text-xs mb-1.5">
//               <span className="text-foreground font-medium truncate pr-2">{r.name}</span>
//               <span className="font-mono font-semibold">₹{(r.amount/1000).toFixed(1)}k</span>
//             </div>
//             <div className="h-2 bg-muted rounded-full overflow-hidden">
//               <div className="h-full bg-primary rounded-full transition-all" style={{width:`${r.pct}%`}}/>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function AnalyticsView() {
//   return <div className="grid lg:grid-cols-2 gap-4"><BookingsChart/><RevenueCard/></div>;
// }

// function BillingView() {
//   const rows=[
//     {month:"Apr 2025",bookings:1842,revenue:"₹9.21L",commission:"₹46,050",status:"Paid"},
//     {month:"Mar 2025",bookings:1620,revenue:"₹8.10L",commission:"₹40,500",status:"Paid"},
//     {month:"Feb 2025",bookings:1485,revenue:"₹7.42L",commission:"₹37,100",status:"Paid"},
//   ];
//   return (
//     <div className="rounded-xl bg-card border border-border overflow-hidden">
//       <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">Billing history</h2></div>
//       <table className="w-full text-sm">
//         <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
//           <tr>{["Month","Bookings","Revenue","Commission","Status"].map(h=><th key={h} className="text-left px-6 py-3 font-medium">{h}</th>)}</tr>
//         </thead>
//         <tbody className="divide-y divide-border">
//           {rows.map(r=>(
//             <tr key={r.month} className="hover:bg-secondary/50">
//               <td className="px-6 py-3 font-medium">{r.month}</td>
//               <td className="px-6 py-3 font-mono">{r.bookings}</td>
//               <td className="px-6 py-3 font-mono">{r.revenue}</td>
//               <td className="px-6 py-3 font-mono">{r.commission}</td>
//               <td className="px-6 py-3"><span className="rounded-full bg-success-soft text-success px-2 py-0.5 text-[10px] font-bold uppercase">{r.status}</span></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function PlaceholderView({title,desc}) {
//   return (
//     <div className="rounded-xl bg-card border border-dashed border-border p-12 text-center">
//       <div className="mx-auto h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-3"><Building2 className="h-5 w-5"/></div>
//       <h2 className="font-semibold text-lg">{title}</h2>
//       <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{desc}</p>
//     </div>
//   );
// }

// // ── Clinic Applications (original) ────────────────────────────────────────────
// function ClinicApplicationsView() {
//   const [apps,setApps]=useState([]);
//   const [filter,setFilter]=useState("all");
//   const [selected,setSelected]=useState(null);
//   const load=()=>{try{const data=JSON.parse(localStorage.getItem("clinic_applications")||"[]");setApps(data);}catch{setApps([]);}};
//   useEffect(()=>{load();},[]);
//   const persist=next=>{setApps(next);localStorage.setItem("clinic_applications",JSON.stringify(next));};
//   const setStatus=(id,status)=>{const next=apps.map(a=>a.id===id?{...a,status}:a);persist(next);if(selected?.id===id)setSelected({...selected,status});};
//   const filtered=filter==="all"?apps:apps.filter(a=>a.status===filter);
//   const counts={all:apps.length,pending:apps.filter(a=>a.status==="pending").length,approved:apps.filter(a=>a.status==="approved").length,rejected:apps.filter(a=>a.status==="rejected").length};
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         {[{l:"Total",v:counts.all,t:"primary"},{l:"Pending",v:counts.pending,t:"warning"},{l:"Approved",v:counts.approved,t:"success"},{l:"Rejected",v:counts.rejected,t:"emergency"}].map(s=>(
//           <div key={s.l} className="rounded-xl bg-card border border-border p-4"><div className="text-xs text-muted-foreground">{s.l}</div><div className={`mt-1 text-2xl font-bold text-${s.t}`}>{s.v}</div></div>
//         ))}
//       </div>
//       <div className="rounded-xl bg-card border border-border overflow-hidden">
//         <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
//           <div><h2 className="font-semibold">Clinic applications</h2><p className="text-xs text-muted-foreground mt-0.5">Review and approve independent doctor clinics joining the platform.</p></div>
//           <div className="flex gap-1 rounded-md bg-secondary p-1">
//             {["all","pending","approved","rejected"].map(f=>(
//               <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition ${filter===f?"bg-card text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}`}>
//                 {f}{f!=="all"&&<span className="ml-1 opacity-60">({counts[f]})</span>}
//               </button>
//             ))}
//           </div>
//         </div>
//         {filtered.length===0?(
//           <div className="px-6 py-16 text-center"><ClipboardList className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3"/><p className="text-sm text-muted-foreground">No {filter!=="all"?filter:""} applications yet.</p></div>
//         ):(
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
//                 <tr>{["Doctor","Clinic","City","Submitted","Status","Actions"].map((h,i)=><th key={h} className={`${i===5?"text-right":"text-left"} px-6 py-3 font-medium`}>{h}</th>)}</tr>
//               </thead>
//               <tbody className="divide-y divide-border">
//                 {filtered.map(a=>(
//                   <tr key={a.id} className="hover:bg-secondary/50">
//                     <td className="px-6 py-3"><div className="font-medium">{a.doctorName}</div><div className="text-xs text-muted-foreground">{a.specialty} · {a.experience} yrs</div></td>
//                     <td className="px-6 py-3">{a.clinicName}</td>
//                     <td className="px-6 py-3 text-muted-foreground">{a.city}</td>
//                     <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
//                     <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${{pending:"bg-warning-soft text-warning",approved:"bg-success-soft text-success",rejected:"bg-emergency-soft text-emergency"}[a.status]}`}>{a.status}</span></td>
//                     <td className="px-6 py-3 text-right"><button onClick={()=>setSelected(a)} className="text-primary text-xs font-semibold hover:underline">Review</button></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {selected&&(
//         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={()=>setSelected(null)}>
//           <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
//             <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
//               <h3 className="font-semibold text-lg">Application review</h3>
//               <button onClick={()=>setSelected(null)} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4"/></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="flex items-center gap-4">
//                 <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">{selected.doctorName?.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()||"DR"}</div>
//                 <div className="flex-1"><div className="font-semibold text-lg">{selected.doctorName}</div><div className="text-sm text-primary">{selected.specialty}</div><div className="text-xs text-muted-foreground">{selected.experience} yrs · ₹{selected.fee} fee</div></div>
//               </div>
//             </div>
//             <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2">
//               <button onClick={()=>setSelected(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Close</button>
//               <button onClick={()=>setStatus(selected.id,"rejected")} className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft inline-flex items-center gap-1.5"><X className="h-4 w-4"/>Reject</button>
//               <button onClick={()=>setStatus(selected.id,"approved")} className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5"><Check className="h-4 w-4"/>Approve</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, BarChart3, Building2, FlaskConical, Stethoscope, Users, UserCog, Siren, CalendarCheck, Settings, CreditCard, Search, Bell, ShieldCheck, ChevronRight, LogOut, Plus, X, ClipboardList, Mail, Phone, MapPin, Award, Check } from "lucide-react";

const sections = [
  { label: "Overview", items: [{ icon: LayoutDashboard, label: "Dashboard" }, { icon: BarChart3, label: "Analytics" }] },
  { label: "Tenants", items: [{ icon: Building2, label: "Hospitals" }, { icon: FlaskConical, label: "Labs" }, { icon: Stethoscope, label: "Doctors" }, { icon: ClipboardList, label: "Clinic Applications" }] },
  { label: "Users", items: [{ icon: Users, label: "Patients" }, { icon: UserCog, label: "Staff" }] },
  { label: "System", items: [{ icon: Siren, label: "SOS Events" }, { icon: CalendarCheck, label: "Bookings" }, { icon: Settings, label: "Settings" }, { icon: CreditCard, label: "Billing" }] },
];

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Admin dashboard — MedConnect";
  }, []);

  const [view, setView] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex flex-col w-[210px] shrink-0 bg-foreground text-background">
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">Med<span className="text-primary">Connect</span></div>
          <div className="inline-flex items-center gap-1 mt-2 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">AS</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Aman Singh</div>
            <div className="text-[10px] text-white/60">Platform admin</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {sections.map((sec) => (
            <div key={sec.label} className="mb-3">
              <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-white/40 font-semibold">{sec.label}</div>
              {sec.items.map((n) => (
                <button
                  key={n.label}
                  onClick={() => setView(n.label)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium border-l-2 transition text-left ${
                    view === n.label ? "bg-primary/15 border-primary text-white" : "border-transparent text-white/70 hover:bg-white/5"
                  }`}
                >
                  <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <Link to="/login" className="m-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30">
          <div className="min-w-0">
            <div className="font-semibold truncate">{view}</div>
            <div className="text-xs text-muted-foreground truncate">All tenants · India</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-input px-3 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search tenants, users..." className="bg-transparent py-1.5 text-sm outline-none flex-1" />
            </div>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">AS</div>
          </div>
        </header>

        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-2 snap-x">
          {sections.flatMap((s) => s.items).map((n) => (
            <button
              key={n.label}
              onClick={() => setView(n.label)}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 ${
                view === n.label ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {view === "Dashboard" && <DashboardView />}
          {view === "Analytics" && <AnalyticsView />}
          {view === "Hospitals" && <HospitalsView />}
          {view === "Labs" && <PlaceholderView title="Labs" desc="Manage lab tenants and home-collection availability." />}
          {view === "Doctors" && <PlaceholderView title="Doctors" desc="All registered doctors across the platform." />}
          {view === "Clinic Applications" && <ClinicApplicationsView />}
          {view === "Patients" && <PlaceholderView title="Patients" desc="Search and manage patient accounts." />}
          {view === "Staff" && <PlaceholderView title="Staff accounts" desc="Hospital staff users with portal access." />}
          {view === "SOS Events" && <SOSEventsView />}
          {view === "Bookings" && <PlaceholderView title="All bookings" desc="Cross-tenant bookings ledger." />}
          {view === "Billing" && <BillingView />}
          {view === "Settings" && <PlaceholderView title="Platform settings" desc="Global config, integrations, branding." />}
        </main>
      </div>
    </div>
  );
}

/* ---------- VIEWS ---------- */

const stats = [
  { label: "Hospitals", value: "48", delta: "+3 this month", tone: "primary", icon: Building2 },
  { label: "Bookings today", value: "1,284", delta: "+18%", tone: "success", icon: CalendarCheck },
  { label: "SOS today", value: "7", delta: "All resolved", tone: "emergency", icon: Siren },
  { label: "Revenue", value: "₹2.4L", delta: "+12%", tone: "success", icon: CreditCard },
];

function DashboardView() {
  return (
    <>
      {/* Hero card */}
      <div className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-foreground">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/70 font-bold">Platform overview</div>
            <h2 className="mt-1 text-2xl font-bold leading-tight">Everything looks healthy</h2>
            <p className="text-sm text-white/80 mt-1">48 hospitals, 1,284 bookings today, 7 SOS events resolved.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20">
              <div className="text-[10px] uppercase tracking-wider text-white/70">Uptime</div>
              <div className="text-lg font-bold">99.98%</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/15 backdrop-blur border border-white/20">
              <div className="text-[10px] uppercase tracking-wider text-white/70">Active staff</div>
              <div className="text-lg font-bold">312</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-4 sm:p-5 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-success uppercase">Live</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
            <div className={`mt-1 text-3xl font-bold text-${s.tone}`}>{s.value}</div>
            <div className="text-[11px] text-success mt-1 font-medium">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_1fr] gap-4">
        <BookingsChart />
        <SOSEventsCard />
      </div>

      <HospitalsView />

      <div className="grid lg:grid-cols-2 gap-4">
        <PendingApprovals />
        <RevenueCard />
      </div>
    </>
  );
}

function BookingsChart() {
  const days = [
    { d: "Mon", v: 60 }, { d: "Tue", v: 78 }, { d: "Wed", v: 52 }, { d: "Thu", v: 88 },
    { d: "Fri", v: 95 }, { d: "Sat", v: 70 }, { d: "Sun", v: 100, today: true },
  ];
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold">Bookings this week</h2>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-48">
        {days.map((c) => (
          <div key={c.d} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono text-text-muted">{Math.round(c.v * 14)}</div>
            <div className="w-full rounded-t-md transition hover:opacity-80" style={{
              height: `${c.v}%`,
              background: c.today ? "var(--color-success)" : "var(--color-primary)",
            }} />
            <div className="text-xs text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const initialSosEvents = [
  { id: 1, name: "Anita Kumar", time: "10:24 AM", hospital: "North Bengal MC", eta: "8 min", status: "Resolved" },
  { id: 2, name: "Vikram Roy", time: "11:42 AM", hospital: "CityMed", eta: "14 min", status: "Resolved" },
  { id: 3, name: "Priya Sen", time: "1:08 PM", hospital: "Neotia Getwel", eta: "22 min", status: "Pending" },
];

function SOSEventsCard() {
  const [events] = useState(initialSosEvents);
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">SOS events today</h2>
        <span className="text-xs text-primary cursor-pointer hover:underline">View all</span>
      </div>
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition">
            <div className="h-8 w-8 rounded-full bg-emergency-soft text-emergency flex items-center justify-center"><Siren className="h-4 w-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{e.name}</div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <span className="font-mono">{e.time}</span> <ChevronRight className="h-3 w-3" /> {e.hospital} · {e.eta}
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              e.status === "Resolved" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
            }`}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const initialTenants = [
  { id: 1, name: "North Bengal MC", type: "Govt", beds: 12, icu: 3, bookings: 284, status: "Active" },
  { id: 2, name: "Siliguri District Hospital", type: "Govt", beds: 5, icu: 0, bookings: 178, status: "Active" },
  { id: 3, name: "CityMed Multispeciality", type: "Private", beds: 18, icu: 4, bookings: 312, status: "Active" },
  { id: 4, name: "CityMed Clinic", type: "Private", beds: null, icu: null, bookings: null, status: "Pending" },
];

function HospitalsView() {
  const [tenants, setTenants] = useState(initialTenants);
  const [showOnboard, setShowOnboard] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Private");

  const onboard = () => {
    if (!name) return;
    setTenants([...tenants, { id: Date.now(), name, type, beds: null, icu: null, bookings: null, status: "Pending" }]);
    setName(""); setType("Private"); setShowOnboard(false);
  };

  const approve = (id) =>
    setTenants(tenants.map((t) => (t.id === id ? { ...t, status: "Active", beds: 0, icu: 0, bookings: 0 } : t)));

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">Tenant hospitals</h2>
        <button onClick={() => setShowOnboard((s) => !s)} className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary-dark inline-flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Onboard hospital
        </button>
      </div>
      {showOnboard && (
        <div className="px-6 py-4 bg-secondary border-b border-border grid sm:grid-cols-3 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hospital name" className="rounded-md bg-card border border-border px-3 py-2 text-sm outline-none focus:border-primary" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md bg-card border border-border px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Private</option><option>Govt</option>
          </select>
          <div className="flex gap-2">
            <button onClick={onboard} className="flex-1 rounded-md bg-success text-success-foreground px-3 py-2 text-xs font-semibold">Submit</button>
            <button onClick={() => setShowOnboard(false)} className="rounded-md border border-border px-3 py-2 text-xs">Cancel</button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Hospital</th>
              <th className="text-left px-6 py-3 font-medium">Type</th>
              <th className="text-left px-6 py-3 font-medium">Beds</th>
              <th className="text-left px-6 py-3 font-medium">ICU</th>
              <th className="text-left px-6 py-3 font-medium">Bookings today</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-right px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-secondary/50">
                <td className="px-6 py-3 font-medium">{t.name}</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    t.type === "Govt" ? "bg-primary-soft text-primary" : "bg-accent text-accent-foreground"
                  }`}>{t.type}</span>
                </td>
                <td className="px-6 py-3 font-mono">{t.beds ?? "—"}</td>
                <td className="px-6 py-3 font-mono">{t.icu ?? "—"}</td>
                <td className="px-6 py-3 font-mono">{t.bookings ?? "—"}</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    t.status === "Active" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                  }`}>{t.status}</span>
                </td>
                <td className="px-6 py-3 text-right">
                  {t.status === "Pending"
                    ? <button onClick={() => approve(t.id)} className="text-success font-semibold text-xs hover:underline">Approve</button>
                    : <button className="text-primary font-medium text-xs hover:underline">Manage</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const initialApprovals = [
  { id: 1, name: "CityMed Clinic", type: "Private", city: "Siliguri", ago: "2 hrs ago" },
  { id: 2, name: "Apollo Diagnostics", type: "Lab", city: "Darjeeling", ago: "5 hrs ago" },
];

function PendingApprovals() {
  const [pending, setPending] = useState(initialApprovals);
  const remove = (id) => setPending((p) => p.filter((x) => x.id !== id));

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Pending approvals</h2>
        <span className="rounded-full bg-warning-soft text-warning px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{pending.length} pending</span>
      </div>
      {pending.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">No pending approvals 🎉</div>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="rounded-lg bg-warning-soft border border-warning/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.type} · {p.city} · Submitted {p.ago}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => remove(p.id)} className="flex-1 rounded-md bg-success text-success-foreground py-1.5 text-xs font-semibold hover:opacity-90">Approve</button>
                <button onClick={() => remove(p.id)} className="flex-1 rounded-md border border-emergency text-emergency py-1.5 text-xs font-semibold hover:bg-emergency-soft">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RevenueCard() {
  const data = [
    { name: "CityMed Multispeciality", amount: 84200, pct: 95 },
    { name: "Neotia Getwel", amount: 62800, pct: 72 },
    { name: "North Bengal MC", amount: 48400, pct: 55 },
    { name: "Siliguri District Hospital", amount: 26100, pct: 30 },
  ];
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h2 className="font-semibold mb-4">Revenue this month</h2>
      <div className="space-y-4">
        {data.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-foreground font-medium truncate pr-2">{r.name}</span>
              <span className="font-mono font-semibold">₹{(r.amount / 1000).toFixed(1)}k</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <BookingsChart />
      <RevenueCard />
    </div>
  );
}

function SOSEventsView() {
  return <SOSEventsCard />;
}

function BillingView() {
  const rows = [
    { month: "Apr 2025", bookings: 1842, revenue: "₹9.21L", commission: "₹46,050", status: "Paid" },
    { month: "Mar 2025", bookings: 1620, revenue: "₹8.10L", commission: "₹40,500", status: "Paid" },
    { month: "Feb 2025", bookings: 1485, revenue: "₹7.42L", commission: "₹37,100", status: "Paid" },
  ];
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border"><h2 className="font-semibold">Billing history</h2></div>
      <table className="w-full text-sm">
        <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left px-6 py-3 font-medium">Month</th>
            <th className="text-left px-6 py-3 font-medium">Bookings</th>
            <th className="text-left px-6 py-3 font-medium">Revenue</th>
            <th className="text-left px-6 py-3 font-medium">Commission</th>
            <th className="text-left px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.month} className="hover:bg-secondary/50">
              <td className="px-6 py-3 font-medium">{r.month}</td>
              <td className="px-6 py-3 font-mono">{r.bookings}</td>
              <td className="px-6 py-3 font-mono">{r.revenue}</td>
              <td className="px-6 py-3 font-mono">{r.commission}</td>
              <td className="px-6 py-3"><span className="rounded-full bg-success-soft text-success px-2 py-0.5 text-[10px] font-bold uppercase">{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlaceholderView({ title, desc }) {
  return (
    <div className="rounded-xl bg-card border border-dashed border-border p-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-3">
        <Building2 className="h-5 w-5" />
      </div>
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{desc}</p>
    </div>
  );
}

function ClinicApplicationsView() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem("clinic_applications") || "[]");
      setApps(data);
    } catch { setApps([]); }
  };
  useEffect(() => { load(); }, []);

  const persist = (next) => {
    setApps(next);
    localStorage.setItem("clinic_applications", JSON.stringify(next));
  };

  const setStatus = (id, status) => {
    const next = apps.map((a) => (a.id === id ? { ...a, status } : a));
    persist(next);
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Total", v: counts.all, tone: "primary" },
          { l: "Pending", v: counts.pending, tone: "warning" },
          { l: "Approved", v: counts.approved, tone: "success" },
          { l: "Rejected", v: counts.rejected, tone: "emergency" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-card border border-border p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`mt-1 text-2xl font-bold text-${s.tone}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold">Clinic applications</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Review and approve independent doctor clinics joining the platform.</p>
          </div>
          <div className="flex gap-1 rounded-md bg-secondary p-1">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition ${
                  filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>
                {f} {f !== "all" && <span className="ml-1 opacity-60">({counts[f]})</span>}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 sm:px-6 py-10 sm:py-16 text-center">
            <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">No {filter !== "all" ? filter : ""} applications yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Submitted clinics will appear here for review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Doctor</th>
                  <th className="text-left px-6 py-3 font-medium">Clinic</th>
                  <th className="text-left px-6 py-3 font-medium">City</th>
                  <th className="text-left px-6 py-3 font-medium">Submitted</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-3">
                      <div className="font-medium">{a.doctorName}</div>
                      <div className="text-xs text-muted-foreground">{a.specialty} · {a.experience} yrs</div>
                    </td>
                    <td className="px-6 py-3">{a.clinicName}</td>
                    <td className="px-6 py-3 text-muted-foreground">{a.city}</td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => setSelected(a)} className="text-primary text-xs font-semibold hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Application review</h3>
                <p className="text-xs text-muted-foreground">Submitted {new Date(selected.submittedAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-md"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {selected.doctorName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "DR"}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selected.doctorName}</div>
                  <div className="text-sm text-primary">{selected.specialty}</div>
                  <div className="text-xs text-muted-foreground">{selected.experience} yrs experience · ₹{selected.fee} fee</div>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <Section title="Contact">
                <DetailRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={selected.email} />
                <DetailRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={selected.phone} />
              </Section>

              <Section title="Credentials">
                <DetailRow icon={<Award className="h-3.5 w-3.5" />} label="Reg. number" value={selected.registrationNo} />
                <DetailRow icon={<Award className="h-3.5 w-3.5" />} label="Qualifications" value={selected.qualifications || "—"} />
              </Section>

              <Section title="Clinic">
                <DetailRow icon={<Building2 className="h-3.5 w-3.5" />} label="Name" value={selected.clinicName} />
                <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value={`${selected.address}, ${selected.city}`} />
                <DetailRow icon={<CalendarCheck className="h-3.5 w-3.5" />} label="Timings" value={selected.timings} />
              </Section>

              {selected.about && (
                <Section title="About the practice">
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.about}</p>
                </Section>
              )}
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Close</button>
              <button onClick={() => setStatus(selected.id, "rejected")}
                className="px-4 py-2 rounded-lg border border-emergency text-emergency text-sm font-semibold hover:bg-emergency-soft inline-flex items-center gap-1.5">
                <X className="h-4 w-4" /> Reject
              </button>
              <button onClick={() => setStatus(selected.id, "approved")}
                className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 inline-flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-warning-soft text-warning",
    approved: "bg-success-soft text-success",
    rejected: "bg-emergency-soft text-emergency",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>{status}</span>;
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}