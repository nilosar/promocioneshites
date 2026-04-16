let productos = [];

// Función para dar formato de moneda chilena
const formatoPeso = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(valor);
};

async function obtenerDatos() {
    try {
        console.log("Iniciando carga de datos...");
        const respuesta = await fetch('./productos.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP! estado: ${respuesta.status}`);
        }

        const textoRaw = await respuesta.text();
        // Limpiamos posibles espacios invisibles que dañan el JSON
        productos = JSON.parse(textoRaw.trim());
        
        console.log("Productos cargados:", productos);

        // IMPORTANTE: Mostramos todos los productos apenas carga la página
        renderizar(productos);

    } catch (error) {
        console.error("Error detallado:", error);
        document.getElementById('catalogo').innerHTML = `
            <div style="text-align:center; padding:50px; color:red; grid-column: 1 / -1;">
                <h3>Error al cargar el catálogo</h3>
                <p>${error.message}</p>
            </div>`;
    }
}

function renderizar(data) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = "";

    if (data.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No se encontraron modelos con ese nombre.</p>";
        return;
    }

    data.forEach(item => {
        // Calculamos el ahorro (Prepago - Plan)
        const ahorro = item.precioPrepago - item.precioPlan;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item.imagen}" alt="${item.modelo}" onerror="this.src='https://via.placeholder.com/150?text=Sin+Foto'">
            </div>
            <div class="brand">${item.marca}</div>
            <div class="model">${item.modelo}</div>
            
            <div class="price-row">
                <span>Precio Prepago:</span>
                <span class="price-val">${formatoPeso(item.precioPrepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan Entel:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(item.precioPlan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorro)}</div>

            ${item.precioFibra ? `
                <div class="fiber-box">
                    <strong>OFERTA PLAN + FIBRA:</strong><br>
                    <span style="font-size:1.1rem;">${formatoPeso(item.precioFibra)}</span>
                </div>
            ` : ''}

            <div class="sku-info">
                Plan: $17.990 | SKU: ${item.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Lógica del buscador corregida para coincidir con el JSON
document.getElementById('busqueda').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase().trim();
    
    const filtrados = productos.filter(p => 
        p.modelo.toLowerCase().includes(busqueda) || 
        p.marca.toLowerCase().includes(busqueda)
    );
    
    renderizar(filtrados);
});

// Ejecutamos la carga al abrir la web
obtenerDatos();
