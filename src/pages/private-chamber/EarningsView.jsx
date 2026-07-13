function EarningsView() {
    const days = [
        { d: "Mon", v: 60 },
        { d: "Tue", v: 78 },
        { d: "Wed", v: 52 },
        { d: "Thu", v: 88 },
        { d: "Fri", v: 95 },
        { d: "Sat", v: 70 },
        { d: "Sun", v: 45 },
    ];
    return (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
            <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold">Earnings this week</h2>
                    <span className="text-xs text-success font-semibold">+22% vs last week</span>
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                    {days.map((c) => (
                        <div key={c.d} className="flex-1 flex flex-col items-center gap-2">
                            <div className="text-[10px] font-mono text-muted-foreground">
                                ₹{Math.round(c.v * 80)}
                            </div>
                            <div
                                className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-glow"
                                style={{ height: `${c.v}%` }}
                            />
                            <div className="text-xs text-muted-foreground">{c.d}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rounded-xl bg-card border border-border p-5 space-y-3">
                <h2 className="font-semibold">Payout snapshot</h2>
                {[
                    { label: "Today", value: "₹8,400", delta: "+22%" },
                    { label: "This week", value: "₹52,200", delta: "+18%" },
                    { label: "This month", value: "₹2.1L", delta: "+24%" },
                    { label: "Pending payout", value: "₹14,800", delta: "Friday" },
                ].map((r) => (
                    <div
                        key={r.label}
                        className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3"
                    >
                        <div>
                            <div className="text-xs text-muted-foreground">{r.label}</div>
                            <div className="text-lg font-bold font-mono">{r.value}</div>
                        </div>
                        <span className="text-xs font-semibold text-success">{r.delta}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}




export default EarningsView;