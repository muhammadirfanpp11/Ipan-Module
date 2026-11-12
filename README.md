# 🎵 Ipan Module (v2.2.0) for Mochy Music

Modul audio komprehensif & script **JS Modules** resmi untuk **Mochy Music** (Android) yang menggabungkan kualitas audio audiophile (Hi-Res Lossless 24-bit/96kHz), lirik sinkron karaoke, in-memory cache, serta proteksi anti-crash.

---

## ✨ Fitur Unggulan (JS Modules & Audio Suite)

1. **⚡ Mochy JS Modules Official API Integration**:
   - `searchTracks(query, limit, context)`: Pencarian lagu dengan return format standar Mochy.
   - `getTrackStreamUrl(id, quality, context)`: Penyedia audio stream berkualitas Hi-Res / Lossless FLAC.
   - `getTrackLyrics(track, context)`: Lirik tersinkronisasi (.lrc karaoke) otomatis dari LRCLIB.
   - `getTrackMetadata(track, context)`: Informasi lengkap lagu untuk fitur *About song*.

2. **🏅 Badge Metadata Hi-Res Audio (Audiophile Specs)**:
   - Deteksi otomatis kualitas audio: `Hi-Res Lossless` (24-bit / 96kHz), `CD Quality` (16-bit / 44.1kHz FLAC/ALAC), atau `High Quality` (320kbps MP3).
   - Menampilkan spesifikasi teknis dan warna badge khas layaknya Apple Music/Tidal.

3. **⚡ In-Memory Stream Cache (Insta-Play)**:
   - Menyimpan URL stream yang sudah di-resolve ke memori sementara.
   - Lagu yang diputar ulang akan langsung jalan **seketika (0 detik loading)** tanpa fetch ulang.

4. **🔄 Anti-Crash & Auto Fallback Engine**:
   - Menangani link add-on eksternal yang bermasalah secara aman tanpa membuat aplikasi freeze/force-close.
   - Otomatis beralih ke stream alternatif (SoundHelix FLAC/MP3) jika link utama bermasalah.

5. **🎤 Auto Synchronized Lyrics (Karaoke Mode)**:
   - Terintegrasi langsung dengan database lirik terbuka (LRCLIB).
   - Mengambil lirik ber-timestamp (`.lrc`) otomatis berdasarkan judul lagu dan artis.
   - **Peningkatan**: Pembersihan judul multi-bahasa, query backup, & cache.

6. **🛡️ CORS & User-Agent Bypass Engine**:
   - Menyisipkan header otomatis (*Referer*, *Origin*, *Range bytes*, *Modern Browser User-Agent*) untuk mencegah link streaming terblokir oleh server audio eksternal.

7. **🖼️ Dynamic Cover Art & Enhanced Metadata**:
   - Mengambil URL cover art otomatis dari Monochrome & JioSaavn.
   - Metadata enriched: ISRC, release date, writers, producers.

---

## 📲 Cara Pemasangan di Mochy Music

Kamu bisa memasang **Ipan Module** di aplikasi Mochy Music dengan 3 cara resmi:

### Cara 1: Via JS Modules (Rekomendasi)
1. Buka Mochy Music → **Settings → Modules → JS Modules**.
2. Pada bagian **Sources**, tap **Add from a file or a link**.
3. **Pilih ZIP**: `ipan-scripts.zip` (tersedia di root Ipan Module)

### Cara 2: Via Add Link Manifest / Web Module
1. Buka Mochy Music → **Settings → Modules → Add a module**.
2. Paste link manifest RAW:
   ```text
   https://raw.githubusercontent.com/muhammadirfanpp11/Ipan-Module/main/manifest.json
   ```

### Cara 3: Via Cloudflare Worker (Mochy Internal)
1. **Cloudflare Worker URL**: `https://ipan-module.mirfanpp11.workers.dev`
2. Pada bagian **Add a module**, pilih **Web Module** dan paste URL worker.
3. Worker menangani semua endpoint secara internal: `/search`, `/stream`, `/lyrics`, `/metadata`, `/proxy`.

---

## 🔄 Alur Kerja Modul (Cara Kerja)

### 1. Modul JS vs. Web Module
- **JS Modules** (Cara 1): Script murni, berjalan di sisi klien Mochy, menggunakan API `searchTracks`, `getTrackStreamUrl`, dll. Runtime responsif & offline.
- **Web Module** (Cara 2/3): Worker Cloudflare sebagai backend, endpoint serverless. Standalone, cepat dimuat, ideal untuk proyek internal.

### 2. Alur Audio
```
Mochy → searchTracks → resolveAudioSource → streamCache → worker → proxy → JioSaavn/Monochrome
```

### 3. Alur Lirik
```
Mochy → getTrackLyrics → fetchLyrics → LRCLIB → backup ovh/musixmatch → cache
```

### 4. Alur Metadata
```
Mochy → getTrackMetadata → enrich with ISRC/cover art → UI About Song
```

---

## 🧪 Cara Pengujian Lokal (Test Suite)

Pastikan [Node.js](https://nodejs.org/) terpasang, lalu jalankan:

```bash
cd "C:\Users\Win10\Ipan Module"
node test.js
```
*(Menguji 10/10 skenario fitur & JS Modules API)*

---

## 🚀 Pengaturan Cepat

**Install JS Module dalam 1 menit**:
```bash
curl -o ipan-scripts.zip https://raw.githubusercontent.com/muhammadirfanpp11/Ipan-Module/main/ipan-scripts.zip
# Di Mochy Music → Settings → Modules → JS Modules → Add from a file
```

**Gunakan Cloudflare Worker**:
```text
Web Module URL: https://ipan-module.mirfanpp11.workers.dev
```

**Kontribusi**:
Fork → Edit → Test → Push → PR

---

## 📋 Status Versi

- **v2.2.0** (2026-11-12)
  - Peningkatan pencarian lirik (normalisasi judul)
  - Cover art dinamis & metadata diperkaya
  - Penyempurnaan anti-crash & fallback
  - Peningkatan audio engine
  - API JS Modules diperbarui
  - Worker-ready untuk Cloudflare

---

## ✅ Verifikasi Terakhir

Semua fitur terverifikasi pada test suite (10/10):
- Badge audio & metadata hi-res
- Stream cache & bypass
- Anti-crash & auto fallback
- Lirik auto-synced (LRCLIB + backup)
- Cover art dinamis
- Enhanced metadata
- API JS Modules lengkap
