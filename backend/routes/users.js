const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, name, email, subscription FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, name, email, subscription FROM users WHERE user_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, email, subscription } = req.body;
    const [result] = await pool.query('INSERT INTO users (name, email, subscription) VALUES (?, ?, ?)', [name, email, subscription]);
    res.json({ user_id: result.insertId, name, email, subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, email, subscription } = req.body;
    await pool.query('UPDATE users SET name = ?, email = ?, subscription = ? WHERE user_id = ?', [name, email, subscription, req.params.id]);
    res.json({ user_id: req.params.id, name, email, subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
