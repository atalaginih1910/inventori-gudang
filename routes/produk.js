const express = require('express');
const router = express.Router();
const { readData, writeData, generateId } = require('../lib/db');

// List all products
router.get('/', (req, res) => {
  const produk = readData('produk.json');
  const kategori = readData('kategori.json');
  const { cari, kategori_id, stok_filter } = req.query;

  let hasil = produk.map((p) => {
    const kat = kategori.find((k) => k.id === p.kategori_id);
    return { ...p, nama_kategori: kat ? kat.nama : '-' };
  });

  if (cari) {
    const lower = cari.toLowerCase();
    hasil = hasil.filter(
      (p) => p.nama.toLowerCase().includes(lower) || (p.kode && p.kode.toLowerCase().includes(lower))
    );
  }

  if (kategori_id) {
    hasil = hasil.filter((p) => p.kategori_id === parseInt(kategori_id));
  }

  if (stok_filter === 'rendah') {
    hasil = hasil.filter((p) => p.stok <= p.stok_minimum);
  } else if (stok_filter === 'habis') {
    hasil = hasil.filter((p) => p.stok === 0);
  }

  res.render('produk/index', {
    title: 'Data Produk',
    produk: hasil,
    kategori,
    cari: cari || '',
    kategori_id: kategori_id || '',
    stok_filter: stok_filter || '',
  });
});

// Show add form
router.get('/tambah', (req, res) => {
  const kategori = readData('kategori.json');
  res.render('produk/form', {
    title: 'Tambah Produk',
    produk: null,
    kategori,
    action: '/produk',
    method: 'POST',
  });
});

// Create product
router.post('/', (req, res) => {
  const produk = readData('produk.json');
  const { nama, kode, kategori_id, satuan, stok, stok_minimum, harga, deskripsi } = req.body;

  const newProduk = {
    id: generateId(produk),
    nama: nama.trim(),
    kode: kode ? kode.trim() : '',
    kategori_id: parseInt(kategori_id) || null,
    satuan: satuan ? satuan.trim() : 'pcs',
    stok: parseInt(stok) || 0,
    stok_minimum: parseInt(stok_minimum) || 0,
    harga: parseFloat(harga) || 0,
    deskripsi: deskripsi ? deskripsi.trim() : '',
    dibuat_pada: new Date().toISOString(),
  };

  produk.push(newProduk);
  writeData('produk.json', produk);
  res.redirect('/produk');
});

// Show edit form
router.get('/:id/edit', (req, res) => {
  const produk = readData('produk.json');
  const kategori = readData('kategori.json');
  const item = produk.find((p) => p.id === parseInt(req.params.id));

  if (!item) {
    return res.redirect('/produk');
  }

  res.render('produk/form', {
    title: 'Edit Produk',
    produk: item,
    kategori,
    action: `/produk/${item.id}?_method=PUT`,
    method: 'POST',
  });
});

// Update product
router.put('/:id', (req, res) => {
  const produk = readData('produk.json');
  const idx = produk.findIndex((p) => p.id === parseInt(req.params.id));

  if (idx === -1) {
    return res.redirect('/produk');
  }

  const { nama, kode, kategori_id, satuan, stok, stok_minimum, harga, deskripsi } = req.body;

  produk[idx] = {
    ...produk[idx],
    nama: nama.trim(),
    kode: kode ? kode.trim() : '',
    kategori_id: parseInt(kategori_id) || null,
    satuan: satuan ? satuan.trim() : 'pcs',
    stok: parseInt(stok) || 0,
    stok_minimum: parseInt(stok_minimum) || 0,
    harga: parseFloat(harga) || 0,
    deskripsi: deskripsi ? deskripsi.trim() : '',
    diperbarui_pada: new Date().toISOString(),
  };

  writeData('produk.json', produk);
  res.redirect('/produk');
});

// Delete product
router.delete('/:id', (req, res) => {
  const produk = readData('produk.json');
  const updated = produk.filter((p) => p.id !== parseInt(req.params.id));
  writeData('produk.json', updated);
  res.redirect('/produk');
});

module.exports = router;
