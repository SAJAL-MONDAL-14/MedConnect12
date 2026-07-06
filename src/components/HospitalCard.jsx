import { CheckCircle2, ShieldCheck } from "lucide-react";

export function BedChip({ label, count, total, type = "general" }) {
  let tone = "success";
  if (count === 0) tone = "emergency";
  else if (type === "icu" && count <= 3) tone = "warning";

  const styles = {
    success: "bg-success-soft text-success border-success/20",
    warning: "bg-warning-soft text-warning border-warning/20",
    emergency: "bg-emergency-soft text-emergency border-emergency/20",
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      <span className="font-mono">{label}: {count === 0 ? "Full" : `${count} free`}</span>
    </span>
  );
}

export function HospitalTypeBadge({ type }) {
  const styles =
    type === "Government"
      ? "bg-primary-soft text-primary"
      : "bg-accent text-accent-foreground border border-border";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles}`}>
      {type}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-success text-xs font-medium">
      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
      Verified
    </span>
  );
}

export function StarRating({ rating, reviews, size = "sm" }) {
  return (
    <span className={`inline-flex items-center gap-1 ${size === "md" ? "text-sm" : "text-xs"}`}>
      <span className="text-warning">★</span>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-muted-foreground">({reviews})</span>}
    </span>
  );
}

export function LiveDot({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-success">
      <span className="live-dot" />
      {label}
    </span>
  );
}

export function UpdatedAgo({ minutes }) {
  const stale = minutes >= 15;
  return (
    <span className={`text-xs ${stale ? "text-warning" : "text-text-muted"}`}>
      Updated {minutes} min ago
    </span>
  );
}

export function HospitalCard({ hospital, index, onBook }) {
  return (
    <div className="group relative w-full max-w-full min-w-0 overflow-hidden bg-card border border-border rounded-lg p-3.5 sm:p-5 hover:shadow-lift transition-all border-l-4 border-l-primary">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {index !== undefined && <span className="font-mono text-xs text-text-muted">#{index + 1}</span>}
          <h3 className="font-semibold text-[15px] text-foreground min-w-0 flex-1 break-words">{hospital.name}</h3>
          <HospitalTypeBadge type={hospital.type} />
          {hospital.verified && <VerifiedBadge />}
        </div>
        <span className="self-start shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {hospital.distanceKm} km
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-2 break-words">{hospital.address}</p>

      {hospital.specialties.length > 0 && (
        <p className="text-xs text-text-muted mb-3 min-w-0 truncate">
          <span className="text-muted-foreground">Specialties:</span> {hospital.specialties.slice(0, 4).join(" · ")}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <BedChip label="General" count={hospital.beds.general} type="general" />
        <BedChip label="ICU" count={hospital.beds.icu} type="icu" />
        {hospital.beds.ot && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft text-success border border-success/20 px-2.5 py-1 text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" /> OT open
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <StarRating rating={hospital.rating} reviews={hospital.reviews} />
          <UpdatedAgo minutes={hospital.updatedMinAgo} />
        </div>
        <button
          onClick={onBook}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1 rounded-md bg-primary px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-dark transition"
        >
          View & Book
        </button>
      </div>
    </div>
  );
}