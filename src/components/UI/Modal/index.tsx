"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import IconButton from "@/components/UI/IconButton";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import { cn } from "@/utils/cn";

interface ModalProps {
  title: string;
  className?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose, className }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    const dialog = ref.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]') ?? []);
    (focusable()[0] ?? dialog)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); dialog?.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div ref={ref} tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Paper className={cn("flex max-h-full w-full flex-col overflow-hidden", className ?? "max-w-[390px]")}>
        <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <SectionHeading title={title} />
          <IconButton aria-label="Закрыть" onClick={onClose}><X size={20} /></IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
      </Paper>
    </div>
  );
}
