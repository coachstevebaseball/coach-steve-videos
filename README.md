# Coach Steve Film Room

Two-page video showcase for Coach Steve Baseball:

- `index.html` — split-screen entry (The Cage / Game Day)
- `cage.html` — 31 cage training sessions, player filters, embedded full playlist (`PLf-AYFJb_UQ0`)
- `gameday.html` — game clips with result tags, featured Gunnar Nelson home run, embedded full playlist (`PLOJLN7PMUYVg`)

## How it works

**The site is fully static** (`HTML/CSS/JS`, no build step) **with an optional Python backend** for live playlist updates.

- Without the backend: the pages render from the bundled snapshot (`videos.js`), and the two embedded YouTube playlist players still always reflect the current playlists automatically.
- With the backend (`server.py`, FastAPI on port 8000): the video grids, filters, and counters refresh automatically as you add videos to either YouTube playlist (15-minute cache). The frontend calls `/api/videos` and silently falls back to the snapshot if the API is unreachable.

## Files

| File            | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `index.html`    | Entry page                                                     |
| `cage.html`     | Training page                                                  |
| `gameday.html`  | Game footage page                                              |
| `base.css`      | Reset + base styles                                            |
| `style.css`     | Design system (light/dark, red/gold accents)                   |
| `app.js`        | Grids, filters, lightbox player, live-data fetch with fallback |
| `videos.js`     | Bundled video snapshot (frontend fallback)                     |
| `server.py`     | Optional live-update API (FastAPI)                             |
| `snapshot.json` | Bundled snapshot used by the backend as last resort            |

## Deploying static-only (Hostinger, Netlify, GitHub Pages, Cloudflare Pages, any web host)

Upload every file except `server.py` and `snapshot.json` (uploading them is harmless, they just won't run). No build step needed. The grids will show the bundled snapshot; the embedded playlist players stay fully automatic.

To refresh the snapshot later, regenerate `videos.js` from the playlists (or re-export from this project) and re-upload.

## Deploying with live updates (Render, Railway, Fly.io, a VPS, or any Python host)

1. Serve the static files from the project root.
2. Run the API: `pip install fastapi uvicorn yt-dlp` then `python3 server.py` (listens on `0.0.0.0:8000`).
3. Point the frontend at the API: in `app.js`, replace the `API` constant with your API's public URL, e.g. `const API = 'https://your-api.example.com';`
4. The backend fetches playlist data with `yt-dlp` (no YouTube account or API key required — works for these unlisted playlists).

Note for Vercel/Netlify functions: `server.py` is a long-running FastAPI app. For serverless platforms, either keep the site static-only or port the `/api/videos` handler to a serverless function that shells out to `yt-dlp` (or use a YouTube Data API key with `playlistItems.list`).

## Changing playlists or the featured video

- Playlist IDs: `CAGE_PLAYLIST` / `GAME_PLAYLIST` at the top of `server.py`, and the two `videoseries?list=` iframe URLs in `cage.html` / `gameday.html`.
- Featured videos: the `data-featured` attribute on `<body>` in `cage.html` and `gameday.html` (currently Emmett's transformation and Gunnar's home run).
- Player names for filters: the `PLAYERS` map in `server.py`.
- Result labels for game clips: the `RESULTS` map in `server.py` (falls back to keyword detection for new clips).
