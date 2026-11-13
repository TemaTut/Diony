import { Scan } from "lucide-react";

import Modal from "@/components/UI/Modal";
import ChoiceCard from "@/components/UI/ChoiceCard";

const formats = [
    ["Авто", "Подберём за вас", 1],
    ["1:1", "Квадрат", 1],
    ["21:9", "Киноформат", 21 / 9],
    ["16:9", "Широкий экран", 16 / 9],
    ["4:3", "Классический", 4 / 3],
    ["3:2", "Горизонтальный", 3 / 2],
    ["5:4", "Горизонтальный", 5 / 4],
    ["9:16", "Истории и Reels", 9 / 16],
    ["3:4", "Вертикальный", 3 / 4],
    ["2:3", "Вертикальный", 2 / 3],
    ["4:5", "Для ленты", 4 / 5],
] as const;

export default function FrameFormatPicker({
    value,
    onChange,
    onClose,
}: {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
}) {
    return (
        <Modal title="Формат кадра" onClose={onClose} className="max-w-xl">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {formats.map(([label, description, ratio]) => (
                    <ChoiceCard
                        compact
                        key={label}
                        title={label}
                        description={description}
                        selected={value === label}
                        onClick={() => {
                            onChange(label);
                            onClose();
                        }}
                        className={label === "4:5" ? "col-span-2 min-h-24" : "min-h-24"}
                        icon={
                            label === "Авто" ? (
                                <Scan size={26} />
                            ) : (
                                <span
                                    className="block rounded border-2 border-current"
                                    style={{
                                        width: ratio >= 1 ? 28 : 28 * ratio,
                                        height: ratio >= 1 ? 28 / ratio : 28,
                                    }}
                                />
                            )
                        }
                    />
                ))}
            </div>
        </Modal>
    );
}
