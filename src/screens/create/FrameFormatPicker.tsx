import { Scan } from "lucide-react";

import Modal from "@/components/UI/Modal";
import ChoiceCard from "@/components/UI/ChoiceCard";

const descriptions: Record<string, string> = {
  auto: "Подберём за вас",
  "1:1": "Квадрат",
  "21:9": "Киноформат",
  "16:9": "Широкий экран",
  "4:3": "Классический",
  "3:2": "Горизонтальный",
  "5:4": "Горизонтальный",
  "9:16": "Истории и Reels",
  "3:4": "Вертикальный",
  "2:3": "Вертикальный",
  "4:5": "Для ленты",
};

export default function FrameFormatPicker({
  title,
  options,
  value,
  onChange,
  onClose,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose} className="max-w-xl">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {options.map((option) => {
          const dimensions = /^(\d+):(\d+)$/.exec(option);
          const ratio = dimensions ? Number(dimensions[1]) / Number(dimensions[2]) : null;
          return (
            <ChoiceCard
              compact
              key={option}
              title={option === "auto" ? "Авто" : option}
              description={descriptions[option]}
              selected={value === option}
              onClick={() => {
                onChange(option);
                onClose();
              }}
              className="min-h-24"
              icon={option === "auto" ? <Scan size={26} /> : ratio && Number.isFinite(ratio) && ratio > 0 ? (
                <span
                  className="block rounded border-2 border-current"
                  style={{
                    width: ratio >= 1 ? 28 : 28 * ratio,
                    height: ratio >= 1 ? 28 / ratio : 28,
                  }}
                />
              ) : undefined}
            />
          );
        })}
      </div>
    </Modal>
  );
}
