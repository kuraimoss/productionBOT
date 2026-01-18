# productionBOT

Bot WhatsApp multi-device berbasis Baileys dengan struktur command modular dan logging konsol yang rapi.

## Lisensi
MIT. Lihat `LICENSE`.

## Fitur Utama
- Sistem command modular (autoload + hot-reload) dari folder `commands/`
- Command owner yang tersedia: `broadcast`, `listgroup`
- Pencatatan error + notifikasi ke owner
- Penyimpanan sesi di folder `session/`
- Patch dependency via `patch-package` (lihat `patches/`)

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
- `global.botName`
- `setting.*` (prefix, mode self/public, auto read, dll)

Catatan: jangan bagikan file config yang berisi data sensitif.

## Menjalankan Bot
```bash
npm start
# atau
node index.js
```

QR di terminal:
```bash
node index.js --qr
```

Mode mobile:
```bash
node index.js --mobile
```

## Struktur Project (ringkas)
- `index.js` : entry point
- `main.js` : koneksi WhatsApp + event + watcher command
- `commands/` : command per kategori (owner/other)
- `lib/` : helper & serializer
- `database/` : data JSON
- `session/` : data sesi
- `patches/` : patch untuk dependency
