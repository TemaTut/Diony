"use client";

import { ArrowLeft, Banana, ChevronDown, Maximize, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";

import Button from "@/components/UI/Button";
import ButtonLink from "@/components/UI/ButtonLink";
import IconButton from "@/components/UI/IconButton";
import Modal from "@/components/UI/Modal";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import Select from "@/components/UI/Select";
import Textarea from "@/components/UI/Textarea";
import Toggle from "@/components/UI/Toggle";
import Tooltip from "@/components/UI/Tooltip";
import { referenceSections } from "@/data/references";
import FrameFormatPicker from "@/screens/create/FrameFormatPicker";
import ImageUpload from "@/screens/create/ImageUpload";

const models = [
    {
        value: "nano-banana",
        label: "Nano Banana Pro 2.1 Edit",
        icon: <Banana size={32} />,
    },
];

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
    const [model, setModel] = useState(models[0].value);
    const [editable, setEditable] = useState(false);
    const [format, setFormat] = useState("Авто");
    const [formatOpen, setFormatOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const closeFormat = useCallback(() => setFormatOpen(false), []);
    const closePrompt = useCallback(() => setExpanded(false), []);

    return (
        <section className="mx-auto w-full max-w-2xl space-y-6 py-4">
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
            <div className="space-y-3">
                <label htmlFor="generation-model" className="block text-base text-muted">
                    Нейросеть
                </label>
                <Select
                    id="generation-model"
                    label="Нейросеть"
                    value={model}
                    options={models}
                    onChange={setModel}
                />
            </div>
            {media === "video" && (
                <p
                    role="status"
                    className="rounded-card border border-line p-4 text-base text-muted"
                >
                    Генерация видео скоро появится. Nano Banana Pro 2.1 Edit работает с
                    изображениями.
                </p>
            )}
            <ImageUpload initialImages={reference?.images} />
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <label htmlFor="generation-prompt" className="text-lead">
                        Промпт <span className="text-danger">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <Toggle
                            label="Редактируемый промпт"
                            checked={editable}
                            onChange={setEditable}
                        />
                        <Tooltip
                            label="Что такое редактируемый промпт"
                            title="Редактируемый промпт"
                        >
                            Превратим описание в шаблон с полями, например: платье {"{{красного}}"}{" "}
                            цвета. После публикации другие смогут менять эти поля, не видя исходный
                            промпт.
                        </Tooltip>
                    </div>
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
                        <span className="text-small text-quiet">
                            {prompt.length} / 4000{editable && " · {{параметр}}"}
                        </span>
                        <IconButton
                            aria-label="Развернуть промпт"
                            onClick={() => setExpanded(true)}
                        >
                            <Maximize size={17} />
                        </IconButton>
                    </div>
                </div>
            </div>
            <Button
                variant="surface"
                onClick={() => setFormatOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={formatOpen}
                className="w-full justify-between bg-surface p-5 text-lead sm:p-6"
            >
                <span className="flex items-center gap-3 text-muted">
                    <Maximize size={19} />
                    Формат кадра <span className="text-danger">*</span>
                </span>
                <span className="flex items-center gap-3">
                    {format}
                    <ChevronDown size={20} />
                </span>
            </Button>
            <div className="space-y-3">
                <Button disabled className="w-full" iconLeft={<Sparkles size={18} />}>
                    Сгенерировать {media === "photo" ? "изображение" : "видео"}
                </Button>
                <p className="text-center text-small text-muted">
                    Генерация станет доступна после подключения сервиса.
                </p>
            </div>
            {formatOpen && (
                <FrameFormatPicker value={format} onChange={setFormat} onClose={closeFormat} />
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
