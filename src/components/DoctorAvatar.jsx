import { useEffect, useRef, useState } from "react";

/**
 * Interactive "3D" doctor girl avatar built with SVG + parallax.
 * - Head and eyes follow the cursor
 * - Subtle idle float + stethoscope swing
 * - Layered shadows give pseudo-3D depth
 */
export function DoctorAvatar() {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({ x: Math.max(-1, Math.min(1, dx * 2)), y: Math.max(-1, Math.min(1, dy * 2)) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const headRX = tilt.x * 6; // px
  const headRY = tilt.y * 4;
  const eyeX = tilt.x * 2.2;
  const eyeY = tilt.y * 1.8;
  const bodyRot = tilt.x * 2;

  return (
    <div ref={wrapRef} className="relative mx-auto w-[300px] h-[420px] select-none">
      {/* Glow disc */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, oklch(0.85 0.12 215 / 0.55), transparent 65%)",
        }}
      />

      {/* Floating + scene-tilt wrapper */}
      <div
        className="absolute inset-0 doctor-float"
        style={{
          transform: `perspective(900px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 6}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 180ms ease-out",
        }}
      >
        <svg
          viewBox="0 0 300 420"
          className="w-full h-full drop-shadow-[0_30px_40px_rgba(15,55,120,0.25)]"
        >
          <defs>
            <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e6eef7" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8d6bb" />
              <stop offset="100%" stopColor="#e8b893" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a2419" />
              <stop offset="100%" stopColor="#1f120b" />
            </linearGradient>
            <linearGradient id="scrubGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82c4" />
              <stop offset="100%" stopColor="#1f5a96" />
            </linearGradient>
            <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff9b86" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff9b86" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Shadow under figure */}
          <ellipse cx="150" cy="405" rx="90" ry="10" fill="#0c2340" opacity="0.18" />

          {/* BODY (coat) */}
          <g
            style={{
              transform: `rotate(${bodyRot}deg)`,
              transformOrigin: "150px 240px",
              transition: "transform 200ms ease-out",
            }}
          >
            {/* Scrub top under coat */}
            <path d="M95 215 Q150 200 205 215 L215 360 Q150 380 85 360 Z" fill="url(#scrubGrad)" />
            {/* Coat */}
            <path
              d="M70 210 Q110 195 150 205 Q190 195 230 210 L240 380 Q150 405 60 380 Z"
              fill="url(#coatGrad)"
              stroke="#cdd9e7"
              strokeWidth="1.2"
            />
            {/* Coat opening V */}
            <path d="M150 205 L130 270 L150 290 L170 270 Z" fill="url(#scrubGrad)" />
            {/* Pocket */}
            <rect x="180" y="320" width="36" height="26" rx="3" fill="#ffffff" stroke="#cdd9e7" />
            {/* Stethoscope */}
            <g className="stetho-swing" style={{ transformOrigin: "150px 215px" }}>
              <path
                d="M125 215 Q115 260 125 290 Q140 320 165 305"
                stroke="#1a1a1a"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="165" cy="305" r="9" fill="#c0c7d1" stroke="#1a1a1a" strokeWidth="2" />
              <circle cx="165" cy="305" r="4" fill="#1a1a1a" />
              <circle cx="125" cy="215" r="3" fill="#1a1a1a" />
            </g>
            {/* ID badge */}
            <rect x="190" y="250" width="22" height="30" rx="2" fill="#fff" stroke="#94a3b8" />
            <rect x="193" y="254" width="16" height="10" rx="1" fill="#3b82c4" />
            <rect x="193" y="267" width="16" height="2" fill="#cbd5e1" />
            <rect x="193" y="272" width="12" height="2" fill="#cbd5e1" />
          </g>

          {/* HEAD GROUP — parallax */}
          <g
            style={{
              transform: `translate(${headRX}px, ${headRY}px)`,
              transition: "transform 180ms ease-out",
            }}
          >
            {/* Neck */}
            <rect x="138" y="180" width="24" height="22" fill="url(#skinGrad)" />
            {/* Hair back */}
            <path
              d="M85 130 Q90 60 150 55 Q210 60 215 130 L215 210 Q200 175 195 175 L105 175 Q100 175 85 210 Z"
              fill="url(#hairGrad)"
            />
            {/* Face */}
            <ellipse cx="150" cy="135" rx="48" ry="55" fill="url(#skinGrad)" />
            {/* Hair fringe */}
            <path
              d="M105 110 Q130 80 150 95 Q170 80 195 110 Q190 125 170 118 Q150 108 130 118 Q110 125 105 110 Z"
              fill="url(#hairGrad)"
            />
            {/* Cheeks */}
            <ellipse cx="122" cy="148" rx="10" ry="6" fill="url(#cheek)" />
            <ellipse cx="178" cy="148" rx="10" ry="6" fill="url(#cheek)" />
            {/* Eyebrows */}
            <path
              d="M125 122 Q133 118 142 122"
              stroke="#2a1810"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M158 122 Q167 118 175 122"
              stroke="#2a1810"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Eyes */}
            <g>
              <ellipse cx="133" cy="135" rx="5" ry="6" fill="#fff" />
              <ellipse cx="167" cy="135" rx="5" ry="6" fill="#fff" />
              <circle cx={133 + eyeX} cy={135 + eyeY} r="2.8" fill="#1b3b5f" />
              <circle cx={167 + eyeX} cy={135 + eyeY} r="2.8" fill="#1b3b5f" />
              <circle cx={134 + eyeX} cy={134 + eyeY} r="0.9" fill="#fff" />
              <circle cx={168 + eyeX} cy={134 + eyeY} r="0.9" fill="#fff" />
            </g>
            {/* Nose */}
            <path
              d="M150 142 Q148 152 152 156"
              stroke="#d49a78"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Mouth */}
            <path
              d="M141 165 Q150 172 159 165"
              stroke="#a8324a"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Head mirror band (doctor) */}
            <path d="M102 100 Q150 78 198 100" stroke="#cfd8e3" strokeWidth="3" fill="none" />
            <circle cx="150" cy="86" r="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="150" cy="86" r="2" fill="#1b3b5f" />
            {/* Earrings */}
            <circle cx="102" cy="148" r="2.5" fill="#fbbf24" />
            <circle cx="198" cy="148" r="2.5" fill="#fbbf24" />
          </g>
        </svg>
      </div>

      {/* Floating info card */}
      <div className="absolute -bottom-2 -left-2 rounded-xl bg-white shadow-lg border border-primary/15 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="font-semibold text-primary-dark">Dr. Aisha</span>
          <span className="text-muted-foreground">online</span>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 rounded-xl bg-primary text-primary-foreground shadow-lg px-3 py-2 text-[11px] font-semibold">
        24/7 Consult
      </div>
    </div>
  );
}
