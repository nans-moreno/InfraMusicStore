// api/src/controllers/tracks.js
const pool = require('../database/pool');

exports.list = async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.TrackId, t.Name, t.AlbumId, t.MediaTypeId, t.GenreId,
             t.Composer, t.Milliseconds, t.Bytes, t.UnitPrice,
             a.Title AS AlbumTitle, g.Name AS GenreName
      FROM Track t
      LEFT JOIN Album a ON a.AlbumId = t.AlbumId
      LEFT JOIN Genre g ON g.GenreId = t.GenreId
      ORDER BY t.TrackId
      LIMIT 500
    `);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.TrackId, t.Name, t.AlbumId, t.MediaTypeId, t.GenreId,
             t.Composer, t.Milliseconds, t.Bytes, t.UnitPrice
      FROM Track t WHERE t.TrackId = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { Name, AlbumId, MediaTypeId, GenreId, Composer = null, Milliseconds = 0, Bytes = 0, UnitPrice } = req.body;
    if (!Name || !AlbumId || !MediaTypeId || !GenreId || UnitPrice == null) {
      return res.status(400).json({ error: 'Name, AlbumId, MediaTypeId, GenreId, UnitPrice are required' });
    }
    const [result] = await pool.execute(
      `INSERT INTO Track (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]
    );
    res.status(201).json({ TrackId: result.insertId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { Name, AlbumId, MediaTypeId, GenreId, Composer = null, Milliseconds = 0, Bytes = 0, UnitPrice } = req.body;
    if (!Name || !AlbumId || !MediaTypeId || !GenreId || UnitPrice == null) {
      return res.status(400).json({ error: 'Name, AlbumId, MediaTypeId, GenreId, UnitPrice are required' });
    }
    const [result] = await pool.execute(
      `UPDATE Track
       SET Name = ?, AlbumId = ?, MediaTypeId = ?, GenreId = ?, Composer = ?, Milliseconds = ?, Bytes = ?, UnitPrice = ?
       WHERE TrackId = ?`,
      [Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ TrackId: Number(req.params.id), Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM Track WHERE TrackId = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) { next(e); }
};
