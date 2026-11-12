# LINE BALANCE OS — Eng. Mohamed Fayez

A branded, Arabic-first Line Balancing web app for a sequential Final Assembly → Performance Testing → Packaging line.

## Run locally
Open `index.html` in a modern browser. No build step or third-party library is required for the local data-entry workflow. To test video analysis locally, serve the repository through a serverless-compatible deployment or configure a proxy for `/api/analyze-video`.

## Publish the static workflow with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then Save.
4. After GitHub Pages finishes publishing, the site URL will be shown in that section.

GitHub Pages serves the browser-only workflow, but it cannot execute `api/analyze-video.js`. The live video-analysis button requires deploying the repository to Vercel (or another serverless host) with `GEMINI_API_KEY` and optionally `GEMINI_MODEL` configured. The endpoint also accepts `ALLOWED_ORIGIN` to restrict browser callers. Do not put the Gemini key in the browser or in a committed file.

## Features
- Brand palette: Deep Black `#1A0F12`, Burgundy `#8B1E3F`, Coral Pink `#FF5A7A`, Gold `#F5C451`, Light Cream `#F9E6D1`.
- Station and task master data.
- Raw time study observations with abnormal-cycle flags and manual exclusion from calculations while preserving records.
- Observed-time summaries (mean, median, standard deviation) and a separately stored manually approved standard time.
- Takt time, station workload, and a manual what-if task assignment scenario.
- Loss log and controlled improvement trial records.
- JSON backup import/export and CSV table exports.
- Engineering diagnostics: predecessor checks, line efficiency, balance delay, smoothness index, and missing-time warnings.
- A transparent heuristic auto-balance suggestion that remains subject to engineering review.
- Provisional video-analysis results can be stored as a reviewed time-study observation and included in local backups.

## Data and engineering limitations
- Data is stored in the current browser's `localStorage`. It is not automatically synchronized between users, devices, or browsers. Export regular JSON backups. Do not store confidential or personally identifying employee data.
- This app is a client-side prototype, not an authenticated multi-user production system. Do not treat it as a system of record without security, access control, backup, and validation work.
- Takt comparisons and workload totals are diagnostic. The app does not solve all precedence, shared-operator scheduling, parallel tester capacity, ergonomic, or safety constraints automatically.
- The auto-balance action is a heuristic proposal, not an optimization proof. Review precedence, operator availability, capacity, quality gates, skill constraints, and the physical layout before trialing it.
- Standard-time calculation is indicative. Rating and allowance factors require an approved factory method; calculated times are not automatically approved. Approving a standard is a manual engineering decision.
- Validate results against measured shop-floor performance before implementing labor or process changes.
