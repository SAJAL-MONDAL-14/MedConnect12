import { Star } from "lucide-react";

function ReviewsView() {
    const reviews = [
        {
            name: "Anita Kumar",
            rating: 5,
            date: "2 days ago",
            comment:
                "Dr. Kapoor was very thorough and patient. Cleared all my doubts about my skin treatment.",
        },
        {
            name: "Vikram Roy",
            rating: 5,
            date: "1 week ago",
            comment: "Excellent doctor. Clinic is clean and well-managed. Highly recommended.",
        },
        {
            name: "Meera Pal",
            rating: 4,
            date: "2 weeks ago",
            comment: "Good consultation. Slight wait time but treatment was effective.",
        },
    ];
    return (
        <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
            <div className="rounded-xl bg-card border border-border p-6 text-center">
                <div className="text-5xl font-bold text-warning">4.8</div>
                <div className="flex justify-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Based on 184 reviews</div>
                <div className="mt-5 space-y-2">
                    {[5, 4, 3, 2, 1].map((n) => (
                        <div key={n} className="flex items-center gap-2 text-xs">
                            <span className="w-3">{n}</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-warning"
                                    style={{ width: `${[80, 15, 3, 1, 1][5 - n]}%` }}
                                />
                            </div>
                            <span className="w-8 text-right text-muted-foreground">
                                {[80, 15, 3, 1, 1][5 - n]}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rounded-xl bg-card border border-border p-5 space-y-4">
                <h2 className="font-semibold">Recent reviews</h2>
                {reviews.map((r, i) => (
                    <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{r.name}</div>
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{r.date}</div>
                        <p className="mt-1.5 text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default ReviewsView;