import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, Clock } from "lucide-react";
import { useEffect } from "react";

export default function HospitalRegisterSuccess() {
  const [params] = useSearchParams();
  const id = params.get("id");
  useEffect(() => {
    document.title = "Application submitted — MedConnect";
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-16 w-16 rounded-full bg-success text-success-foreground mx-auto mb-5 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Application submitted</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Application ID <span className="font-mono">{id}</span>
        </p>
        <div className="mt-6 grid gap-3 text-left text-sm">
          <div className="rounded-lg border border-border bg-card p-3 flex gap-3">
            <Clock className="h-4 w-4 text-warning mt-0.5" />
            <div>
              <div className="font-semibold">Under review</div>
              <div className="text-muted-foreground text-xs">
                Our team will verify your documents, photos and facility info.
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 flex gap-3">
            <Mail className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">We'll email you</div>
              <div className="text-muted-foreground text-xs">
                Approval, rejection or requests for more info land in your admin inbox.
              </div>
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary-dark"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
