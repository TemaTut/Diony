"use client";

import { ImagePlus } from "lucide-react";
import { useState, type DragEvent, type InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  label: string;
  onFiles: (files: File[]) => void;
};

export default function FileUpload({ label, className, disabled, multiple, onFiles, ...props }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = disabled ? "none" : "copy";
    setDragging(!disabled);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled || !event.dataTransfer.files.length) return;

    const files = Array.from(event.dataTransfer.files);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <label
      className={cn(
        "flex min-h-36 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-muted/50 bg-surface-raised text-center focus-within:ring-2 focus-within:ring-muted",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-surface",
        dragging && !disabled && "ring-2 ring-muted",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <ImagePlus size={30} className="text-muted" />
      <span className="text-base font-medium">{label}</span>
      <input
        {...props}
        type="file"
        disabled={disabled}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </label>
  );
}
