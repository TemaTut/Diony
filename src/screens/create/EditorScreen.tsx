"use client";

import { ArrowLeft, ChevronDown, Maximize, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  useCreateGeneration,
  useCreateNsfwGeneration,
  useGenerationModels,
  useGenerationResult,
} from "@/api/generations/hooks";
import { generationErrorMessage } from "@/api/generations/generations";
import type { GenerationImage } from "@/api/generations/types";
import GenerationResult from "@/screens/create/GenerationResult";

import Button from "@/components/UI/Button";
import ButtonLink from "@/components/UI/ButtonLink";
import IconButton from "@/components/UI/IconButton";
import Modal from "@/components/UI/Modal";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import Select from "@/components/UI/Select";
import Skeleton from "@/components/UI/Skeleton";
import Textarea from "@/components/UI/Textarea";
import Toggle from "@/components/UI/Toggle";
import { referenceSections } from "@/data/references";
import FrameFormatPicker from "@/screens/create/FrameFormatPicker";
import { mapFrameFormats } from "@/screens/create/frameFormats";
import ImageUpload from "@/screens/create/ImageUpload";
import { screens } from "../../../tailwind.config";

export default function EditorScreen({
  media,
  referenceId,
}: {
  media: "photo" | "video";
  referenceId?: string;
}) {
  const reference = referenceSections
    .flatMap((section) => section.items)
    .find((item) => item.id === referenceId);
  const [prompt, setPrompt] = useState(reference?.prompt ?? "");
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const canUseNsfw = media === "photo" && !referenceId;
  const nsfw = canUseNsfw && nsfwEnabled;
  const [enhance, setEnhance] = useState(false);
  const [images, setImages] = useState<GenerationImage[]>(() => reference?.images ?? []);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const scrolledGeneration = useRef<string | null>(null);

  useEffect(() => {
    if (!generationId || scrolledGeneration.current === generationId ||
      window.matchMedia(`(min-width: ${screens.md})`).matches) return;

    const frame = window.requestAnimationFrame(() => {
      if (!resultRef.current) return;
      scrolledGeneration.current = generationId;
      resultRef.current.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [generationId]);
  const create = useCreateGeneration();
  const createNsfw = useCreateNsfwGeneration();
  const activeCreate = nsfw ? createNsfw : create;
  const result = useGenerationResult(generationId);
  const lastAttempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const busy =
    create.isPending || createNsfw.isPending ||
    Boolean(
      generationId &&
      (result.isPending ||
        result.data?.status === "pending" ||
        result.data?.status === "processing"),
    );

  const models = useGenerationModels(!nsfw);
  const modelOptions = Object.keys(models.data ?? {}).map((key) => ({ value: key, label: key }));
  const [selectedModel, setSelectedModel] = useState("nano-banana-2.1");
  const modelKey = modelOptions.some((option) => option.value === selectedModel)
    ? selectedModel
    : (modelOptions[0]?.value ?? "");
  const model = models.data?.[modelKey];
  const [selectedFormat, setFormat] = useState<string>();
  const [selectedSize, setSize] = useState<string>();
  const formats = mapFrameFormats(model?.aspect_ratio ?? []);
  const sizes = mapFrameFormats(model?.size ?? []);
  const format = formats.find((option) => option.value === selectedFormat)
    ?? formats.find((option) => option.value === "1:1")
    ?? formats[0];
  const size = sizes.find((option) => option.value === selectedSize)
    ?? sizes.find((option) => option.value === "auto")
    ?? sizes[0];
  const modelsReady = models.isSuccess && Boolean(model);
  const parameters = [
    {
      key: "aspectRatio",
      title: "Формат кадра",
      value: format?.value,
      label: format?.label,
      options: formats,
      onChange: setFormat,
    },
    {
      key: "size",
      title: "Размер изображения",
      value: size?.value,
      label: size?.label,
      options: sizes,
      onChange: setSize,
    },
  ];
  const [openParameter, setOpenParameter] = useState<string | null>(null);
  const activeParameter = parameters.find((parameter) => parameter.key === openParameter);
  const [expanded, setExpanded] = useState(false);
  const closeParameter = useCallback(() => setOpenParameter(null), []);
  const closePrompt = useCallback(() => setExpanded(false), []);

  function generate() {
    if (media !== "photo" || busy || !prompt.trim() || !images.length) return;
    if (nsfw) {
      setGenerationId(null);
      createNsfw.mutate({
        prompt: prompt.trim(),
        characterReferences: [...images],
      }, { onSuccess: (data) => setGenerationId(data.id) });
      return;
    }
    if (!modelsReady || !model) return;
    const input = {
      model: model.model,
      prompt: prompt.trim(),
      enhance,
      images: [...images],
      ...(format ? { aspectRatio: format.value } : {}),
      ...(size ? { size: size.value } : {}),
    };
    const fingerprint = JSON.stringify({
      ...input,
      images: input.images.map((image) => ({ url: image.url, name: image.name })),
    });
    const key =
      create.isError && lastAttempt.current?.fingerprint === fingerprint
        ? lastAttempt.current.key
        : crypto.randomUUID();
    lastAttempt.current = { fingerprint, key };
    setGenerationId(null);
    create.mutate(
      {
        ...input,
        idempotencyKey: key,
      },
      { onSuccess: (data) => setGenerationId(data.id) },
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl flex flex-col gap-6 py-4">
      <header className="flex items-center gap-3">
        <ButtonLink href="/create" aria-label="Назад к выбору" className="shrink-0 px-2">
          <ArrowLeft size={24} />
        </ButtonLink>
        <div className="min-w-0 flex-1">
          <SectionHeading as="h1" title="Редактор" />
        </div>
        <span className="text-small text-muted">
          {media === "photo" ? "Фото" : "Видео"}
        </span>
      </header>
      {reference && (
        <Paper className="p-4">
          <p className="text-small text-muted">Выбранный референс</p>
          <p className="mt-1 text-lead">{reference.title}</p>
        </Paper>
      )}
      <div className="flex flex-col gap-3">
        {canUseNsfw && (
          <Toggle
            label="NSFW-режим"
            checked={nsfw}
            disabled={busy}
            onChange={(value) => {
              setNsfwEnabled(value);
              setOpenParameter(null);
            }}
          />
        )}
        {!nsfw && (
          <>
            <p className="text-base text-muted">Нейросеть</p>
            {models.isPending ? (
              <Skeleton
                className="h-20 w-full"
                role="status"
                aria-label="Загружаем нейросети"
              />
            ) : models.isError ? (
              <div className="flex min-h-20 flex-col gap-3">
                <p role="alert" className="text-base text-danger">
                  Не удалось загрузить нейросети. {generationErrorMessage(models.error)}
                </p>
                <Button
                  variant="secondary"
                  isLoading={models.isFetching}
                  onClick={() => void models.refetch()}
                >
                  Повторить загрузку
                </Button>
              </div>
            ) : modelOptions.length === 0 ? (
              <p role="status" className="flex min-h-20 items-center text-base text-muted">
                Сейчас нет доступных нейросетей.
              </p>
            ) : (
              <Select
                label="Нейросеть"
                value={modelKey}
                options={modelOptions}
                disabled={busy}
                onChange={(value) => {
                  setSelectedModel(value);
                  setFormat(undefined);
                  setSize(undefined);
                  setOpenParameter(null);
                }}
              />
            )}
          </>
        )}
      </div>
      {media === "video" && (
        <p
          role="status"
          className="rounded-card border border-line p-4 text-base text-muted"
        >
          Генерация видео скоро появится. Доступные нейросети работают с изображениями.
        </p>
      )}
      {nsfw && <p className="text-small text-muted">Загрузите фото персонажа и опишите желаемые изменения.</p>}
      <ImageUpload images={images} onChange={setImages} disabled={busy} />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="generation-prompt" className="text-lead">
            Промпт <span className="text-danger">*</span>
          </label>
          {!nsfw && (
            <Toggle
              label="Улучшение промпта"
              checked={enhance}
              disabled={busy}
              onChange={setEnhance}
            />
          )}
        </div>
        <div className="rounded-card bg-surface p-4 sm:p-5">
          <Textarea
            id="generation-prompt"
            required
            maxLength={4000}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Опишите изображение, стиль и важные детали"
            className="min-h-52 border-0 p-0 text-lead"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-small text-quiet">{prompt.length} / 4000</span>
            <IconButton
              aria-label="Развернуть промпт"
              onClick={() => setExpanded(true)}
            >
              <Maximize size={17} />
            </IconButton>
          </div>
        </div>
      </div>
      {!nsfw && models.isPending && <Skeleton className="h-20 w-full" aria-hidden="true" />}
      {!nsfw && modelsReady &&
        parameters.map(
          (parameter) =>
            parameter.value && (
              <Button
                key={parameter.key}
                variant="surface"
                disabled={busy}
                onClick={() => setOpenParameter(parameter.key)}
                aria-haspopup="dialog"
                aria-expanded={openParameter === parameter.key}
                className="w-full justify-between bg-surface p-5 text-lead sm:p-6"
              >
                <span className="flex items-center gap-3 text-muted">
                  <Maximize size={19} />
                  {parameter.title}
                </span>
                <span className="flex items-center gap-3">
                  {parameter.label}
                  <ChevronDown size={20} />
                </span>
              </Button>
            ),
        )}
      <div className="flex flex-col gap-3">
        <Button
          disabled={
            media === "video" ||
            (!nsfw && !modelsReady) ||
            !prompt.trim() ||
            images.length === 0 ||
            busy
          }
          isLoading={activeCreate.isPending}
          onClick={generate}
          className="w-full"
          iconLeft={<Sparkles size={18} />}
        >
          {busy
            ? "Генерация выполняется…"
            : activeCreate.isError
             ? "Повторить запрос"
             : `Сгенерировать ${media === "photo" ? "изображение" : "видео"}`}
        </Button>
        {activeCreate.isError && (
          <p role="alert" className="text-small text-danger">
            {generationErrorMessage(activeCreate.error)}
          </p>
        )}
      </div>
      {generationId && (
        <div ref={resultRef} className="scroll-mt-4">
          <GenerationResult key={generationId} id={generationId} query={result} />
        </div>
      )}

      {!nsfw && modelsReady && activeParameter?.value && (
        <FrameFormatPicker
          title={activeParameter.title}
          options={activeParameter.options}
          value={activeParameter.value}
          onChange={activeParameter.onChange}
          onClose={closeParameter}
        />
      )}
      {expanded && (
        <Modal title="Промпт" className="max-w-2xl" onClose={closePrompt}>
          <Textarea
            aria-label="Промпт"
            maxLength={4000}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="min-h-72"
          />
          <p className="my-3 text-small text-muted">{prompt.length} / 4000</p>
          <Button onClick={() => setExpanded(false)}>Готово</Button>
        </Modal>
      )}
    </section>
  );
}
