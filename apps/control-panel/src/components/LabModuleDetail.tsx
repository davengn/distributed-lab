"use client";

import { useEffect, useMemo, useState } from 'react';
import type { LabModule } from '@/lib/lab-modules';
import { TabButton } from './Panel';

type DetailTab = 'overview' | 'experiments' | 'guide';

const tabs: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'guide', label: 'Guide' },
];

interface LabModuleDetailProps {
  module: LabModule;
}

export function LabModuleDetail({ module }: LabModuleDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [module.id]);

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.id === activeTab), [activeTab]);
  const panelId = `module-${module.id}-${activeTab}-panel`;
  const tabId = `module-${module.id}-${activeTab}-tab`;

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    let nextIndex = activeIndex;

    if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== activeIndex) {
      event.preventDefault();
      setActiveTab(tabs[nextIndex].id);
    }
  }

  return (
    <section className="overflow-hidden rounded-[6px] border border-border bg-canvas">
      <div className="flex border-b border-border bg-canvas-subtle" role="tablist" aria-label="Module detail tabs">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={`module-${module.id}-${tab.id}-tab`}
            controls={`module-${module.id}-${tab.id}-panel`}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={handleKeyDown}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        className="px-6 py-5 max-md:px-4"
      >
        {activeTab === 'overview' && (
          <div>
            <h2 className="mb-3 text-section text-fg-default">{module.detailName}</h2>
            <div className="divide-y divide-border-subtle">
              {module.features.map((feature) => (
                <div key={feature.name} className="py-3 first:pt-0 last:pb-0">
                  <div className="mb-0.5 text-sm font-medium text-fg-default">{feature.name}</div>
                  <div className="text-table leading-6 text-fg-muted">{feature.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experiments' && (
          <p className="py-2 text-table text-fg-muted">
            No experiments running for this module. Start one from the feature list above.
          </p>
        )}

        {activeTab === 'guide' && (
          <p className="py-2 text-table text-fg-muted">
            Lab guide and concept notes will appear here. Based on Building Microservices and
            Designing Data-Intensive Applications.
          </p>
        )}
      </div>
    </section>
  );
}
