import React from 'react';
import { CalendarCheck, Users, Wallet, Star, Eye, TrendingUp } from "lucide-react";
import AppointmentsView from "./AppointmentsView";

// Note: RecentPatients is used in this file but seems to be defined in Dashboard.jsx. 
import { RecentPatients } from "./Dashboard";
function DashboardView() {
    const stats = [
        {
            label: "Today's bookings",
            value: "14",
            delta: "+3 vs yesterday",
            tone: "primary",
            icon: CalendarCheck,
        },
        {
            label: "Total patients",
            value: "1,284",
            delta: "+18 this week",
            tone: "success",
            icon: Users,
        },
        { label: "Earnings today", value: "₹8,400", delta: "+22%", tone: "warning", icon: Wallet },
        { label: "Rating", value: "4.8", delta: "184 reviews", tone: "emergency", icon: Star },
    ];
    return (
        <>
            <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
                <div
                    className="absolute right-0 top-0 h-full w-1/3 opacity-20"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                    }}
                />
                <div className="relative">
                    <div className="text-xs uppercase tracking-wider text-white/70 font-bold">
                        Today's overview
                    </div>
                    <h2 className="mt-1 text-2xl font-bold">You have 14 appointments today</h2>
                    <p className="text-sm text-white/80 mt-1">
                        Next patient: <span className="font-semibold">Riya Sharma — 11:00 AM</span>
                    </p>
                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 transition">
                        <Eye className="h-4 w-4" /> View today's schedule
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="rounded-xl bg-card border border-border p-4 hover:shadow-lg transition"
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
                        <div className="text-[11px] text-success mt-1 font-medium">{s.delta}</div>
                    </div>
                ))}
            </div>
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
                <AppointmentsView compact />
                <RecentPatients />
            </div>
        </>
    );
}

export default DashboardView;