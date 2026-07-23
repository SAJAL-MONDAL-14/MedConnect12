import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle className="h-4 w-4 shrink-0" />,
  error: <XCircle className="h-4 w-4 shrink-0" />,
  info: <Info className="h-4 w-4 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
};

const COLORS = {
  success: "bg-success text-success-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-primary text-primary-foreground",
  warning: "bg-warning text-warning-foreground",
};

/** Single toast item */
function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount with tiny delay so transition fires
    const tIn = setTimeout(() => setVisible(true), 10);
    const tOut = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 4000);
    return () => { clearTimeout(tIn); clearTimeout(tOut); };
  }, []);

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-elevated min-w-[260px] max-w-[360px] transition-all duration-300 ${COLORS[toast.type]} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {ICONS[toast.type]}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
        className="opacity-70 hover:opacity-100 transition ml-1 shrink-0"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/** Toast container — render at root */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

/** Hook — returns { toasts, toast, removeToast } */
let _id = 0;
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = "info", duration = 4000) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, toast, removeToast };
}
