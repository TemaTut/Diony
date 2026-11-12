import type { ReactNode } from "react";

import EntryAnimation from "@/components/EntryAnimation";

export default function EntryLayout({ children }: { children: ReactNode }) {
    return <EntryAnimation>{children}</EntryAnimation>;
}
