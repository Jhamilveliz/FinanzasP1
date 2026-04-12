// src/app/supervivencia/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { calcularRunway } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wallet, TrendingDown, Clock, Activity } from 'lucide-react';

export default function SupervivenciaPage() {
    const [caja, setCaja] = useState<number>(15000);
    const [costos, setCostos] = useState<number>(4500);
    const [ingresos, setIngresos] = useState<number>(6000);
    const [porcentaje, setPorcentaje] = useState<number>(100);

        const [resultado, setResultado] = useState<{
        ingresos_reales: number;
        perdida_mensual: number;
        meses_supervivencia: string;
    }>({
        ingresos_reales: 0,
        perdida_mensual: 0,
        meses_supervivencia: "0",
    });

    useEffect(() => {
        const pedirDatosAPython = async () => {
            try {
                const data = await calcularRunway({
                    caja_inicial: caja,
                    costos_fijos: costos,
                    ingresos_base: ingresos,
                    porcentaje_ventas: porcentaje,
                });
                setResultado(data);
            } catch (error) {
                console.error("No se pudo conectar a Python", error);
            }
        };
        pedirDatosAPython();
    }, [caja, costos, ingresos, porcentaje]);

    // Validación y formatteo seguro de números
    const formatearMoneda = (valor: number | string): string => {
        const num = typeof valor === "string" ? parseFloat(valor) : valor;
        if (isNaN(num) || num === undefined) return "Bs. 0";
        return `Bs. ${Math.round(num).toLocaleString("es-BO")}`;
    };

    const datosGrafico = Array.from({ length: 6 }).map((_, i) => ({
        mes: `Mes ${i + 1}`,
        cajaRestante: Math.max(0, caja - resultado.perdida_mensual * i),
    }));

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
                            <Clock size={13} /> Supervivencia · Runway
                        </div>
                        <h1 className="text-xl font-medium text-white">Supervivencia de Urubo Bakery (Runway)</h1>
                    </div>
                    <p className="hidden lg:block text-sm text-right max-w-sm" style={{ color: '#8fa3b8' }}>
                        Simula escenarios de crisis. Si las ventas de horneados caen, ¿cuántos meses podemos pagar el alquiler del local y a los panaderos antes de quedarnos sin caja?
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                {[
                    {
                        Icon: Wallet, label: 'Caja Actual',
                        value: formatearMoneda(caja),
                        iconBg: '#f1f5f9', iconColor: '#475569',
                        valueColor: '#1e2a3a',
                    },
                    {
                        Icon: Activity, label: 'Ingresos Proyectados',
                        value: formatearMoneda(resultado.ingresos_reales),
                        iconBg: '#eaf3de', iconColor: '#3b6d11',
                        valueColor: '#1e2a3a',
                    },
                    {
                        Icon: TrendingDown, label: 'Pérdida Mensual',
                        value: formatearMoneda(resultado.perdida_mensual),
                        iconBg: '#fcebeb', iconColor: '#a32d2d',
                        valueColor: '#a32d2d',
                    },
                    {
                        Icon: Clock, label: 'Meses de Supervivencia',
                        value: `${resultado.meses_supervivencia} meses`,
                        iconBg: '#faeeda', iconColor: '#ba7517',
                        valueColor: '#ba7517',
                        highlight: true,
                    },
                ].map(({ Icon, label, value, iconBg, iconColor, valueColor, highlight }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-5 flex items-center gap-4"
                        style={{
                            background: '#fff',
                            border: highlight ? '1.5px solid #f5a623' : '0.5px solid #e2e8f0',
                        }}
                    >
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: iconBg }}
                        >
                            <Icon size={20} style={{ color: iconColor }} />
                        </div>
                        <div>
                            <p className="text-xs mb-1" style={{ color: '#64748b' }}>{label}</p>
                            <p className="text-base font-medium" style={{ color: valueColor }}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main: Params + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">

                {/* Parámetros */}
                <div
                    className="rounded-2xl p-6 flex flex-col gap-5"
                    style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                >
                    <h3
                        className="text-base font-medium flex-shrink-0 pb-4"
                        style={{ color: '#1e2a3a', borderBottom: '0.5px solid #e2e8f0' }}
                    >
                        Parámetros
                    </h3>

                    <div className="flex flex-col gap-4 flex-1 justify-between">
                        {[
                            { label: 'Fondo de Emergencia en Caja (Bs.)', value: caja, setter: setCaja },
                            { label: 'Costos Fijos (Alquiler, Sueldos, Servicios)', value: costos, setter: setCostos },
                            { label: 'Ventas Promedio de Pan/Mes (Bs.)', value: ingresos, setter: setIngresos },
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
                                    style={{
                                        background: '#f8fafc',
                                        border: '0.5px solid #e2e8f0',
                                        color: '#1e2a3a',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#f5a623'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        ))}

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium" style={{ color: '#64748b' }}>
                                    Caída de Ventas (Ej: 80%)
                                </label>
                                <span
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ background: '#faeeda', color: '#ba7517' }}
                                >
                                    {porcentaje}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0" max="150" step="10"
                                value={porcentaje}
                                onChange={(e) => setPorcentaje(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                style={{ background: '#e2e8f0' }}
                            />
                            <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                                Ajusta para simular caída en ventas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gráfico */}
                <div
                    className="lg:col-span-2 rounded-2xl p-6 flex flex-col min-h-0"
                    style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
                >
                    <div className="flex-shrink-0 pb-4 mb-2" style={{ borderBottom: '0.5px solid #e2e8f0' }}>
                        <h3 className="text-base font-medium" style={{ color: '#1e2a3a' }}>
                            Proyección de la Caja (Runway)
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                            Estimación a 6 meses con la pérdida mensual actual
                        </p>
                    </div>

                    <div className="flex-1 w-full min-h-0 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosGrafico} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="mes"
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
                                    formatter={(value: any, name: any) => [`Bs. ${value}`, 'Caja Restante']}
                                />
                                <Bar
                                    dataKey="cajaRestante"
                                    fill="#f5a623"
                                    radius={[8, 8, 0, 0]}
                                    activeBar={{ fill: '#1e2a3a' }}
                                    barSize={48}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}