const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM publishers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM publishers WHERE publisher_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    const [result] = await pool.query('INSERT INTO publishers (name, location) VALUES (?, ?)', [name, location]);
    res.json({ publisher_id: result.insertId, name, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, location } = req.body;
    await pool.query('UPDATE publishers SET name = ?, location = ? WHERE publisher_id = ?', [name, location, req.params.id]);
    res.json({ publisher_id: req.params.id, name, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM publishers WHERE publisher_id = ?', [req.params.id]);
    res.json({ message: 'Publisher deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
