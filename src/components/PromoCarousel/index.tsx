"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const slides = [
    {
        title: "Образ, который начинается с идеи",
        copy: "Подберите визуальное направление и создайте свой вариант.",
        image: "/images/diony-hero.png",
        position: "center 44%",
    },
    {
        title: "Больше формы. Больше свободы.",
        copy: "Ищите новый визуальный язык среди идей Diony.",
        image: "/images/model-catalog-sprite.png",
        position: "center top",
    },
    {
        title: "От первого кадра до целой истории",
        copy: "Соберите настроение, детали и композицию в одном референсе.",
        image: "/images/diony-hero.png",
        position: "72% 58%",
    },
];

const trackPositions = ["translate-x-0", "-translate-x-1/3", "-translate-x-2/3"];

export default function PromoCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const step = (direction: number) => {
        setActiveIndex((current) => (current + direction + slides.length) % slides.length);
    };

    return (
        <section
            className="group relative w-full max-w-full aspect-[3.43/1] min-h-[248px] overflow-hidden rounded-card bg-surface min-w-0 max-md:aspect-auto max-md:h-[250px] max-md:min-h-[250px]"
            aria-roledescription="карусель"
            aria-label="Подборка Diony"
        >
            <div
                className={`flex h-full w-[300%] transition-transform duration-700 ease-in-out motion-reduce:duration-0 ${trackPositions[activeIndex]}`}
            >
                {slides.map((slide, index) => (
                    <article
                        key={slide.title}
                        className="relative h-full min-w-0 flex-1"
                        aria-hidden={index !== activeIndex}
                    >
                        <Image
                            src={slide.image}
                            alt=""
                            fill
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 960px"
                            className="object-cover"
                            style={{ objectPosition: slide.position }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                        <div className="relative z-10 flex h-full max-w-[34rem] flex-col justify-center px-9 pb-8 pt-8 max-md:px-5">
                            <p className="text-small text-white/70">Diony studio</p>
                            <h2 className="mt-2 text-h1 text-white max-md:text-h2">
                                {slide.title}
                            </h2>
                            <p className="mt-3 max-w-[21rem] text-base text-white/80">
                                {slide.copy}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3">
                <button
                    className="grid size-8 place-items-center rounded-full border border-white/20 bg-black/35 text-white opacity-0 backdrop-blur-md transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                    type="button"
                    aria-label="Предыдущий слайд"
                    onClick={() => step(-1)}
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5" aria-label="Выбрать слайд">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
                            aria-label={`Слайд ${index + 1}`}
                            aria-current={activeIndex === index ? "true" : undefined}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
                <button
                    className="grid size-8 place-items-center rounded-full border border-white/20 bg-black/35 text-white opacity-0 backdrop-blur-md transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                    type="button"
                    aria-label="Следующий слайд"
                    onClick={() => step(1)}
                >
                    <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
}
