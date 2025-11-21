// api/src/controllers/genres.js
const pool = require('../database/pool');

exports.list = async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT GenreId, Name FROM Genre ORDER BY GenreId LIMIT 500');
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT GenreId, Name FROM Genre WHERE GenreId = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { Name } = req.body;
    if (!Name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await pool.execute('INSERT INTO Genre (Name) VALUES (?)', [Name]);
    res.status(201).json({ GenreId: result.insertId, Name });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { Name } = req.body;
    if (!Name) return res.status(400).json({ error: 'Name is required' });
    const [result] = await pool.execute('UPDATE Genre SET Name = ? WHERE GenreId = ?', [Name, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ GenreId: Number(req.params.id), Name });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM Genre WHERE GenreId = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
};
