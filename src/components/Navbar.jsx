import { Link } from "react-router-dom";

export function Logo({ className = "" }) {
  return (
    <Link to="/" className={`text-xl font-bold tracking-tight ${className}`}>
      <span className="text-foreground">Med</span>
      <span className="text-primary">Connect</span>
    </Link>
  );
}

export function LangSwitcher() {
  const langs = ["EN", "हि", "বা"];
  return (
    <div className="hidden md:inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
      </svg>
    </div>
  );
}

export function Navbar({ active }) {
  const links = [
    { label: "Hospitals", key: "hospitals", to: "/search" },
    { label: "Doctors", key: "doctors", to: "/doctors" },
    { label: "Clinics", key: "clinics", to: "/clinics" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`text-sm transition ${
                  active === l.key
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-md border border-border hover:border-primary hover:text-primary transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
