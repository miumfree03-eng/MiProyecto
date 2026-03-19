const mysql = require('mysql2/promise');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 1. DECLARAR dbConfig (Asegúrate de que esté ARRIBA de las rutas)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

// 2. RUTA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. RUTAS DE LA API (Aquí ya pueden usar dbConfig porque ya existe arriba)
app.get('/api/unidades', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM unidades');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/unidades', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO unidades (nombre) VALUES (?)', [nombre]);
        await connection.end();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;