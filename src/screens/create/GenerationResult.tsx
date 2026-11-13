"use client";

import { useState } from "react";

import { useGenerationPhoto, useGenerationResult } from "@/api/generations/hooks";
import { generationErrorMessage } from "@/api/generations/generations";
import Button from "@/components/UI/Button";
import ImagePreview from "@/components/UI/ImagePreview";
import Loader from "@/components/UI/Loader";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import Skeleton from "@/components/UI/Skeleton";

export default function GenerationResult({ id, query }: { id: string; query: ReturnType<typeof useGenerationResult> }) {
  const { data, isError, error, isFetching, refetch } = query;
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const pending = !isError && (!data || ["pending", "processing"].includes(data.status));
  const completed = data?.status === "completed";
  const photo = useGenerationPhoto(completed ? data.result_url : null);
  const [sharing, setSharing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function savePhoto() {
    if (!photo.data || sharing) return;
    setSaveMessage(null);
    const files = [photo.data];
    if (!navigator.canShare?.({ files })) {
      setSaveMessage("Нажмите и удерживайте фото выше, затем выберите «Сохранить изображение» или «Добавить в Фото». Если пункта нет, откройте страницу в Safari или Chrome.");
      return;
    }
    setSharing(true);
    try {
      // The file is prepared before the click to preserve user activation.
      await navigator.share({ files });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setSaveMessage("Не удалось открыть меню сохранения. Нажмите и удерживайте фото выше и выберите сохранение изображения.");
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <Paper className="flex flex-col gap-4 p-5 sm:p-6" aria-busy={pending}>
      <SectionHeading title="Результат" />
      <p className="text-caption text-quiet">ID: {id}</p>
      {pending && <>
        <div role="status" className="flex items-center gap-2 text-base text-muted"><Loader size={18} />Создаём изображение…</div>
        <Skeleton className="aspect-square w-full" />
      </>}
      {isError && <div className="flex flex-col gap-3">
        <p role="alert" className="text-base text-danger">Не удалось получить результат. {generationErrorMessage(error)}</p>
        <Button variant="secondary" isLoading={isFetching} onClick={() => void refetch()}>Проверить результат</Button>
      </div>}
      {!isError && data?.status === "failed" && <p role="alert" className="text-base text-danger">Не удалось выполнить генерацию. Попробуйте создать новую.</p>}
      {completed && data.result_url && <>
        <ImagePreview src={data.result_url} alt="Результат генерации" onError={() => setFailedImage(data.result_url)} />
        {failedImage === data.result_url && <p role="alert" className="text-base text-danger">Не удалось показать изображение. Попробуйте нажать «Сохранить фото».</p>}
        <Button isLoading={photo.isFetching || sharing} disabled={!photo.data && !photo.isError} onClick={() => photo.isError ? void photo.refetch() : void savePhoto()}>Сохранить фото</Button>
        {photo.isError && <p role="alert" className="text-base text-danger">Не удалось подготовить фото. Нажмите «Сохранить фото», чтобы повторить.</p>}
        {saveMessage && <p role="status" className="text-base text-muted">{saveMessage}</p>}
      </>}
    </Paper>
  );
}
