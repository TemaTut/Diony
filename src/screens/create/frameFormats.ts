const frameRatios = [
  "1:1", "21:9", "16:9", "4:3", "3:2", "5:4", "9:16", "3:4", "2:3", "4:5",
  "2:1", "6:5", "7:5", "7:2",
];

export type FrameFormatOption = {
  value: string;
  label: string;
  format: string;
  ratio?: number;
  resolution?: string;
};

function parseRatio(value: string) {
  const dimensions = /^(\d+)[:x×*](\d+)$/i.exec(value);
  if (!dimensions) return undefined;
  const ratio = Number(dimensions[1]) / Number(dimensions[2]);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined;
}

export function mapFrameFormats(values: string[]) {
  const order = ["auto", ...frameRatios];
  const position = (format: string) => {
    const index = order.indexOf(format);
    return index === -1 ? order.length : index;
  };

  return values.flatMap<FrameFormatOption>((value) => {
    if (value === "auto") return [{ value, label: "Авто", format: value }];
    if (/^\d+k$/i.test(value)) {
      return [{ value, label: value.toUpperCase(), format: value }];
    }

    const ratio = parseRatio(value);
    if (ratio === undefined) return [];
    if (value.includes(":")) return [{ value, label: value, format: value, ratio }];

    // Model sizes can round dimensions to the nearest supported pixel count.
    const format = frameRatios.find((candidate) => {
      const target = parseRatio(candidate);
      return target !== undefined && Math.abs(ratio / target - 1) < 0.02;
    });
    return format ? [{ value, label: format, format, ratio, resolution: value }] : [];
  }).sort((left, right) => position(left.format) - position(right.format));
}
