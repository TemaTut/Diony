import Link from "next/link";

import { cn } from "@/utils/cn";

const sizes = {
  mobile: "text-h2",
  desktop: "self-start px-2 text-h1",
};

export default function BrandLogo({ size = "desktop" }: { size?: keyof typeof sizes }) {
  return (
    <Link href="/" aria-label="Diony — главная" data-entry-logo className={cn("inline-block shrink-0 italic tracking-brand text-foreground", sizes[size])}>
      Diony
    </Link>
  );
}
