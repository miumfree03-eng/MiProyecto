const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2/promise');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306, // Usar parseInt ayuda a evitar errores
    connectTimeout: 10000 // Le da 10 segundos para intentar conectar
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// CONFIGURACIÓN DE LA BASE DE DATOS
app.get('/api/unidades', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM unidades');
        await connection.end();
        res.json(rows); // Envía la lista de unidades al frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

// --- RUTA PARA GUARDAR UNIDADES (POST) ---
app.post('/api/unidades', async (req, res) => {
    const { nombre } = req.body; // Recibe el nombre desde el frontend
    
    if (!nombre) {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        // Aquí va el código SQL para insertar
        const sql = 'INSERT INTO unidades (nombre) VALUES (?)';
        await connection.execute(sql, [nombre]);
        await connection.end();
        
        res.json({ success: true, message: "Unidad guardada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

// IMPORTANTE: Esta línea debe ir al final
module.exports = app;
