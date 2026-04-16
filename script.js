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
        const aNumero = (val) => {
            if (!val || val === "null" || val === null) return 0;
            if (typeof val === "number") return val;
            return Number(String(val).replace(/\./g, '').replace(/[^0-9]/g, ''));
        };

        const mod = item.Modelo || item.modelo || "Desconocido";
        const mar = item.Marca || item.marca || "EQUIPO";
        const img = item["Imagen (Nombre de archivo)"] || item.imagen || "";
        const sku = item["SKU Plan"] || item.skuPlan || "N/A";
        
        const prepa = aNumero(item.Prepago || item.precioPrepago);
        const plan = aNumero(item["Con Plan"] || item.precioPlan);
        const fibra = aNumero(item["Dcto. Especial (Fibra)"] || item.precioFibra);
        
        const ahorro = prepa - plan;
        const finalFibra = prepa - fibra;

        const card = document.createElement('div');
        card.className = 'card';
        
        // CORRECCIÓN: Todo el contenido (incluyendo el botón) debe ir dentro del innerHTML
        card.innerHTML = `
            <div class="img-container">
                <img src="./img/${img}" alt="${mod}" 
                     onclick="ampliarImagen('./img/${img}', '${mar} ${mod}')" 
                     onerror="this.src='https://via.placeholder.com/200x200?text=Sin+Foto'">
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

            <div style="margin-top:15px; font-size:0.8rem; border-top:1px solid #eee; padding-top:10px; color:#666; margin-bottom:10px;">
                SKU: ${sku}
            </div>

            <a href="https://wa.me/56965699563?text=Hola,%20me%20interesa%20el%20${mod}%20que%20vi%20en%20el%20catálogo" 
               target="_blank" 
               style="display:block; text-align:center; background:#0033a0; color:white; padding:10px; border-radius:5px; text-decoration:none; font-weight:bold;">
               Consultar Stock
            </a>
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

function ampliarImagen(src, titulo) {
    const modal = document.getElementById("modalImagen");
    const imgGrande = document.getElementById("imgGrande");
    const captionText = document.getElementById("caption");
    
    if (modal && imgGrande) {
        modal.style.display = "block";
        imgGrande.src = src;
        captionText.innerHTML = titulo;
    }
}

// Iniciar carga
obtenerDatos();
