import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM autor ORDER BY apellidos, nombres');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching authors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM autor WHERE id_autor = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching author' });
  }
});

router.get('/:id/books', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT l.* FROM libros l
      JOIN autor_libro al ON l.id_libro = al.id_libro
      WHERE al.id_autor = $1
      ORDER BY l.titulo
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching author books' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombres, apellidos, nacionalidad } = req.body;
    const result = await query(
      'INSERT INTO autor (nombres, apellidos, nacionalidad) VALUES ($1, $2, $3) RETURNING *',
      [nombres, apellidos, nacionalidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating author' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, nacionalidad } = req.body;
    const result = await query(
      'UPDATE autor SET nombres = $1, apellidos = $2, nacionalidad = $3 WHERE id_autor = $4 RETURNING *',
      [nombres, apellidos, nacionalidad, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating author' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM autor WHERE id_autor = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting author' });
  }
});

export default router;
