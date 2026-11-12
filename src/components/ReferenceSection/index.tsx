"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import ReferenceCard from "@/components/ReferenceCard";
import IconButton from "@/components/UI/IconButton";
import SectionHeading from "@/components/UI/SectionHeading";
import type { ReferenceSection as ReferenceSectionData } from "@/data/references";

export default function ReferenceSection({ section, media = "photo" }: { section: ReferenceSectionData; media?: "photo" | "video" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 2);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const frame = window.requestAnimationFrame(updateControls);
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    if (!card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby={`${section.id}-title`} className="flex flex-col gap-3">
      <SectionHeading id={`${section.id}-title`} title={section.title} description={section.description}>
        <div className="flex shrink-0 gap-2">
          <IconButton
            type="button"
            aria-label={`Прокрутить ${section.title} назад`}
            onClick={() => scroll(-1)}
            disabled={!canScrollBack}
          >
            <ArrowLeft size={17} />
          </IconButton>
          <IconButton
            type="button"
            aria-label={`Прокрутить ${section.title} вперёд`}
            onClick={() => scroll(1)}
            disabled={!canScrollForward}
          >
            <ArrowRight size={17} />
          </IconButton>
        </div>
      </SectionHeading>
      <div
        ref={trackRef}
        className="-my-2 flex snap-x snap-mandatory gap-3 overflow-x-auto py-2 scroll-smooth motion-reduce:scroll-auto"
      >
        {section.items.map((item) => (
          <div
            key={item.id}
            className="min-w-0 flex-none basis-[calc((100%_-_2.25rem)/4)] max-lg:basis-[calc((100%_-_1.5rem)/3)] max-md:basis-[calc((100%_-_0.75rem)/2)]"
          >
            <ReferenceCard item={item} media={media} />
          </div>
        ))}
      </div>
    </section>
  );
}
