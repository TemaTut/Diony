"use client";

import { Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import Button from "@/components/UI/Button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";

type SelectOption = { value: string; label: string; description?: string; icon?: ReactNode };
type SelectProps = {
  id?: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function Select({ id, label, value, options, onChange, disabled }: SelectProps) {
  const generatedId = useId();
  const listId = `${id ?? generatedId}-options`;
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];
  useClickOutside(ref, () => setOpen(false));

  function choose(index: number) {
    if (!options[index]) return;
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape") { setOpen(false); event.stopPropagation(); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) { setActive(selectedIndex); setOpen(true); return; }
      setActive((index) => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    }
    if (open && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); choose(active); }
  }

  return (
    <div ref={ref} className="relative min-w-0" onKeyDown={onKeyDown}>
      <Button
        id={id}
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled || options.length === 0}
        variant="surface"
        onClick={(event) => { trigger.current = event.currentTarget; setActive(selectedIndex); setOpen(!open); }}
        onFocus={(event) => { trigger.current = event.currentTarget; }}
        className="w-full justify-between p-5 text-left sm:p-6"
      >
        <span className="flex min-w-0 items-center gap-4">
          {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
          <span className="min-w-0"><span className="block text-lead font-semibold">{selected?.label ?? "Выберите вариант"}</span>{selected?.description && <span className="mt-1 block text-base font-normal text-muted">{selected.description}</span>}</span>
        </span>
        <ChevronDown size={20} className={cn("shrink-0 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")} />
      </Button>
      {open && <div id={listId} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-card border border-line bg-surface-raised p-2 shadow-xl">
        {options.map((option, index) => <div
          key={option.value}
          id={`${listId}-${index}`}
          role="option"
          aria-selected={value === option.value}
          onMouseDown={(event) => event.preventDefault()}
          onMouseMove={() => setActive(index)}
          onClick={() => choose(index)}
          className={cn("flex cursor-pointer items-center gap-3 rounded-card p-3", active === index && "bg-surface", value === option.value ? "text-foreground" : "text-muted")}
        >
          {option.icon && <span className="shrink-0">{option.icon}</span>}
          <span className="min-w-0 flex-1"><span className="block text-base font-medium">{option.label}</span>{option.description && <span className="mt-1 block text-small text-muted">{option.description}</span>}</span>
          {value === option.value && <Check size={18} className="shrink-0" />}
        </div>)}
      </div>}
    </div>
  );
}
