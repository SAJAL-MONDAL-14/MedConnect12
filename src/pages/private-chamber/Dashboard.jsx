import { Link, replace, Route, Routes } from "react-router-dom";
import React, { useState, Fragment, useEffect, Suspense } from "react";
import api from "@/lib/api";
import StatusChip from "@/components/StatusChip";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wallet,
  Star,
  Settings,
  LogOut,
  Bell,
  Plus,
  CheckCircle2,
  X,
  Eye,
  Clock,
  TrendingUp,
  Stethoscope,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CalendarCheck, label: "Appointments" },
  { icon: Users, label: "Patients" },
  { icon: Clock, label: "Schedule" },
  { icon: Wallet, label: "Earnings" },
  { icon: Star, label: "Reviews" },
  { icon: Settings, label: "Settings" },
];

const DashboardView = React.lazy(() => import("./DashboardView"));
const AppointmentsView = React.lazy(() => import("./AppointmentsView"));
const PatientsView = React.lazy(() => import("./PatientsView"));
const SettingsView = React.lazy(() => import("./SettingsView"));

const ReviewsView = React.lazy(() => import("./ReviewsView"));
const ScheduleView = React.lazy(() => import("./ScheduleView"));
const EarningView = React.lazy(() => import("./EarningsView"));

export default function PrivateChamberDashboard() {
  const [view, setView] = useState("Dashboard");
  const { id, owner_doctor_name, gmail, phone, speciality, medical_council_reg_no, experience, qualification, clinic_name, address, about_of_clinic, status } = JSON.parse(localStorage.getItem("clinic_doctor")) || {};
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("clinic_doctor")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    document.title = "Chamber dashboard — MedConnect";
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/private-chamber/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("clinic_doctor");
      delete api.defaults.headers.common["Authorization"];
      navigate("/private-chamber/login", { replace: true });
    }
  };

  const initials = doctor.owner_doctor_name
    ? doctor.owner_doctor_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "DR";

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 text-white bg-gradient-to-b from-primary via-primary-dark to-foreground">
        <div className="p-5 border-b border-white/10">
          <div className="text-base font-bold">
            Med<span className="text-white/60">Connect</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
            Chamber Portal
          </div>
        </div>
        <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">Dr. {doctor.owner_doctor_name}</div>
            <div className="text-[10px] text-white/60">
              {doctor.speciality || "Private Chamber"}
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map((n) => (
            <Link
              to={n.label === "Dashboard" ? "." : n.label.toLowerCase()}
              key={n.label}
              onClick={() => setView(n.label)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium border-l-2 transition text-left ${view === n.label ? "bg-white/10 border-white text-white" : "border-transparent text-white/70 hover:bg-white/5"}`}
            >
              <n.icon className="h-4 w-4" strokeWidth={1.5} /> {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/login"
          onClick={() => handleLogout()}
          className="m-4 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div>
            <div className="font-semibold">
              {view === "Dashboard"
                ? `Welcome back, Dr. ${doctor.owner_doctor_name || ""} 👨‍⚕️`
                : view}
            </div>
            <div className="text-xs text-muted-foreground">
              {doctor.clinic_name || "Private Chamber"} · {doctor.city || ""}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-success">
              <span className="live-dot" /> Online
            </span>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emergency" />
            </button>
          </div>
        </header>
        <div className="md:hidden flex overflow-x-auto bg-card border-b border-border px-3">
          {navItems.map((n) => (
            <button
              key={n.label}
              onClick={() => {
                setView(n.label);
                navigate(n.label === "Dashboard" ? "." : n.label.toLowerCase());
              }}
              className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 ${view === n.label ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              {n.label}
            </button>
          ))}
        </div>
        <main className="p-6 space-y-6">
          <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="earning" element={<EarningView />} />
              <Route path="appointments" element={<AppointmentsView />} />
              <Route path="patients" element={<PatientsView />} />
              <Route path="settings" element={<SettingsView />} />

              <Route path="reviews" element={<ReviewsView />} />
              <Route path="schedule" element={<ScheduleView />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function RecentPatients() {
  const patients = [
    { name: "Anita Kumar", age: 34, last: "Today", visits: 4 },
    { name: "Vikram Roy", age: 52, last: "Yesterday", visits: 12 },
    { name: "Sneha Bose", age: 28, last: "2 days ago", visits: 2 },
    { name: "Rahul Das", age: 41, last: "1 week ago", visits: 8 },
  ];
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent patients</h2>
        <button className="text-xs text-primary hover:underline">All patients</button>
      </div>
      <div className="space-y-3">
        {patients.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition"
          >
            <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
              {p.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">
                Age {p.age} · {p.visits} visits
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground">{p.last}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
