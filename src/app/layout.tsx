import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import QueryProvider from "@/components/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
    title: "Diony",
    description: "Откройте инструменты для идей, изображений, видео и музыки.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="ru" data-scroll-behavior="smooth">
            <body>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
