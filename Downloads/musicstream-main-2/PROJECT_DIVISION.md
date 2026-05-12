# Project division (3 contributors)

This document splits the **musicstream** codebase into **three coherent workstreams**, as if three people built it together. The app still ships as one Vite + React bundle; integration happens in `src/App.jsx`, which wires state and views.

Replace **Contributor 1 / 2 / 3** with real names when you submit or present.

---

## Contributor 1 — Playback engine & app shell

**Focus:** Audio behavior, transport controls, layout chrome, and playback-adjacent overlays.

| Responsibility | Files |
|----------------|--------|
| Root shell & global audio wiring | `src/App.jsx`, `src/App.css` |
| Entry | `src/main.jsx` |
| Global styles | `src/index.css` |
| Navigation chrome | `src/components/sidebar.jsx` |
| Now playing bar | `src/components/player.jsx` |
| Player visuals & seeking | `src/components/PlayerWaveformSeek.jsx`, `src/components/VinylArt.jsx`, `src/components/EqualizerBars.jsx`, `src/components/LyricsMarquee.jsx`, `src/components/Visualizer.jsx` |
| Playback utilities | `src/components/SleepTimer.jsx` |
| Lyrics experience tied to the player | `src/components/LyricsDisplay.jsx`, `src/components/LyricsEditor.jsx` |
| Queue as “what plays next” | `src/views/queueview.jsx` |
| Time formatting (used by player) | `src/util.js` |
| Lyrics fetching / timing helpers | `src/utils/lyricsAPI.js` |
| Static lyric lines | `src/data/lyrics.js` |
| Shared icon set (used everywhere) | `src/components/Icon.jsx` |
| Color extraction for artwork | `src/utils/extractColor.js` |

**Integration notes:** Owns `audioRef`, shuffle/repeat/queue-from-shuffle logic, volume, and props passed into `Player` and queue view. Coordinates with Contributor 2 for `TRACKS` / `ARTISTS` and with Contributor 3 for premium-gated download entry points.

---

## Contributor 2 — Music library, discovery & playlists

**Focus:** Browsing tracks, artists, playlists, likes, and search; reusable track rows.

| Responsibility | Files |
|----------------|--------|
| Catalog data | `src/data.js` |
| Home & discovery surfaces | `src/views/Homeview.jsx`, `src/views/searchview.jsx` |
| Artists & tracks in context | `src/views/Artistsview.jsx` |
| Liked songs | `src/views/Likedview.jsx` |
| Playlists CRUD UI | `src/views/playlistview.jsx`, `src/views/playlistdetailview.jsx` |
| Shared track list row | `src/components/TrackRow.jsx` |
| Add-to-playlist modal | `src/components/AddToPlaylist.jsx` |

**Integration notes:** Views consume `TRACKS`, `ARTISTS`, and callbacks (`onPlay`, `onLike`, `onAddToQueue`, `onAddToPlaylist`) provided by `App.jsx`. Does not own auth or payment flows.

---

## Contributor 3 — Accounts, onboarding, settings & monetization

**Focus:** Identity, preferences, subscription UX, checkout, and offline download UI.

| Responsibility | Files |
|----------------|--------|
| Sign-in | `src/views/LoginView.jsx` |
| First-run preferences | `src/views/OnboardingView.jsx`, `src/musicPreferences.js` |
| User profile | `src/views/ProfileView.jsx` |
| Settings & sign-out | `src/views/SettingsView.jsx` |
| Plans & FAQ | `src/views/SubscriptionView.jsx`, `src/components/PricingPlanCard.jsx`, `src/components/SubscriptionFAQ.jsx` |
| Checkout | `src/views/PaymentView.jsx` |
| Download manager (premium) | `src/components/DownloadManager.jsx` |
| Download implementation | `src/utils/downloadTrack.js` |

**Integration notes:** Auth persistence (`localStorage` / `sessionStorage` keys, `normalizeAuth`, `readAuth` / `writeAuth`) lives in `App.jsx` today; in a real team, Contributor 3 would typically own that module extracted from `App.jsx`. Subscription tier gates `hasPremiumDownloads` and routes to subscription when needed.

---

## Shared / integration (for presentations)

| Item | Note |
|------|------|
| `src/App.jsx` | Central **integration layer**: auth gate, view switcher, playback state, playlist state, modals. In slides, describe it as “joint integration” or assign primary maintenance to Contributor 1 with reviews from 2 and 3. |
| `index.html`, `vite.config.js`, `package.json`, `eslint.config.js` | Project scaffolding; any teammate or a fourth “devops” role. |

---

## Suggested talking points per person

1. **Contributor 1:** Walk through `Audio` lifecycle, shuffle/repeat, `Player` + `LyricsDisplay`, and how `Sidebar` drives `view` state.  
2. **Contributor 2:** Demo `Homeview` → `searchview` → playlists; show `TrackRow` and `AddToPlaylist` data flow.  
3. **Contributor 3:** Demo login → onboarding → profile/settings; subscription → payment; premium downloads via `DownloadManager`.

This mapping is **organizational** only: paths and imports are unchanged so `npm run dev` and `npm run build` behave as before.
