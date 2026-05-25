# Contract: UI Lab Testing Workspace

This contract defines the learner-visible behavior for the testing workspace inside the Labs UI.

## Entry Point

- The workspace is reachable from the selected lab module detail area.
- It must not replace the existing Overview, Experiments, or Guide content.
- The workspace should be available only after a module is selected.

## Required Regions

### Target and Request Composer

- Shows target service selection.
- Shows method, path, query, headers, body, and timeout controls.
- Validates required fields before sending.
- Keeps the draft editable after success or failure.
- Shows pending state immediately after send.

### Request Presets

- Shows module-specific presets before generic utilities.
- Loading a preset fills the request composer and displays the expected observation.
- State-changing presets are visibly labeled.
- Presets can be edited before sending.

### Result Viewer

- Shows target, method, path, status, duration, timestamp, response headers, response body preview, truncation state, and actionable error details.
- Handles empty, invalid, or large bodies without breaking layout.
- Provides copy actions for request and response content where supported.

### History and Comparison

- Shows latest request history entries for the current browser session.
- Each entry includes target, method, path, status, duration, timestamp, and response summary.
- Retry loads a copy of a historical request into the composer.
- Comparing two entries highlights status, timing, and response-content differences.

### Utilities

- Provides service health checks, sample data helpers, cleanup reminders, and safe reset actions where relevant.
- Read-only and state-changing utilities are visually distinguished.
- State-changing utilities require deliberate confirmation.
- Utility failures show actionable next steps and do not discard the current request draft.

## Accessibility and Layout

- All controls are keyboard reachable.
- Tab and panel semantics must stay compatible with the existing Lab detail tabs.
- Status and error information must not rely on color alone.
- Dark and light themes must remain supported.
- Content must not overflow or overlap on tablet and desktop lab workflows.

## Empty and Failure States

- If no services are available, the workspace explains that the lab stack must be running and offers a health check when possible.
- If presets are not available for a module, the workspace still allows custom local lab service requests.
- If the Lab API request runner is unavailable, the workspace keeps the draft and displays a retryable failure message.
