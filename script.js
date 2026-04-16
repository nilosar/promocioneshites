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
        
        renderizar(productos);
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red;">Error en los datos: Revisa el formato del archivo productos.json</p>`;
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
        // Limpiamos los valores por si vienen con puntos o como texto
        const limpiarNumero = (val) => {
            if (!val || val === "null") return 0;
            return Number(String(val).replace(/\./g, ''));
        };

        const prepago = limpiarNumero(item.precioPrepago);
        const plan = limpiarNumero(item.precioPlan);
        const fibraDcto = limpiarNumero(item.precioFibra);
        
        const ahorroNormal = prepago - plan;
        const precioFinalFibra = plan - fibraDcto;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item.imagen}" alt="${item.modelo}" onerror="this.src='https://via.placeholder.com/200x200?text=Sin+Foto'">
            </div>
            <div class="brand">${item.marca || 'GENÉRICO'}</div>
            <div class="model">${item.modelo || 'Modelo Desconocido'}</div>
            
            <div class="price-row">
                <span>Precio Prepago:</span>
                <span class="price-val">${formatoPeso(prepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan Entel:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(plan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorroNormal)}</div>

            ${fibraDcto > 0 ? `
                <div class="fiber-box" style="background-color: #d4edda; border: 2px solid #28a745; margin-top:10px; padding:10px; border-radius:10px;">
                    <strong>OFERTA EQUIPO + FIBRA:</strong><br>
                    <span style="font-size:1.3rem; font-weight:bold; color:#155724;">${formatoPeso(precioFinalFibra)}</span><br>
                    <small style="color:#155724;">(Descuento Fibra: -${formatoPeso(fibraDcto)})</small>
                </div>
            ` : ''}

            <div style="margin-top:15px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px; color:#666;">
                Plan: $17.990 | SKU: ${item.skuPlan || 'N/A'}
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
