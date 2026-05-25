"use client";

import { useEffect, useMemo, useState } from 'react';
import type { LabExperimentDefinition, LabGuideSection, LabModule } from '@/lib/lab-modules';
import { TabButton } from './Panel';
import { LabTestingWorkspace } from './LabTestingWorkspace';

type DetailTab = 'overview' | 'experiments' | 'guide' | 'testing';

const tabs: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'guide', label: 'Guide' },
  { id: 'testing', label: 'Testing' },
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
          <ExperimentsTab experiments={module.experiments} />
        )}

        {activeTab === 'guide' && (
          <GuideTab guide={module.guide} />
        )}

        {activeTab === 'testing' && (
          <LabTestingWorkspace module={module} />
        )}
      </div>
    </section>
  );
}

function ExperimentsTab({ experiments }: { experiments: LabExperimentDefinition[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[6px] border border-border-subtle bg-canvas-subtle px-3 py-2 text-table leading-6 text-fg-muted">
        No live run is active. Use the catalog below to choose the next lab activity; live status
        can be layered on without hiding these definitions.
      </div>

      <div className="divide-y divide-border-subtle">
        {experiments.map((experiment) => (
          <article key={experiment.id} className="py-4 first:pt-0 last:pb-0">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-fg-default">{experiment.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {experiment.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-[6px] border border-border bg-canvas-subtle px-2 py-0.5 text-[11px] font-medium text-fg-muted"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {(experiment.duration || experiment.difficulty) && (
                <div className="shrink-0 text-right text-caption text-fg-muted max-sm:w-full max-sm:text-left">
                  {experiment.duration && <div>{experiment.duration}</div>}
                  {experiment.difficulty && <div>{experiment.difficulty}</div>}
                </div>
              )}
            </div>

            <dl className="grid gap-3 text-table leading-6 text-fg-muted md:grid-cols-2">
              <DetailItem label="Objective" value={experiment.objective} />
              <DetailItem label="Setup" value={experiment.setup} />
              <DetailItem label="Action" value={experiment.action} />
              <DetailItem label="Observe" value={experiment.expectedObservation} />
              <DetailItem
                className="md:col-span-2"
                label="Success signal"
                value={experiment.successSignal}
              />
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

function GuideTab({ guide }: { guide: LabGuideSection }) {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-1 text-sm font-medium text-fg-default">Objective</h3>
        <p className="text-table leading-6 text-fg-muted">{guide.objective}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-medium text-fg-default">Prerequisites</h3>
          <ul className="space-y-1 text-table leading-6 text-fg-muted">
            {guide.prerequisites.map((item) => (
              <li key={item} className="pl-3 before:mr-2 before:content-['-']">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-fg-default">Setup check</h3>
          <p className="text-table leading-6 text-fg-muted">{guide.setupCheck}</p>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium text-fg-default">Steps</h3>
        <ol className="space-y-3">
          {guide.steps.map((step, index) => (
            <li key={step.title} className="grid gap-3 border-t border-border-subtle pt-3 first:border-t-0 first:pt-0 md:grid-cols-[2rem_1fr]">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-canvas-subtle text-caption font-semibold text-fg-muted">
                {index + 1}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-fg-default">{step.title}</h4>
                <p className="mt-1 text-table leading-6 text-fg-muted">{step.instruction}</p>
                <p className="mt-1 text-table leading-6 text-fg-muted">
                  <span className="font-medium text-fg-default">Observe: </span>
                  {step.observation}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <GuideList title="Observation checklist" items={guide.observationChecklist} />
        <GuideList title="Validation" items={guide.validation} />
      </section>

      <section>
        <h3 className="mb-1 text-sm font-medium text-fg-default">Cleanup</h3>
        <p className="text-table leading-6 text-fg-muted">{guide.cleanup}</p>
      </section>

      {guide.nextSteps && guide.nextSteps.length > 0 && (
        <GuideList title="Next steps" items={guide.nextSteps} />
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="mb-0.5 text-caption font-semibold uppercase text-fg-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-fg-default">{title}</h3>
      <ul className="space-y-1 text-table leading-6 text-fg-muted">
        {items.map((item) => (
          <li key={item} className="pl-3 before:mr-2 before:content-['-']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
