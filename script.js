let productos = [];

const formatoPeso = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor || 0);
};

async function obtenerDatos() {
    const contenedor = document.getElementById('catalogo');
    try {
        const respuesta = await fetch('./productos.json');
        if (!respuesta.ok) throw new Error("No se encontró productos.json");

        const textoRaw = await respuesta.text();
        productos = JSON.parse(textoRaw.trim());
        
        // Mostrar todos los productos al cargar
        renderizar(productos);
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red;">Error al cargar datos: ${error.message}</p>`;
    }
}

function renderizar(data) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No hay modelos disponibles.</p>";
        return;
    }

    data.forEach(item => {
        // Aseguramos que los valores sean números para evitar errores de cálculo
        const prepago = Number(item.precioPrepago) || 0;
        const plan = Number(item.precioPlan) || 0;
        const fibraDcto = (item.precioFibra && item.precioFibra !== "null") ? Number(item.precioFibra) : 0;
        
        const ahorroNormal = prepago - plan;
        const precioFinalFibra = plan - fibraDcto;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item.imagen}" alt="${item.modelo}" onerror="this.src='https://via.placeholder.com/200x200?text=Cargando...'">
            </div>
            <div class="brand">${item.marca}</div>
            <div class="model">${item.modelo}</div>
            
            <div class="price-row">
                <span>Prepago:</span>
                <span class="price-val">${formatoPeso(prepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(plan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorroNormal)}</div>

            ${fibraDcto > 0 ? `
                <div class="fiber-box" style="background-color: #d4edda; border: 2px solid #28a745; margin-top:10px; padding:10px; border-radius:10px;">
                    <strong>OFERTA EQUIPO + FIBRA:</strong><br>
                    <span style="font-size:1.3rem; font-weight:bold; color:#155724;">${formatoPeso(precioFinalFibra)}</span><br>
                    <small style="color:#155724;">(Dscto. Fibra: -${formatoPeso(fibraDcto)})</small>
                </div>
            ` : ''}

            <div style="margin-top:15px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px; color:#666;">
                Plan: $17.990 | SKU: ${item.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.getElementById('busqueda').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase().trim();
    const filtrados = productos.filter(p => 
        (p.modelo && p.modelo.toLowerCase().includes(busqueda)) || 
        (p.marca && p.marca.toLowerCase().includes(busqueda))
    );
    renderizar(filtrados);
});

obtenerDatos();
