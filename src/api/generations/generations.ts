import axios from "axios";

import api from "@/api/client";
import {
    MAX_IMAGES,
    MAX_IMAGE_BYTES,
    type CreateGenerationInput,
    type CreatedGeneration,
    type GenerationResult,
    type GenerationStatus,
} from "@/api/generations/types";

function checkStatus(status: unknown): asserts status is GenerationStatus {
    if (!["pending", "processing", "completed", "failed"].includes(String(status))) {
        throw new Error("Сервер вернул неизвестный статус генерации.");
    }
}

export async function createGeneration(input: CreateGenerationInput): Promise<CreatedGeneration> {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error("Не настроен адрес API.");
    if (!input.prompt.trim() || input.prompt.length > 4000)
        throw new Error("Введите промпт длиной до 4000 символов.");
    if (!input.images.length || input.images.length > MAX_IMAGES)
        throw new Error("Добавьте от 1 до 14 изображений.");

    const body = new FormData();
    body.append("media_type", input.mediaType);
    body.append("model_id", input.modelId);
    body.append("prompt", input.prompt.trim());
    body.append("aspect_ratio", input.aspectRatio);
    body.append("editable_prompt", String(input.editablePrompt));

    for (const image of input.images) {
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
        body.append("images", file, file.name);
    }

    const { data } = await api.post<CreatedGeneration>("/generations", body, {
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
  const { data } = await axios.get<Blob>("/api/generations/download", {
    params: { url },
    responseType: "blob",
    signal,
  });
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  const extension = extensions[data.type];
  if (!extension) throw new Error("Не удалось подготовить фото для сохранения.");
  return new File([data], `diony-generation.${extension}`, { type: data.type });
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
