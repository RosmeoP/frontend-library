import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT m.*, p.id_usuario, p.id_ejemplar, p.fecha_prestamo, p.fecha_devolucion_esperada,
             u.nombre, u.apellido, u.email,
             ej.id_libro, l.titulo
      FROM multas m
      JOIN prestamos p ON m.id_prestamo = p.id_prestamo
      JOIN usuario u ON p.id_usuario = u.id_usuario
      JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
      JOIN libros l ON ej.id_libro = l.id_libro
      ORDER BY m.id_multa DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching fines' });
  }
});

router.get('/unpaid', async (req, res) => {
  try {
    const result = await query(`
      SELECT m.*, p.id_usuario, u.nombre, u.apellido, u.email, l.titulo
      FROM multas m
      JOIN prestamos p ON m.id_prestamo = p.id_prestamo
      JOIN usuario u ON p.id_usuario = u.id_usuario
      JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
      JOIN libros l ON ej.id_libro = l.id_libro
      WHERE m.pagado = false
      ORDER BY m.id_multa DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching unpaid fines' });
  }
});

router.get('/calculate/:id_prestamo', async (req, res) => {
  try {
    const { id_prestamo } = req.params;
    const result = await query('SELECT * FROM sp_calcular_multa($1)', [id_prestamo]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error calculating fine' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT m.*, p.id_usuario, u.nombre, u.apellido, l.titulo
      FROM multas m
      JOIN prestamos p ON m.id_prestamo = p.id_prestamo
      JOIN usuario u ON p.id_usuario = u.id_usuario
      JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
      JOIN libros l ON ej.id_libro = l.id_libro
      WHERE m.id_multa = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching fine' });
  }
});

router.put('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE multas SET pagado = true, fecha_pago = CURRENT_DATE WHERE id_multa = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error marking fine as paid' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM multas WHERE id_multa = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fine not found' });
    }
    res.json({ message: 'Fine deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting fine' });
  }
});

export default router;
