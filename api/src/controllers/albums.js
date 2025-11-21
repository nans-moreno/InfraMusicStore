// api/src/controllers/albums.js
const pool = require('../database/pool');

exports.list = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.AlbumId, a.Title, a.ArtistId, ar.Name AS ArtistName
      FROM Album a
      JOIN Artist ar ON ar.ArtistId = a.ArtistId
      ORDER BY a.AlbumId LIMIT 500
    `);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.AlbumId, a.Title, a.ArtistId, ar.Name AS ArtistName
      FROM Album a
      JOIN Artist ar ON ar.ArtistId = a.ArtistId
      WHERE a.AlbumId = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { Title, ArtistId } = req.body;
    if (!Title || !ArtistId) return res.status(400).json({ error: 'Title and ArtistId are required' });
    const [result] = await pool.execute('INSERT INTO Album (Title, ArtistId) VALUES (?, ?)', [Title, ArtistId]);
    res.status(201).json({ AlbumId: result.insertId, Title, ArtistId });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { Title, ArtistId } = req.body;
    if (!Title || !ArtistId) return res.status(400).json({ error: 'Title and ArtistId are required' });
    const [result] = await pool.execute('UPDATE Album SET Title = ?, ArtistId = ? WHERE AlbumId = ?', [Title, ArtistId, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ AlbumId: Number(req.params.id), Title, ArtistId });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM Album WHERE AlbumId = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
};
