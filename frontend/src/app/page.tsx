// src/app/page.tsx
import { Store, Users, ShoppingCart, Info, TrendingUp, ShieldAlert, Coins, Landmark, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 overflow-hidden">

      {/* Header - Responsive */}
      <div
        className="rounded-lg md:rounded-2xl px-4 md:px-6 lg:px-8 py-4 md:py-6 relative overflow-hidden flex-shrink-0"
        style={{ background: '#1e2a3a' }}
      >
        <div className="absolute -right-6 -top-6 opacity-[0.06]">
          <Store size={100} className="md:size-[180px]" color="#fff" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-0">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 md:px-4 py-1 md:py-1.5 mb-2 md:mb-3 text-xs md:text-sm font-medium"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.25)', color: '#f5a623' }}
            >
              <Store size={12} className="md:size-[14px]" /> Urubo Bakery · Dashboard
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-medium text-white">
              Análisis de sensibilidad y decisiones financieras
            </h1>
          </div>
          <p className="hidden lg:block text-sm leading-relaxed max-w-sm text-right" style={{ color: '#8fa3b8' }}>
            Panadería artesanal cruceña — evaluando liquidez,
            inversiones y opciones de financiamiento.
          </p>
        </div>
      </div>

      {/* Main grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">

        {/* Contexto - Full width on mobile, 1/3 on large */}
        <div
          className="rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-7 flex flex-col gap-4 md:gap-6 lg:col-span-1"
          style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}
        >
          <h2
            className="text-sm md:text-base font-medium flex items-center gap-2 pb-3 md:pb-4 flex-shrink-0"
            style={{ color: '#1e2a3a', borderBottom: '0.5px solid #e2e8f0' }}
          >
            <Info size={16} className="md:size-[18px]" style={{ color: '#378add' }} /> Contexto operativo
          </h2>

          {[
            { Icon: Users, label: 'Origen', text: 'Capital familiar. Inició la dueña junto a su tía.' },
            { Icon: ShoppingCart, label: 'Insumos', text: 'Compras al contado, una vez a la semana en el Abasto.' },
            { Icon: Store, label: 'Productos', text: 'Pan "Top", Chamas y Empanadas. 12 panes × 10 Bs.' },
            { Icon: Coins, label: 'Laboral', text: '1 empleada fija · Bs. 2,300/mes + almuerzo.' },
          ].map(({ Icon, label, text }) => (
            <div key={label} className="flex gap-3 md:gap-4 items-start flex-1">
              <div
                className="w-10 md:w-11 h-10 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#faeeda' }}
              >
                <Icon size={18} className="md:size-[20px]" style={{ color: '#ba7517' }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-medium mb-1" style={{ color: '#1e2a3a' }}>{label}</p>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#64748b' }}>{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Módulos - 2/3 on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-3 md:gap-4 min-h-0">
          <h2 className="text-sm md:text-base font-medium flex-shrink-0" style={{ color: '#1e2a3a' }}>
            Módulos de análisis financiero
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 flex-1 min-h-0">
            {[
              {
                href: '/supervivencia', Icon: ShieldAlert,
                iconBg: '#faeeda', iconColor: '#ba7517',
                title: '1. Supervivencia (Runway)',
                desc: 'Capacidad para cubrir costos fijos ante caídas en ventas diarias.',
                tag: 'Liquidez',
              },
              {
                href: '/inversiones', Icon: TrendingUp,
                iconBg: '#e6f1fb', iconColor: '#185fa5',
                title: '2. Inversiones (VAN y TIR)',
                desc: 'Evalúa compra de hornos industriales y flujos de caja descontados.',
                tag: 'Proyección',
              },
              {
                href: '/capital', Icon: PieChart,
                iconBg: '#eeedfe', iconColor: '#534ab7',
                title: '3. Dilución (Cap Table)',
                desc: 'Notas convertibles y porcentaje a ceder sin bajar del 65% de control.',
                tag: 'Capital',
              },
              {
                href: '/prestamos', Icon: Landmark,
                iconBg: '#eaf3de', iconColor: '#3b6d11',
                title: '4. Simulador de préstamos',
                desc: 'Interés simple vs. compuesto para financiar clases de panadería.',
                tag: 'Deuda',
              },
            ].map(({ href, Icon, iconBg, iconColor, title, desc, tag }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg md:rounded-2xl p-4 md:p-6 lg:p-7 flex flex-col gap-3 md:gap-4 border border-slate-200 hover:border-yellow-400 transition-colors"
                style={{ background: '#fff' }}
              >
                {/* Ícono + tag */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 md:w-12 lg:w-14 h-11 md:h-12 lg:h-14 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg }}
                  >
                    <Icon size={20} className="md:size-[22px] lg:size-[26px]" style={{ color: iconColor }} />
                  </div>
                  <span
                    className="text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium"
                    style={{ background: iconBg, color: iconColor }}
                  >
                    {tag}
                  </span>
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-1.5 md:gap-2 flex-1">
                  <h3 className="text-sm md:text-base lg:text-lg font-medium leading-snug" style={{ color: '#1e2a3a' }}>{title}</h3>
                  <p className="text-xs md:text-sm md:leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
                </div>

                {/* Footer */}
                <div
                  className="text-xs md:text-sm font-medium flex items-center gap-1.5 pt-2"
                  style={{ color: '#f5a623', borderTop: '0.5px solid #e2e8f0' }}
                >
                  Ver módulo
                  <svg width="12" height="12" className="md:w-[14px] md:h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}