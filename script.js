let productos = [];

// Formato de moneda chilena
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
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo productos.json");

        const textoRaw = await respuesta.text();
        productos = JSON.parse(textoRaw.trim());
        
        console.log("Datos cargados:", productos);
        renderizar(productos);
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red;">Error al cargar el catálogo. Revisa el formato del archivo JSON.</p>`;
    }
}

function renderizar(data) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = "";

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No se encontraron equipos.</p>";
        return;
    }

    data.forEach(item => {
        // Función interna para limpiar puntos y convertir a número
        const limpiar = (val) => {
            if (!val || val === "null" || val === null) return 0;
            return Number(String(val).replace(/\./g, ''));
        };

        // Extraemos los valores usando los nombres exactos de tu JSON
        const prepago = limpiar(item["Prepago"] || item.precioPrepago);
        const conPlan = limpiar(item["Con Plan"] || item.precioPlan);
        const dctoFibra = limpiar(item["Dcto. Especial (Fibra)"] || item.precioFibra);
        
        const ahorroNormal = prepago - conPlan;
        
        // LÓGICA SOLICITADA: Al precio PREPAGO se le resta el DESCUENTO FIBRA
        const precioFinalFibra = prepago - dctoFibra;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${item["Imagen (Nombre de archivo)"] || item.imagen}" alt="${item.Modelo}" onerror="this.src='https://via.placeholder.com/200x200?text=Sin+Foto'">
            </div>
            <div class="brand">${item.Marca || 'EQUIPO'}</div>
            <div class="model">${item.Modelo || 'Modelo Genérico'}</div>
            
            <div class="price-row">
                <span>Precio Prepago:</span>
                <span class="price-val">${formatoPeso(prepago)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan Entel:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(conPlan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorroNormal)}</div>

            ${dctoFibra > 0 ? `
                <div class="fiber-box" style="background-color: #d4edda; border: 2px solid #28a745; margin-top:10px; padding:10px; border-radius:10px;">
                    <strong style="color: #155724;">OFERTA EQUIPO + FIBRA:</strong><br>
                    <span style="font-size:1.4rem; font-weight:bold; color:#155724;">${formatoPeso(precioFinalFibra)}</span><br>
                    <small style="color:#155724;">(Dscto. Fibra aplicado sobre Prepago)</small>
                </div>
            ` : ''}

            <div style="margin-top:15px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px; color:#666;">
                Plan: $17.990 | SKU: ${item["SKU Plan"] || item.skuPlan || 'N/A'}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Buscador
document.getElementById('busqueda').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase().trim();
    const filtrados = productos.filter(p => {
        const modelo = (p.Modelo || "").toLowerCase();
        const marca = (p.Marca || "").toLowerCase();
        return modelo.includes(busqueda) || marca.includes(busqueda);
    });
    renderizar(filtrados);
});

// Iniciar app
obtenerDatos();
