"use client";
import { useState, useRef, useEffect } from 'react';
import { X, Send, LayoutDashboard, TrendingDown, Bot, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Asistente() {
    const [isOpen, setIsOpen] = useState(false);
    const [mensajeInput, setMensajeInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const [history, setHistory] = useState<any[]>([
        {
            role: "assistant",
            message: "¡Hola! Soy Bradley, tu Asistente Financiero de Urubo Bakery 🍞. He detectado que estás evaluando el proyecto. Pregúntame sobre la Situación 1, Situación 2, Dilución o Préstamos.",
            icon: <LayoutDashboard className="text-yellow-600" size={20} />
        }
    ]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const enviarMensaje = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mensajeInput.trim()) return;

        const textoUsuario = mensajeInput;
        setHistory(prev => [...prev, { role: "user", message: textoUsuario }]);
        setMensajeInput("");

        try {
            const respuesta = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensaje: textoUsuario,
                    historial: history
                        .filter(m => !m.loading)
                        .map(m => ({ role: m.role, content: m.message }))
                })
            });

            if (!respuesta.ok) throw new Error("Error en el servidor");

            const data = await respuesta.json();

            setHistory(prev => [...prev, {
                role: "assistant",
                message: data.respuesta,
                icon: <Sparkles className="text-yellow-500" size={20} />
            }]);

        } catch (error) {
            setHistory(prev => [...prev, {
                role: "assistant",
                message: "⚠️ Error de conexión. Asegúrate de que la terminal de Python (uvicorn) esté encendida.",
                icon: <TrendingDown className="text-red-600" size={20} />
            }]);
        }
    };

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
            {/* BOTÓN FLOTANTE - Responsivo */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-lg sm:rounded-xl shadow-2xl flex items-center justify-center transition-all transform hover:-translate-y-1 border border-slate-200 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'}`}
            >
                <Image
                    src="/pan.jpg"
                    alt="Logotipo de Panadería Asistente"
                    width={64}
                    height={64}
                    className="rounded-lg sm:rounded-xl w-16 h-16 sm:w-20 sm:h-20"
                />
            </button>

            {/* VENTANA DE CHAT - Completamente responsiva */}
            <div
                className={`fixed inset-0 sm:inset-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out sm:w-[380px] sm:h-[700px] sm:bottom-6 sm:right-6
                ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
                style={{
                    maxHeight: 'calc(100vh - 2rem)',
                    height: '100vh',
                    width: '100vw',
                }}
            >
                {/* Header */}
                <div className="bg-slate-900 text-white p-3 sm:p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/pan.jpg"
                                alt="Logo Panadería"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm line-clamp-1">Bradley - CFO Urubo Bakery</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                                <span className="hidden sm:inline">En línea</span>
                                <span className="sm:hidden">Online</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Mensajes) */}
                <div className="p-3 sm:p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 sm:gap-4 flex-1">
                    {history.map((item, index) => (
                        <div key={index} className={`flex items-start gap-2 sm:gap-3 ${item.role === 'user' ? 'justify-end' : ''}`}>
                            {item.role === 'assistant' && item.icon && (
                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg shrink-0 mt-1 hidden sm:flex">
                                    {item.icon}
                                </div>
                            )}
                            <div className={`rounded-2xl text-xs sm:text-sm p-2.5 sm:p-3 max-w-xs sm:max-w-sm shadow-sm ${item.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm whitespace-pre-wrap' : 'bg-indigo-600 text-white rounded-tr-sm break-words'}`}>
                                {item.message}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Data Analysis Section - Responsive */}
                <div className="p-3 sm:p-4 border-t border-slate-100 bg-white shrink-0">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-2 sm:mb-3">Análisis en Tiempo Real</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs text-slate-600 flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex justify-between">
                            <span>Inversión Inicial:</span>
                            <span className="font-semibold text-red-500 border-b border-red-500 border-dashed cursor-help" title="¡Debería ser negativo!">Bs. 80,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tasa de Descuento:</span>
                            <span className="font-semibold text-slate-800">18%</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-1.5 sm:pt-2">
                            <span>VAN calculado:</span>
                            <span className="font-semibold text-slate-400">Bs. 0,00</span>
                        </div>
                    </div>
                </div>

                {/* Footer (Input) */}
                <form onSubmit={enviarMensaje} className="p-2 sm:p-3 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0">
                    <input
                        type="text"
                        value={mensajeInput}
                        onChange={(e) => setMensajeInput(e.target.value)}
                        placeholder="Escribe aquí..."
                        className="w-full border border-slate-200 text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!mensajeInput.trim()}
                        className="p-2 sm:p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg sm:rounded-xl transition flex items-center justify-center flex-shrink-0"
                    >
                        <Send size={16} className="sm:size-[18px]" />
                    </button>
                </form>
            </div>
        </div>
    );
}