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
    const input = document.getElementById('nombreUnidad');
    const valor = input.value;

    // 1. Enviamos al servidor
    await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: valor })
    });

    // 2. Limpiamos el cuadrito de texto
    input.value = "";

    // 3. ¡IMPORTANTE! Volvemos a llamar a la función que dibuja la lista
    // Esto hace que el nuevo dato aparezca en pantalla sin recargar la página.
    cargarUnidades(); 
}