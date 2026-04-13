
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function calcularRunway(datos: {
    caja_inicial: number;
    costos_fijos: number;
    ingresos_base: number;
    porcentaje_ventas: number;
}) {
    const respuesta = await fetch(`${API_URL}/runway`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
        throw new Error('Error al conectar con el cerebro matemático de Python');
    }

    return respuesta.json();
}

export async function calcularVan(datos: {
    inversion_inicial: number;
    flujo_1: number;
    flujo_2: number;
    flujo_3: number;
    tasa_descuento: number;
}) {
    const respuesta = await fetch(`${API_URL}/van`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
        throw new Error('Error al calcular el VAN');
    }

    return respuesta.json();
}

export async function calcularDilucion(datos: {
    inversion: number;
    valoracion_futura: number;
    cap_valoracion: number;
    descuento: number;
}) {
    const respuesta = await fetch(`${API_URL}/dilucion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
        throw new Error('Error al calcular la dilución');
    }

    return respuesta.json();
}

export async function calcularPrestamos(datos: {
    capital: number;
    meses: number;
    tasa_simple_anual: number;
    tasa_compuesta_anual: number;
}) {
    const respuesta = await fetch(`${API_URL}/prestamos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
        throw new Error('Error al calcular las ofertas de préstamo');
    }

    return respuesta.json();
}
