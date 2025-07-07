const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, author_id, category_id, published_date, description, available } = req.body;
    const [result] = await pool.query('INSERT INTO books (title, author_id, category_id, published_date, description, available) VALUES (?, ?, ?, ?, ?, ?)', [title, author_id, category_id, published_date, description, available]);
    res.json({ book_id: result.insertId, title, author_id, category_id, published_date, description, available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { title, author_id, category_id, published_date, description, available } = req.body;
    await pool.query('UPDATE books SET title = ?, author_id = ?, category_id = ?, published_date = ?, description = ?, available = ? WHERE book_id = ?', [title, author_id, category_id, published_date, description, available, req.params.id]);
    res.json({ book_id: req.params.id, title, author_id, category_id, published_date, description, available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
