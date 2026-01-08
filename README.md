# kuraBOT

Bot WhatsApp multi-device berbasis Baileys dengan fitur AI, downloader media, tools, dan utilitas grup.

## Lisensi
MIT — lihat `LICENSE`.

## Fitur Utama
- Menu & bantuan per kategori (`.menu`, `.help`)
- AI chat (auto/interactive) + text-to-image (Blackbox)
- Downloader (IG/FB/Twitter/X/TikTok/YouTube/Spotify/MediaFire/Git clone, dll)
- Tools: sticker, toimg/tovideo/tomp3, ssweb (screenshot web), iplookup, dll
- Fitur grup: promote/demote/kick/hidetag/link/revoke/mute, dll

## Requirements
- Node.js >= 20
- Yarn atau npm
- Akun WhatsApp untuk sesi bot

## Instalasi
```bash
yarn install
# atau
npm install
```

## Konfigurasi
Edit `config.js` sesuai kebutuhan:
- `global.owner` (WA owner)
- `setting.*` (prefix, mode self/public, API keys, dll)
- `setting.blackbox.*` (model chat/image/video)
- `setting.group.id` dan `setting.saluran.id` (opsional)

Catatan: jangan share file config yang berisi API key.

## Menjalankan Bot
```bash
npm start
# atau
node index.js
```

Saat pertama kali login, bisa pakai QR di terminal:
```bash
node index.js --qr
```

Session akan tersimpan di folder `session/`.

## Struktur Project (ringkas)
- `main.js` : koneksi WhatsApp + watcher hot-reload command
- `lib/handler.js` : router command + middleware
- `commands/` : semua command berdasarkan kategori
- `lib/scraper/` : modul scraper & AI client

## Catatan Developer
- Project memakai `patch-package` untuk patch dependency agar perubahan tetap berlaku setelah reinstall.
