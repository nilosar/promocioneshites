let productos = [];

// 1. Cargar los datos desde el JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        productos = await respuesta.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 2. Función para mostrar las tarjetas
function mostrarProductos(lista) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = '';

    lista.forEach(p => {
        const descuentoNormal = p.precioPrepago - p.precioPlan;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="img/${p.imagen}" alt="${p.modelo}">
            </div>
            <div class="brand">${p.marca}</div>
            <div class="model">${p.modelo}</div>
            
            <div class="price-box">
                <span class="label">Precio Prepago:</span><br>
                <span class="price">$${p.precioPrepago.toLocaleString()}</span>
            </div>

            <div class="price-box">
                <span class="label">Con Plan:</span><br>
                <span class="price" style="color:var(--entel-blue)">$${p.precioPlan.toLocaleString()}</span>
                <div class="discount-badge">Ahorras $${descuentoNormal.toLocaleString()}</div>
            </div>

            ${p.precioFibra ? `
                <div class="fiber-special">
                    OFERTA PLAN + FIBRA: $${p.precioFibra.toLocaleString()}<br>
                    <small>Ahorro extra: $${(p.precioPlan - p.precioFibra).toLocaleString()}</small>
                </div>
            ` : ''}

            <div class="plan-info">
                <strong>Plan: $17.990</strong><br>
                SKU Plan: ${p.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. Buscador en tiempo real
document.getElementById('busqueda').addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => 
        p.modelo.toLowerCase().includes(termino) || 
        p.marca.toLowerCase().includes(termino)
    );
    mostrarProductos(filtrados);
});

cargarProductos();