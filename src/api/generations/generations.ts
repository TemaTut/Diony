import axios, { type AxiosResponse } from "axios";

import api from "@/api/client";
import {
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  type CreateGenerationInput,
  type CreateNsfwGenerationInput,
  type GenerationImage,
  type CreatedGeneration,
  type GenerationModels,
  type GenerationResult,
  type GenerationStatus,
} from "@/api/generations/types";

function checkStatus(status: unknown): asserts status is GenerationStatus {
  if (!["pending", "processing", "completed", "failed"].includes(String(status))) {
    throw new Error("Сервер вернул неизвестный статус генерации.");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
}

export async function getGenerationModels(signal?: AbortSignal): Promise<GenerationModels> {
  const { data } = await api.get<unknown>("/generations/models/list", {
    signal,
    skipAuth: true,
  });
  const message = "Сервер вернул некорректный список моделей.";
  if (!isRecord(data)) throw new Error(message);

  const models: GenerationModels = Object.create(null);
  for (const [key, value] of Object.entries(data)) {
    if (
      !key.trim() || !isRecord(value) ||
      typeof value.model !== "string" || !value.model.trim() ||
      typeof value.prompt !== "string" || !value.prompt.trim() ||
      typeof value.images !== "string" || !value.images.trim() ||
      (value.aspect_ratio !== undefined && !isStringList(value.aspect_ratio)) ||
      (value.size !== undefined && !isStringList(value.size))
    ) {
      throw new Error(message);
    }
    models[key] = {
      model: value.model,
      prompt: value.prompt,
      images: value.images,
      ...(value.aspect_ratio !== undefined ? { aspect_ratio: value.aspect_ratio } : {}),
      ...(value.size !== undefined ? { size: value.size } : {}),
    };
  }
  return models;
}

async function appendImages(body: FormData, field: string, images: GenerationImage[]) {
  for (const image of images) {
    let file = image.file;
    if (!file) {
      // Bundled reference pictures must also be sent as files, not URLs.
      const url = new URL(image.url, window.location.origin);
      if (url.origin !== window.location.origin)
        throw new Error("Недоступен исходный файл референса.");
      const response = await axios.get<Blob>(url.href, { responseType: "blob" });
      const extension = url.pathname.split(".").pop() ?? "png";
      file = new File([response.data], `${image.name}.${extension}`, {
        type: response.data.type,
      });
    }
    if (file.size > MAX_IMAGE_BYTES) throw new Error(`Файл «${image.name}» превышает 7 МБ.`);
    body.append(field, file, file.name);
  }
}

export async function createNsfwGeneration(input: CreateNsfwGenerationInput): Promise<CreatedGeneration> {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error("Не настроен адрес API.");
  if (!input.prompt.trim() || input.prompt.length > 4000)
    throw new Error("Введите промпт длиной до 4000 символов.");
  if (!input.characterReferences.length)
    throw new Error("Добавьте фото персонажа.");
  const images = [
    ...input.characterReferences,
    ...(input.environmentReference ?? []),
    ...(input.postureReference ?? []),
  ];
  if (images.length > MAX_IMAGES) throw new Error("Добавьте не больше 14 изображений.");

  const body = new FormData();
  body.append("prompt", input.prompt.trim());
  if (input.aspectRatio) body.append("aspect_ratio", input.aspectRatio);
  await appendImages(body, "character_references", input.characterReferences);
  await appendImages(body, "environment_reference", input.environmentReference ?? []);
  await appendImages(body, "posture_reference", input.postureReference ?? []);

  const { data } = await api.post<CreatedGeneration>("/generations/nsfw", body, {
    skipAuth: true,
  });
  if (typeof data.id !== "string" || !data.id)
    throw new Error("Сервер не вернул ID генерации. Повторите запрос.");
  checkStatus(data.status);
  return data;
}

export async function createGeneration(input: CreateGenerationInput): Promise<CreatedGeneration> {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error("Не настроен адрес API.");
  if (!input.model.trim()) throw new Error("Выберите нейросеть.");
  if (!input.prompt.trim() || input.prompt.length > 4000)
    throw new Error("Введите промпт длиной до 4000 символов.");
  if (!input.images.length || input.images.length > MAX_IMAGES)
    throw new Error("Добавьте от 1 до 14 изображений.");

  const body = new FormData();
  body.append("model", input.model);
  body.append("prompt", input.prompt.trim());
  if (input.aspectRatio) body.append("aspect_ratio", input.aspectRatio);
  if (input.size) body.append("size", input.size);

  await appendImages(body, "images", input.images);

  const { data } = await api.post<CreatedGeneration>("/generations", body, {
    params: { enhance: input.enhance },
    headers: { "Idempotency-Key": input.idempotencyKey },
    skipAuth: true,
  });
  if (typeof data.id !== "string" || !data.id)
    throw new Error("Сервер не вернул ID генерации. Повторите запрос.");
  checkStatus(data.status);
  return data;
}

export async function getGeneration(id: string, signal?: AbortSignal): Promise<GenerationResult> {
  const { data } = await api.get<GenerationResult>(`/generations/${encodeURIComponent(id)}`, {
    signal,
    skipAuth: true,
  });
  checkStatus(data.status);
  if (data.status === "completed" && !data.result_url)
    throw new Error("Генерация завершена, но сервер не вернул ссылку на результат.");
  let resultUrl: string | null = null;
  if (data.result_url) {
    const url = new URL(data.result_url, process.env.NEXT_PUBLIC_API_BASE_URL);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("Сервер вернул некорректную ссылку на результат.");
    resultUrl = url.href;
  }
  return { status: data.status, result_url: resultUrl };
}

export async function getGenerationPhoto(url: string, signal?: AbortSignal): Promise<File> {
  const started = Date.now();
  let response: AxiosResponse<Blob> | undefined;
  try {
    response = await axios.get<Blob>("/api/generations/download", {
      params: { url },
      responseType: "blob",
      signal,
    });
    const data = response.data;
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
    };
    const extension = extensions[data.type];
    if (!extension) throw new Error("Неподдерживаемый тип ответа при подготовке фото.");
    if (!data.size) throw new Error("Сервер вернул пустой файл.");
    return new File([data], `diony-generation.${extension}`, { type: data.type });
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    if (axios.isAxiosError<Blob>(error)) response = error.response;
    const blob = response?.data;
    const contentType = response?.headers["content-type"] ?? blob?.type ?? "неизвестен";
    const body = blob instanceof Blob && !blob.type.startsWith("image/")
      ? await blob.slice(0, 1000).text()
      : "";
    throw new Error([
      "Этап: скачивание и подготовка файла",
      "Запрос: /api/generations/download",
      `HTTP: ${response?.status ?? "нет ответа"}`,
      `Код: ${axios.isAxiosError(error) ? error.code ?? "не указан" : "не указан"}`,
      `Ошибка: ${error instanceof Error ? `${error.name}: ${error.message}` : "неизвестная ошибка"}`,
      `Content-Type: ${contentType}`,
      `Размер: ${blob instanceof Blob ? blob.size : "неизвестен"} байт`,
      `Время: ${Date.now() - started} мс`,
      `Vercel ID: ${response?.headers["x-vercel-id"] ?? "нет"}`,
      ...(body ? [`Ответ сервера (до 1000 байт): ${body}`] : []),
    ].join("\n"));
  }
}

export function generationErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail: unknown = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => (typeof item?.msg === "string" ? item.msg : ""))
        .filter(Boolean);
      if (messages.length) return messages.join(" ");
    }
    if (!error.response)
      return "Не удалось связаться с сервером. Проверьте подключение и повторите запрос.";
    if (error.response.status === 413)
      return "Превышен допустимый размер загрузки. Каждый файл должен быть не больше 7 МБ.";
    if (error.response.status === 429)
      return "Слишком много запросов. Попробуйте немного позже.";
    return "Сервер не смог обработать запрос. Попробуйте ещё раз.";
  }
  return error instanceof Error ? error.message : "Не удалось выполнить запрос.";
}
