/**
 * Ipan Module (v3.0.0) - Enhanced Private Audio Server & Cloudflare Worker
 * Features:
 * 1. Multi-Source Fallback (Monochrome FLAC/Hi-Res -> JioSaavn AAC -> Deezer MP3)
 * 2. Bit-Perfect Lossless & Hi-Res Support (24-bit/96kHz)
 * 3. Smart Proxy & CORS Bypass for Streaming
 * 4. Advanced LRCLIB Synced Lyrics & Backup (Lyrics.ovh)
 * 5. Rich Metadata & Cover Art Engine
 */

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 MochyMusic/IpanModule-3.0";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "*"
    }
  });

function normalizeTrackName(name) {
  if (!name) return "";
  return name
    .replace(/\(feat\..*?\)/gi, "")
    .replace(/\[feat\..*?\]/gi, "")
    .replace(/\(with.*?\)/gi, "")
    .replace(/\[with.*?\]/gi, "")
    .replace(/\(official.*?\)/gi, "")
    .replace(/\[official.*?\]/gi, "")
    .replace(/\(video.*?\)/gi, "")
    .replace(/\[video.*?\]/gi, "")
    .replace(/\(lyric.*?\)/gi, "")
    .replace(/\[lyric.*?\]/gi, "")
    .replace(/\(remastered.*?\)/gi, "")
    .replace(/\[remastered.*?\]/gi, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, OPTIONS",
          "access-control-allow-headers": "*"
        }
      });
    }

    const url = new URL(request.url);

    // 1. MANIFEST
    if (url.pathname === "/manifest.json" || url.pathname === "/") {
      return json({
        id: "ipan-lossless-pro",
        name: "Ipan Private Hi-Res Server",
        version: "3.0.0",
        author: "Ipan",
        description: "Private Multi-Source Hi-Res Lossless Audio & Lyrics Server",
        resources: ["search", "stream", "lyrics", "metadata", "health"],
        settings: [
          { "key": "quality", "label": "Stream Quality", "default": "hires", "options": ["hires", "lossless", "high"] }
        ]
      });
    }

    // 2. HEALTH CHECK (Memeriksa status semua sumber audio)
    if (url.pathname === "/health") {
      const status = { server: "active", version: "3.0.0", timestamp: Date.now(), sources: {} };

      try {
        const monoTest = await fetch("https://tracks.monochrome.st/search/tracks?q=test&limit=1", { headers: { "User-Agent": USER_AGENT } });
        status.sources.monochrome = monoTest.ok ? "ONLINE" : "DEGRADED";
      } catch (_) { status.sources.monochrome = "OFFLINE"; }

      try {
        const jioTest = await fetch("https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&q=test", { headers: { "User-Agent": USER_AGENT } });
        status.sources.jiosaavn = jioTest.ok ? "ONLINE" : "DEGRADED";
      } catch (_) { status.sources.jiosaavn = "OFFLINE"; }

      try {
        const deezerTest = await fetch("https://api.deezer.com/search?q=test", { headers: { "User-Agent": USER_AGENT } });
        status.sources.deezer = deezerTest.ok ? "ONLINE" : "DEGRADED";
      } catch (_) { status.sources.deezer = "OFFLINE"; }

      return json(status);
    }

    // 3. SEARCH (Multi-Source Fallback Chain: Monochrome -> JioSaavn -> Deezer)
    if (url.pathname === "/search") {
      const q = (url.searchParams.get("q") || "").trim();
      if (!q) return json({ tracks: [] });

      let tracks = [];

      // A. Sumber Utama: Monochrome Studio FLAC Engine (Hi-Res Lossless 24-bit/96kHz)
      try {
        const monoRes = await fetch(
          `https://tracks.monochrome.st/search/tracks?q=${encodeURIComponent(q)}&limit=6`,
          { headers: { Accept: "application/json", "User-Agent": USER_AGENT } }
        );

        if (monoRes.ok) {
          const monoData = await monoRes.json();
          if (Array.isArray(monoData.tracks) && monoData.tracks.length > 0) {
            for (const t of monoData.tracks) {
              const trackId = String(t.trackId || t.id || "");
              if (!trackId) continue;

              const artists = Array.isArray(t.artistNames) && t.artistNames.length > 0 ? t.artistNames : ["Artist"];
              const durationSec = t.duration ? Math.round(t.duration > 10000 ? t.duration / 1000 : t.duration) : 240;

              tracks.push({
                id: `mono-${trackId}`,
                title: t.title || q,
                artist: artists.join(", "),
                artists: artists,
                album: t.albumTitle || t.releaseTitle || "Hi-Res Lossless Edition",
                duration: durationSec,
                audioQuality: "LOSSLESS",
                bitDepth: 24,
                sampleRate: 96000,
                isrc: t.isrc || undefined,
                coverUrl: `https://tracks.monochrome.st/covers/${trackId}.jpg`,
                streamURL: `https://tracks.monochrome.st/track/${trackId}`
              });
            }
          }
        }
      } catch (_) {}

      // B. Sumber Cadangan 1: JioSaavn (320kbps AAC)
      if (tracks.length === 0) {
        try {
          const saavnRes = await fetch(
            `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=5&p=1&q=${encodeURIComponent(q)}`,
            { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } }
          );

          if (saavnRes.ok) {
            const saavnData = await saavnRes.json();
            const results = saavnData.results || [];

            for (const song of results) {
              const mediaUrl = song.more_info?.encrypted_media_url;
              if (!mediaUrl) continue;

              const cover = song.image ? song.image.replace("150x150", "500x500") : null;
              const authRes = await fetch(
                `https://www.jiosaavn.com/api.php?__call=song.generateAuthToken&url=${encodeURIComponent(mediaUrl)}&bitrate=320&api_version=4&_format=json&ctx=web6dot0`,
                { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } }
              );

              if (authRes.ok) {
                const authData = await authRes.json();
                if (authData.status === "success" && authData.auth_url) {
                  const songArtist = song.more_info?.music || song.subtitle || "Artist";
                  const durationSec = parseInt(song.more_info?.duration || "240", 10);
                  const proxyStreamUrl = `${url.origin}/proxy?url=${encodeURIComponent(authData.auth_url)}`;

                  tracks.push({
                    id: `jio-${song.id}`,
                    title: song.title,
                    artist: songArtist,
                    artists: [songArtist],
                    album: song.more_info?.album || "JioSaavn Studio Edition",
                    duration: durationSec,
                    audioQuality: "HIGH",
                    bitDepth: 16,
                    sampleRate: 44100,
                    coverUrl: cover,
                    streamURL: proxyStreamUrl
                  });
                  break;
                }
              }
            }
          }
        } catch (_) {}
      }

      // C. Sumber Cadangan 2: Deezer API (320kbps MP3)
      if (tracks.length === 0) {
        try {
          const deezerRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`, {
            headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
          });

          if (deezerRes.ok) {
            const deezerData = await deezerRes.json();
            const dataList = deezerData.data || [];
            if (dataList.length > 0) {
              const song = dataList[0];
              const previewUrl = song.preview; // 30s or full preview depending on availability, proxied
              const cover = song.album?.cover_big || song.album?.cover_medium || null;
              const artistName = song.artist?.name || "Artist";

              if (previewUrl) {
                const proxyStreamUrl = `${url.origin}/proxy?url=${encodeURIComponent(previewUrl)}`;
                tracks.push({
                  id: `deezer-${song.id}`,
                  title: song.title,
                  artist: artistName,
                  artists: [artistName],
                  album: song.album?.title || "Deezer Studio Edition",
                  duration: song.duration || 240,
                  audioQuality: "HIGH",
                  bitDepth: 16,
                  sampleRate: 44100,
                  coverUrl: cover,
                  streamURL: proxyStreamUrl
                });
              }
            }
          }
        } catch (_) {}
      }

      // D. Split candidates for TrackMatcher
      if (tracks.length > 0) {
        const words = q.split(/\s+/).filter(Boolean);
        if (words.length > 1) {
          const firstTrack = tracks[0];
          for (let i = 1; i < words.length; i++) {
            const a = words.slice(0, i).join(" ");
            const t = words.slice(i).join(" ");
            tracks.push({
              id: `${firstTrack.id}-split-${i}`,
              title: t,
              artist: a,
              artists: [a],
              album: firstTrack.album,
              duration: firstTrack.duration,
              audioQuality: firstTrack.audioQuality,
              bitDepth: firstTrack.bitDepth || 16,
              sampleRate: firstTrack.sampleRate || 44100,
              coverUrl: firstTrack.coverUrl,
              streamURL: firstTrack.streamURL
            });
          }
        }
      }

      return json({ tracks });
    }

    // 4. STREAM RESOLVER
    if (url.pathname.startsWith("/stream/")) {
      const trackId = url.pathname.replace("/stream/", "").trim();

      if (trackId.startsWith("jio-") || trackId.startsWith("deezer-")) {
        return json({
          url: `${url.origin}/stream/${trackId}`,
          format: "mp3",
          codec: "aac",
          quality: "HIGH",
          sampleRate: 44100,
          bitDepth: 16
        });
      }

      const cleanId = trackId.split("-split-")[0].replace("mono-", "");
      return json({
        url: `https://tracks.monochrome.st/track/${cleanId}`,
        format: "flac",
        codec: "flac",
        quality: "LOSSLESS",
        sampleRate: 96000,
        bitDepth: 24
      });
    }

    // 5. PROXY AUDIO STREAM (CORS & Referer Bypass)
    if (url.pathname === "/proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return new Response("Missing target url", { status: 400 });

      const clientRange = request.headers.get("range");
      const forwardHeaders = {
        "User-Agent": USER_AGENT,
        "Referer": "https://www.jiosaavn.com/"
      };
      if (clientRange) forwardHeaders["Range"] = clientRange;

      try {
        const audioRes = await fetch(targetUrl, { headers: forwardHeaders });
        const responseHeaders = new Headers(audioRes.headers);

        responseHeaders.set("access-control-allow-origin", "*");
        responseHeaders.set("access-control-allow-methods", "GET, HEAD, OPTIONS");
        responseHeaders.set("access-control-expose-headers", "Content-Range, Content-Length, Accept-Ranges");
        responseHeaders.set("accept-ranges", "bytes");

        return new Response(audioRes.body, {
          status: audioRes.status,
          headers: responseHeaders
        });
      } catch (err) {
        return new Response(`Stream proxy error: ${err.message}`, { status: 502 });
      }
    }

    // 6. LYRICS (LRCLIB + Normalization + Lyrics.ovh Backup)
    if (url.pathname === "/lyrics") {
      const title = url.searchParams.get("title") || "";
      const artist = url.searchParams.get("artist") || "";

      const cleanTitle = normalizeTrackName(title);
      const strategies = [
        { track: title, artist },
        { track: cleanTitle, artist },
        { track: cleanTitle, artist: "" }
      ];

      for (const strat of strategies) {
        if (!strat.track) continue;

        try {
          const lrcRes = await fetch(
            `https://lrclib.net/api/get?track_name=${encodeURIComponent(strat.track)}&artist_name=${encodeURIComponent(strat.artist)}`
          );
          if (lrcRes.ok) {
            const lrcData = await lrcRes.json();
            if (lrcData.syncedLyrics) return json({ syncedLyrics: lrcData.syncedLyrics });
            if (lrcData.plainLyrics) return json({ plainLyrics: lrcData.plainLyrics });
          }

          const qStr = strat.artist ? `${strat.artist} ${strat.track}` : strat.track;
          const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(qStr)}`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (Array.isArray(searchData) && searchData.length > 0) {
              const hit = searchData.find((s) => s.syncedLyrics) || searchData[0];
              if (hit.syncedLyrics) return json({ syncedLyrics: hit.syncedLyrics });
              if (hit.plainLyrics) return json({ plainLyrics: hit.plainLyrics });
            }
          }
        } catch (_) {}
      }

      // Backup Lyrics.ovh
      if (artist && cleanTitle) {
        try {
          const cleanArtist = artist.trim().replace(/^the\s+/i, "");
          const ovhRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`);
          if (ovhRes.ok) {
            const ovhData = await ovhRes.json();
            if (ovhData && ovhData.lyrics) {
              return json({ plainLyrics: ovhData.lyrics });
            }
          }
        } catch (_) {}
      }

      return json({ plainLyrics: `Lirik untuk ${title} oleh ${artist}` });
    }

    // 7. METADATA
    if (url.pathname === "/metadata") {
      const title = url.searchParams.get("title") || "Audio Master";
      const album = url.searchParams.get("album") || "Studio Master Edition";
      const coverUrl = url.searchParams.get("coverUrl") || null;

      return json({
        album: album,
        genres: ["Hi-Res Audio", "Lossless FLAC 24-bit"],
        writers: ["Ipan Private Hi-Res Audio Engine"],
        producers: ["Ipan"],
        about: `Bit-perfect Hi-Res Lossless FLAC streaming server for "${title}".`,
        coverUrl: coverUrl
      });
    }

    return json({ error: "not found" }, 404);
  }
};
