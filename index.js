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

// 3. Tus rutas de API (Asegúrate de que sigan aquí abajo)
app.get('/api/unidades', async (req, res) => {
    // ... tu código de mysql ...
});

module.exports = app;