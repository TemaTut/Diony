"use client";

import { useEffect, useRef } from "react";

import Button from "@/components/UI/Button";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function ImagePreview({ src, alt, onError, onLoad }: ImagePreviewProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const animations = useRef<Animation[]>([]);
  const closing = useRef(false);
  const previousOverflow = useRef<string | null>(null);

  useEffect(() => () => {
    animations.current.forEach((animation) => animation.cancel());
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
    }
  }, []);

  function open() {
    if (!dialog.current || !image.current || !trigger.current || dialog.current.open) return;
    const from = trigger.current.getBoundingClientRect();
    dialog.current.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const to = image.current.getBoundingClientRect();
    const scale = Math.min(from.width / to.width, from.height / to.height);
    const x = from.left + from.width / 2 - to.left - to.width / 2;
    const y = from.top + from.height / 2 - to.top - to.height / 2;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    const options: KeyframeAnimationOptions = { duration, easing: "ease-in-out", fill: "both" };
    animations.current = [
      dialog.current.animate([{ opacity: 0 }, { opacity: 1 }], options),
      image.current.animate([
        { transform: `translate(${x}px, ${y}px) scale(${scale})` },
        { transform: "translate(0, 0) scale(1)" },
      ], options),
    ];
  }

  async function close() {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    animations.current.forEach((animation) => animation.reverse());
    await Promise.allSettled(animations.current.map((animation) => animation.finished));
    dialog.current?.close();
    animations.current.forEach((animation) => animation.cancel());
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    closing.current = false;
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <Button ref={trigger} variant="surface" className="aspect-square w-full cursor-zoom-in overflow-hidden border-0 bg-surface-raised p-0" aria-label="Открыть фото на весь экран" aria-haspopup="dialog" onClick={open}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} referrerPolicy="no-referrer" onLoad={onLoad} onError={onError} className="size-full object-contain" />
      </Button>
      <dialog ref={dialog} aria-label="Просмотр фото. Нажмите на фото, чтобы закрыть" className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-black/80 p-4 backdrop:bg-transparent" onCancel={(event) => { event.preventDefault(); void close(); }}>
        <Button variant="surface" className="size-full cursor-zoom-out rounded-none border-0 bg-transparent p-0 hover:bg-transparent" aria-label="Закрыть фото" onClick={() => void close()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={image} src={src} alt={alt} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
        </Button>
      </dialog>
    </>
  );
}
