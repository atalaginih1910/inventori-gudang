const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
const indexRouter = require('./routes/index');
const produkRouter = require('./routes/produk');
const kategoriRouter = require('./routes/kategori');
const transaksiRouter = require('./routes/transaksi');

app.use('/', indexRouter);
app.use('/produk', produkRouter);
app.use('/kategori', kategoriRouter);
app.use('/transaksi', transaksiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Terjadi Kesalahan', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
