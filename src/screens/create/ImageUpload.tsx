"use client";

import { ImageIcon, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";

import { IMAGE_ACCEPT, IMAGE_MIME_TYPES, MAX_IMAGES, MAX_IMAGE_BYTES, type GenerationImage } from "@/api/generations/types";
import FileUpload from "@/components/UI/FileUpload";
import Paper from "@/components/UI/Paper";
import IconButton from "@/components/UI/IconButton";
import SectionHeading from "@/components/UI/SectionHeading";

type ImageUploadProps = {
  images: GenerationImage[];
  onChange: Dispatch<SetStateAction<GenerationImage[]>>;
  disabled?: boolean;
};

export default function ImageUpload({ images, onChange, disabled }: ImageUploadProps) {
  const [error, setError] = useState("");
  const [unavailablePreviews, setUnavailablePreviews] = useState<Set<string>>(() => new Set());
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const currentUrls = urls.current;
    return () => currentUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const additions: GenerationImage[] = [];
    const errors: string[] = [];
    for (const file of files) {
      if (images.length + additions.length >= MAX_IMAGES) { errors.push("Можно добавить не больше 14 изображений."); break; }
      const allowedExtension = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
      const allowedType = IMAGE_MIME_TYPES.includes(file.type.toLowerCase());
      if (!allowedType && !((!file.type || file.type === "application/octet-stream") && allowedExtension)) {
        errors.push(`«${file.name}»: используйте PNG, JPEG, WebP, HEIC или HEIF.`);
        continue;
      }
      if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
        errors.push(`«${file.name}»: файл должен быть непустым и не больше 7 МБ.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      additions.push({ url, name: file.name, file });
    }
    setError(errors.join(" "));
    onChange((previous) => [...previous, ...additions]);
  }

  function removeImage(image: GenerationImage) {
    if (urls.current.has(image.url)) {
      URL.revokeObjectURL(image.url);
      urls.current.delete(image.url);
    }
    onChange((previous) => previous.filter((item) => item !== image));
  }

  return (
    <Paper className="flex flex-col gap-4 border-0 p-5 sm:p-6">
      <SectionHeading title="Изображения"><span className="text-base text-muted">{images.length} / {MAX_IMAGES}</span></SectionHeading>
      <p className="text-lead">Выберите фото</p>
      {images.length > 0 && <div className="grid grid-cols-4 gap-2">{images.map((image, index) => <div key={`${image.url}-${index}`} className="relative aspect-square overflow-hidden rounded-card bg-surface-raised">
        {unavailablePreviews.has(image.url) ? (
          <div className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center" title={image.name}>
            <ImageIcon size={22} className="text-muted" />
            <span className="w-full truncate text-caption text-muted">{image.name}</span>
          </div>
        ) : (
          // HEIC/HEIF files remain valid even when this browser cannot render a preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.name} className="size-full object-cover" onError={() => setUnavailablePreviews((previous) => new Set(previous).add(image.url))} />
        )}
        <IconButton className="absolute right-1 top-1 size-7" disabled={disabled} aria-label={`Удалить ${image.name}`} onClick={() => removeImage(image)}><X size={14} /></IconButton>
      </div>)}</div>}
      <FileUpload label="Добавить из галереи" accept={IMAGE_ACCEPT} multiple disabled={disabled || images.length >= MAX_IMAGES} onChange={selectFiles} />
      <p className="text-small text-quiet">До {MAX_IMAGES} файлов · до 7 МБ каждый · PNG, JPEG, WebP, HEIC, HEIF</p>
      {error && <p role="alert" className="text-small text-danger">{error}</p>}
    </Paper>
  );
}
