document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        cargarModulo(section);
    });
});

async function cargarModulo(seccion) {
    const content = document.getElementById('content');
    
    if (seccion === 'unidades') {
        content.innerHTML = `
            <h2>Catálogo: Unidades de Medida</h2>
            <input type="text" id="nuevaUnidad" placeholder="Nombre (ej. Kg)">
            <button onclick="guardarUnidad()">Guardar</button>
            <ul id="listaUnidades">Cargando...</ul>
        `;
        actualizarListaUnidades();
    }
}

async function actualizarListaUnidades() {
    const res = await fetch('/api/unidades');
    const data = await res.json();
    const lista = document.getElementById('listaUnidades');
    lista.innerHTML = data.map(u => `<li>${u.nombre}</li>`).join('');
}

async function guardarUnidad() {
    const nombreInput = document.getElementById('nombreUnidad').value;
    
    await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreInput }) // "nombre" debe coincidir con el backend
    });

    document.getElementById('nombreUnidad').value = ""; // Limpiar input
    cargarUnidades(); // Refrescar la lista
}