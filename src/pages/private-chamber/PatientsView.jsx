import { Plus } from "lucide-react";
import StatusChip from "@/components/StatusChip";

export default function PatientsView() {
    const patients = [
        {
            name: "Anita Kumar",
            age: 34,
            phone: "+91 98765 11111",
            last: "Today",
            visits: 4,
            status: "Active",
        },
        {
            name: "Vikram Roy",
            age: 52,
            phone: "+91 98765 22222",
            last: "Yesterday",
            visits: 12,
            status: "Active",
        },
        {
            name: "Sneha Bose",
            age: 28,
            phone: "+91 98765 33333",
            last: "2 days ago",
            visits: 2,
            status: "New",
        },
        {
            name: "Rahul Das",
            age: 41,
            phone: "+91 98765 44444",
            last: "1 week ago",
            visits: 8,
            status: "Active",
        },
        {
            name: "Meera Pal",
            age: 36,
            phone: "+91 98765 55555",
            last: "2 weeks ago",
            visits: 3,
            status: "Inactive",
        },
    ];
    return (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Patients ({patients.length})</h2>
                <button className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add patient
                </button>
            </div>
            <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                        <th className="text-left px-6 py-3 font-medium">Name</th>
                        <th className="text-left px-6 py-3 font-medium">Age</th>
                        <th className="text-left px-6 py-3 font-medium">Phone</th>
                        <th className="text-left px-6 py-3 font-medium">Visits</th>
                        <th className="text-left px-6 py-3 font-medium">Last visit</th>
                        <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {patients.map((p) => (
                        <tr key={p.name} className="hover:bg-secondary/50">
                            <td className="px-6 py-3 font-medium">{p.name}</td>
                            <td className="px-6 py-3 font-mono">{p.age}</td>
                            <td className="px-6 py-3 font-mono text-muted-foreground">{p.phone}</td>
                            <td className="px-6 py-3 font-mono">{p.visits}</td>
                            <td className="px-6 py-3 text-muted-foreground">{p.last}</td>
                            <td className="px-6 py-3">
                                <StatusChip s={p.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
