"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const ENTRY_DURATION_MS = 2_600;
const CONTENT_REVEAL_OFFSET = 0.65;
const START_SCALE = 2;

export default function EntryAnimation({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    let disposed = false;
    let logo: HTMLElement | undefined;
    const animations: Animation[] = [];
    const previousContentVisibility = content.style.visibility;
    let previousVisibility = "";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const finish = () => {
      if (disposed) return;
      disposed = true;
      // Preserve the visible final state before removing animation effects.
      content.style.visibility = "visible";
      animations.forEach((animation) => animation.cancel());
      setEntered(true);
    };

    async function run() {
      if (motion.matches) { finish(); return; }
      await document.fonts.ready;
      if (disposed || !content) return;

      logo = Array.from(content.querySelectorAll<HTMLElement>("[data-entry-logo]"))
        .find((element) => element.getBoundingClientRect().width > 0);
      if (!logo) { finish(); return; }

      const bounds = logo.getBoundingClientRect();
      const x = window.innerWidth / 2 - (bounds.left + bounds.width / 2);
      const y = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
      const scale = Math.min(START_SCALE, window.innerWidth * 0.75 / bounds.width);
      const start = `translate(${x}px, ${y}px) scale(${scale})`;

      previousVisibility = logo.style.visibility;
      const animation = logo.animate([
        { opacity: 0, transform: start, offset: 0, easing: "ease-out" },
        { opacity: 1, transform: start, offset: 0.2 },
        { opacity: 1, transform: start, offset: CONTENT_REVEAL_OFFSET, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
        { opacity: 1, transform: "none", offset: 1 },
      ], { duration: ENTRY_DURATION_MS, fill: "both" });
      animations.push(animation);

      const delay = ENTRY_DURATION_MS * CONTENT_REVEAL_OFFSET;
      const duration = ENTRY_DURATION_MS - delay;
      // Fade sibling branches along the logo's ancestry. No fading ancestor
      // contains the logo itself, so its opacity and rendering stay unchanged.
      let branch: HTMLElement = logo;
      while (branch !== content && branch.parentElement) {
        for (const sibling of branch.parentElement.children) {
          if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
          animations.push(sibling.animate([
            { opacity: 0 },
            { opacity: getComputedStyle(sibling).opacity },
          ], { delay, duration, easing: "ease-in-out", fill: "both" }));
        }
        branch = branch.parentElement;
      }
      animations.push(content.animate([
        { visibility: "visible" },
        { visibility: "visible" },
      ], { delay, duration: 1, fill: "forwards" }));
      // Reveal only this existing navigation logo during the intro.
      logo.style.visibility = "visible";
      await Promise.all(animations.map((effect) => effect.finished));
      finish();
    }

    void run().catch(finish);
    window.addEventListener("resize", finish, { once: true });
    window.addEventListener("scroll", finish, { once: true, passive: true });
    motion.addEventListener("change", finish);
    return () => {
      disposed = true;
      window.removeEventListener("resize", finish);
      window.removeEventListener("scroll", finish);
      motion.removeEventListener("change", finish);
      animations.forEach((animation) => animation.cancel());
      content.style.visibility = previousContentVisibility;
      if (logo) logo.style.visibility = previousVisibility;
    };
  }, []);

  return (
    <div ref={contentRef} inert={!entered} aria-busy={!entered} className={entered ? undefined : "invisible"}>
      {children}
    </div>
  );
}
