function StatusChip({ s }) {
    const map = {
        Confirmed: "bg-success-soft text-success",
        Pending: "bg-warning-soft text-warning",
        "No-show": "bg-emergency-soft text-emergency",
        Completed: "bg-muted text-muted-foreground",
        Active: "bg-success-soft text-success",
        New: "bg-primary-soft text-primary",
        Inactive: "bg-muted text-muted-foreground",
    };
    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[s] ?? "bg-muted"}`}
        >
            {s}
        </span>
    );
}


export default StatusChip;