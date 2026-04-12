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
        <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12 right-4 sm:right-6 md:right-8 lg:right-10 xl:right-12 z-50">
            {/* BOTÓN FLOTANTE - Responsivo */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center transition-all transform hover:-translate-y-1 border border-slate-200 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'}`}
            >
                <Image
                    src="/pan.jpg"
                    alt="Logotipo de Panadería Asistente"
                    width={80}
                    height={80}
                    className="rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                />
            </button>

            {/* VENTANA DE CHAT - Completamente responsiva */}
            <div
                className={`fixed inset-0 sm:inset-auto bg-white rounded-t-3xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl shadow-2xl border-t sm:border border-slate-200 flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out sm:w-[380px] md:w-[420px] lg:w-[480px] xl:w-[520px] sm:h-[700px] md:h-[750px] lg:h-[800px] xl:h-[850px] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-12 xl:right-12
                ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
                style={{
                    maxHeight: 'calc(100vh - 2rem)',
                    height: '100vh',
                    width: '100vw',
                }}
            >
                {/* Header */}
                <div className="bg-slate-900 text-white p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 flex justify-between items-center shrink-0">
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
                            <h3 className="font-bold text-sm md:text-base lg:text-lg xl:text-lg line-clamp-1">Bradley - CFO Urubo Bakery</h3>
                            <p className="text-xs md:text-sm lg:text-sm xl:text-sm text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                                <span className="hidden sm:inline">En línea</span>
                                <span className="sm:hidden">Online</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
                        <X size={20} className="md:size-[22px] lg:size-[24px] xl:size-[24px]" />
                    </button>
                </div>

                {/* Body (Mensajes) */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 overflow-y-auto bg-slate-50 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 flex-1">
                    {history.map((item, index) => (
                        <div key={index} className={`flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-4 ${item.role === 'user' ? 'justify-end' : ''}`}>
                            {item.role === 'assistant' && item.icon && (
                                <div className="p-2 md:p-2.5 lg:p-3 xl:p-3 bg-yellow-50 border border-yellow-200 rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl shrink-0 mt-1 hidden sm:flex">
                                    {item.icon}
                                </div>
                            )}
                            <div className={`rounded-2xl text-xs sm:text-sm md:text-base lg:text-base xl:text-base p-2.5 sm:p-3 md:p-3.5 lg:p-4 xl:p-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow-sm ${item.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm whitespace-pre-wrap' : 'bg-indigo-600 text-white rounded-tr-sm break-words'}`}>
                                {item.message}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Data Analysis Section - Responsive */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 border-t border-slate-100 bg-white shrink-0">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm md:text-base lg:text-base xl:text-base mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-4">Análisis en Tiempo Real</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg xl:rounded-lg p-2 sm:p-3 md:p-3.5 lg:p-4 xl:p-4 text-xs md:text-sm lg:text-sm xl:text-sm text-slate-600 flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3">
                        <div className="flex justify-between">
                            <span>Inversión Inicial:</span>
                            <span className="font-semibold text-red-500 border-b border-red-500 border-dashed cursor-help" title="¡Debería ser negativo!">Bs. 80,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tasa de Descuento:</span>
                            <span className="font-semibold text-slate-800">18%</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-1.5 sm:pt-2 md:pt-2.5 lg:pt-3 xl:pt-3">
                            <span>VAN calculado:</span>
                            <span className="font-semibold text-slate-400">Bs. 0,00</span>
                        </div>
                    </div>
                </div>

                {/* Footer (Input) */}
                <form onSubmit={enviarMensaje} className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-5 bg-white border-t border-slate-100 flex gap-2 md:gap-3 lg:gap-3 xl:gap-3 items-center shrink-0">
                    <input
                        type="text"
                        value={mensajeInput}
                        onChange={(e) => setMensajeInput(e.target.value)}
                        placeholder="Escribe aquí..."
                        className="w-full border border-slate-200 text-xs sm:text-sm md:text-base lg:text-base xl:text-base rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl px-3 sm:px-4 md:px-5 lg:px-5 xl:px-5 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-3 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!mensajeInput.trim()}
                        className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl transition flex items-center justify-center flex-shrink-0"
                    >
                        <Send size={16} className="sm:size-[18px] md:size-[20px] lg:size-[20px] xl:size-[20px]" />
                    </button>
                </form>
            </div>
        </div>
    );
}