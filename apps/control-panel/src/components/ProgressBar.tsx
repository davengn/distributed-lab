interface ProgressBarProps {
  value: number;
  max?: number;
  threshold?: number;
}

export function ProgressBar({ value, max = 100, threshold }: ProgressBarProps) {
  const pct = Math.max(0, Math.min((value / max) * 100, 100));
  let fillColor = "var(--success-fg)";
  if (threshold !== undefined && value > threshold) {
    fillColor = "var(--danger-fg)";
  } else if (value > max * 0.7) {
    fillColor = "var(--attention-fg)";
  }

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-[3px] bg-progress-bg"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
    >
      <div
        className="h-full rounded-[3px] transition-all duration-200"
        style={{ width: `${pct}%`, backgroundColor: fillColor }}
      />
    </div>
  );
}
