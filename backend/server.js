const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Estado inicial del Hospital (Base de datos en memoria)
let hospitalState = {
    nombre: "Hospital San Camilo",
    capacidad_maxima: 50,
    pacientes_espera_baja_complejidad: 12, // Empezamos con 12 (aprox 2 horas)
    tendencia: 'ESTABLE'
};

// Simula que cada 10 segundos entra o sale gente aleatoriamente
setInterval(() => {
    // Generamos un número aleatorio entre -2 y +3
    const flujo = Math.floor(Math.random() * 6) - 2; 
    
    // Actualizamos la cantidad de pacientes
    hospitalState.pacientes_espera_baja_complejidad += flujo;

    // Evitamos números negativos
    if (hospitalState.pacientes_espera_baja_complejidad < 0) {
        hospitalState.pacientes_espera_baja_complejidad = 0;
    }

    // Definimos la tendencia para mostrar en consola
    hospitalState.tendencia = flujo > 0 ? 'SUBIENDO 📈' : (flujo < 0 ? 'BAJANDO 📉' : 'ESTABLE ➖');
    
    console.log(`[SIMULACIÓN RCE] Pacientes ESI-4/5: ${hospitalState.pacientes_espera_baja_complejidad} | Tendencia: ${hospitalState.tendencia}`);

}, 10000); // Se ejecuta cada 10,000 ms (10 segundos)

function calcularTiempoEspera(cantidadPacientes) {
    // Fórmula simple: 10 minutos por paciente de baja complejidad acumulado
    // Más factor base de 20 minutos por triaje/administrativo
    return 20 + (cantidadPacientes * 10);
}

function obtenerEstado(tipo) {
    if (tipo === 'HOSPITAL') {
        const tiempo = calcularTiempoEspera(hospitalState.pacientes_espera_baja_complejidad);
        
        // Umbrales dinámicos
        let estado = 'DISPONIBLE';
        let color = 0xFF388E3C; // Verde
        let recomendacion = "Atención normal.";

        if (tiempo > 120) {
            estado = 'SATURADO';
            color = 0xFFD32F2F; // Rojo
            recomendacion = "Acudir solo en caso de Riesgo Vital (ESI 1-2).";
        } else if (tiempo > 60) {
            estado = 'CONGESTIONADO';
            color = 0xFFFBC02D; // Amarillo
            recomendacion = "Tiempo de espera elevado. Considere ir a SAPU.";
        }

        return { tiempo, estado, color, recomendacion };
    } else {
        return { tiempo: 25, estado: 'DISPONIBLE', color: 0xFF388E3C, recomendacion: "Opción recomendada para baja complejidad." };
    }
}

app.get('/api/v1/red-urgencia', (req, res) => {
    const hospital = obtenerEstado('HOSPITAL');
    const sapu = obtenerEstado('SAPU');

    res.json({
        mensaje: "Estado de la Red de Urgencia Aconcagua (Tiempo Real)",
        pacientes_en_fila_simulados: hospitalState.pacientes_espera_baja_complejidad,
        centros: [
            {
                nombre: "Hospital San Camilo (San Felipe)",
                tipo: "Alta Complejidad",
                tiempo_espera: hospital.tiempo,
                estado: hospital.estado,
                color_hex: hospital.color,
                recomendacion: hospital.recomendacion
            },
            {
                nombre: "SAPU Dr. Segismundo Iturra",
                tipo: "Atención Primaria",
                tiempo_espera: sapu.tiempo,
                estado: sapu.estado,
                color_hex: sapu.color,
                recomendacion: sapu.recomendacion
            },
            {
                nombre: "SAR Dr. Segismundo Iturra",
                tipo: "Alta Resolutividad",
                tiempo_espera: 35,
                estado: "DISPONIBLE",
                color_hex: 0xFF388E3C,
                recomendacion: "Disponible para urgencias de mediana gravedad"
            }
        ],
        timestamp: new Date().toISOString()
    });
});

// Forzar COLAPSO: https://tu-api.onrender.com/admin/colapsar
app.get('/admin/colapsar', (req, res) => {
    hospitalState.pacientes_espera_baja_complejidad = 20; // 20 * 10min + 20 = 220 minutos
    res.send("<h1>¡Emergencia Simulada! 🚨</h1><p>El hospital ha sido saturado manualmente.</p>");
});

// Forzar LIMPIEZA: https://tu-api.onrender.com/admin/liberar
app.get('/admin/liberar', (req, res) => {
    hospitalState.pacientes_espera_baja_complejidad = 2; // 2 * 10min + 20 = 40 minutos
    res.send("<h1>¡Limpieza Simulada! 🧹</h1><p>El hospital ha sido liberado manualmente.</p>");
});

app.listen(port, () => {
    console.log(`Servidor de Red Urgencia corriendo en puerto ${port}`);
    console.log(`[INIT] Simulación iniciada con ${hospitalState.pacientes_espera_baja_complejidad} pacientes.`);
});