"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import FileUpload from "@/components/UI/FileUpload";
import Paper from "@/components/UI/Paper";
import IconButton from "@/components/UI/IconButton";
import SectionHeading from "@/components/UI/SectionHeading";
import type { Reference } from "@/data/references";

type UploadedImage = Reference["images"][number];
const MAX_IMAGES = 8;

export default function ImageUpload({ initialImages = [] }: { initialImages?: UploadedImage[] }) {
  const [images, setImages] = useState<UploadedImage[]>(() => initialImages.slice(0, MAX_IMAGES));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const urls = useRef(new Set<string>());
  const count = useRef(images.length);
  useEffect(() => {
    const currentUrls = urls.current;
    return () => currentUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        if (count.current >= MAX_IMAGES) { setError("Можно добавить не больше 8 изображений."); break; }
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 20 * 1024 * 1024) {
          setError("Выберите JPG, PNG или WebP размером до 20 МБ.");
          continue;
        }
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.src = url;
        try {
          await image.decode();
          if (Math.min(image.width, image.height) < 128 || Math.max(image.width, image.height) > 8192) throw new Error();
          urls.current.add(url);
          count.current += 1;
          setImages((previous) => [...previous, { url, name: file.name }]);
        } catch {
          URL.revokeObjectURL(url);
          setError("Размер каждой стороны должен быть от 128 до 8192 пикселей. Используйте JPG, PNG или WebP.");
        }
      }
    } finally {
      setUploading(false);
    }
  }

  function removeImage(image: UploadedImage) {
    if (urls.current.has(image.url)) {
      URL.revokeObjectURL(image.url);
      urls.current.delete(image.url);
    }
    count.current -= 1;
    setImages((previous) => previous.filter((item) => item !== image));
  }

  return (
    <Paper className="space-y-4 border-0 p-5 sm:p-6">
      <SectionHeading title="Изображения"><span className="text-base text-muted">{images.length} / {MAX_IMAGES}</span></SectionHeading>
      <p className="text-lead">Выберите фото</p>
      {images.length > 0 && <div className="grid grid-cols-4 gap-2">{images.map((image, index) => <div key={`${image.url}-${index}`} className="relative aspect-square overflow-hidden rounded-card bg-surface-raised">
        {/* Local file previews and bundled reference assets do not need image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.name} className="size-full object-cover" />
        <IconButton className="absolute right-1 top-1 size-7" disabled={uploading} aria-label={`Удалить ${image.name}`} onClick={() => removeImage(image)}><X size={14} /></IconButton>
      </div>)}</div>}
      <FileUpload label={uploading ? "Проверяем изображения…" : "Добавить из галереи"} accept="image/jpeg,image/png,image/webp" multiple disabled={uploading || images.length >= MAX_IMAGES} onChange={upload} />
      <p className="text-small text-quiet">До 8 файлов · до 20 МБ каждый · от 128×128 до 8192×8192 px</p>
      {error && <p role="alert" className="text-small text-danger">{error}</p>}
    </Paper>
  );
}
