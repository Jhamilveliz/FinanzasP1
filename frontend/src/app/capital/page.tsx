// src/app/capital/page.tsx
"use client";
import { useState, useEffect } from "react";
import { calcularDilucion } from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export default function CapitalPage() {
    const [inversion, setInversion] = useState<number>(200000);
    const [valoracionFutura, setValoracionFutura] = useState<number>(2000000);
    const [capValoracion, setCapValoracion] = useState<number>(2000000);
    const [descuento, setDescuento] = useState<number>(20);

    const [resultado, setResultado] = useState<{
        porcentaje_inversor: number;
        porcentaje_fundador: number;
        metodo_usado: string;
        mensaje_criterio: string;
    }>({
        porcentaje_inversor: 0,
        porcentaje_fundador: 100,
        metodo_usado: "",
        mensaje_criterio: ""
    });

    useEffect(() => {
        const pedirDatosAPython = async () => {
            try {
                const data = await calcularDilucion({
                    inversion,
                    valoracion_futura: valoracionFutura,
                    cap_valoracion: capValoracion,
                    descuento
                });
                setResultado(data);
            } catch (error) {
                console.error("No se pudo conectar a Python (Dilución)", error);
            }
        };
        pedirDatosAPython();
    }, [inversion, valoracionFutura, capValoracion, descuento]);

    const datosGrafico = [
        { name: 'Fundadora', value: resultado.porcentaje_fundador },
        { name: 'Inversionista', value: resultado.porcentaje_inversor },
    ];
    const COLORES = ['#f5a623', '#1e2a3a'];

    // Validación y formatteo seguro de números
    const formatearMoneda = (valor: number | string): string => {
        const num = typeof valor === "string" ? parseFloat(valor) : valor;
        if (isNaN(num) || num === undefined) return "Bs. 0";
        return `Bs. ${Math.round(num).toLocaleString("es-BO")}`;
    };

    const esPositivo = resultado.mensaje_criterio?.includes('✅') ?? false;

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
                            <PieIcon size={13} /> Capital · Dilución
                        </div>
                        <h1 className="text-xl font-medium text-white">Levantamiento de Capital: Sucursal Urubo</h1>
                    </div>
                    <p className="hidden lg:block text-sm text-right max-w-sm" style={{ color: '#8fa3b8' }}>
                        Un inversor quiere inyectar dinero para abrir una nueva sucursal. ¿Cuánto porcentaje de Urubo Bakery perderá la dueña al firmar esta nota convertible?
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
                        Variables de inversión
                    </h3>

                    <div className="flex flex-col gap-4 flex-1 justify-between">
                        {[
                            { label: 'Inversión para la Nueva Sucursal (Bs.)', value: inversion, setter: setInversion },
                            { label: 'Valoración Futura Esperada (Bs.)', value: valoracionFutura, setter: setValoracionFutura },
                        ].map(({ label, value, setter }) => (
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
                            </div>
                        ))}

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium" style={{ color: '#64748b' }}>
                                    Valoración Tope de Urubo Bakery (Cap)
                                </label>
                                <span
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ background: '#faeeda', color: '#ba7517' }}
                                >
                                    {formatearMoneda(capValoracion)}
                                </span>
                            </div>
                            <input
                                type="range" min="1000000" max="3000000" step="100000"
                                value={capValoracion}
                                onChange={(e) => setCapValoracion(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                style={{ background: '#e2e8f0' }}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium" style={{ color: '#64748b' }}>
                                    Descuento negociado
                                </label>
                                <span
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ background: '#faeeda', color: '#ba7517' }}
                                >
                                    {descuento}%
                                </span>
                            </div>
                            <input
                                type="range" min="0" max="50" step="5"
                                value={descuento}
                                onChange={(e) => setDescuento(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                style={{ background: '#e2e8f0' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="lg:col-span-2 flex flex-col gap-5 min-h-0">

                    {/* Método + Criterio */}
                    <div className="grid grid-cols-2 gap-5 flex-shrink-0">
                        <div
                            className="rounded-2xl p-5"
                            style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                        >
                            <p className="text-sm mb-2" style={{ color: '#64748b' }}>
                                El inversionista convierte usando
                            </p>
                            <p className="text-lg font-medium" style={{ color: '#1e2a3a' }}>
                                {resultado.metodo_usado || '—'}
                            </p>
                        </div>

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
                                {resultado.mensaje_criterio || '—'}
                            </p>
                        </div>
                    </div>

                    {/* Gráfico torta */}
                    <div
                        className="rounded-2xl p-6 flex flex-col flex-1 min-h-0"
                        style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                    >
                        <div className="flex-shrink-0 pb-4 mb-2" style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                            <h3 className="text-base font-medium" style={{ color: '#1e2a3a' }}>
                                Distribución de acciones (Cap Table)
                            </h3>
                            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                                Porcentaje accionario tras la conversión
                            </p>
                        </div>

                        <div className="flex-1 min-h-0 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={datosGrafico}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(props: any) => `${(props.percent * 100).toFixed(1)}%`}
                                        outerRadius="70%"
                                        dataKey="value"
                                    >
                                        {datosGrafico.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any, name: any) => {
                                            const num = typeof value === 'number' ? value : parseFloat(value);
                                            return isNaN(num) ? '0%' : `${num.toFixed(2)}%`;
                                        }}
                                        contentStyle={{ borderRadius: '12px', border: '0.5px solid #e2e8f0', boxShadow: 'none' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => (
                                            <span style={{ color: '#64748b', fontSize: '13px' }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}