import express from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const adminRoles = ['Administrativo', 'Bibliotecario'];
    const isAdmin = adminRoles.includes(user.tipo_usuario);

    let result;
    if (isAdmin) {
      result = await query(`
        SELECT p.*, u.nombre, u.apellido, u.email,
               ej.id_libro, l.titulo
        FROM prestamos p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
        JOIN libros l ON ej.id_libro = l.id_libro
        ORDER BY p.fecha_prestamo DESC
      `);
    } else {
      result = await query(`
        SELECT p.*, u.nombre, u.apellido, u.email,
               ej.id_libro, l.titulo
        FROM prestamos p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
        JOIN libros l ON ej.id_libro = l.id_libro
        WHERE p.id_usuario = $1
        ORDER BY p.fecha_prestamo DESC
      `, [user.id_usuario]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching loans' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vw_prestamos_activos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching active loans' });
  }
});

router.get('/overdue', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vw_prestamos_vencidos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching overdue loans' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT p.*, u.nombre, u.apellido, u.email,
             ej.id_libro, l.titulo
      FROM prestamos p
      JOIN usuario u ON p.id_usuario = u.id_usuario
      JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
      JOIN libros l ON ej.id_libro = l.id_libro
      WHERE p.id_prestamo = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching loan' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_usuario, id_ejemplar, dias_prestamo } = req.body;
    const result = await query(
      'SELECT * FROM sp_registrar_prestamo($1, $2, $3)',
      [id_usuario, id_ejemplar, dias_prestamo || 14]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error creating loan' });
  }
});

router.post('/:id/return', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM sp_devolver_libro($1)', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error returning book' });
  }
});

router.post('/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;
    const { dias_adicionales } = req.body;
    const result = await query('SELECT * FROM sp_renovar_prestamo($1, $2)', [id, dias_adicionales || 7]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error renewing loan' });
  }
});

export default router;
