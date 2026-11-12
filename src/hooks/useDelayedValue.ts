import { useEffect, useState } from "react";

export default function useDelayedValue<T>(value: T | undefined, delay = 400) {
    const [delayedValue, setDelayedValue] = useState<T>();

    useEffect(() => {
        if (value === undefined) return;

        const timeout = window.setTimeout(() => setDelayedValue(value), delay);

        return () => window.clearTimeout(timeout);
    }, [delay, value]);

    return delayedValue;
}
