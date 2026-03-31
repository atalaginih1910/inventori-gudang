const express = require('express');
const router = express.Router();
const { readData, writeData, generateId } = require('../lib/db');

// List all categories
router.get('/', (req, res) => {
  const kategori = readData('kategori.json');
  const produk = readData('produk.json');

  const hasil = kategori.map((k) => {
    const jumlahProduk = produk.filter((p) => p.kategori_id === k.id).length;
    return { ...k, jumlah_produk: jumlahProduk };
  });

  res.render('kategori/index', {
    title: 'Data Kategori',
    kategori: hasil,
  });
});

// Create category
router.post('/', (req, res) => {
  const kategori = readData('kategori.json');
  const { nama, deskripsi } = req.body;

  const newKategori = {
    id: generateId(kategori),
    nama: nama.trim(),
    deskripsi: deskripsi ? deskripsi.trim() : '',
    dibuat_pada: new Date().toISOString(),
  };

  kategori.push(newKategori);
  writeData('kategori.json', kategori);
  res.redirect('/kategori');
});

// Update category
router.put('/:id', (req, res) => {
  const kategori = readData('kategori.json');
  const idx = kategori.findIndex((k) => k.id === parseInt(req.params.id));

  if (idx === -1) {
    return res.redirect('/kategori');
  }

  const { nama, deskripsi } = req.body;
  kategori[idx] = {
    ...kategori[idx],
    nama: nama.trim(),
    deskripsi: deskripsi ? deskripsi.trim() : '',
    diperbarui_pada: new Date().toISOString(),
  };

  writeData('kategori.json', kategori);
  res.redirect('/kategori');
});

// Delete category
router.delete('/:id', (req, res) => {
  const kategori = readData('kategori.json');
  const produk = readData('produk.json');

  // Unlink products from this category
  const updatedProduk = produk.map((p) => {
    if (p.kategori_id === parseInt(req.params.id)) {
      return { ...p, kategori_id: null };
    }
    return p;
  });

  const updated = kategori.filter((k) => k.id !== parseInt(req.params.id));
  writeData('kategori.json', updated);
  writeData('produk.json', updatedProduk);
  res.redirect('/kategori');
});

module.exports = router;
