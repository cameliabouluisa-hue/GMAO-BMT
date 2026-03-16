'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/familles', label: 'Familles', icon: '≣' },
  { href: '/modeles', label: 'Modèles', icon: '◇' },
  { href: '/materiels', label: 'Équipements', icon: '▣' },
  { href: '/maintenance', label: 'Maintenance', icon: '⚙' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-[270px] flex-col border-r lg:flex"
      style={{
        background: 'linear-gradient(180deg, #163E56 0%, #1F5678 100%)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="border-b px-6 py-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#81C3D7]">
          BMT
        </p>
        <h1 className="mt-3 text-[18px] font-semibold text-white">GMAO Portuaire</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#D9DCD6]">
          Gestion des équipements et maintenance
        </p>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="space-y-1.5">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] transition"
                style={{
                  backgroundColor: active ? 'rgba(129,195,215,0.18)' : 'transparent',
                  color: '#FFFFFF',
                  border: active
                    ? '1px solid rgba(129,195,215,0.28)'
                    : '1px solid transparent',
                }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[12px]"
                  style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                    color: '#D9DCD6',
                  }}
                >
                  {link.icon}
                </span>

                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4">
        <div
          className="rounded-[22px] p-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#81C3D7]">
            Version
          </p>
          <p className="mt-2 text-[14px] font-semibold text-white">Initiale</p>
        </div>
      </div>
    </aside>
  );
}