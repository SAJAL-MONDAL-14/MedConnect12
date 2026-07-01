import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error("Route Error Caught:", error);

  // Detect chunk loading errors (typical in production when redeploying)
  const isChunkError =
    error?.name === "ChunkLoadError" ||
    error?.message?.includes("Failed to fetch dynamically imported module") ||
    error?.message?.includes("Importing a module script failed");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-elevated p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emergency/10 flex items-center justify-center text-emergency mb-4 animate-bounce">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {isChunkError ? "Update Available" : "Something went wrong"}
        </h1>

        <p className="text-sm text-muted-foreground mt-2 mb-6">
          {isChunkError
            ? "A newer version of the application is available. Please reload the page to load the updates."
            : error?.statusText ||
              error?.message ||
              "An unexpected error occurred while loading this page."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary-dark transition"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card text-foreground px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error?.stack && (
          <div className="mt-8 text-left bg-muted p-4 rounded-lg overflow-auto max-h-40 border border-border">
            <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
              {error.stack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
