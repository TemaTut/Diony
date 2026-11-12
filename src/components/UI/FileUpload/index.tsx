import { ImagePlus } from "lucide-react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string };

export default function FileUpload({ label, className, disabled, ...props }: FileUploadProps) {
  return (
    <label className={cn("flex min-h-36 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-muted/50 bg-surface-raised text-center focus-within:ring-2 focus-within:ring-muted", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-surface", className)}>
      <ImagePlus size={30} className="text-muted" /><span className="text-base font-medium">{label}</span>
      <input {...props} type="file" disabled={disabled} className="sr-only" />
    </label>
  );
}
