// src/app/layout.tsx
"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Asistente from "@/components/Asistente";
import { Menu, X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="es">
      <head>
        <title>Dashboard Financiero</title>
        <meta name="description" content="Proyecto Final de Finanzas - Python y Next.js" />
      </head>
      <body className={`${inter.className} flex h-screen overflow-hidden`} style={{ background: '#f0f2f5' }}>
        
        {/* SIDEBAR - Desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <main className="flex-1 ml-0 md:ml-60 lg:ml-72 h-screen flex flex-col transition-all duration-300">
          
          {/* HEADER CON HAMBURGUESA - Móvil */}
          <div className="md:hidden h-16 bg-white flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X size={24} className="text-slate-800" />
              ) : (
                <Menu size={24} className="text-slate-800" />
              )}
            </button>
            <h1 className="text-sm font-bold text-slate-800">Urubo Bakery</h1>
            <div className="w-10 h-10" /> {/* Espacio para balance */}
          </div>

          {/* DRAWER MÓVIL - Sidebar que sale desde la izquierda en móvil */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <div
                className="w-64 h-screen bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            </div>
          )}

          {/* CONTENIDO PRINCIPAL CON SCROLL */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* ASISTENTE FLOTANTE */}
        <Asistente />
      </body>
    </html>
  );
}