# C.A.S.C.O. Supervisor Console — UX/UI Redesign Prompt

You are redesigning the **casco-web** React + Vite frontend for **C.A.S.C.O.** (Casco Autónomo con Sensores de Control y Observación), an autonomous IoT safety-helmet prototype. Implement a new visual and interaction design. Keep the existing backend contracts, Socket.IO behavior, MJPEG clip parser, and Spanish copy. Do not invent telemetry the API does not provide.

---

## Product context (do not ignore)

C.A.S.C.O. improves **post-fall awareness** on industrial and construction sites. Hardware: ESP32-WROOM-32, MPU6050 IMU, ESP32-CAM. A three-stage FSM (freefall → impact → post-impact stillness) confirms a fall, then:

1. Sensor node sends an ESP-NOW trigger to the camera node.
2. Camera locks a **7-second pre-event JPEG buffer** in PSRAM and records **7 seconds after**.
3. The MJPEG clip uploads to backend storage.
4. Supervisors get a **real-time Socket.IO** `fall_alert`.

This UI is the **supervisor console**, not a consumer IoT dashboard and not a marketing site. The primary job is: **see that a worker fell, see the live camera, review the 14-second evidence clip, act**.

Paper results (prototype, not certified PPE): 92.0% sensitivity / 92.5% specificity in lab-like trials; further classifier tuning is required before safety-critical deployment. Surface this honestly with a small “Prototipo de investigación” mark — never as a certified safety system.

---

## Current UX/UI mistakes to eliminate

### Global / chrome
- Leftover Vite template CSS (`index.css` constrains `#root` to 1126px, centers all text, styles unused hero/docs blocks; `App.css` is dead). It fights every page.
- `index.html` is English (`lang="en"`), title is `casco-web`, favicon is the Vite logo. UI language is Spanish.
- No design tokens, no shared layout, no component library. Every screen duplicates inline styles.
- No focus rings, no form semantics (`<form>`), unlabeled inputs, emoji-as-icons, `window.confirm` / `alert` for critical actions.
- Fake “online” green dots on every device card with no connection data — a dangerous lie in a safety product.
- Dual add-device flows (dashboard modal + unused `/add-device` page) with inconsistent IDs (one uppercases, one does not).

### Auth
- Placeholder-only fields (no labels) — fails when the placeholder disappears.
- Login/register do not submit on Enter; no loading or disabled state while the request is in flight.
- No product explanation: a supervisor landing on “C.A.S.C.O. / Sistema de Monitoreo” has no idea what they are signing into.

### Fleet (dashboard)
- Header is only an acronym and two unlabeled buttons. No role, time, or “what is this screen for”.
- Tiny 200px cards with ID + register date. No “open console” affordance besides a vague clickable region vs. a competing “Eliminar”.
- Empty state is a gray sentence, not a recovery path.
- `loadDevices` has no error/retry path.
- Add-device modal: no Escape, no overlay-click, no focus trap, no labelled field.

### Device console
- Fall banner **auto-dismisses after 8 seconds** — unacceptable for a fall alert. Alerts must persist until the supervisor acknowledges them.
- No audible cue (optional, user-controlled) for a new fall.
- Live stream has no reserved aspect ratio (layout jump), no “no signal” guidance, flash toggle swallows errors.
- Event clips autoplay as an endless 10 FPS loop with no pause, no scrubber, no explanation that this is a 7s+7s evidence clip (not a standard MP4).
- Object URLs from parsed JPEGs are never revoked (memory leak when browsing many events).
- Event list treats every item as a generic “⚠ fall” chip; no expand keyboard support.

### Visual tone
- Generic dark admin (`#0f1117` + random orange `#f5a623`) does not read as industrial safety operations.
- Avoid generic AI-UI clichés: purple gradients, Inter-only type, glassmorphism, rounded-everything, decorative sparklines.

---

## Design direction

**Metaphor:** a **site safety operations board** in a construction-yard control room — high-visibility amber, steel, night, stencil markings — not a SaaS analytics suite.

### Visual system
- **Background:** near-black charcoal (`#0a0c0f`) with a faint technical grid and a subtle diagonal high-vis stripe in the auth brand panel only.
- **Raised surfaces:** `#14181f` / `#1b212b`, 1px hairline borders `#2c3542`.
- **Primary (safety amber):** `#f5b301` for primary actions and live accents. Not pastel yellow.
- **Critical:** `#ff2d2d` background/border for unacknowledged falls; text white.
- **Live / ok:** `#1ecf7a` only for *real* live signal or connected sockets — never for “we don’t know”.
- **Muted:** `#8b97a8` on charcoal (contrast ≥ 4.5:1 for body).
- **Type:** **Barlow Condensed** (700/800, wide tracking) for product wordmark and section titles; **Barlow** for UI; **IBM Plex Mono** for device IDs, timestamps, frame counters.
- **Radius:** 6–10px, not 24px pills everywhere. Badges can be slightly more rounded.
- **Density:** operations-dense, not lots of whitespace. Still comfortable on a 13" laptop.
- **Motion:** 150–200ms ease; respect `prefers-reduced-motion`. Alert entrance may pulse *until acknowledged*.

### Brand
- Wordmark: `C.A.S.C.O.` with the expansion visible once: *Casco Autónomo con Sensores de Control y Observación*.
- Custom hard-hat + IMU mark as favicon/logo (not Vite).
- Language: **Spanish (es)** throughout. `html lang="es"`. Title: `C.A.S.C.O. — Consola de supervisión`.

---

## Information architecture (keep routes)

| Route | Role |
|---|---|
| `/login` | Sign in |
| `/register` | Create supervisor account |
| `/` | Fleet of linked helmets |
| `/add-device` | Dedicated link-helmet flow (keep; match dashboard modal behavior: uppercase Device ID) |
| `/device/:deviceId` | Live stream + fall events for one helmet |

Private routes stay token-gated. Do not add fake pages (analytics, maps, worker profiles) that the backend cannot support.

---

## Screen specs

### 1. Login / Register
- Split layout on desktop: **left brand panel** (safety stripes, wordmark, 3-line product job: detect fall → lock 7s pre/post clip → alert supervisor). **Right:** form.
- Stacked on mobile; brand panel compresses to a compact header.
- Real `<form>`, visible `<label>`s, `autocomplete`, submit on Enter, busy button, inline error.
- Register: password confirm, mismatch error, success then redirect.
- Link between login and register.
- Small prototype disclaimer, not a hero claim of 92% accuracy.

### 2. Fleet dashboard (`/`)
- **Top bar:** logo + “Consola de supervisión”, local date/time, Cerrar sesión.
- **Page header:** “Cascos vinculados” + primary “Vincular casco”.
- **Stat chips (honest):** count of linked devices only. Do not invent online/battery/fall-today counts unless fetched.
- **Device cards (min ~280px):** mono Device ID, linked date, primary “Abrir consola”, destructive “Desvincular”. No fake green “online” dot.
- **Empty state:** hard-hat illustration, explanation, CTA to vincular.
- **Error state** if `GET /devices` fails, with retry.
- **Search/filter** by Device ID if there is at least one device.
- Vincular opens an accessible modal (Escape, overlay click, labelled input, uppercase ID, error from API). Same `POST /devices/link` as today.

### 3. Device console (`/device/:deviceId`)
- Top bar: back to fleet, Device ID in mono, **real** WebSocket status (`conectando` / `conectado` / `desconectado` / `error`), optional “Alerta sonora” toggle (default off until the user enables it — browsers block autoplay audio).
- **Unacknowledged fall:** full-width critical banner. Device ID + time. **Does not auto-dismiss.** Button “Reconocer alerta”. Optional short attention tone only if sonora is on *and* there was a user gesture.
- **Live panel:** reserved 16:9 (or 4:3) frame. “En vivo” only when a frame is present; otherwise “Sin señal de cámara” + short hint (helmet powered, paired, on site Wi-Fi). Flash control with `aria-pressed` and visible error if `POST /devices/:id/flash` fails.
- **Events panel:** “Evidencia de caídas (pre 7 s + post 7 s)”. Expand/collapse with keyboard. Empty: “Sin caídas registradas”.
- **MJPEG player:** play/pause, range scrubber, `n / total` frames, ~10 FPS autoplay when playing. Revoke blob URLs on unmount/url change. Explain non-standard MJPEG if load fails.

### 4. Add device page
- Same visual language as the modal. Uppercase ID. Cancel returns home. Success redirects home.

---

## Technical constraints

- Stack: React 19, Vite, react-router-dom, axios, socket.io-client. You may add CSS (preferred) or a font link. Do not require a backend change.
- Preserve:
  - `GET/POST /auth/login|register`
  - `GET /devices`, `POST /devices/link`, `DELETE /devices/:id`
  - `GET /events/:deviceId`, `POST /devices/:id/flash`
  - Socket: `join_device`, `frame`, `fall_alert`
  - MJPEG JPEG SOI/EOI parser for Supabase clips
- `api.js` base URL stays `https://casco-backend.onrender.com` (or existing env usage in DeviceView).
- Accessibility: focus visible, dialog semantics, buttons have `type`, images have alt, contrast.
- Responsive: auth, fleet grid, and console stack cleanly below ~900px.
- Remove unused Vite template CSS (`App.css` hero, `#root` 1126px column, centered text).

---

## Out of scope

- Do not add maps, worker HR profiles, battery charts, or FSM debug graphs unless the API returns them.
- Do not present lab sensitivity/specificity as a live KPI.
- Do not auto-play alert sound without an explicit supervisor toggle.
- Do not keep the 8-second auto-dismiss of fall alerts.

---

## Definition of done

- All current routes work with the new UI.
- Fall alerts persist until acknowledged.
- No fake device-online indicators.
- Auth forms are real forms with labels and Enter-to-submit.
- MJPEG player has pause/scrub and no object-URL leak.
- Spanish UI, `lang="es"`, branded title/favicon.
- Builds with existing Vite/ESLint setup.
