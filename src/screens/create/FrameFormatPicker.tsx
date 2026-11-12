import { Scan } from "lucide-react";

import Modal from "@/components/UI/Modal";
import ChoiceCard from "@/components/UI/ChoiceCard";

const formats = [
  ["Авто", "Подберём подходящий формат.", 1],
  ["1:1", "Квадратный формат.", 1],
  ["21:9", "Кинематографичный формат.", 21 / 9],
  ["16:9", "Широкий горизонтальный.", 16 / 9],
  ["4:3", "Классический горизонтальный.", 4 / 3],
  ["3:2", "Горизонтальный формат.", 3 / 2],
  ["5:4", "Горизонтальный формат.", 5 / 4],
  ["9:16", "Для историй и Reels.", 9 / 16],
  ["3:4", "Вертикальный формат.", 3 / 4],
  ["2:3", "Вертикальный формат.", 2 / 3],
  ["4:5", "Для публикаций в ленте.", 4 / 5],
] as const;

export default function FrameFormatPicker({ value, onChange, onClose }: { value: string; onChange: (value: string) => void; onClose: () => void }) {
  return (
    <Modal title="Формат кадра" onClose={onClose} className="max-w-xl">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {formats.map(([label, description, ratio]) => (
          <ChoiceCard
            key={label}
            title={label}
            description={description}
            selected={value === label}
            onClick={() => { onChange(label); onClose(); }}
            className={label === "4:5" ? "col-span-2 min-h-24" : "min-h-24"}
            icon={label === "Авто" ? <Scan size={26} /> : <span className="block rounded border-2 border-current" style={{ width: ratio >= 1 ? 28 : 28 * ratio, height: ratio >= 1 ? 28 / ratio : 28 }} />}
          />
        ))}
      </div>
    </Modal>
  );
}
