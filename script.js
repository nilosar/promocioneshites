let productos = [];

const formatoPeso = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(valor);
};

async function obtenerDatos() {
    try {
        const respuesta = await fetch('./productos.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar el JSON");
        productos = await respuesta.json();
        renderizar(productos);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('catalogo').innerHTML = "<p>Error cargando los productos. Revisa el archivo JSON.</p>";
    }
}

function renderizar(data) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = "";

    data.forEach(item => {
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
                <span>Prepago:</span>
                <span class="price-val">${formatoPeso(item.precioPrepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan:</span>
                <span class="price-val">${formatoPeso(item.precioPlan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorro)}</div>

            ${item.precioFibra ? `
                <div class="fiber-box">
                    <strong>Precio con Fibra:</strong><br>
                    ${formatoPeso(item.precioFibra)}
                </div>
            ` : ''}

            <div class="sku-info">
                Plan: $17.990 | SKU: ${item.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.getElementById('busqueda').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => 
        p.modelo.toLowerCase().includes(busqueda) || 
        p.marca.toLowerCase().includes(busqueda)
    );
    renderizar(filtrados);
});

obtenerDatos();
