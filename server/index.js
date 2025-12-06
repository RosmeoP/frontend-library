import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import booksRoutes from './routes/books.js';
import usersRoutes from './routes/users.js';
import loansRoutes from './routes/loans.js';
import reservationsRoutes from './routes/reservations.js';
import finesRoutes from './routes/fines.js';
import categoriesRoutes from './routes/categories.js';
import authorsRoutes from './routes/authors.js';
import publishersRoutes from './routes/publishers.js';
import statsRoutes from './routes/stats.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/fines', finesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/publishers', publishersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
