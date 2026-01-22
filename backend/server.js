// server.js - API Red Urgencia Aconcagua (Demo Nube)
const express = require('express');
const cors = require('cors'); // Necesario para que Flutter Web se conecte
const app = express();
const port = process.env.PORT || 3000; // El puerto lo asignará la nube

app.use(cors()); // Permitir conexiones externas

// Simulación de estados basada en ESI
function obtenerEstado(tipo) {
    // Simulamos que el Hospital está colapsado y los SAPU libres
    if (tipo === 'HOSPITAL') {
        return { tiempo: 180, estado: 'SATURADO', color: 0xFFD32F2F }; // Rojo
    } else {
        return { tiempo: 25, estado: 'DISPONIBLE', color: 0xFF388E3C }; // Verde
    }
}

app.get('/api/v1/red-urgencia', (req, res) => {
    const hospital = obtenerEstado('HOSPITAL');
    const sapu = obtenerEstado('SAPU');

    res.json({
        mensaje: "Estado de la Red de Urgencia Aconcagua",
        centros: [
            {
                nombre: "Hospital San Camilo (San Felipe)",
                tipo: "Alta Complejidad",
                tiempo_espera: hospital.tiempo,
                estado: hospital.estado,
                color_hex: hospital.color,
                recomendacion: "Acudir solo en caso de Riesgo Vital (ESI 1-2)"
            },
            {
                nombre: "SAPU Segismundo Iturra",
                tipo: "Atención Primaria",
                tiempo_espera: sapu.tiempo,
                estado: sapu.estado,
                color_hex: sapu.color,
                recomendacion: "Opción recomendada para baja complejidad (ESI 4-5)"
            },
            {
                nombre: "SAR Dr. Segismundo Iturra",
                tipo: "Alta Resolutividad",
                tiempo_espera: 35,
                estado: "DISPONIBLE",
                color_hex: sapu.color,
                recomendacion: "Disponible para urgencias de mediana gravedad"
            }
        ],
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});