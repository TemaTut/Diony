"use client";

import { useEffect, useState } from "react";

const KEYBOARD_THRESHOLD = 150;

function isEditableElement(element: Element | null) {
    return (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        (element instanceof HTMLElement && element.isContentEditable)
    );
}

export function useKeyboardOpen() {
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    useEffect(() => {
        const viewport = window.visualViewport;

        const handleFocusIn = (event: FocusEvent) => {
            if (isEditableElement(event.target as Element)) {
                setKeyboardOpen(true);
            }
        };

        const handleFocusOut = () => {
            setTimeout(() => {
                if (!isEditableElement(document.activeElement)) {
                    setKeyboardOpen(false);
                }
            }, 100);
        };

        const handleViewportChange = () => {
            if (!viewport) return;

            const difference = window.innerHeight - viewport.height;

            if (difference > KEYBOARD_THRESHOLD) {
                setKeyboardOpen(true);
            } else if (!isEditableElement(document.activeElement)) {
                setKeyboardOpen(false);
            }
        };

        handleViewportChange();

        document.addEventListener("focusin", handleFocusIn);
        document.addEventListener("focusout", handleFocusOut);

        viewport?.addEventListener("resize", handleViewportChange);
        viewport?.addEventListener("scroll", handleViewportChange);

        return () => {
            document.removeEventListener("focusin", handleFocusIn);
            document.removeEventListener("focusout", handleFocusOut);

            viewport?.removeEventListener("resize", handleViewportChange);
            viewport?.removeEventListener("scroll", handleViewportChange);
        };
    }, []);

    return keyboardOpen;
}