const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/trips', async (req, res) => {
  const { title, description, category, location, start_date, end_date, images } = req.body;
  try {
    const result = await pool.query(
        'INSERT INTO trips (title, description, category, location, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, category, location, start_date, end_date]
    );
    const trip = result.rows[0];

    // Salva immagini se presenti
    if (images && Array.isArray(images)) {
      for (const img of images) {
        const buf = Buffer.from(img, 'base64');
        await pool.query('INSERT INTO trip_images (trip_id, image) VALUES ($1, $2)', [trip.id, buf]);
      }
    }

    res.json(trip);
  } catch (err) {
    console.error('Errore durante inserimento viaggio:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.get('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Viaggio non trovato' });
    const trip = result.rows[0];

    // Recupera immagini
    const imgRes = await pool.query('SELECT image FROM trip_images WHERE trip_id = $1', [id]);
    const images = imgRes.rows.map(r => r.image.toString('base64'));

    res.json({
      ...trip,
      images,
      isFavorite: trip.isfavorite,
    });
  } catch (err) {
    console.error('Errore nel recupero del viaggio:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.get('/api/trips', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY date DESC');
    const trips = result.rows.map(trip => ({
      ...trip,
      isFavorite: trip.isfavorite,
    }));
    res.json(trips);
  } catch (err) {
    console.error('Errore nel recupero dei viaggi:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.patch('/api/trips/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const { isfavorite } = req.body;
  try {
    const result = await pool.query(
        'UPDATE trips SET isfavorite = $1 WHERE id = $2 RETURNING *',
        [isfavorite, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore aggiornamento preferito:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.patch('/api/trips/:id/repeat', async (req, res) => {
  const { id } = req.params;
  const { ripeti } = req.body;
  try {
    const result = await pool.query(
        'UPDATE trips SET ripeti = $1 WHERE id = $2 RETURNING *',
        [ripeti, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore aggiornamento "da ripetere":', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.patch('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, location, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
        'UPDATE trips SET title=$1, description=$2, category=$3, location=$4, start_date=$5, end_date=$6 WHERE id=$7 RETURNING *',
        [title, description, category, location, start_date, end_date, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Viaggio non trovato' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Errore aggiornamento viaggio:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM trips WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Viaggio non trovato' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Errore durante eliminazione:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.get('/api/tipology', async (req, res) => {
  try {
    const result = await pool.query('SELECT nome FROM tipology ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Errore nel recupero delle tipologie:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/api/tipology', async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await pool.query(
        'INSERT INTO tipology (nome) VALUES ($1) RETURNING *',
        [nome]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Errore durante l'inserimento della tipologia:", err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.delete('/api/tipology/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const result = await pool.query('DELETE FROM tipology WHERE nome = $1', [nome]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tipologia non trovata' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Errore durante eliminazione tipologia:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});