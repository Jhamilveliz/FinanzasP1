"use client";
import { useState, useEffect } from "react";
import { calcularPrestamos } from "@/lib/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { CreditCard } from "lucide-react";

export default function PrestamosPage() {
    const [capital, setCapital] = useState(100000);
    const [meses, setMeses] = useState(24);
    const [tasaSimple, setTasaSimple] = useState(15);
    const [tasaCompuesta, setTasaCompuesta] = useState(11);

    const [resultado, setResultado] = useState({
        pago_total_simple: 0,
        pago_total_compuesto: 0,
        mensaje_criterio: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await calcularPrestamos({
                    capital,
                    meses,
                    tasa_simple_anual: tasaSimple,
                    tasa_compuesta_anual: tasaCompuesta,
                });
                setResultado(data);
            } catch (error) {
                console.error("No se pudo conectar a Python (Préstamos)", error);
            }
        };
        fetchData();
    }, [capital, meses, tasaSimple, tasaCompuesta]);

    const construirDatosGrafico = () => {
        const datos = [];
        const iSimpleMensual = tasaSimple / 100 / 12;
        const iCompuestaMensual = tasaCompuesta / 100 / 12;
        for (let m = 0; m <= meses; m++) {
            datos.push({
                mes: `M${m}`,
                Simple: Math.round(capital * (1 + iSimpleMensual * m)),
                Compuesto: Math.round(capital * Math.pow(1 + iCompuestaMensual, m)),
            });
        }
        return datos;
    };

    const datosGrafico = construirDatosGrafico();

    const ahorro = resultado.pago_total_compuesto - resultado.pago_total_simple;
    const esSimpleMejor = ahorro > 0;

    const formatBs = (val: number) =>
        `Bs. ${Math.round(val).toLocaleString("es-BO")}`;

    return (
        <div className="h-full flex flex-col gap-5 overflow-hidden">

            {/* ── Header ── */}
            <div
                className="rounded-2xl px-8 py-5 flex-shrink-0"
                style={{ background: "#1e2a3a" }}
            >
                <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-2 font-medium"
                    style={{
                        fontSize: 15,
                        background: "rgba(245,166,35,0.15)",
                        border: "1px solid rgba(245,166,35,0.25)",
                        color: "#f5a623",
                    }}
                >
                    <CreditCard size={15} />
                    Préstamos · Simulación de financiamiento
                </div>
                <h1 className="text-xl font-medium text-white">
                    Financiamiento: Camioneta de Reparto
                </h1>
                <p className="hidden lg:block text-sm mt-2 max-w-2xl" style={{ color: '#8fa3b8' }}>
                    Análisis de deuda para comprar una camioneta distribuidora para Urubo Bakery. Comparamos un crédito productivo bancario vs. un préstamo de socios.
                </p>
            </div>

            {/* ── Contenido principal ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">

                {/* Panel izquierdo — Inputs */}
                <div
                    className="rounded-2xl p-6 flex flex-col gap-5"
                    style={{ background: "#fff", border: "0.5px solid #e2e8f0" }}
                >
                    <p
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "#94a3b8",
                        }}
                    >
                        Condiciones del crédito
                    </p>

                    {/* Capital */}
                    <div className="flex flex-col gap-1.5">
                        <label style={{ fontSize: 16, color: "#64748b" }}>
                            Precio de la Camioneta (Bs.)
                        </label>
                        <div
                            className="flex items-center rounded-xl overflow-hidden"
                            style={{ border: "0.5px solid #e2e8f0" }}
                        >
                            <span
                                className="px-3 py-2"
                                style={{
                                    fontSize: 16,
                                    color: "#94a3b8",
                                    background: "#f8fafc",
                                    borderRight: "0.5px solid #e2e8f0",
                                }}
                            >
                                Bs.
                            </span>
                            <input
                                type="number"
                                value={capital}
                                onChange={(e) => setCapital(Number(e.target.value))}
                                className="flex-1 px-3 py-2 outline-none"
                                style={{ fontSize: 16, color: "#1e2a3a", background: "transparent" }}
                            />
                        </div>
                    </div>

                    {/* Plazo */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label style={{ fontSize: 16, color: "#64748b" }}>
                                Plazo del préstamo
                            </label>
                            <span style={{ fontSize: 17, fontWeight: 500, color: "#1e2a3a" }}>
                                {meses} meses
                            </span>
                        </div>
                        <input
                            type="range"
                            min={6}
                            max={60}
                            step={6}
                            value={meses}
                            onChange={(e) => setMeses(Number(e.target.value))}
                            className="w-full accent-yellow-500 cursor-pointer"
                        />
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "0.5px solid #e2e8f0" }} />

                    {/* Tasa simple */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label style={{ fontSize: 16, color: "#64748b" }}>
                                Oferta 1: Préstamo Socios (Simple %)
                            </label>
                            <span
                                className="rounded-full px-2.5 py-0.5 font-medium"
                                style={{ fontSize: 15, background: "#e6f1fb", color: "#185fa5" }}
                            >
                                {tasaSimple}% anual
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={30}
                            step={1}
                            value={tasaSimple}
                            onChange={(e) => setTasaSimple(Number(e.target.value))}
                            className="w-full cursor-pointer"
                            style={{ accentColor: "#185fa5" }}
                        />
                    </div>

                    {/* Tasa compuesta */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label style={{ fontSize: 16, color: "#64748b" }}>
                                Oferta 2: Crédito Bancario (Compuesto %)
                            </label>
                            <span
                                className="rounded-full px-2.5 py-0.5 font-medium"
                                style={{ fontSize: 15, background: "#eeedfe", color: "#534ab7" }}
                            >
                                {tasaCompuesta}% anual
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={30}
                            step={1}
                            value={tasaCompuesta}
                            onChange={(e) => setTasaCompuesta(Number(e.target.value))}
                            className="w-full cursor-pointer"
                            style={{ accentColor: "#534ab7" }}
                        />
                    </div>

                    {/* Criterio */}
                    <div
                        className="rounded-xl px-4 py-3 mt-auto flex-shrink-0"
                        style={{
                            background: esSimpleMejor ? "#eaf3de" : "#fcebeb",
                            border: `0.5px solid ${esSimpleMejor ? "#c6dea8" : "#f5c0c0"}`,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color: esSimpleMejor ? "#3b6d11" : "#a32d2d",
                            }}
                        >
                            {resultado.mensaje_criterio || "Calculando recomendación..."}
                        </p>
                        {ahorro !== 0 && (
                            <p
                                style={{
                                    fontSize: 14,
                                    marginTop: 4,
                                    color: esSimpleMejor ? "#3b6d11" : "#a32d2d",
                                }}
                            >
                                Diferencia: {formatBs(Math.abs(ahorro))}
                            </p>
                        )}
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="lg:col-span-2 flex flex-col gap-5 min-h-0">

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 gap-5 flex-shrink-0">
                        <div
                            className="rounded-2xl p-5"
                            style={{ background: "#fff", border: "0.5px solid #e2e8f0" }}
                        >
                            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>
                                Total a pagar — interés simple
                            </p>
                            <p style={{ fontSize: 28, fontWeight: 500, color: "#185fa5" }}>
                                {formatBs(resultado.pago_total_simple)}
                            </p>
                            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                                Tasa {tasaSimple}% anual · {meses} meses
                            </p>
                        </div>
                        <div
                            className="rounded-2xl p-5"
                            style={{ background: "#fff", border: "0.5px solid #e2e8f0" }}
                        >
                            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>
                                Total a pagar — interés compuesto
                            </p>
                            <p style={{ fontSize: 28, fontWeight: 500, color: "#534ab7" }}>
                                {formatBs(resultado.pago_total_compuesto)}
                            </p>
                            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                                Tasa {tasaCompuesta}% anual · {meses} meses
                            </p>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div
                        className="rounded-2xl p-6 flex flex-col flex-1 min-h-0"
                        style={{ background: "#fff", border: "0.5px solid #e2e8f0" }}
                    >
                        <p
                            style={{
                                fontSize: 16,
                                fontWeight: 500,
                                color: "#1e2a3a",
                                marginBottom: 16,
                                flexShrink: 0,
                            }}
                        >
                            Crecimiento de la deuda en el tiempo
                        </p>
                        <div className="w-full h-[300px] md:h-[400px] min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={datosGrafico}
                                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f2f5"
                                    />
                                    <XAxis
                                        dataKey="mes"
                                        minTickGap={24}
                                        tick={{ fontSize: 13, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={(v) => `Bs.${Math.round(v / 1000)}k`}
                                        tick={{ fontSize: 13, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={["dataMin", "dataMax"]}
                                    />
                                    <Tooltip
                                        formatter={(value: any, name: any) => [formatBs(Number(value)), name]}
                                        labelFormatter={(label: any) => `Mes ${label.replace("M", "")}`}
                                        contentStyle={{
                                            borderRadius: 10,
                                            border: "0.5px solid #e2e8f0",
                                            fontSize: 14,
                                            color: "#1e2a3a",
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={10}
                                        wrapperStyle={{ fontSize: 14, color: "#64748b" }}
                                    />
                                    <ReferenceLine
                                        y={capital}
                                        stroke="#e2e8f0"
                                        strokeDasharray="4 4"
                                        label={{
                                            value: "Capital inicial",
                                            fontSize: 12,
                                            fill: "#94a3b8",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Simple"
                                        name="Interés simple"
                                        stroke="#185fa5"
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Compuesto"
                                        name="Interés compuesto"
                                        stroke="#534ab7"
                                        strokeWidth={2.5}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}