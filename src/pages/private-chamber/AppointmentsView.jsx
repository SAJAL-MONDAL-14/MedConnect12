import { useState } from "react";
import StatusChip from "@/components/StatusChip";
import {
    X,
    CheckCircle2
} from "lucide-react";


const initialAppts = [
    {
        id: 1,
        time: "10:00",
        patient: "Anita Kumar",
        type: "Consultation",
        status: "Completed",
        fee: 600,
    },
    {
        id: 2,
        time: "11:00",
        patient: "Riya Sharma",
        type: "Follow-up",
        status: "Confirmed",
        fee: 400,
    },
    {
        id: 3,
        time: "11:30",
        patient: "Vikash Roy",
        type: "Consultation",
        status: "Pending",
        fee: 600,
    },
    { id: 4, time: "12:00", patient: "Meera Pal", type: "Procedure", status: "Confirmed", fee: 1500 },
    {
        id: 5,
        time: "5:00 PM",
        patient: "Sneha Bose",
        type: "Consultation",
        status: "Confirmed",
        fee: 600,
    },
];




function AppointmentsView({ compact = false }) {
    const [appts, setAppts] = useState(initialAppts);
    const update = (id, status) =>
        setAppts((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
    return (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">{compact ? "Today's appointments" : "All appointments"}</h2>
                <button className="text-xs text-primary font-medium hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="text-left px-6 py-3 font-medium">Time</th>
                            <th className="text-left px-6 py-3 font-medium">Patient</th>
                            <th className="text-left px-6 py-3 font-medium">Type</th>
                            <th className="text-left px-6 py-3 font-medium">Fee</th>
                            <th className="text-left px-6 py-3 font-medium">Status</th>
                            <th className="text-right px-6 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {appts.map((a) => (
                            <tr key={a.id} className="hover:bg-secondary/50">
                                <td className="px-6 py-3 font-mono">{a.time}</td>
                                <td className="px-6 py-3 font-medium">{a.patient}</td>
                                <td className="px-6 py-3 text-muted-foreground">{a.type}</td>
                                <td className="px-6 py-3 font-mono">₹{a.fee}</td>
                                <td className="px-6 py-3">
                                    <StatusChip s={a.status} />
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => update(a.id, "Completed")}
                                            className="p-1.5 rounded hover:bg-success-soft text-success"
                                            title="Complete"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => update(a.id, "No-show")}
                                            className="p-1.5 rounded hover:bg-emergency-soft text-emergency"
                                            title="No-show"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



export default AppointmentsView;