"use client";

import { useMemo, useState } from 'react';
import { LabModuleCard } from '@/components/LabModuleCard';
import { LabModuleDetail } from '@/components/LabModuleDetail';
import { labModules } from '@/lib/lab-modules';

export default function LabsPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const selectedModule = useMemo(
    () => labModules.find((module) => module.id === selectedModuleId) ?? null,
    [selectedModuleId]
  );

  return (
    <div className="min-w-0">
      <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {labModules.map((module) => (
          <LabModuleCard
            key={module.id}
            module={module}
            selected={module.id === selectedModuleId}
            onSelect={() => setSelectedModuleId(module.id)}
          />
        ))}
      </div>

      {selectedModule && <LabModuleDetail module={selectedModule} />}
    </div>
  );
}
