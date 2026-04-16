async function obtenerDatos() {
    try {
        console.log("Intentando cargar JSON...");
        const respuesta = await fetch('./productos.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP! estado: ${respuesta.status}`);
        }

        const textoLimpio = await respuesta.text(); // Leemos como texto primero
        productos = JSON.parse(textoLimpio.trim()); // Limpiamos espacios invisibles y convertimos
        
        console.log("JSON cargado con éxito:", productos);
        renderizar(productos);
    } catch (error) {
        console.error("Error detallado:", error);
        document.getElementById('catalogo').innerHTML = `
            <div style="text-align:center; padding:50px; color:red;">
                <h3>Error en el archivo de datos</h3>
                <p>${error.message}</p>
                <small>Revisa la consola (F12) para más detalles.</small>
            </div>`;
    }
}
