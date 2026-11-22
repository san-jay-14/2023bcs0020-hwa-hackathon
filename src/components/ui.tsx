"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "sun" | "ink" | "cream" | "coral" | "teal";

export function TicketButton({
  href,
  children,
  variant = "sun",
  size = "md",
  className = "",
  full = false,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  full?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">) {
  const sizes = {
    sm: "h-10 px-6 text-base",
    md: "h-14 px-9 text-xl",
    lg: "h-16 px-12 text-2xl md:h-20 md:px-14 md:text-3xl",
  } as const;
  const cls = `ticket ticket-btn tb-${variant} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} data-cursor="hover">
        <span>{children}</span>
      </Link>
    );
  }
  return (
    <button className={cls} data-cursor="hover" {...rest}>
      <span>{children}</span>
    </button>
  );
}

export function Img({ src, alt = "", className = "", style }: { src: string; alt?: string; className?: string; style?: CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} style={style} />;
}

export function Marquee({
  items,
  className = "",
  reverse = false,
  duration = 30,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  duration?: number;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 md:px-10">{t}</span>
          <Star />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee overflow-hidden ${reverse ? "marquee-rev" : ""} ${className}`} aria-hidden>
      <div className="marquee-track" style={{ "--dur": `${duration}s` } as CSSProperties}>
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

export function Star({ className = "h-[0.6em] w-[0.6em]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
    </svg>
  );
}

export function RoundBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow h-full w-full" aria-hidden>
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="display" fontSize="23" letterSpacing="3.5" fill="currentColor">
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Star className="h-1/4 w-1/4" />
      </div>
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function ConceptNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed opacity-70 ${className}`}>
      Longshift is a concept in development; a prototype is pending. Renders are illustrative and this store runs in test
      mode.
    </p>
  );
}
