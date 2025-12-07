import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for email:', email);
    
    const result = await query('SELECT * FROM usuario WHERE email = $1', [email]);
    console.log('📊 Query result - rows found:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('❌ No user found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log('👤 User found:', {
      id: user.id_usuario,
      email: user.email,
      nombre: user.nombre,
      tipo: user.tipo_usuario,
      hasPasswordHash: !!user.password_hash
    });
    
    if (user.password_hash) {
      console.log('🔒 Checking hashed password...');
      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log('✓ Password hash comparison result:', isValid);
      if (!isValid) {
        console.log('❌ Password hash does not match');
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      console.log('⚠️  No password hash found, checking default password...');
      if (password !== 'password') {
        console.log('❌ Default password does not match');
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      console.log('✓ Default password matches');
    }

    console.log('✅ Login successful for:', email);
    res.json({
      id: user.id_usuario,
      name: `${user.nombre} ${user.apellido}`,
      email: user.email,
      tipo: user.tipo_usuario
    });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ error: 'Error during login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, direccion, tipo_usuario, carnet } = req.body;
    console.log('📝 Registration attempt for email:', email);
    
    const existing = await query('SELECT id_usuario FROM usuario WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    const userCarnet = carnet || `USR${Date.now().toString().slice(-6)}`;
    
    console.log('💾 Creating user with carnet:', userCarnet);
    const result = await query(
      `INSERT INTO usuario (carnet, nombre, apellido, email, password_hash, telefono, direccion, tipo_usuario, fecha_registro, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, 'Activo') RETURNING *`,
      [userCarnet, nombre, apellido, email, passwordHash, telefono, direccion, tipo_usuario || 'Externo']
    );

    const user = result.rows[0];
    console.log('✅ User registered successfully:', user.email);
    res.status(201).json({
      id: user.id_usuario,
      name: `${user.nombre} ${user.apellido}`,
      email: user.email,
      tipo: user.tipo_usuario
    });
  } catch (err) {
    console.error('💥 Registration error:', err);
    res.status(500).json({ error: 'Error during registration' });
  }
});

export default router;
