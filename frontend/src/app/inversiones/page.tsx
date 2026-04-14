// src/app/inversiones/page.tsx
"use client";
import { useState, useEffect } from "react";
import { calcularVan } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Función Matemática para calcular la TIR en el Frontend
const calcularTIRLocal = (flujos: number[]): number => {
    let minRate = -0.99; // -99%
    let maxRate = 10.0;  // 1000%
    let guess = 0;

    // Método iterativo de bisección
    for (let iteration = 0; iteration < 100; iteration++) {
        guess = (minRate + maxRate) / 2;
        let npv = 0;
        for (let i = 0; i < flujos.length; i++) {
            npv += flujos[i] / Math.pow(1 + guess, i);
        }
        if (Math.abs(npv) < 0.001) break;
        if (npv > 0) minRate = guess;
        else maxRate = guess;
    }
    return guess * 100; // Retorna en porcentaje
};

export default function InversionesPage() {
    const [inversionInicial, setInversionInicial] = useState<number>(-50000);
    const [flujo1, setFlujo1] = useState<number>(20000);
    const [flujo2, setFlujo2] = useState<number>(25000);
    const [flujo3, setFlujo3] = useState<number>(30000);
    const [tasaDescuento, setTasaDescuento] = useState<number>(15);

    const [resultado, setResultado] = useState<{
        van: number;
        mensaje_criterio: string;
    }>({
        van: 0,
        mensaje_criterio: "",
    });

    useEffect(() => {
        const pedirDatosAPython = async () => {
            try {
                const data = await calcularVan({
                    inversion_inicial: inversionInicial,
                    flujo_1: flujo1,
                    flujo_2: flujo2,
                    flujo_3: flujo3,
                    tasa_descuento: tasaDescuento
                });
                setResultado(data);
            } catch (error) {
                console.error("No se pudo conectar a Python (VAN)", error);
            }
        };
        pedirDatosAPython();
    }, [inversionInicial, flujo1, flujo2, flujo3, tasaDescuento]);

    const datosGrafico = [
        { año: 'Año 0', flujo: inversionInicial },
        { año: 'Año 1', flujo: flujo1 },
        { año: 'Año 2', flujo: flujo2 },
        { año: 'Año 3', flujo: flujo3 },
    ];

    // Cálculos de la TIR
    const flujosArray = [inversionInicial, flujo1, flujo2, flujo3];
    const tirCalculada = calcularTIRLocal(flujosArray);
    const tirFormateada = isNaN(tirCalculada) ? "0.00" : tirCalculada.toFixed(2);
    const tirSuperaBanco = tirCalculada >= tasaDescuento;

    const vanFormateado = isNaN(resultado.van) ? "0.00" : resultado.van.toFixed(2);
    const esPositivo = resultado.van >= 0;

    return (
        <div className="h-full flex flex-col gap-5 overflow-hidden">

            {/* Header */}
            <div
                className="rounded-2xl px-8 py-5 relative overflow-hidden flex-shrink-0"
                style={{ background: '#1e2a3a' }}
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-2 text-sm font-medium"
                            style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.25)', color: '#f5a623' }}
                        >
                            <TrendingUp size={13} /> Inversiones · VAN y TIR
                        </div>
                        <h1 className="text-xl font-medium text-white">Inversión: Horno Industrial y Delivery</h1>
                    </div>
                    <p className="hidden lg:block text-sm text-right max-w-sm" style={{ color: '#8fa3b8' }}>
                        Evaluación del proyecto (VAN y TIR). ¿Vale la pena endeudar a Urubo Bakery para comprar un nuevo horno rotativo y una moto de delivery?
                    </p>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">

                {/* Panel izquierdo: Parámetros */}
                <div
                    className="rounded-2xl p-6 flex flex-col gap-5 min-h-0"
                    style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                >
                    <h3
                        className="text-base font-medium flex-shrink-0 pb-4"
                        style={{ color: '#1e2a3a', borderBottom: '0.5px solid #e2e8f0' }}
                    >
                        Datos del Proyecto
                    </h3>

                    <div className="flex flex-col gap-4 flex-1 justify-between">
                        {[
                            { label: 'Costo del Horno y Moto (Inversión)', value: inversionInicial, setter: setInversionInicial, hint: 'Usa signo negativo (-) para salida de dinero' },
                            { label: 'Flujo Neto Año 1 (Ventas Extra)', value: flujo1, setter: setFlujo1 },
                            { label: 'Flujo Neto Año 2 (Ventas Extra)', value: flujo2, setter: setFlujo2 },
                            { label: 'Flujo Neto Año 3 (Ventas Extra)', value: flujo3, setter: setFlujo3 },
                        ].map(({ label, value, setter, hint }) => (
                            <div key={label}>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: '#64748b' }}>
                                    {label}
                                </label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setter(Number(e.target.value))}
                                    className="w-full p-3 rounded-xl text-sm outline-none transition-all"
                                    style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', color: '#1e2a3a' }}
                                    onFocus={e => e.target.style.borderColor = '#f5a623'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                                {hint && <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{hint}</p>}
                            </div>
                        ))}

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium" style={{ color: '#64748b' }}>
                                    Retorno Exigido por el Banco (%)
                                </label>
                                <span
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ background: '#faeeda', color: '#ba7517' }}
                                >
                                    {tasaDescuento}%
                                </span>
                            </div>
                            <input
                                type="range" min="0" max="50" step="1"
                                value={tasaDescuento}
                                onChange={(e) => setTasaDescuento(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                style={{ background: '#e2e8f0' }}
                            />
                            <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                                Ajusta el costo de capital exigido
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel derecho: Resultado + Gráfico */}
                <div className="lg:col-span-2 flex flex-col gap-5 min-h-0">

                    {/* TARJETAS SUPERIORES: VAN, TIR y Criterio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-shrink-0">
                        {/* 1. Tarjeta VAN */}
                        <div
                            className="rounded-2xl p-5 flex flex-col justify-center"
                            style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                        >
                            <p className="text-sm mb-2" style={{ color: '#64748b' }}>Valor Actual Neto (VAN)</p>
                            <p
                                className="text-2xl font-medium"
                                style={{ color: esPositivo ? '#3b6d11' : '#a32d2d' }}
                            >
                                Bs. {parseFloat(vanFormateado).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* 2. Tarjeta TIR (¡NUEVA!) */}
                        <div
                            className="rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden"
                            style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                        >
                            <p className="text-sm mb-2" style={{ color: '#64748b' }}>Tasa Interna de Retorno (TIR)</p>
                            <p
                                className="text-2xl font-medium flex items-center gap-2"
                                style={{ color: tirSuperaBanco ? '#3b6d11' : '#a32d2d' }}
                            >
                                {tirFormateada}%
                                <span className="text-sm font-normal px-2 py-0.5 rounded-md" style={{ background: tirSuperaBanco ? '#eaf3de' : '#fcebeb' }}>
                                    {tirSuperaBanco ? '> ' + tasaDescuento + '%' : '< ' + tasaDescuento + '%'}
                                </span>
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                                Si la TIR supera al banco, aprueba.
                            </p>
                        </div>

                        {/* 3. Tarjeta Criterio */}
                        <div
                            className="rounded-2xl p-5 flex items-center"
                            style={{
                                background: esPositivo ? '#eaf3de' : '#fcebeb',
                                border: `0.5px solid ${esPositivo ? '#c0dd97' : '#f7c1c1'}`,
                            }}
                        >
                            <p
                                className="text-sm font-medium leading-relaxed"
                                style={{ color: esPositivo ? '#3b6d11' : '#a32d2d' }}
                            >
                                {resultado.mensaje_criterio || (esPositivo ? '✅ Proyecto viable. El VAN es positivo y la TIR supera el costo de la deuda.' : '❌ Proyecto no viable. Destruye valor.')}
                            </p>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div
                        className="rounded-2xl p-6 flex flex-col flex-1 min-h-0"
                        style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                    >
                        <div className="flex-shrink-0 pb-4 mb-2" style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                            <h3 className="text-base font-medium" style={{ color: '#1e2a3a' }}>
                                Flujos de Caja Proyectados
                            </h3>
                            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                                Visualización por año del proyecto
                            </p>
                        </div>

                        <div className="w-full h-[300px] md:h-[400px] min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosGrafico} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="año"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 13 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(v) => `Bs. ${v}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: '0.5px solid #e2e8f0', boxShadow: 'none' }}
                                        labelStyle={{ fontWeight: '500', color: '#1e2a3a', marginBottom: '4px' }}
                                        formatter={(value: any, name: any) => [
                                            `Bs. ${typeof value === 'number' ? value.toLocaleString("es-BO") : value}`,
                                            'Flujo'
                                        ]}
                                    />
                                    <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={2} />
                                    <Bar
                                        dataKey="flujo"
                                        radius={[8, 8, 0, 0]}
                                        barSize={48}
                                        fill="#f5a623"
                                        activeBar={{ fill: '#1e2a3a' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}