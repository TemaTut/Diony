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
    if (sharing || !data?.result_url) return;
    setSaveMessage(null);
    setSharing(true);
    try {
      // Web Share must run during the click, with the image already prepared.
      if (photo.data && navigator.share && navigator.canShare?.({ files: [photo.data] })) {
        await navigator.share({ files: [photo.data] });
        return;
      }
      if (!photo.data) {
        const result = await photo.refetch();
        setSaveMessage(result.data
          ? "Фото подготовлено. Нажмите «Сохранить фото», чтобы открыть системное меню."
          : "Не удалось подготовить фото для сохранения. Повторите попытку.");
        return;
      }
      setSaveMessage("Этот встроенный браузер не поддерживает системное меню для сохранения фото. Нажмите и удерживайте изображение: если доступен пункт «Сохранить изображение», выберите его.");
    } catch (error) {
      setSaveMessage(error instanceof DOMException && error.name === "AbortError"
        ? "Сохранение отменено."
        : `Не удалось открыть системное меню фото: ${error instanceof Error ? `${error.name}: ${error.message}` : "неизвестная ошибка"}`);
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
        <ImagePreview src={data.result_url} alt="Результат генерации" onLoad={() => setFailedImage(null)} onError={() => setFailedImage(data.result_url)} />
        {failedImage === data.result_url && <p role="alert" className="text-base text-danger">Не удалось показать изображение. Попробуйте нажать «Сохранить фото».</p>}
        <Button isLoading={sharing || (!photo.data && photo.isFetching)} onClick={() => void savePhoto()}>Сохранить фото</Button>
        {saveMessage && <p role="status" className="text-base text-muted">{saveMessage}</p>}
      </>}
    </Paper>
  );
}
