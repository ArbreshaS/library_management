const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loans WHERE loan_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { book_id, user_id, loan_date, return_date } = req.body;
    const [result] = await pool.query('INSERT INTO loans (book_id, user_id, loan_date, return_date) VALUES (?, ?, ?, ?)', [book_id, user_id, loan_date, return_date]);
    res.json({ loan_id: result.insertId, book_id, user_id, loan_date, return_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { book_id, user_id, loan_date, return_date } = req.body;
    await pool.query('UPDATE loans SET book_id = ?, user_id = ?, loan_date = ?, return_date = ? WHERE loan_id = ?', [book_id, user_id, loan_date, return_date, req.params.id]);
    res.json({ loan_id: req.params.id, book_id, user_id, loan_date, return_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM loans WHERE loan_id = ?', [req.params.id]);
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
