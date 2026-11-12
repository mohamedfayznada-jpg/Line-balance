# Line Balance OS — Delivery TODO

## Normalize and protect local data
- [x] Imported backups normalize settings, arrays, scenario data, and older records before rendering.
- [x] Invalid numeric settings are normalized, and broken predecessor references/cycles appear in the balancing summary instead of silently passing.

## Improve engineering balance analysis
- [x] Balance page shows line efficiency, balance delay, smoothness index, total known work, and missing-time count.
- [x] System validates predecessor references and detects predecessor cycles.
- [x] User can request a transparent heuristic station assignment that respects predecessor order when possible and reports unresolved tasks.
- [x] Station capacity and fixed-operator data influence the heuristic utilization score.

## Connect video analysis to time study
- [x] AI results remain provisional and can be saved as a reviewed time-study observation.
- [x] Saved video studies remain available in the local backup and include model, operator, source file, timestamp, and engine metadata.
- [x] The UI no longer claims that the backend is disconnected when the endpoint is present.

## Harden the API and documentation
- [x] API validates frame count, timestamps, image format, image size, task/station fields, and structured model output.
- [x] API uses no-store responses and configurable CORS.
- [x] README documents GitHub Pages limitations and the required Vercel/serverless deployment for video analysis.

## Verification
- [x] Inline JavaScript passes `node --check`.
- [x] API JavaScript passes `node --check`.
- [x] Backup/metrics/validation smoke checks pass.
- [ ] Changes are committed and pushed to `main`.

## Yamazumi and production-control view
- [x] The overview page shows a lightweight Yamazumi snapshot without third-party chart dependencies.
- [x] The balancing page shows a large stacked Yamazumi chart: each station is a column, each operation is a colored segment, Cycle Time is the column total, and Takt is a red dashed reference line.
- [x] The balancing page shows a per-operation Cycle Time chart with a Takt reference and bottleneck highlighting.
- [x] The chart includes a legend, numeric axes, station labels, and an engineering interpretation note.
- [x] The chart renders from the current assignment or the proposed scenario, and remains diagnostic rather than an automatic approval.

## Deferred production phase
Authentication, multi-user synchronization, a managed database, audit history, and a full mathematical optimization solver remain intentionally deferred. The current heuristic is clearly labeled as a proposal and keeps the browser-only prototype deployable.
