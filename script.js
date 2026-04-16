let productos = [];

// Función para dar formato de moneda chilena
const formatoPeso = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor);
};

async function obtenerDatos() {
    const contenedor = document.getElementById('catalogo');
    try {
        console.log("Iniciando carga de datos...");
        const respuesta = await fetch('./productos.json');
        
        if (!respuesta.ok) {
            throw new Error(`No se encontró el archivo productos.json (Error ${respuesta.status})`);
        }

        const textoRaw = await respuesta.text();
        // Limpiamos espacios o caracteres invisibles que bloquean el JSON
        productos = JSON.parse(textoRaw.trim());
        
        console.log("Productos cargados exitosamente");
        renderizar(productos);

    } catch (error) {
        console.error("Error detallado:", error);
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color:red; padding:20px;">
                <h3>⚠️ Error en la base de datos</h3>
                <p>${error.message}</p>
                <p>Verifica que el nombre del archivo sea productos.json (todo en minúsculas).</p>
            </div>`;
    }
}

function renderizar(data) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = "";

    if (data.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>🔍 No se encontraron equipos con ese nombre.</p>";
        return;
    }

    data.forEach(item => {
        const ahorroNormal = (item.precioPrepago || 0) - (item.precioPlan || 0);
        
        // CORRECCIÓN: Calculamos el precio final con fibra
        // Si el precioFibra en el JSON es el monto del descuento (ej: 130.000), 
        // lo restamos del precio con plan.
        const precioFinalFibra = (item.precioPlan || 0) - (item.precioFibra || 0);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item.imagen}" alt="${item.modelo}" onerror="this.src='https://via.placeholder.com/200x200?text=Cargando+Imagen'">
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

            <div class="discount-tag">Ahorras ${formatoPeso(ahorroNormal)}</div>

            ${item.precioFibra && item.precioFibra !== "null" ? `
                <div class="fiber-box" style="background-color: #d4edda; border: 2px solid #28a745;">
                    <strong>OFERTA EQUIPO + FIBRA:</strong><br>
                    <span style="font-size:1.3rem; font-weight:bold;">${formatoPeso(precioFinalFibra)}</span><br>
                    <small>(Dscto. Fibra aplicado: ${formatoPeso(item.precioFibra)})</small>
                </div>
            ` : ''}

            <div class="plan-info" style="margin-top:10px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px;">
                Plan: $17.990 | SKU: ${item.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

    data.forEach(item => {
        const ahorro = (item.precioPrepago || 0) - (item.precioPlan || 0);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item.imagen}" alt="${item.modelo}" onerror="this.src='https://via.placeholder.com/200x200?text=Cargando+Imagen'">
            </div>
            <div class="brand">${item.marca}</div>
            <div class="model">${item.modelo}</div>
            
            <div class="price-row">
                <span>Prepago:</span>
                <span class="price-val">${formatoPeso(item.precioPrepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(item.precioPlan)}</span>
            </div>

            <div class="discount-tag">¡Ahorras ${formatoPeso(ahorro)}!</div>

            ${item.precioFibra && item.precioFibra !== "null" ? `
                <div class="fiber-box">
                    <strong>PRECIO PLAN + FIBRA:</strong><br>
                    <span style="font-size:1.2rem;">${formatoPeso(item.precioFibra)}</span>
                </div>
            ` : ''}

            <div class="plan-info" style="margin-top:10px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px;">
                Plan: $17.990 | SKU: ${item.skuPlan}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Buscador corregido
document.getElementById('busqueda').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase().trim();
    const filtrados = productos.filter(p => 
        p.modelo.toLowerCase().includes(busqueda) || 
        p.marca.toLowerCase().includes(busqueda)
    );
    renderizar(filtrados);
});

obtenerDatos();
