import Link from "next/link";
import type { Route } from "next";

import Tag from "@/components/UI/Tag";
import type { Reference } from "@/data/references";

export default function ReferenceCard({ item, media = "photo" }: { item: Reference; media?: "photo" | "video" }) {
  return (
    <Link
      href={`/create/editor?reference=${item.id}&media=${media}` as Route}
      className="group relative block aspect-[0.78] min-w-0 snap-start overflow-hidden rounded-card bg-surface outline-none transition duration-300 hover:scale-[1.025] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Использовать референс «${item.title}»`}
    >
      <div
        role="img"
        aria-label={item.title}
        className="absolute inset-0 bg-cover bg-no-repeat transition duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: item.position,
          backgroundSize: item.image.endsWith("model-catalog-sprite.png")
            ? "200% 200%"
            : "cover",
        }}
      />
      <div className="absolute inset-x-2 top-2 flex justify-end gap-1.5">
        {item.tags.map((tag, index) => (
          <Tag key={tag} variant={index === 0 ? "glass" : "muted"}>
            {tag}
          </Tag>
        ))}
      </div>
    </Link>
  );
}
