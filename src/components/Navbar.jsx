import { Link, useNavigate } from "react-router-dom";
import { Siren, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export function Logo({ className = "" }) {
  return (
    <Link to="/" className={`text-xl font-bold tracking-tight ${className}`}>
      <span className="text-foreground">Med</span>
      <span className="text-primary">Connect</span>
    </Link>
  );
}

export function SOSPill({ size = "md" }) {
  return (
    <Link
      to="/sos"
      className={`relative inline-flex items-center gap-1.5 rounded-full bg-emergency text-emergency-foreground font-semibold sos-btn hover:opacity-90 transition ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
        }`}
    >
      <Siren className="h-3.5 w-3.5" strokeWidth={2.2} />
      SOS
    </Link>
  );
}

export function LangSwitcher() {
  return (
    <div className="hidden md:inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    </div>
  );
}

/** User avatar dropdown shown when logged in */
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.name || user?.email?.split("@")[0] || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="navbar-user-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-secondary transition text-sm font-medium"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar circle */}
        <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </span>
        <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
          </div>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary transition"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            My Profile
          </Link>
          <button
            id="navbar-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-emergency-soft transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { label: "Hospitals", key: "hospitals", to: "/search" },
    { label: "Doctors", key: "doctors", to: "/doctors" },
    { label: "Clinics", key: "clinics", to: "/clinics" },
    { label: "Labs", key: "labs", to: "/labs" },
    { label: "Emergency", key: "emergency", to: "/sos" },
  ];

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-6 lg:gap-10 min-w-0">
            <Logo />
            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className={`text-sm transition whitespace-nowrap ${active === l.key ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitcher />
            {/* Conditional: show login button OR user menu */}
            {user ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-md border border-border hover:border-primary hover:text-primary transition"
              >
                Login
              </Link>
            )}
            <SOSPill />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border hover:bg-secondary transition"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-xs bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${active === l.key ? "bg-primary-soft text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-border" />
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-emergency-soft transition"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <User className="h-4 w-4" /> Login / Sign up
                </Link>
              )}
            </nav>
            <div className="p-3 border-t border-border shrink-0">
              <Link
                to="/sos"
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emergency text-emergency-foreground px-4 py-3 text-sm font-bold hover:opacity-90"
              >
                <Siren className="h-4 w-4" /> Emergency SOS
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
