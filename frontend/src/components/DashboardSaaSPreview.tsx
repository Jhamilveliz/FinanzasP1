"use client";

import React, { useState } from 'react';
import { 
  Croissant, 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Datos de prueba para el gráfico (Recharts)
const chartData = [
  { mes: 'Ene', ingresos: 12000, gastos: 8000 },
  { mes: 'Feb', ingresos: 15000, gastos: 8500 },
  { mes: 'Mar', ingresos: 14000, gastos: 9000 },
  { mes: 'Abr', ingresos: 18000, gastos: 8200 },
  { mes: 'May', ingresos: 22000, gastos: 8800 },
  { mes: 'Jun', ingresos: 26000, gastos: 9200 },
  { mes: 'Jul', ingresos: 32000, gastos: 10500 },
];

export default function DashboardSaaSPreview() {
  const [sliderValue, setSliderValue] = useState(15);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* 
        ========================================================
        SIDEBAR (Menú Lateral Izquierdo)
        [Color cool oscuro]: bg-slate-900 (#0f172a)
        [Texto claro]: text-slate-300 para contraste moderado, text-white para activo
        ========================================================
      */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col h-full shrink-0 shadow-xl z-20">
        {/* Header de Sidebar (Logo) */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80 mb-6 shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Croissant className="text-indigo-400" size={24} />
            </div>
            <span className="font-bold text-lg tracking-wide">Panadería Finanzas</span>
          </div>
        </div>

        {/* Rutas de Menú Requeridas */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard (Activo) 
              [Resalte activo cool]: bg-indigo-600 (#4f46e5) */}
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <GraduationCap size={20} />
            <span>Students</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <Users size={20} />
            <span>Teachers</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <ClipboardCheck size={20} />
            <span>Attendance</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <BookOpen size={20} />
            <span>Courses</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <FileText size={20} />
            <span>Exam</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <CreditCard size={20} />
            <span>Payment</span>
          </a>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 shrink-0">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 
        ========================================================
        ÁREA PRINCIPAL DE CONTENIDO
        [Fondo muy claro]: bg-slate-50 (#f8fafc)
        ========================================================
      */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
        
        {/* HEADER TOP BAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Análisis de Supervivencia</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Métricas financieras y proyección de negocio</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Buscador Central */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar métricas..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 lg:w-80 transition-all placeholder:text-slate-400"
              />
            </div>
            
            {/* Notificaciones */}
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
              <Bell size={22} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            {/* Perfil Usuario */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                 AP
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-none mb-1">Admin Panadería</p>
                <p className="text-xs text-slate-500 leading-none">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO INTERNO CON SCROLL (padding p-8) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          
          {/* TARJETAS KPI (Cuadrícula superior) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tarjeta 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Ingresos Brutos</p>
                  <h3 className="text-3xl font-bold text-slate-800">$32,000</h3>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp size={14} className="mr-1" /> +14.5%
                </span>
                <span className="text-slate-400 font-medium">vs último mes</span>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Pérdida Mensual (Burn)</p>
                  <h3 className="text-3xl font-bold text-slate-800">$10,500</h3>
                </div>
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <TrendingDown size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="flex items-center text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                  <TrendingUp size={14} className="mr-1" /> +2.1%
                </span>
                <span className="text-slate-400 font-medium">vs último mes</span>
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Runway (Meses de Vida)</p>
                  <h3 className="text-3xl font-bold text-slate-800">14 <span className="text-lg text-slate-400 font-medium">meses</span></h3>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp size={14} className="mr-1" /> +1 mes
                </span>
                <span className="text-slate-400 font-medium">mejora proyectada</span>
              </div>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Margen Neto</p>
                  <h3 className="text-3xl font-bold text-slate-800">42%</h3>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Activity size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp size={14} className="mr-1" /> +4.0%
                </span>
                <span className="text-slate-400 font-medium">vs último mes</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN PRINCIPAL: 2 Columnas (1/3 Formulario, 2/3 Gráfico) */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* COLUMNA IZQUIERDA (1/3) - Entradas / Formulario 
                [Color de acento vibrante]: indigo-500 en inputs, rings y buttons */}
            <div className="w-full lg:w-1/3 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800">Parámetros de Simulación</h2>
                <p className="text-sm text-slate-500">Ajusta las variables de la panadería</p>
              </div>

              <form className="space-y-6 flex-1">
                {/* Input estilizado */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Capital Inicial ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      defaultValue={150000}
                      className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Slider con color de acento vibrante */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Tasa de Crecimiento
                    </label>
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      {sliderValue}%
                    </span>
                  </div>
                  {/* accent-indigo-500 estiliza el thumb en navegadores modernos */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
                  />
                </div>

                {/* Input de Gasto Fijo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gastos Fijos Mensuales ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      defaultValue={8000}
                      className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Botón de acción vibrante */}
                <button type="button" className="mt-8 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                  Actualizar Proyección <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* COLUMNA DERECHA (2/3) - Gráfico de Recharts */}
            <div className="w-full lg:w-2/3 bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full min-h-[400px]">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Proyección de Ingresos vs Gastos</h2>
                  <p className="text-sm text-slate-500">Histórico y proyección a 6 meses</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center text-xs font-medium text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span> Ingresos
                  </span>
                  <span className="flex items-center text-xs font-medium text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span> Gastos
                  </span>
                </div>
              </div>
              
              {/* Contenedor de Previsualización Recharts */}
              <div className="flex-1 w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={60} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="ingresos" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                    <Area type="monotone" dataKey="gastos" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorGastos)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
