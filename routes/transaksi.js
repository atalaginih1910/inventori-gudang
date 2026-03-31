const express = require('express');
const router = express.Router();
const { readData, writeData, generateId } = require('../lib/db');

// List all transactions
router.get('/', (req, res) => {
  const transaksi = readData('transaksi.json');
  const produk = readData('produk.json');
  const { jenis, cari, dari, sampai } = req.query;

  let hasil = transaksi
    .map((t) => {
      const p = produk.find((x) => x.id === t.produk_id);
      return { ...t, nama_produk: p ? p.nama : 'Produk dihapus', satuan: p ? p.satuan : '' };
    })
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  if (jenis) {
    hasil = hasil.filter((t) => t.jenis === jenis);
  }

  if (cari) {
    const lower = cari.toLowerCase();
    hasil = hasil.filter((t) => t.nama_produk.toLowerCase().includes(lower));
  }

  if (dari) {
    hasil = hasil.filter((t) => new Date(t.tanggal) >= new Date(dari));
  }

  if (sampai) {
    const sampaiDate = new Date(sampai);
    sampaiDate.setHours(23, 59, 59, 999);
    hasil = hasil.filter((t) => new Date(t.tanggal) <= sampaiDate);
  }

  res.render('transaksi/index', {
    title: 'Riwayat Transaksi',
    transaksi: hasil,
    produk,
    jenis: jenis || '',
    cari: cari || '',
    dari: dari || '',
    sampai: sampai || '',
  });
});

// Show add transaction form
router.get('/tambah', (req, res) => {
  const produk = readData('produk.json');
  res.render('transaksi/form', {
    title: 'Catat Transaksi',
    produk,
    selectedProduk: req.query.produk_id || '',
    errorMsg: req.query.error === 'stok_kurang' ? 'Stok tidak mencukupi untuk transaksi keluar!' : null,
  });
});

// Create transaction
router.post('/', (req, res) => {
  const transaksi = readData('transaksi.json');
  const produk = readData('produk.json');
  const { produk_id, jenis, jumlah, keterangan, tanggal } = req.body;

  const produkIdx = produk.findIndex((p) => p.id === parseInt(produk_id));
  if (produkIdx === -1) {
    return res.redirect('/transaksi');
  }

  const qty = parseInt(jumlah) || 0;
  if (qty <= 0) {
    return res.redirect('/transaksi/tambah');
  }

  // Update stock
  if (jenis === 'masuk') {
    produk[produkIdx].stok += qty;
  } else if (jenis === 'keluar') {
    if (produk[produkIdx].stok < qty) {
      return res.redirect('/transaksi/tambah?error=stok_kurang');
    }
    produk[produkIdx].stok -= qty;
  }

  const newTransaksi = {
    id: generateId(transaksi),
    produk_id: parseInt(produk_id),
    jenis,
    jumlah: qty,
    stok_sebelum: jenis === 'masuk' ? produk[produkIdx].stok - qty : produk[produkIdx].stok + qty,
    stok_sesudah: produk[produkIdx].stok,
    keterangan: keterangan ? keterangan.trim() : '',
    tanggal: tanggal || new Date().toISOString().split('T')[0],
    dibuat_pada: new Date().toISOString(),
  };

  transaksi.push(newTransaksi);
  writeData('transaksi.json', transaksi);
  writeData('produk.json', produk);
  res.redirect('/transaksi');
});

// Delete transaction (does NOT reverse stock)
router.delete('/:id', (req, res) => {
  const transaksi = readData('transaksi.json');
  const updated = transaksi.filter((t) => t.id !== parseInt(req.params.id));
  writeData('transaksi.json', updated);
  res.redirect('/transaksi');
});

module.exports = router;
