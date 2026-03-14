'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/familles', label: 'Familles' },
  { href: '/modeles', label: 'Modèles' },
  { href: '/materiels', label: 'Équipements' },
  { href: '/maintenance', label: 'Maintenance' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-72 flex-col border-r lg:flex"
      style={{
        background: 'linear-gradient(180deg, #16425B 0%, #2F6690 100%)',
        borderColor: '#2F6690',
      }}
    >
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#81C3D7]">
          BMT
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">GMAO Portuaire</h1>
        <p className="mt-2 text-sm text-[#D9DCD6]">
          Gestion des équipements et maintenance
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-2xl px-4 py-3 text-sm font-medium transition"
              style={{
                backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: '#FFFFFF',
                border: active ? '1px solid rgba(129,195,215,0.45)' : '1px solid transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <div className="rounded-3xl bg-white/10 p-4">
          <p className="text-xs uppercase tracking-wide text-[#81C3D7]">
            Version
          </p>
          <p className="mt-1 text-sm font-semibold text-white">Initiale</p>
        </div>
      </div>
    </aside>
  );
}