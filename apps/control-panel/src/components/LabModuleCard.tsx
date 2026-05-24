import type { LabModule } from '@/lib/lab-modules';

interface LabModuleCardProps {
  module: LabModule;
  selected: boolean;
  onSelect: () => void;
}

const toneStyles: Record<LabModule['tone'], string> = {
  m1: 'bg-[#E1F5EE] text-[#0F6E56] dark:bg-[#0F3D2E] dark:text-[#3fb950]',
  m2: 'bg-[#E6F1FB] text-[#185FA5] dark:bg-[#0D2942] dark:text-[#58a6ff]',
  m3: 'bg-[#FAECE7] text-[#993C1D] dark:bg-[#3D1F14] dark:text-[#f0883e]',
  m4: 'bg-[#FAEEDA] text-[#854F0B] dark:bg-[#3D2E00] dark:text-[#d29922]',
  m5: 'bg-[#EEEDFE] text-[#534AB7] dark:bg-[#2A1F47] dark:text-[#bc8cff]',
};

export function LabModuleCard({ module, selected, onSelect }: LabModuleCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`rounded-[6px] border bg-canvas p-4 text-left transition-colors hover:border-accent-fg ${
        selected ? 'border-accent-fg shadow-[0_0_0_3px_var(--accent-subtle)]' : 'border-border'
      }`}
    >
      <div className="mb-2.5 flex items-center gap-3">
        <span
          className={`mono flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-[13px] font-semibold ${toneStyles[module.tone]}`}
          aria-hidden="true"
        >
          {String(module.moduleNumber).padStart(2, '0')}
        </span>
        <span>
          <span className="block text-section text-fg-default">{module.name}</span>
          <span className="mono text-[11px] text-fg-muted">
            Module {String(module.moduleNumber).padStart(2, '0')}
          </span>
        </span>
      </div>
      <p className="mb-3 text-table text-fg-muted">{module.description}</p>
      <span className="flex flex-wrap gap-1">
        {module.tags.map((tag) => (
          <span
            key={tag}
            className="mono rounded-[4px] border border-border bg-canvas-subtle px-2 py-0.5 text-[11px] text-fg-muted"
          >
            {tag}
          </span>
        ))}
      </span>
    </button>
  );
}
