"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Clock3, Compass, House, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

const links = [
    { href: "/", label: "Главная", Icon: House },
    { href: "/trends", label: "Тренды", Icon: Compass },
    { href: "/create", label: "Создать", Icon: Sparkles },
    { href: "/history", label: "История", Icon: Clock3 },
    { href: "/profile", label: "Профиль", Icon: UserRound },
] as const;

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
    const bevel = Math.min(20, radius * 0.55);

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
                const strength = 0.42 * t * t;

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

export default function MobileNavigation() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);

    const uniqueId = useId().replace(/:/g, "");
    const navId = `mobile-glass-${uniqueId}`;
    const filterId = `mobile-lens-${uniqueId}`;

    const [lensMap, setLensMap] = useState<string | null>(null);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        let lastWidth = 0;
        let lastHeight = 0;

        const updateLens = () => {
            const { width, height } = nav.getBoundingClientRect();

            const w = Math.round(width);
            const h = Math.round(height);

            if (!w || !h) return;
            if (w === lastWidth && h === lastHeight) return;

            lastWidth = w;
            lastHeight = h;

            setLensMap(createLensMap(w, h));
        };

        updateLens();

        const observer = new ResizeObserver(updateLens);
        observer.observe(nav);

        return () => observer.disconnect();
    }, []);

    return (
        <nav
            ref={navRef}
            id={navId}
            data-refraction={lensMap ? "ready" : "pending"}
            className={cn(
                "fixed inset-x-3 z-30 isolate",
                "bottom-[max(12px,env(safe-area-inset-bottom))]",
                "hidden min-h-[76px] grid-cols-5 items-center",
                "overflow-hidden rounded-full p-2",
                "max-md:grid",
            )}
            aria-label="Основная навигация"
        >
            {/* Оптическое преломление */}
            <svg
                className="pointer-events-none absolute size-0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-25%"
                        y="-25%"
                        width="150%"
                        height="150%"
                        colorInterpolationFilters="sRGB"
                    >
                        {lensMap && (
                            <>
                                <feImage
                                    href={lensMap}
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    preserveAspectRatio="none"
                                    result="lensMap"
                                />

                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="lensMap"
                                    scale="32"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </>
                        )}
                    </filter>
                </defs>
            </svg>

            {/* Преломление в Chromium, fallback в Safari/Firefox */}
            <style>{`
                @supports (-webkit-app-region: inherit) {
                    #${navId}[data-refraction="ready"] .liquid-glass-surface {
                        -webkit-backdrop-filter:
                            url("#${filterId}")
                            blur(2px)
                            saturate(1.65);

                        backdrop-filter:
                            url("#${filterId}")
                            blur(2px)
                            saturate(1.65);
                    }
                }
            `}</style>

            {/* Основная стеклянная поверхность */}
            <div
                aria-hidden="true"
                className={cn(
                    "liquid-glass-surface",
                    "pointer-events-none absolute inset-0 rounded-full",
                    "bg-white/[0.09]",
                    "backdrop-blur-xl backdrop-saturate-150",
                )}
            />

            {/* Мягкое отражение сверху */}
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-[1px] rounded-full",
                    "bg-gradient-to-b",
                    "from-white/[0.18]",
                    "via-white/[0.035]",
                    "to-transparent",
                )}
            />

            {/* Направленный световой блик */}
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-full",
                    "bg-[radial-gradient(ellipse_at_25%_0%,rgba(255,255,255,0.23),transparent_60%)]",
                )}
            />

            {/* Оптический ободок и внутренние отражения */}
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-full",
                    "border border-white/35",
                    "shadow-[0_12px_32px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-1px_0_rgba(255,255,255,0.16)]",
                )}
            />

            {/* Тонкий нижний блик */}
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-8 bottom-[1px] h-px",
                    "bg-gradient-to-r from-transparent via-white/35 to-transparent",
                )}
            />

            {/* Навигация */}
            {links.map(({ href, label, Icon }) => {
                const active =
                    href === "/"
                        ? pathname === href
                        : href === "/profile"
                          ? pathname.startsWith("/profile") ||
                            pathname.startsWith("/settings") ||
                            pathname.startsWith("/partnership")
                          : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "relative z-10",
                            "flex min-h-14 min-w-0 flex-col",
                            "items-center justify-center gap-1",
                            "rounded-full px-1 py-2",
                            "text-caption",
                            "transition-all duration-300 ease-out",
                            "active:scale-95",
                            active
                                ? cn(
                                      "bg-white/[0.20] text-white",
                                      "ring-1 ring-inset ring-white/30",
                                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.30),0_2px_12px_rgba(255,255,255,0.08)]",
                                  )
                                : cn("text-white/70", "hover:bg-white/10", "hover:text-white"),
                        )}
                    >
                        <Icon
                            size={21}
                            strokeWidth={active ? 2 : 1.8}
                            aria-hidden="true"
                            className={cn(
                                "transition-transform duration-300",
                                active && "scale-105",
                                href === "/create" && "rounded-lg bg-accent p-0.5 text-background",
                            )}
                        />

                        <span className="relative z-10">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
