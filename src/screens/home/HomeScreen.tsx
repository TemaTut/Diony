import PromoCarousel from "@/components/PromoCarousel";
import ReferenceSection from "@/components/ReferenceSection";
import { referenceSections } from "@/data/references";
import SectionHeading from "@/components/UI/SectionHeading";

export default function HomeScreen() {
    return (
        <div className="mx-auto grid w-full min-w-0 max-w-content grid-cols-1 gap-8 pb-8">
            <PromoCarousel />
            <section aria-labelledby="references-title" className="space-y-6">
                <SectionHeading
                    id="references-title"
                    title="Референсы"
                    description="Выберите направление и начните создавать."
                />
                <div className="space-y-8">
                    {referenceSections.map((section) => (
                        <ReferenceSection key={section.id} section={section} />
                    ))}
                </div>
            </section>
        </div>
    );
}
