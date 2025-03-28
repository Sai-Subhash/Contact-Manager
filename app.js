const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dpune@24',
  database: 'contacts',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create table if it doesn't exist
pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL
    )`, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Table created or already exists');
  }
});

// Read all contacts
app.get('/contacts', (req, res) => {
  pool.query('SELECT * FROM contacts', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Create a new contact
app.post('/contacts', (req, res) => {
  const { name, email, country_code, phone } = req.body;
  const sql = 'INSERT INTO contacts (name, email, country_code, phone) VALUES (?, ?, ?, ?)';
  pool.query(sql, [name, email, country_code, phone], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, name, email, country_code, phone });
  });
});

// Update a contact
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, country_code, phone } = req.body;
  const sql = 'UPDATE contacts SET name = ?, email = ?, country_code = ?, phone = ? WHERE id = ?';
  pool.query(sql, [name, email, country_code, phone, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: results.affectedRows });
  });
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM contacts WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: results.affectedRows });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));