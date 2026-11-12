import { LoaderCircle } from "lucide-react";

interface LoaderProps {
    size?: number;
    className?: string;
}

export default function Loader({ size = 24, className }: LoaderProps) {
    return (
        <LoaderCircle size={size} className={`animate-spin text-accent ${className ?? ""}`} />
    );
}
