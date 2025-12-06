import express from 'express';
import { query } from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const adminRoles = ['Administrativo', 'Bibliotecario'];
    const isAdmin = adminRoles.includes(user.tipo_usuario);

    let result;
    if (isAdmin) {
      result = await query(`
        SELECT r.*, u.nombre, u.apellido, u.email, l.titulo
        FROM reservas r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN libros l ON r.id_libro = l.id_libro
        ORDER BY r.fecha_solicitud DESC
      `);
    } else {
      result = await query(`
        SELECT r.*, u.nombre, u.apellido, u.email, l.titulo
        FROM reservas r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN libros l ON r.id_libro = l.id_libro
        WHERE r.id_usuario = $1
        ORDER BY r.fecha_solicitud DESC
      `, [user.id_usuario]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const adminRoles = ['Administrativo', 'Bibliotecario'];
    const isAdmin = adminRoles.includes(user.tipo_usuario);

    let result;
    if (isAdmin) {
      result = await query(`
        SELECT r.*, u.nombre, u.apellido, u.email, l.titulo
        FROM reservas r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN libros l ON r.id_libro = l.id_libro
        WHERE r.id_reserva = $1
      `, [id]);
    } else {
      result = await query(`
        SELECT r.*, u.nombre, u.apellido, u.email, l.titulo
        FROM reservas r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        JOIN libros l ON r.id_libro = l.id_libro
        WHERE r.id_reserva = $1 AND r.id_usuario = $2
      `, [id, user.id_usuario]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reservation' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { id_usuario, id_libro } = req.body;
    const result = await query(
      `INSERT INTO reservas (id_usuario, id_libro, fecha_solicitud, estado) 
       VALUES ($1, $2, CURRENT_DATE, 'Pendiente') RETURNING *`,
      [id_usuario, id_libro]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

router.put('/:id/complete', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE reservas SET estado = 'Completada' WHERE id_reserva = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error completing reservation' });
  }
});

router.put('/:id/cancel', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE reservas SET estado = 'Cancelada' WHERE id_reserva = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error cancelling reservation' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM reservas WHERE id_reserva = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting reservation' });
  }
});

export default router;
