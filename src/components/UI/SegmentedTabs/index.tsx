import { cn } from "@/utils/cn";

interface SegmentedTabsProps<T extends string> {
  value: T;
  items: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

export default function SegmentedTabs<T extends string>({ value, items, onChange }: SegmentedTabsProps<T>) {
  return (
    <div role="group" className="grid rounded-shell bg-surface p-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => <button type="button" aria-pressed={value === item.value} key={item.value} onClick={() => onChange(item.value)} className={cn("rounded-card px-3 py-2 text-center text-small transition", value === item.value ? "bg-accent text-background" : "text-muted hover:text-foreground")}>{item.label}</button>)}
    </div>
  );
}
