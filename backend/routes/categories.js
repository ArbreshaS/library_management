const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT category_id, name, description FROM categories');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT category_id, name, description FROM categories WHERE category_id = ?', [req.params.id]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    res.json({ category_id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    await pool.query('UPDATE categories SET name = ?, description = ? WHERE category_id = ?', [name, description, req.params.id]);
    res.json({ category_id: req.params.id, name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE category_id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
