export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

export type GenerationImage = {
  url: string;
  name: string;
  file?: File;
};

export type CreateGenerationInput = {
  model: string;
  prompt: string;
  enhance: boolean;
  images: GenerationImage[];
  aspectRatio?: string;
  size?: string;
  idempotencyKey: string;
};

export type GenerationModel = {
  model: string;
  prompt: string;
  images: string;
  aspect_ratio?: string[];
  size?: string[];
};

export type GenerationModels = Record<string, GenerationModel>;

export type CreatedGeneration = { id: string; status: GenerationStatus };
export type GenerationResult = { status: GenerationStatus; result_url: string | null };

export const MAX_IMAGES = 14;
export const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";
export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];
