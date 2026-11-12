"use client";

import { useState } from "react";
import { ArrowUpRight, Images, Sparkles } from "lucide-react";

import ReferenceSection from "@/components/ReferenceSection";
import ChoiceCard from "@/components/UI/ChoiceCard";
import SegmentedTabs from "@/components/UI/SegmentedTabs";
import SectionHeading from "@/components/UI/SectionHeading";
import { referenceSections } from "@/data/references";

export default function CreateScreen() {
    const [media, setMedia] = useState<"photo" | "video">("photo");
    const [references, setReferences] = useState(false);

    return (
        <section className="mx-auto max-w-content flex flex-col gap-7 py-4">
            <SectionHeading
                as="h1"
                title="Создать"
                description="Начните с готовой идеи или придумайте свою."
            />
            <div className="max-w-sm">
                <SegmentedTabs
                    value={media}
                    items={[
                        { value: "photo", label: "Фото" },
                        { value: "video", label: "Видео" },
                    ]}
                    onChange={setMedia}
                />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                    title="Готовый референс"
                    description="Выберите образ — остальное уже придумано."
                    icon={<Images size={24} />}
                    selected={references}
                    onClick={() => setReferences(true)}
                    className="min-h-36"
                />
                <ChoiceCard
                    href={`/create/editor?media=${media}`}
                    title="Своя генерация"
                    description={`Опишите идею и настройте ${media === "photo" ? "изображение" : "видео"} в редакторе.`}
                    icon={<Sparkles size={24} />}
                    trailing={<ArrowUpRight size={19} className="shrink-0 text-muted" />}
                    className="min-h-36"
                />
            </div>
            {references && (
                <div className="flex flex-col gap-8">
                    {referenceSections.map((section) => (
                        <ReferenceSection
                            key={`${media}-${section.id}`}
                            section={section}
                            media={media}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
