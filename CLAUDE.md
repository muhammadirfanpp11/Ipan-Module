# Ipan Module - Mochy Music Audio Suite

## Architecture Overview
- **Main backend (Cloudflare Worker):** `C:\Users\Win10\Ipan Module\worker.js` — serves endpoints `/manifest.json`, `/search`, `/stream`, `/proxy`, `/lyrics`, `/metadata`.
- **Local / JS Module:** `C:\Users\Win10\Ipan Module\index.js` & `ipan.js` — sandboxed local script for direct import into Mochy Music settings/modules.
- **Packaging:** `ipan-scripts.zip` — archive containing `index.json` and `ipan.js` specifically for importing into JS Modules menu.

## Features
1. **Hi-Res Lossless Core:** Primary source = tracks.monochrome.st FLAC (bit-perfect 24-bit/96kHz). Fallback = JioSaavn 320kbps MP4/AAC.
2. **Dynamic Search:** Query interpolates artists + title, auto splits on spaces for better track matching (Mochy TrackMatcher).
3. **Full Audio Streaming:** Direct FLAC URLs + CORS/bypass headers + proxy support for JioSaavn (fixing HTTP 403 anti-hotlink).
4. **Synced Lyrics:** LRCLIB auto-lookup on request (fallback text: `Lirik untuk ... oleh ...`).
5. **Rich Metadata:** Album, genres, writers, producers from metadata endpoint.
6. **Settings Integration:** Quality toggle (hires/lossless/high) per user preferences.

## Progress (Latest)
- **Completed:**
  - Full Cloudflare Worker deployment ready (`ipan-module.mirfanpp11.workers.dev`).
  - Local JS module prepared for import into Mochy JS Modules.
  - Monochrome search flows + JioSaavn streaming working.
  - Slider progress fix (duration sent correctly).
  - CORS & anti-hotlink bypass headers.
- **In Progress / Open:**
  - Lyric API coverage: Some songs not in LRCLIB (e.g., "Dunia yang salah" by Raim Laode) return standard fallback.
  - Want to improve lyric search: try multiple query forms, fuzzy matching, or expand sources.

## How to use
1. **Import into Mochy:** via Settings → Modules → Add a module → From a file → select `ipan-scripts.zip`.
2. **Enable in Mochy:** Switch Ipan Module ON; set quality (hires/lossless/high) under Audio Lab.
3. **Play any song:** Mochy calls `/search?q=...`, picks best match, then `/stream/{id}` to play.
4. **Lyrics appear:** auto-synced from LRCLIB if available.

## Special notes
- Lyric fallback: If no synced lyrics in LRCLIB, returns `plainLyrics` ("Lirik untuk ... oleh ...") to avoid no lyrics at all.
- Audio proxy: JioSaavn auth URL is proxied via `/proxy` so Mochy can reach 320kbps streams from Android devices.
- Monochrome gives direct 200 OK with `Content-Type: audio/octet-stream` (FLAC). Use is free for non-commercial/high-res playback.
- If search returns multiple matches, Mochy TrackMatcher picks based on artist/title/duration.

## Next improvements
- Expand lyric coverage (e.g., contributions, manual sync, or backup lyric APIs).
- Handle newer indie/local songs (explore additional music metadata APIs).
- Add cover art / album art from Monochrome or JioSaavn.
- Optimize Monochrome fallback logic (rate limiting, retry).
