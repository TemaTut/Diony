export default function LiquidGlass() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]">
      <div className="absolute inset-0 rounded-[inherit] bg-accent/[0.025] backdrop-blur-glass backdrop-saturate-200 backdrop-contrast-125" />
      <div className="absolute inset-0 rounded-[inherit] bg-glass-sheen" />
      <div className="absolute inset-0 rounded-[inherit] border border-accent/35 shadow-glass-edge" />
      <div className="absolute inset-[3px] rounded-[inherit] border border-accent/10" />
      <div className="absolute inset-x-8 top-0 h-px bg-glass-highlight" />
      <div className="absolute inset-x-10 bottom-0 h-px bg-glass-highlight opacity-60" />
    </div>
  );
}
