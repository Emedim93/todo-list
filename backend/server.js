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
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
//Routes
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/tasks', async (req, res) => {
    const { description } = req.body;
    try {
        const result = await pool.query('INSERT INTO tasks (description) VALUES ($1) RETURNING *', [description]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = await pool.query('UPDATE tasks SET description = $1 WHERE id = $2 RETURNING *', [description, id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM task WHERE id = $1', [id]);
        res.json({ message: "Task deleted successfully!"});
    } catch (error) {
        console.error(err.message);
    }
});

//Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});