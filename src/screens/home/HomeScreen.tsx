import PromoCarousel from "@/components/PromoCarousel";
import ReferenceSection from "@/components/ReferenceSection";
import { referenceSections } from "@/data/references";

export default function HomeScreen() {
    return (
        <div className="mx-auto grid w-full min-w-0 max-w-content grid-cols-1 gap-8 pb-8">
            <PromoCarousel />
            <section aria-labelledby="references-title" className="flex flex-col gap-6">
                <div className="flex flex-col gap-8">
                    {referenceSections.map((section) => (
                        <ReferenceSection key={section.id} section={section} />
                    ))}
                </div>
            </section>
        </div>
    );
}
