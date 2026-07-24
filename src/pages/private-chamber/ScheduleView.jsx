import React, { useState, useEffect, use } from 'react';
import api from "@/lib/api";
// import toast from 'react-hot-toast'; // Assuming you use toast for notifications

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Generates 24 slots: "00:00-01:00", "01:00-02:00", ..., "23:00-00:00"
const HOURS = Array.from({ length: 24 }, (_, i) => {
    const start = i.toString().padStart(2, '0') + ":00";
    const end = ((i + 1) % 24).toString().padStart(2, '0') + ":00";
    return `${start}-${end}`;
});

function ScheduleView() {
    const [schedule, setSchedule] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log("hello", schedule);

    // TODO: Call this in useEffect to fetch data on mount
    const fetchSchedule = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/api/private-chamber/schedule");
                // The backend returns { success: true, data: [ {dayOfWeek: "Mon", timeSlots: []}, ... ] }
                const fetchedData = response.data.data;
                const formattedSchedule = {};
                
                fetchedData.forEach(item => {
                    formattedSchedule[item.dayOfWeek] = item.timeSlots;
                });
                
                setSchedule(formattedSchedule);
            } catch (error) {
                console.error("Failed to fetch schedule", error);
            } finally {
                setIsLoading(false);
            }
        };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const toggleSlot = (day, time) => {
        if (!isEditing) return;

        setSchedule(prev => {
            const daySlots = prev[day] || [];
            if (daySlots.includes(time)) {
                return { ...prev, [day]: daySlots.filter(t => t !== time) };
            } else {
                return { ...prev, [day]: [...daySlots, time] };
            }
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = DAYS.map(day => ({
                dayOfWeek: day,
                timeSlots: schedule[day] || []
            }));
            
            await api.put("/api/private-chamber/schedule", { schedules: payload });
            // toast.success("Schedule saved successfully!");
            fetchSchedule(); // Refresh the schedule after saving


            console.log("Saving payload:", payload);
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed", error);
            // toast.error("Failed to save schedule.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
            {/* Header section with modern Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-semibold text-lg text-slate-800">Weekly Schedule (24x7)</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isEditing ? "Click on any slot to toggle your availability." : "Click 'Edit' to make changes."}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground shadow hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : "Save changes"}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-xs font-semibold rounded-md border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition"
                        >
                            Edit Schedule
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable 24x7 Grid */}
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-border rounded-lg custom-scrollbar">
                <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-px bg-border min-w-[800px]">
                    
                    {/* Header Row */}
                    <div className="bg-muted p-3 sticky top-0 left-0 z-20"></div>
                    {DAYS.map((d) => (
                        <div key={d} className="bg-muted p-3 text-center text-xs font-semibold text-muted-foreground sticky top-0 z-10">
                            {d}
                        </div>
                    ))}

                    {/* Time Rows */}
                    {HOURS.map((time) => (
                        <React.Fragment key={time}>
                            {/* Time Label */}
                            <div className="bg-card p-2 text-[11px] text-muted-foreground font-mono flex items-center justify-center sticky left-0 z-10 border-r border-border">
                                {time}
                            </div>
                            
                            {/* Slots for each day */}
                            {DAYS.map((day) => {
                                const isSelected = schedule[day]?.includes(time);
                                
                                return (
                                    <div
                                        key={`${day}-${time}`}
                                        onClick={() => toggleSlot(day, time)}
                                        className={`
                                            p-1 bg-card transition-all duration-200 flex items-center justify-center
                                            ${isEditing ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}
                                        `}
                                    >
                                        <div className={`
                                            w-full h-8 rounded text-[10px] font-medium flex items-center justify-center transition-colors
                                            ${isSelected 
                                                ? 'bg-blue-600 text-white shadow-sm' 
                                                : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-blue-300'}
                                            ${!isEditing && !isSelected && 'opacity-60'}
                                        `}>
                                            {isSelected ? "Open" : "Closed"}
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ScheduleView;