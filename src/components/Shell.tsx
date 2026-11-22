"use client";

import { useId } from "react";

function mix(hex: string, with_: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = p(hex);
  const b = p(with_);
  return (
    "#" +
    a
      .map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0"))
      .join("")
  );
}
export const lighten = (h: string, t: number) => mix(h, "#ffffff", t);
export const darken = (h: string, t: number) => mix(h, "#000000", t);

const BODY =
  "M30 215 C30 112 108 58 200 58 C292 58 370 112 370 215 C370 288 296 322 200 322 C104 322 30 288 30 215Z";

type Props = {
  color?: string;
  view?: "exterior" | "cutaway";
  loaded?: boolean;
  className?: string;
  /** hotspots rendering hook for features page */
  children?: React.ReactNode;
};

/** Illustrative render of the Longshift shell. Placeholder until real product imagery arrives. */
export function Shell({ color = "#0b5f5c", view = "exterior", loaded = true, className = "", children }: Props) {
  const id = useId().replace(/:/g, "");
  const light = lighten(color, 0.38);
  const dark = darken(color, 0.5);

  return (
    <svg viewBox="0 0 400 340" className={className} role="img" aria-label="Longshift shell, illustrative render">
      <defs>
        <radialGradient id={`b${id}`} cx="32%" cy="22%" r="95%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`r${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(color, 0.55)} />
          <stop offset="1" stopColor={lighten(color, 0.12)} />
        </linearGradient>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darken(color, 0.72)} />
          <stop offset="1" stopColor={darken(color, 0.45)} />
        </linearGradient>
        <filter id={`bl${id}`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`bs${id}`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id={`cone${id}`}>
          <path d="M104 98 L296 98 L250 240 L150 240 Z" />
        </clipPath>
        <pattern id={`ridge${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <rect width="14" height="14" fill="#e39a3b" />
          <rect width="5" height="14" fill="#b9741f" opacity=".55" />
        </pattern>
        <pattern id={`dent${id}`} width="26" height="22" patternUnits="userSpaceOnUse">
          <rect width="26" height="22" fill="#4b2a18" />
          <circle cx="8" cy="7" r="3.2" fill="#2f180b" opacity=".7" />
          <circle cx="20" cy="16" r="2.4" fill="#2f180b" opacity=".7" />
        </pattern>
      </defs>

      <ellipse cx="200" cy="320" rx="158" ry="15" fill="#000" opacity=".28" filter={`url(#bl${id})`} />
      <path d={BODY} fill={`url(#b${id})`} />

      {view === "exterior" ? (
        <g>
          <ellipse cx="200" cy="104" rx="106" ry="35" fill={`url(#r${id})`} />
          <ellipse cx="200" cy="109" rx="88" ry="26" fill={`url(#c${id})`} />
          {loaded && (
            <g>
              <ellipse cx="200" cy="113" rx="80" ry="21" fill="#ffb89a" />
              <ellipse cx="190" cy="108" rx="36" ry="6" fill="#fff" opacity=".35" />
            </g>
          )}
          <path
            d="M64 196 C60 146 92 104 132 88"
            stroke="#fff"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            opacity=".22"
            filter={`url(#bs${id})`}
          />
          <path
            d="M70 268 C120 308 250 312 322 268"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity=".12"
            filter={`url(#bs${id})`}
          />
        </g>
      ) : (
        <g>
          <path d="M96 94 L304 94 L254 244 L146 244 Z" fill={`url(#c${id})`} />
          <g clipPath={`url(#cone${id})`}>
            <rect className="ls-layer ls-layer-1" x="90" y="98" width="220" height="48" fill="#ffb89a" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }} />
            <rect className="ls-layer ls-layer-2" x="90" y="146" width="220" height="48" fill={`url(#ridge${id})`} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }} />
            <rect className="ls-layer ls-layer-3" x="90" y="194" width="220" height="46" fill={`url(#dent${id})`} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }} />
          </g>
          <ellipse cx="200" cy="96" rx="106" ry="10" fill={`url(#r${id})`} opacity=".9" />
          <path d="M96 94 L146 244" stroke={lighten(color, 0.3)} strokeWidth="3" opacity=".5" />
          <path d="M304 94 L254 244" stroke={darken(color, 0.6)} strokeWidth="3" opacity=".5" />
          <ellipse cx="200" cy="288" rx="62" ry="22" fill={darken(color, 0.75)} />
          <ellipse cx="200" cy="284" rx="62" ry="20" fill="#1c2a29" />
          <ellipse cx="184" cy="278" rx="24" ry="6" fill="#fff" opacity=".12" />
        </g>
      )}
      {children}
    </svg>
  );
}
