"use client";

import { useEffect, useMemo, useState } from 'react';
import { ApiClientError, apiClient } from '@/lib/api-client';
import { compareHistoryEntries } from '@/lib/lab-testing-compare';
import { requestPresets } from '@/lib/lab-testing-presets';
import {
  appendRequestHistory,
  copyDraft,
  loadRequestHistory,
} from '@/lib/lab-testing-session';
import {
  emptyRequestDraft,
  type ComparisonResult,
  type RequestHistoryEntry,
  type RequestPreset,
  type ServiceRequestDraft,
  type ServiceRequestPayload,
  type ServiceRequestResult,
  type ServiceRequestTarget,
  type TestingUtility,
  type UtilityRunResult,
} from '@/lib/lab-testing-types';
import { testingUtilities } from '@/lib/lab-testing-utilities';
import type { LabModule } from '@/lib/lab-modules';
import { RequestComposer } from './RequestComposer';
import { RequestHistoryPanel } from './RequestHistoryPanel';
import { RequestPresetList } from './RequestPresetList';
import { RequestResultPanel } from './RequestResultPanel';
import { TestingUtilitiesPanel } from './TestingUtilitiesPanel';

interface LabTestingWorkspaceProps {
  module: LabModule;
}

export function LabTestingWorkspace({ module }: LabTestingWorkspaceProps) {
  const [targets, setTargets] = useState<ServiceRequestTarget[]>([]);
  const [targetError, setTargetError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ServiceRequestDraft>(emptyRequestDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ServiceRequestResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<RequestPreset | null>(null);
  const [history, setHistory] = useState<RequestHistoryEntry[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [utilityResults, setUtilityResults] = useState<Record<string, UtilityRunResult>>({});
  const [runningUtilityId, setRunningUtilityId] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    apiClient.serviceRequests
      .listTargets()
      .then((nextTargets) => {
        if (cancelled) return;
        setTargets(nextTargets);
        setTargetError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setTargets([]);
        setTargetError('Lab API request runner is unavailable. Keep your draft and try again.');
      });
    setHistory(loadRequestHistory());
    return () => {
      cancelled = true;
    };
  }, []);

  const comparison = useMemo<ComparisonResult | null>(() => {
    if (compareIds.length !== 2) return null;
    const left = history.find((entry) => entry.id === compareIds[0]);
    const right = history.find((entry) => entry.id === compareIds[1]);
    return left && right ? compareHistoryEntries(left, right) : null;
  }, [compareIds, history]);

  const modulePresets = useMemo(
    () => requestPresets.filter((preset) => preset.moduleId === module.id),
    [module.id]
  );

  async function submitRequest() {
    const errors = validateDraft(draft);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const blockedResult = localResult('blocked', 'validation', 'Fix the highlighted fields.');
      setResult(blockedResult);
      addHistory(blockedResult);
      return;
    }

    const pending = localResult('pending');
    setResult(pending);
    setIsSubmitting(true);

    try {
      const response = await apiClient.serviceRequests.send(toPayload(draft));
      setResult(response);
      addHistory(response);
    } catch (error) {
      const failure = resultFromError(error, pending);
      setFieldErrors(failure.fieldErrors ?? {});
      setResult(failure);
      addHistory(failure);
    } finally {
      setIsSubmitting(false);
    }
  }

  function loadPreset(preset: RequestPreset) {
    const target = targets.find((item) => item.id === preset.targetName);
    setSelectedPreset(preset);
    setFieldErrors({});
    setDraft({
      targetId: target?.id ?? '',
      method: preset.method,
      path: preset.path,
      query: {},
      headers: preset.headers ?? {},
      body: preset.body ?? '',
      timeoutMs: 5000,
      presetId: preset.id,
    });
  }

  function retryHistoryEntry(entry: RequestHistoryEntry) {
    setDraft(copyDraft(entry));
    setSelectedPreset(requestPresets.find((preset) => preset.id === entry.draft.presetId) ?? null);
    setFieldErrors({});
  }

  function toggleCompare(entryId: string) {
    setCompareIds((current) => {
      if (current.includes(entryId)) return current.filter((id) => id !== entryId);
      return [...current, entryId].slice(-2);
    });
  }

  async function runUtility(utility: TestingUtility, confirmed: boolean) {
    setRunningUtilityId(utility.id);
    try {
      const response = await apiClient.serviceRequests.runUtility(utility.id, {
        targetId: draft.targetId || undefined,
        moduleId: module.id,
        confirmed,
      });
      setUtilityResults((current) => ({ ...current, [utility.id]: response }));
    } catch (error) {
      setUtilityResults((current) => ({
        ...current,
        [utility.id]: {
          utilityId: utility.id,
          status: 'failed',
          message: error instanceof Error ? error.message : 'Utility could not complete.',
          completedAt: new Date().toISOString(),
        },
      }));
    } finally {
      setRunningUtilityId(undefined);
    }
  }

  function addHistory(nextResult: ServiceRequestResult) {
    const entry: RequestHistoryEntry = {
      id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      draft: { ...draft, query: { ...draft.query }, headers: { ...draft.headers } },
      result: nextResult,
      moduleId: module.id,
      createdAt: new Date().toISOString(),
    };
    setHistory(appendRequestHistory(entry));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-section text-fg-default">Lab testing workspace</h2>
        <p className="mt-1 text-table leading-6 text-fg-muted">
          Compose local service requests, run guided presets, inspect results, and compare recent
          lab observations without leaving this module.
        </p>
      </div>

      {targetError && (
        <div role="status" className="rounded-[6px] border border-danger-fg/40 p-3 text-table">
          <div className="font-medium text-danger-fg">Request runner unavailable</div>
          <p className="mt-1 text-fg-muted">{targetError}</p>
        </div>
      )}

      {selectedPreset && !draft.targetId && (
        <div role="status" className="rounded-[6px] border border-danger-fg/40 p-3 text-table">
          <div className="font-medium text-danger-fg">Preset target unavailable</div>
          <p className="mt-1 text-fg-muted">
            {selectedPreset.targetName} is not currently available. Choose another local service or
            start the lab stack.
          </p>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <RequestComposer
          targets={targets}
          draft={draft}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
          onDraftChange={setDraft}
          onSubmit={submitRequest}
        />
        <RequestResultPanel
          result={result}
          targets={targets}
          expectedObservation={selectedPreset?.expectedObservation}
          onCopyResponse={(item) => copyText(item.bodyPreview ?? '')}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <RequestPresetList
          moduleId={module.id}
          presets={modulePresets}
          targets={targets}
          selectedPresetId={selectedPreset?.id}
          onLoadPreset={loadPreset}
        />
        <RequestHistoryPanel
          entries={history}
          selectedEntryIds={compareIds}
          comparison={comparison}
          onToggleCompare={toggleCompare}
          onRetry={retryHistoryEntry}
          onCopyRequest={(entry) => copyText(JSON.stringify(toPayload(entry.draft), null, 2))}
          onCopyResponse={(item) => copyText(item.bodyPreview ?? '')}
        />
        <TestingUtilitiesPanel
          utilities={testingUtilities}
          results={utilityResults}
          runningUtilityId={runningUtilityId}
          onRunUtility={runUtility}
        />
      </div>
    </div>
  );
}

function validateDraft(draft: ServiceRequestDraft) {
  const errors: Record<string, string> = {};
  if (!draft.targetId) errors.targetId = 'Choose a target service.';
  if (!draft.method) errors.method = 'Choose a request method.';
  if (!draft.path || !draft.path.startsWith('/') || draft.path.includes('..')) {
    errors.path = 'Path must start with / and stay within the service.';
  }
  if (draft.timeoutMs < 500 || draft.timeoutMs > 10000) {
    errors.timeoutMs = 'Timeout must be between 500 and 10000 milliseconds.';
  }
  return errors;
}

function toPayload(draft: ServiceRequestDraft): ServiceRequestPayload {
  return {
    targetId: draft.targetId,
    method: draft.method,
    path: draft.path,
    query: draft.query,
    headers: draft.headers,
    body: draft.body.trim() ? draft.body : null,
    timeoutMs: draft.timeoutMs,
    clientRequestId: `req-${Date.now()}`,
  };
}

function localResult(
  status: ServiceRequestResult['status'],
  errorCategory?: string,
  errorMessage?: string
): ServiceRequestResult {
  const now = new Date().toISOString();
  return {
    id: `local-${Date.now()}`,
    status,
    durationMs: 0,
    errorCategory,
    errorMessage,
    bodyPreview: '',
    bodyTruncated: false,
    startedAt: now,
    completedAt: status === 'pending' ? undefined : now,
  };
}

function resultFromError(error: unknown, fallback: ServiceRequestResult): ServiceRequestResult {
  if (error instanceof ApiClientError && isResultPayload(error.payload)) {
    return {
      ...fallback,
      ...error.payload,
      id: error.payload.id ?? fallback.id,
      durationMs: error.payload.durationMs ?? fallback.durationMs,
    };
  }
  return {
    ...fallback,
    status: 'failed',
    errorCategory: 'lab_api_unavailable',
    errorMessage: error instanceof Error ? error.message : 'The Lab API request failed.',
    completedAt: new Date().toISOString(),
  };
}

function isResultPayload(value: unknown): value is Partial<ServiceRequestResult> {
  return Boolean(value && typeof value === 'object' && 'status' in value);
}

function copyText(value: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return;
  void navigator.clipboard.writeText(value).catch(() => undefined);
}
