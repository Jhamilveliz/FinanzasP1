// src/components/Sidebar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Timer, LineChart, PieChart, Landmark } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Resumen', icon: Home },
        { href: '/supervivencia', label: '1. Supervivencia', icon: Timer },
        { href: '/inversiones', label: '2. Inversiones (VAN)', icon: LineChart },
        { href: '/capital', label: '3. Dilución', icon: PieChart },
        { href: '/prestamos', label: '4. Préstamos', icon: Landmark },
    ];
    return (
        <div
            className="w-16 md:w-60 lg:w-72 h-screen fixed left-0 top-0 flex flex-col py-8 transition-all duration-300"
            style={{ background: '#1e2a3a' }}
        >
            {/* Logo */}
            <div
                className="flex items-center justify-center md:justify-start gap-3 px-4 md:px-7 pb-7 mb-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
                <span className="text-3xl flex-shrink-0">🍞</span>
                <h1 className="hidden md:block text-base font-medium leading-tight" style={{ color: '#f5a623' }}>
                    Urubo <br /> bakery
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1.5 px-2 md:px-4 flex-1">
                {menuItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center justify-center md:justify-start gap-4 px-3 md:px-5 py-3.5 rounded-xl text-base transition-all hover:bg-white/5"
                            style={{
                                background: isActive ? '#fff' : 'transparent',
                                color: isActive ? '#1e2a3a' : '#8fa3b8',
                                fontWeight: isActive ? 500 : 400,
                            }}
                            title={label}
                        >
                            <Icon size={22} className="flex-shrink-0" />
                            <span className="hidden md:block">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}