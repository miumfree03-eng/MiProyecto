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

    if (!valor) return alert("Escribe un nombre");

    // 1. ENVIAR: Mandamos el dato al servidor (index.js)
    await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: valor })
    });

    // 2. LIMPIAR: Borramos lo que escribiste en el cuadrito
    input.value = "";

    // 3. REFLEJAR: Llamamos a la función que trae los datos de la DB
    // ¡Esta es la parte que hace que aparezca en la lista!
    await cargarUnidades(); 
}

async function cargarUnidades() {
    const lista = document.getElementById('lista');
    
    // Pedimos los datos actualizados al servidor
    const res = await fetch('/api/unidades');
    const data = await res.json();

    // Dibujamos la lista en el HTML
    lista.innerHTML = data.map(u => `<li>${u.nombre}</li>`).join('');
}