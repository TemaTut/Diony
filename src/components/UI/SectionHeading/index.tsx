import type { ReactNode } from "react";

export default function SectionHeading({
    title,
    description,
    children,
    id,
    as: Heading = "h2",
}: {
    title: string;
    description?: string;
    children?: ReactNode;
    id?: string;
    as?: "h1" | "h2" | "h3";
}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <Heading
                    id={id}
                    className={
                        Heading === "h1"
                            ? "text-h1 text-foreground max-md:text-h2"
                            : "text-h2 text-foreground"
                    }
                >
                    {title}
                </Heading>
                {description && <p className="mt-1 text-small text-muted">{description}</p>}
            </div>
            {children}
        </div>
    );
}
