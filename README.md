# inventori-gudang

Sistem Manajemen Inventori Gudang berbasis web yang dibangun dengan Node.js, Express, dan EJS.

## Fitur

- 📦 **Manajemen Produk** — Tambah, edit, hapus produk beserta kode, satuan, harga, dan stok minimum
- 🏷️ **Kategori Produk** — Kelola kategori untuk mengorganisir produk
- 🔄 **Transaksi Stok** — Catat barang masuk dan barang keluar, stok otomatis terupdate
- 📊 **Dashboard** — Ringkasan statistik: total produk, kategori, nilai stok, dan transaksi terbaru
- 🔍 **Filter & Pencarian** — Cari produk berdasarkan nama/kode, filter stok rendah/habis
- ⚠️ **Alert Stok Rendah** — Produk dengan stok di bawah minimum ditandai secara otomatis

## Teknologi

- **Backend**: Node.js + Express
- **Template**: EJS
- **Storage**: JSON file-based (tidak memerlukan database server)
- **UI**: Bootstrap 5 + Bootstrap Icons

## Instalasi & Menjalankan

### Prasyarat

- Node.js >= 18

### Langkah

```bash
# Clone repositori
git clone https://github.com/atalaginih1910/inventori-gudang.git
cd inventori-gudang

# Install dependensi
npm install

# Jalankan server
npm start
```

Buka browser dan akses: **http://localhost:3000**

### Mode Development (auto-reload)

```bash
npm run dev
```

## Struktur Proyek

```
inventori-gudang/
├── app.js              # Entry point aplikasi
├── routes/
│   ├── index.js        # Dashboard
│   ├── produk.js       # CRUD produk
│   ├── kategori.js     # CRUD kategori
│   └── transaksi.js    # Transaksi stok masuk/keluar
├── views/
│   ├── partials/       # Header & footer bersama
│   ├── produk/         # Halaman produk
│   ├── kategori/       # Halaman kategori
│   └── transaksi/      # Halaman transaksi
├── lib/
│   └── db.js           # Helper baca/tulis data JSON
├── data/               # File penyimpanan data (JSON)
│   ├── kategori.json
│   ├── produk.json
│   └── transaksi.json
└── public/
    └── css/
        └── style.css
```

## Penggunaan

1. **Tambah Kategori** — Klik menu *Kategori* → tambah kategori produk
2. **Tambah Produk** — Klik menu *Produk* → *Tambah Produk*, isi data dan stok awal
3. **Catat Transaksi** — Klik *Catat Transaksi*, pilih produk, pilih jenis (masuk/keluar), dan jumlah
4. **Monitor Stok** — Dashboard menampilkan ringkasan stok, nilai inventori, dan transaksi terkini

## Variabel Lingkungan

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `PORT`   | `3000`  | Port server |
