# 🎵 Ipan Module (v2.0.0) for Mochy Music

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

6. **🛡️ CORS & User-Agent Bypass Engine**:
   - Menyisipkan header otomatis (*Referer*, *Origin*, *Range bytes*, *Modern Browser User-Agent*) untuk mencegah link streaming terblokir oleh server audio eksternal.

---

## 📲 Cara Pemasangan di Mochy Music

Kamu bisa memasang **Ipan Module** di aplikasi Mochy Music dengan 2 cara resmi:

### Cara 1: Via JS Modules (Rekomendasi)
1. Buka Mochy Music → **Settings → Modules → JS Modules**.
2. Pada bagian **Sources**, tap **Add from a file or a link**.
3. Masukkan link RAW script atau catalog index berikut:
   - **Direct Script Link**:
     ```text
     https://raw.githubusercontent.com/muhammadirfanpp11/Ipan-Module/main/index.js
     ```
   - **Catalog Index Link**:
     ```text
     https://raw.githubusercontent.com/muhammadirfanpp11/Ipan-Module/main/index.json
     ```

### Cara 2: Via Add Link Manifest / Web Module
1. Buka Mochy Music → **Settings → Modules → Add a module**.
2. Paste link manifest RAW:
   ```text
   https://raw.githubusercontent.com/muhammadirfanpp11/Ipan-Module/main/manifest.json
   ```

---

## 🧪 Cara Pengujian Lokal (Test Suite)

Pastikan [Node.js](https://nodejs.org/) terpasang, lalu jalankan:

```bash
cd "C:\Users\Win10\Ipan Module"
node test.js
```
*(Menguji 10/10 skenario fitur & JS Modules API)*
