const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// 1. Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 2. Ruta para el Home (Esto evita el error Cannot GET /)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ... (Tus require y configuración de dbConfig van arriba) ...

// --- RUTA PARA OBTENER UNIDADES (GET) ---
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
