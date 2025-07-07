const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM authors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM authors WHERE author_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, biography } = req.body;
    const [result] = await pool.query('INSERT INTO authors (name, biography) VALUES (?, ?)', [name, biography]);
    res.json({ author_id: result.insertId, name, biography });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, biography } = req.body;
    await pool.query('UPDATE authors SET name = ?, biography = ? WHERE author_id = ?', [name, biography, req.params.id]);
    res.json({ author_id: req.params.id, name, biography });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM authors WHERE author_id = ?', [req.params.id]);
    res.json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
