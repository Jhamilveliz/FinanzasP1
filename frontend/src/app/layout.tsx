// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Asistente from "@/components/Asistente"; // 1. Importamos el nuevo componente

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Financiero",
  description: "Proyecto Final de Finanzas - Python y Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex h-screen overflow-hidden`} style={{ background: '#f0f2f5' }}>
        <Sidebar />

        <main className="flex-1 ml-16 md:ml-60 lg:ml-72 h-screen p-6 lg:p-8 overflow-hidden transition-all duration-300">
          {children}
        </main>

        {/* 2. El asistente va aquí, libre y flotando sobre toda la app */}
        <Asistente />
      </body>
    </html>
  );
}