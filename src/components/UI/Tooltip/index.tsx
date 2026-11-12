"use client";

import { CircleHelp } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";

import IconButton from "@/components/UI/IconButton";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Tooltip({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const open = hovered || pinned;
  useClickOutside(ref, () => { setPinned(false); setHovered(false); });

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPinned(false); }} onKeyDown={(event) => { if (event.key === "Escape") { setPinned(false); setHovered(false); } }}>
      <IconButton aria-label={label} aria-expanded={open} aria-describedby={open ? id : undefined} onClick={() => { setPinned(!pinned); setHovered(false); }}><CircleHelp size={18} /></IconButton>
      {open && <div id={id} role="tooltip" className="absolute right-0 top-full z-20 w-64 max-w-[calc(100vw-2rem)] pt-2 sm:w-80"><div className="rounded-card border border-line bg-surface-raised p-4 shadow-xl"><p className="font-semibold">{title}</p><div className="mt-2 text-base text-muted">{children}</div></div></div>}
    </div>
  );
}
