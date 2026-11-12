"use client";

import { useEffect, useId, useRef, useState } from "react";

// Карта преломления: искажает фон вдоль краёв стекла.
function createLensMap(width: number, height: number): string | null {
  const w = Math.round(width);
  const h = Math.round(height);

  if (w <= 0 || h <= 0) return null;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(w, h);
  const pixels = image.data;

  const radius = Math.min(w, h) / 2;
  const centerY = h / 2;
  const bevel = Math.min(28, radius * 0.8);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;

      const px = x + 0.5;
      const py = y + 0.5;

      const nearestX = Math.max(radius, Math.min(w - radius, px));

      const dx = px - nearestX;
      const dy = py - centerY;

      const length = Math.hypot(dx, dy);
      const distance = radius - length;

      let red = 128;
      let green = 128;

      if (distance >= 0 && distance < bevel && length > 0) {
        const t = 1 - distance / bevel;
        const strength = 0.8 * t * t;

        red += (dx / length) * strength * 127;
        green += (dy / length) * strength * 127;
      }

      pixels[i] = Math.round(red);
      pixels[i + 1] = Math.round(green);
      pixels[i + 2] = 128;
      pixels[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  return canvas.toDataURL("image/png");
}


export default function LiquidGlass() {
  const ref = useRef<HTMLDivElement>(null);
  const filterId = `liquid-glass-${useId().replace(/:/g, "")}`;
  const [lensMap, setLensMap] = useState<string | null>(null);

  useEffect(() => {
    const surface = ref.current;
    // Safari cannot apply SVG displacement to a backdrop. Keep its clear
    // CSS glass treatment and avoid generating an unused canvas there.
    if (!surface || !CSS.supports("-webkit-app-region", "inherit")) return;
    let lastWidth = 0;
    let lastHeight = 0;
    const update = () => {
      const width = Math.round(surface.clientWidth);
      const height = Math.round(surface.clientHeight);
      if (!width || !height || (width === lastWidth && height === lastHeight)) return;
      lastWidth = width;
      lastHeight = height;
      setLensMap(createLensMap(width, height));
    };
    const observer = new ResizeObserver(update);
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);

  // Only the SVG reference is dynamic; the Safari appearance uses Tailwind.
  const refraction = lensMap ? `url("#${filterId}") blur(0.8px) saturate(1.9) contrast(1.08)` : undefined;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]">
      {lensMap && <svg className="absolute size-0" focusable="false">
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feImage href={lensMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="lensMap" />
            <feDisplacementMap in="SourceGraphic" in2="lensMap" scale="58" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>}
      <div
        className="absolute inset-0 rounded-[inherit] bg-accent/[0.025] backdrop-blur-glass backdrop-saturate-200 backdrop-contrast-125"
        style={refraction ? { backdropFilter: refraction, WebkitBackdropFilter: refraction } : undefined}
      />
      <div className="absolute inset-0 rounded-[inherit] bg-glass-sheen" />
      <div className="absolute inset-0 rounded-[inherit] border border-accent/35 shadow-glass-edge" />
      <div className="absolute inset-[3px] rounded-[inherit] border border-accent/10" />
      <div className="absolute inset-x-8 top-0 h-px bg-glass-highlight" />
      <div className="absolute inset-x-10 bottom-0 h-px bg-glass-highlight opacity-60" />
    </div>
  );
}
