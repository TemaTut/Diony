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
import { Telegram } from "@/lib/telegram";

export default function GenerationResult({ id, query }: { id: string; query: ReturnType<typeof useGenerationResult> }) {
  const { data, isError, error, isFetching, refetch } = query;
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const pending = !isError && (!data || ["pending", "processing"].includes(data.status));
  const completed = data?.status === "completed";
  const photo = useGenerationPhoto(completed ? data.result_url : null);
  const [sharing, setSharing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [useBrowser, setUseBrowser] = useState(false);

  function openPhotoInBrowser() {
    if (!data?.result_url) return;
    const url = new URL("/api/generations/download", window.location.origin);
    url.searchParams.set("url", data.result_url);
    url.searchParams.set("inline", "1");
    setSaveMessage("В открывшемся изображении нажмите и удерживайте фото, затем выберите «Сохранить изображение» или «Добавить в Фото».");
    try {
      if (Telegram.openLink.isAvailable()) {
        Telegram.openLink(url.href);
        return;
      }
    } catch {
      // Outside Telegram, use the browser's normal image viewer.
    }
    const viewer = window.open(url.href, "_blank");
    if (viewer) {
      viewer.opener = null;
    } else {
      window.location.assign(url.href);
    }
  }

  function handleSave() {
    if (sharing) return;
    setSaveMessage(null);
    if (useBrowser || !photo.data || !navigator.share || !navigator.canShare?.({ files: [photo.data] })) {
      openPhotoInBrowser();
      return;
    }
    void savePhoto();
  }

  async function savePhoto() {
    if (!photo.data || sharing) return;
    setSaveMessage(null);
    const files = [photo.data];
    setSharing(true);
    try {
      // The file is prepared before the click to preserve user activation.
      await navigator.share({ files });
    } catch (error) {
      setUseBrowser(true);
      setSaveMessage(error instanceof DOMException && error.name === "AbortError"
        ? "Сохранение отменено или меню недоступно. Нажмите «Сохранить фото», чтобы открыть изображение в браузере и сохранить его удержанием."
        : "Меню сохранения недоступно. Нажмите «Сохранить фото», чтобы открыть изображение в браузере и сохранить его удержанием.");
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
        <Button isLoading={sharing} onClick={handleSave}>Сохранить фото</Button>
        {saveMessage && <p role="status" className="text-base text-muted">{saveMessage}</p>}
      </>}
    </Paper>
  );
}
