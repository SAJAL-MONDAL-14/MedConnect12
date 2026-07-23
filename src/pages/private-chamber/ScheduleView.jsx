import React, { Fragment } from 'react';

function ScheduleView() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const slots = ["9:00", "10:00", "11:00", "12:00", "4:00", "5:00", "6:00", "7:00"];
    return (
        <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="font-semibold text-lg">Weekly schedule</h2>
                    <p className="text-xs text-muted-foreground">Tap a slot to toggle availability</p>
                </div>
                <button className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold">
                    Save changes
                </button>
            </div>
            <div className="overflow-x-auto">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2 min-w-[640px]">
                    <div></div>
                    {days.map((d) => (
                        <div key={d} className="text-center text-xs font-semibold text-muted-foreground">
                            {d}
                        </div>
                    ))}
                    {slots.map((s) => (
                        <Fragment key={s}>
                            <div className="text-xs text-muted-foreground font-mono py-2">{s}</div>
                            {days.map((d, i) => {
                                const off = i === 6 || (i === 0 && s.startsWith("4"));
                                return (
                                    <button
                                        key={d + s}
                                        className={`h-10 rounded-md text-[11px] font-medium border transition ${off ? "bg-muted text-muted-foreground border-border" : "bg-success-soft text-success border-success/20 hover:bg-success hover:text-success-foreground"}`}
                                    >
                                        {off ? "Off" : "Open"}
                                    </button>
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}



export default ScheduleView;