import React from "react";
import { Activity } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner with Pulsing Medical Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Loading text with subtle fade */}
        <div className="text-center mt-2">
          <div className="text-sm font-bold tracking-tight text-foreground">
            Med<span className="text-primary">Connect</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 animate-pulse">
            Loading secure patient portal...
          </p>
        </div>
      </div>
    </div>
  );
}
