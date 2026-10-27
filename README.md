# LINE BALANCE OS — Eng. Mohamed Fayez

A branded, Arabic-first Line Balancing web app for a sequential Final Assembly → Performance Testing → Packaging line.

## Run locally
Open `index.html` in a modern browser. No build step or third-party library is required.

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then Save.
4. After GitHub Pages finishes publishing, the site URL will be shown in that section.

## Features
- Brand palette: Deep Black `#1A0F12`, Burgundy `#8B1E3F`, Coral Pink `#FF5A7A`, Gold `#F5C451`, Light Cream `#F9E6D1`.
- Station and task master data.
- Raw time study observations with abnormal-cycle flags and manual exclusion from calculations while preserving records.
- Observed-time summaries (mean, median, standard deviation) and a separately stored manually approved standard time.
- Takt time, station workload, and a manual what-if task assignment scenario.
- Loss log and controlled improvement trial records.
- JSON backup import/export and CSV table exports.

## Data and engineering limitations
- Data is stored in the current browser's `localStorage`. It is not automatically synchronized between users, devices, or browsers. Export regular JSON backups. Do not store confidential or personally identifying employee data.
- This app is a client-side prototype, not an authenticated multi-user production system. Do not treat it as a system of record without security, access control, backup, and validation work.
- Takt comparisons and workload totals are diagnostic. The app does not solve all precedence, shared-operator scheduling, parallel tester capacity, ergonomic, or safety constraints automatically.
- Standard-time calculation is indicative. Rating and allowance factors require an approved factory method; calculated times are not automatically approved. Approving a standard is a manual engineering decision.
- Validate results against measured shop-floor performance before implementing labor or process changes.
