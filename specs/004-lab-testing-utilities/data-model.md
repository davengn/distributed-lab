# Data Model: Lab Testing Utilities

## ServiceTarget

Represents a local lab service that can receive learner requests.

**Fields**:

- `id`: Stable service identifier.
- `name`: Learner-facing service name.
- `status`: `ready`, `degraded`, `unavailable`, or `unknown`.
- `moduleIds`: Lab modules where this target is relevant.
- `basePath`: Internal target base path resolved by Lab API, never edited directly by the learner.
- `allowedMethods`: Supported request methods for the target.
- `healthPath`: Optional path used for health checks.
- `lastObservedAt`: Timestamp for service status freshness.

**Validation rules**:

- Target must come from the Lab API target registry.
- Target must resolve to the local lab environment.
- Unavailable targets can be displayed but cannot be submitted without an explicit retry attempt that returns a clear failure.

## ServiceRequestDraft

Represents a learner-composed request before submission.

**Fields**:

- `targetId`: Selected `ServiceTarget`.
- `method`: Request method.
- `path`: Relative service path.
- `query`: Optional key/value query entries.
- `headers`: Optional key/value headers.
- `body`: Optional request body text.
- `timeoutMs`: Request timeout.
- `presetId`: Optional source preset.
- `validationErrors`: Field-level validation messages.

**Validation rules**:

- `targetId`, `method`, and `path` are required.
- `path` must be relative and must not contain a scheme, host, or parent-directory traversal.
- Header names must be non-empty and unique.
- Body content must be valid for presets or methods that require structured content.
- Timeout must stay within the configured minimum and maximum.

## RequestPreset

Represents a guided request template for a module or concept.

**Fields**:

- `id`: Stable preset identifier.
- `moduleId`: Related lab module.
- `label`: Learner-facing preset name.
- `description`: What the preset demonstrates.
- `concepts`: Related distributed-systems concepts.
- `targetName`: Preferred target service name.
- `method`: Request method.
- `path`: Relative request path.
- `headers`: Optional default headers.
- `body`: Optional default body.
- `expectedObservation`: What learners should look for after sending.
- `safety`: `read_only` or `state_changing`.

**Validation rules**:

- Presets must reference an existing lab module.
- Presets must use a relative path.
- State-changing presets must be visibly marked in the UI.

## ServiceRequestResult

Represents the outcome of a submitted request.

**Fields**:

- `id`: Client-generated or server-returned result identifier.
- `request`: Request summary.
- `status`: `pending`, `succeeded`, `failed`, `timed_out`, or `blocked`.
- `httpStatus`: Optional downstream response status.
- `durationMs`: Elapsed time.
- `responseHeaders`: Optional downstream response headers.
- `bodyPreview`: Response body preview suitable for display.
- `bodyTruncated`: Whether the preview is capped.
- `errorCategory`: Optional category such as `validation`, `target_unavailable`, `timeout`, or `downstream_error`.
- `errorMessage`: Optional actionable error message.
- `startedAt`: Request start timestamp.
- `completedAt`: Optional completion timestamp.

**Validation rules**:

- Failed, timed-out, and blocked results must include `errorCategory` and `errorMessage`.
- Large bodies must be truncated for display while preserving status and timing.
- Result status must move out of `pending` exactly once.

## RequestHistoryEntry

Represents a session-scoped request and result pair.

**Fields**:

- `id`: History entry identifier.
- `draft`: Request draft at submission time.
- `result`: Request result.
- `moduleId`: Optional selected lab module.
- `createdAt`: Timestamp.

**Validation rules**:

- History is bounded to the latest 20 entries by default.
- Retry loads a copy of the historical draft, not a mutable reference.
- History should clear when the browser session ends.

## TestingUtility

Represents a supporting lab testing action.

**Fields**:

- `id`: Utility identifier.
- `label`: Learner-facing name.
- `description`: Purpose and expected result.
- `moduleId`: Optional related module.
- `targetId`: Optional required service target.
- `safety`: `read_only` or `state_changing`.
- `kind`: `health_check`, `sample_data`, `cleanup_reminder`, or `safe_reset`.
- `requiresConfirmation`: Whether learner confirmation is required.

**Validation rules**:

- State-changing utilities must require confirmation.
- Utilities with a target must validate the target against the target registry.
- Cleanup reminders may be displayed without making a backend call.

## UtilityRunResult

Represents the outcome of running a testing utility.

**Fields**:

- `utilityId`: Utility identifier.
- `status`: `pending`, `succeeded`, `failed`, or `skipped`.
- `message`: Learner-facing outcome.
- `details`: Optional structured details.
- `durationMs`: Optional elapsed time.
- `completedAt`: Optional timestamp.

**Validation rules**:

- Failed utility runs must include an actionable message.
- Read-only utility failures must not alter the active request draft.

## ComparisonResult

Represents a comparison between two request results.

**Fields**:

- `leftEntryId`: First history entry.
- `rightEntryId`: Second history entry.
- `statusChanged`: Whether response status changed.
- `durationDeltaMs`: Timing difference.
- `bodySummary`: Human-readable response difference summary.
- `generatedAt`: Timestamp.

**Validation rules**:

- Both compared entries must exist in current session history.
- Comparison must not mutate either historical result.

## State Transitions

### Request execution

```text
draft -> validating -> blocked
draft -> validating -> pending -> succeeded
draft -> validating -> pending -> failed
draft -> validating -> pending -> timed_out
```

### Utility execution

```text
available -> confirming -> pending -> succeeded
available -> confirming -> pending -> failed
available -> skipped
```

### History

```text
empty -> append result -> compare selected results -> retry as new draft
```
