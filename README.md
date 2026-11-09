# 🎵 Ipan Module (v2.0.0) for Mochy Music

Modul audio komprehensif untuk **Mochy Music** yang menggabungkan kualitas audio audiophile, performa instan, dan fitur hiburan interaktif.

---

## ✨ 5 Fitur Unggulan

1. **🏅 Badge Metadata Hi-Res Audio (Audiophile Specs)**:
   * Deteksi otomatis kualitas audio: `Hi-Res Lossless` (24-bit / 96kHz), `CD Quality` (16-bit / 44.1kHz FLAC/ALAC), atau `High Quality` (320kbps).
   * Menampilkan spesifikasi teknis dan warna badge khas layaknya Apple Music/Tidal.

2. **⚡ In-Memory Stream Cache (Insta-Play)**:
   * Menyimpan URL stream yang sudah di-resolve ke memori sementara.
   * Lagu yang diputar ulang akan langsung jalan **seketika (0 detik loading)** tanpa fetch ulang.

3. **🔄 Anti-Crash & Auto Fallback**:
   * Menangani link add-on eksternal (BitChord, link streaming pribadi) yang bermasalah secara aman tanpa membuat aplikasi freeze/force-close.
   * Otomatis beralih ke stream alternatif jika link utama bermasalah.

4. **🎤 Auto Synchronized Lyrics (Karaoke Mode)**:
   * Terintegrasi langsung dengan database lirik terbuka (LRCLIB).
   * Mengambil lirik ber-timestamp (`.lrc`) otomatis berdasarkan judul lagu dan artis sehingga player bisa menampilkan lirik berjalan sinkron detik per detik.

5. **🛡️ CORS & User-Agent Bypass Engine**:
   * Menyisipkan header otomatis (*Referer*, *Origin*, *Range bytes*, *Modern Browser User-Agent*) untuk mencegah link streaming terblokir oleh server audio eksternal.

---

## 🧪 Cara Pengujian Lokal

Pastikan [Node.js](https://nodejs.org/) terpasang, lalu jalankan:

```bash
cd "C:\Users\Win10\Ipan Module"
node test.js
```

---

## 📲 Cara Pasang ke Aplikasi Mochy Music

1. Salin folder `Ipan Module` ini (bisa dinamai `ipan`) ke folder `modules/` di Mochy Music:
   ```text
   Mochy-Music/
   └── modules/
       ├── ipan/
       │   ├── index.js
       │   └── manifest.json
       └── catalog.json
   ```

2. Tambahkan entri berikut ke dalam `modules/catalog.json`:
   ```json
   {
     "id": "ipan-lossless",
     "name": "Ipan Module",
     "author": "Ipan",
     "description": "Hi-Res Lossless, Insta-Play Cache, Synced Lyrics & Anti-Crash Suite",
     "repo": "https://github.com/USERNAME_KAMU/Ipan-Module",
     "version": "2.0.0"
   }
   ```

3. Buka Mochy Music -> **Add a module** -> pilih **Ipan Module**! 🚀
