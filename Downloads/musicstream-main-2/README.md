Music Stream UI

A React + Vite music streaming UI with player controls, playlists, search, subscription, lyrics, and download management.

Features

- Home dashboard with featured tracks and artists
- Search experience for tracks and artists
- Like / unlike tracks and queue management
- Playlists and playlist detail views
- Audio player controls with shuffle, repeat, volume, and progress
- Lyrics display and sleep timer
- Subscription flow with premium/download gating
- Login / onboarding / profile / settings screens
- Local auth persistence via sessionStorage / localStorage

Project structure

- `src/App.jsx` — main application state and route/view management
- `src/components/` — reusable UI components like `player`, `sidebar`, `DownloadManager`, `LyricsDisplay`, and `SleepTimer`
- `src/views/` — app screens such as `Homeview`, `SearchView`, `LikedView`, `QueueView`, `ArtistsView`, `PlaylistView`, `SubscriptionView`, `LoginView`, `ProfileView`, and `SettingsView`
- `src/data.js` — app data sources for artists and tracks
- `src/utils/downloadTrack.js` — download helper utility

Requirements

- Node.js 18+ (or compatible)
- npm

Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite (usually `http://localhost:5173`)

Available scripts

- `npm run dev` — start Vite development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint on the project files
- `npm run preview` — preview the production build locally

 Notes

- This project uses React 19 with Vite as the build tool.
- The current implementation is a UI prototype and uses local data for tracks and playlists.
- Subscription-related downloads are gated on the client side.
 License

This repository does not include a license file. Add one if you want to publish or share this project publicly.
