"use client";

import { useGenerationResult } from "@/api/generations/hooks";
import { generationErrorMessage } from "@/api/generations/generations";
import Button from "@/components/UI/Button";
import ButtonLink from "@/components/UI/ButtonLink";
import Loader from "@/components/UI/Loader";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import Skeleton from "@/components/UI/Skeleton";

export default function GenerationResult({ id, query }: { id: string; query: ReturnType<typeof useGenerationResult> }) {
  const { data, isError, error, isFetching, refetch } = query;
  const pending = !isError && (!data || data.status === "pending");
  const completed = data?.status === "completed";

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
        <div className="aspect-square w-full overflow-hidden rounded-card bg-surface-raised">
          {/* Backend result URLs can belong to different image storage providers. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.result_url} alt="Результат генерации" className="size-full object-contain" />
        </div>
        <ButtonLink href={data.result_url} target="_blank" rel="noopener noreferrer">Открыть оригинал</ButtonLink>
      </>}
    </Paper>
  );
}
