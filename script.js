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
        if (!respuesta.ok) throw new Error("No se pudo cargar productos.json");

        const textoRaw = await respuesta.text();
        // El trim() es vital para quitar espacios fantasmas al inicio/final
        productos = JSON.parse(textoRaw.trim());
        
        renderizar(productos);
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red;">Error en los datos. Revisa el archivo productos.json</p>`;
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
        // Esta función quita puntos y convierte a número real
        const aNumero = (val) => {
            if (!val || val === "null" || val === null) return 0;
            if (typeof val === "number") return val;
            return Number(String(val).replace(/\./g, '').replace(/[^0-9]/g, ''));
        };

        // Mapeo flexible: Busca el dato sin importar cómo se llame en el JSON
        const mod = item.Modelo || item.modelo || "Desconocido";
        const mar = item.Marca || item.marca || "EQUIPO";
        const img = item["Imagen (Nombre de archivo)"] || item.imagen || "";
        const sku = item["SKU Plan"] || item.skuPlan || "N/A";
        
        const prepa = aNumero(item.Prepago || item.precioPrepago);
        const plan = aNumero(item["Con Plan"] || item.precioPlan);
        const fibra = aNumero(item["Dcto. Especial (Fibra)"] || item.precioFibra);
        
        const ahorro = prepa - plan;
        // RESTA CORRECTA: Prepago menos Descuento Fibra
        const finalFibra = prepa - fibra;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${img}" alt="${mod}" onerror="this.src='https://via.placeholder.com/200x200?text=Sin+Foto'">
            </div>
            <div class="brand">${mar}</div>
            <div class="model">${mod}</div>
            
            <div class="price-row">
                <span>Precio Prepago:</span>
                <span class="price-val">${formatoPeso(prepa)}</span>
            </div>
            
            <div class="price-row">
                <span>Con Plan Entel:</span>
                <span class="price-val" style="color:#0033a0;">${formatoPeso(plan)}</span>
            </div>

            <div class="discount-tag">Ahorras ${formatoPeso(ahorro)}</div>

            ${fibra > 0 ? `
                <div class="fiber-box" style="background-color: #d4edda; border: 2px solid #28a745; margin-top:10px; padding:10px; border-radius:10px;">
                    <strong style="color: #155724;">OFERTA EQUIPO + FIBRA:</strong><br>
                    <span style="font-size:1.4rem; font-weight:bold; color:#155724;">${formatoPeso(finalFibra)}</span><br>
                    <small style="color:#155724;">(Dscto. aplicado sobre Prepago)</small>
                </div>
            ` : ''}

            <div style="margin-top:15px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px; color:#666;">
                SKU: ${sku}
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.getElementById('busqueda').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtrados = productos.filter(p => {
        const m = (p.Modelo || p.modelo || "").toLowerCase();
        const r = (p.Marca || p.marca || "").toLowerCase();
        return m.includes(term) || r.includes(term);
    });
    renderizar(filtrados);
});

obtenerDatos();
