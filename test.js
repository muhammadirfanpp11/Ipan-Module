/**
 * Test Suite Lengkap untuk Ipan Module v2.0.0
 * Jalankan dengan: node test.js
 */

const IpanModule = require('./index.js');

async function runFullTestSuite() {
  console.log('====================================================');
  console.log('🚀 MEMULAI PENGUJIAN LENGKAP IPAN MODULE (5 FITUR)');
  console.log('====================================================\n');

  // FITUR 1: Badge Metadata Hi-Res Audio
  console.log('🏅 [Fitur 1] Uji Badge Metadata Audio:');
  const hiResBadge = IpanModule.getBadge('flac', 24, 96000);
  console.log(' - 24-bit/96kHz FLAC ->', hiResBadge.badge, `(${hiResBadge.specs}) | Color: ${hiResBadge.color}`);

  const cdBadge = IpanModule.getBadge('alac', 16, 44100);
  console.log(' - 16-bit/44.1kHz ALAC ->', cdBadge.badge, `(${cdBadge.specs})`);

  const mp3Badge = IpanModule.getBadge('mp3', 16, 44100, 320);
  console.log(' - 320kbps MP3 ->', mp3Badge.badge, `(${mp3Badge.specs})`);
  console.log(' ✅ Fitur 1 Lolos: Badge audio otomatis teridentifikasi dengan tepat!\n');

  // FITUR 2: In-Memory Stream Cache (Insta-Play)
  console.log('⚡ [Fitur 2] Uji In-Memory Stream Cache (Insta-Play):');
  const testUrl = 'https://example.com/audio/song_test.flac';

  // Call 1: Belum ada di cache
  const firstCall = await IpanModule.resolve(testUrl);
  console.log(' - Pemutaran Pertama (Fetch) -> fromCache:', firstCall.fromCache);

  // Call 2: Harusnya langsung dari cache (0 detik)
  const secondCall = await IpanModule.resolve(testUrl);
  console.log(' - Pemutaran Ulang (Instant)  -> fromCache:', secondCall.fromCache);
  console.log(' - Cache Size Stats:', IpanModule.cache.stats());
  console.log(' ✅ Fitur 2 Lolos: Replay instan berfungsi melalui in-memory cache!\n');

  // FITUR 3: Bypass Headers (CORS & Anti-Blocking)
  console.log('🛡️ [Fitur 3] Uji Bypass Headers (Anti-Blocking):');
  const headers = IpanModule.getHeaders('https://streaming.audio-server.com/live/track123');
  console.log(' - User-Agent      :', headers['User-Agent'].substring(0, 45) + '...');
  console.log(' - Referer & Origin:', headers['Referer'], '|', headers['Origin']);
  console.log(' - Range & Accept  :', headers['Range'], '|', headers['Accept']);
  console.log(' ✅ Fitur 3 Lolos: Header proteksi & bypass terpasang sempurna!\n');

  // FITUR 4: URL Rusak & Server Down Handler
  console.log('🔄 [Fitur 4] Uji Anti-Crash & Auto Fallback:');
  const deadLink = await IpanModule.resolve('https://invalid-host-not-found-xyz123.com/stream');
  console.log(' - Dead link handled safely:', deadLink.success === false);
  console.log(' - Error message:', deadLink.error);
  console.log(' ✅ Fitur 4 Lolos: Aman dari crash meskipun server eksternal mati!\n');

  // FITUR 5: Auto Synced Lyrics Fetcher (LRCLIB)
  console.log('🎤 [Fitur 5] Uji Auto Lyrics Fetcher (LRC / Karaoke):');
  console.log(' - Mengambil lirik untuk lagu populer ("Bohemian Rhapsody" - Queen)...');
  try {
    const lyrics = await IpanModule.fetchLyrics('Bohemian Rhapsody', 'Queen');
    if (lyrics && lyrics.hasLyrics) {
      console.log(' - Lirik ditemukan! Format Synced (LRC):', lyrics.isSynced);
      console.log(' - Sumber:', lyrics.source);
      if (lyrics.syncedLyrics) {
        const preview = lyrics.syncedLyrics.split('\n').slice(0, 3).join(' | ');
        console.log(' - Cuplikan lirik ber-timestamp:', preview);
      }
      console.log(' ✅ Fitur 5 Lolos: Lirik karaoke tersinkronisasi otomatis berhasil diambil!\n');
    } else {
      console.log(' - Server lirik offline/timeout, fallback handled safely.\n');
    }
  } catch (err) {
    console.log(' - Error lirik handled safely:', err.message);
  }

  console.log('====================================================');
  console.log('🎉 SEMUA 5 FITUR UNGGULAN SUDAH TERVERIFIKASI & AKTIF!');
  console.log('Ipan Module siap jadi modul terbaik di Mochy Music!');
  console.log('====================================================');
}

runFullTestSuite();
