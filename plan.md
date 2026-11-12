# Line Balance OS — Implementation Plan

## Goal
Upgrade the existing Arabic-first prototype into a safer and more useful engineering tool without breaking its zero-build browser workflow.

## Implementation approach
- Keep the current single-page interface and localStorage workflow for backward compatibility.
- Add database normalization/migration so imported or older backups cannot break rendering.
- Add engineering diagnostics: predecessor validation, line-efficiency metrics, balance delay, smoothness index, and a transparent heuristic auto-balance suggestion.
- Add a reviewed path from AI video analysis into a time-study observation while preserving the AI result as provisional.
- Harden the serverless Gemini endpoint with request limits, input validation, no-store responses, configurable CORS, and output validation.
- Update deployment documentation to distinguish GitHub Pages static hosting from Vercel/serverless hosting.

## Main files
- `index.html`: UI, state management, calculations, scenario suggestion, video-to-study handoff.
- `api/analyze-video.js`: Gemini proxy validation and response hardening.
- `README.md`: deployment and engineering limitations.
- `plan.md`, `TODO.md`: implementation record.

## Design decisions
The existing visual direction remains: a branded industrial dashboard using the burgundy/gold/coral palette, compact cards, clear Arabic labels, and explicit engineering warnings. New metrics will appear in the balancing page, and automatic suggestions will remain clearly labeled as heuristic proposals requiring review.

## Delivery boundary
This iteration does not introduce authentication, multi-user synchronization, or a production database. Those remain the next platform phase after validating the engineering workflow with real shop-floor data.
