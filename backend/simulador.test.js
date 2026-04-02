// Prueba Unitaria: Verifica la lógica matemática del Triage ESI

// Mock de la función para pruebas
function simularTiempoEspera(categoria) {
    const baseEspera = { 
        'C1': 0,    // ESI 1: Vital
        'C2': 10,   // ESI 2: Emergencia
        'C3': 40,   // ESI 3: Urgencia
        'C4': 120,  // ESI 4: Baja Complejidad (Derivable a SAPU)
        'C5': 240   // ESI 5: No Urgente
    };
    return baseEspera[categoria];
}

describe('Pruebas de Algoritmo ESI (Teoría de Colas)', () => {
    test('Un paciente ESI-1 (Emergencia Vital) debe tener 0 minutos de espera', () => {
        const resultado = simularTiempoEspera('C1');
        expect(resultado).toBe(0);
    });

    test('Un paciente ESI-4 (Baja Complejidad) debe tener espera base de 120 minutos', () => {
        const resultado = simularTiempoEspera('C4');
        expect(resultado).toBe(120);
    });

    test('Categoría inválida debe retornar undefined', () => {
        const resultado = simularTiempoEspera('Z99');
        expect(resultado).toBeUndefined();
    });
});