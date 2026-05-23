interface ProgressBarProps {
  value: number;
  max?: number;
  threshold?: number;
}

export function ProgressBar({ value, max = 100, threshold }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  let fillColor = "var(--success-fg)";
  if (threshold !== undefined && value > threshold) {
    fillColor = "var(--danger-fg)";
  } else if (value > max * 0.7) {
    fillColor = "var(--attention-fg)";
  }

  return (
    <div className="w-full h-1.5 rounded-[3px] bg-progress-bg overflow-hidden">
      <div
        className="h-full rounded-[3px] transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: fillColor }}
      />
    </div>
  );
}
