require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

//Middlware
app.use(cors());
app.use(bodyParser.json());

//connexion à la base de données 
const pool = new Pool({
    user: process.env.DB_USER, //indique le nom de l'utilisateur de la base à  données
    host: process.env.DB_HOST, //
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),// convertion les port en nobre avec parseInt
});

// test de connexion à la base de données

pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err));


//Routes
app.get('/todo', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todo');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: 'Server error '});
    }
});

app.post('/todo', async (req, res) => {
    const { description } = req.body;
    try {
        const result = await pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/todo/:id', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = await pool.query('UPDATE todo SET description = $1 WHERE id = $2 RETURNING *', [description, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM todo WHERE id = $1', [id]);
        res.json({ message: "todo deleted successfully!"});
    } catch (error) {
        console.error(err.message);
    }
});

//Démarrer le serveur
const PORT = process.env.PORT || 5000;
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`PORT: ${PORT}`);
console.log(`DB_PORT: ${process.env.DB_PORT}, PORT: ${PORT}`);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});