const express = require('express');
const router = express.Router();
const { readData } = require('../lib/db');

router.get('/', (req, res) => {
  const produk = readData('produk.json');
  const kategori = readData('kategori.json');
  const transaksi = readData('transaksi.json');

  // Summary statistics
  const totalProduk = produk.length;
  const totalKategori = kategori.length;

  // Stock summary
  const stokRendah = produk.filter((p) => p.stok <= p.stok_minimum).length;

  // Total nilai stok
  const totalNilaiStok = produk.reduce((sum, p) => sum + p.stok * (p.harga || 0), 0);

  // Recent transactions (last 5)
  const transaksiTerbaru = [...transaksi]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)
    .map((t) => {
      const p = produk.find((x) => x.id === t.produk_id);
      return { ...t, nama_produk: p ? p.nama : 'Produk dihapus' };
    });

  // Masuk & keluar this month
  const now = new Date();
  const bulanIni = transaksi.filter((t) => {
    const d = new Date(t.tanggal);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMasuk = bulanIni
    .filter((t) => t.jenis === 'masuk')
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalKeluar = bulanIni
    .filter((t) => t.jenis === 'keluar')
    .reduce((sum, t) => sum + t.jumlah, 0);

  res.render('index', {
    title: 'Dashboard',
    totalProduk,
    totalKategori,
    stokRendah,
    totalNilaiStok,
    transaksiTerbaru,
    totalMasuk,
    totalKeluar,
  });
});

module.exports = router;
