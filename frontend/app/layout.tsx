import './globals.css';
import Link from 'next/link';
import Sidebar from '../components/sidebar';

export const metadata = {
  title: 'GMAO BMT',
  description: 'Application de gestion de maintenance assistée par ordinateur',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-h-screen flex-1 flex-col">
            <header
              className="sticky top-0 z-20 border-b px-6 py-4 shadow-sm"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#D9DCD6',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#16425B' }}>
                    GMAO BMT
                  </h2>
                  <p className="text-sm" style={{ color: '#3A7CA5' }}>
                    Port · Maintenance · Équipements
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor: '#DCEFF6',
                      color: '#16425B',
                    }}
                  >
                    Admin
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}