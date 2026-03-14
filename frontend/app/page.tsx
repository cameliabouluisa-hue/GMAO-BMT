import Link from 'next/link';

export default function DashboardPage() {
  const cards = [
    {
      title: 'Familles',
      value: 'Arborescence',
      description: 'Gestion des familles et sous-familles d’équipements',
      href: '/familles',
    },
    {
      title: 'Modèles',
      value: 'Catalogue',
      description: 'Gestion des modèles associés aux familles',
      href: '/modeles',
    },
    {
      title: 'Équipements',
      value: 'Parc matériel',
      description: 'Suivi du matériel du port BMT',
      href: '/materiels',
    },
    {
      title: 'Maintenance',
      value: 'Interventions',
      description: 'Préventif et correctif',
      href: '/maintenance',
    },
  ];

  return (
    <div
      className="min-h-full p-6"
      style={{
        background: 'linear-gradient(180deg, #EEF5F8 0%, #D9DCD6 100%)',
      }}
    >
      <section
        className="mb-6 rounded-[32px] border p-8 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #16425B 0%, #2F6690 55%, #3A7CA5 100%)',
          borderColor: '#2F6690',
        }}
      >
        <p
          className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ color: '#81C3D7' }}
        >
          Tableau de bord
        </p>

        <h1 className="text-4xl font-bold text-white">Bienvenue dans la GMAO BMT</h1>

        <p className="mt-3 max-w-3xl text-base" style={{ color: '#D9DCD6' }}>
          Interface initiale du système de gestion de maintenance assistée par ordinateur
          pour le port BMT.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-[28px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#D9DCD6',
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
              {card.title}
            </p>

            <h2 className="mt-2 text-2xl font-bold" style={{ color: '#16425B' }}>
              {card.value}
            </h2>

            <p className="mt-3 text-sm leading-6" style={{ color: '#2F6690' }}>
              {card.description}
            </p>

            <div
              className="mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: '#DCEFF6',
                color: '#16425B',
              }}
            >
              Ouvrir
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-3">
        <div
          className="rounded-[28px] border p-6 shadow-sm xl:col-span-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#D9DCD6',
          }}
        >
          <h3 className="text-xl font-bold" style={{ color: '#16425B' }}>
            Vue générale
          </h3>
          <p className="mt-2 text-sm" style={{ color: '#3A7CA5' }}>
            Cette version initiale sert à structurer l’application avant l’ajout
            des fonctionnalités avancées.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#F4F8FA' }}
            >
              <p className="text-xs uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
                Module actif
              </p>
              <p className="mt-2 text-lg font-bold" style={{ color: '#16425B' }}>
                Équipement
              </p>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#F4F8FA' }}
            >
              <p className="text-xs uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
                Backend
              </p>
              <p className="mt-2 text-lg font-bold" style={{ color: '#16425B' }}>
                NestJS + Prisma
              </p>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#F4F8FA' }}
            >
              <p className="text-xs uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
                Frontend
              </p>
              <p className="mt-2 text-lg font-bold" style={{ color: '#16425B' }}>
                Next.js
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-[28px] border p-6 shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#D9DCD6',
          }}
        >
          <h3 className="text-xl font-bold" style={{ color: '#16425B' }}>
            Accès rapide
          </h3>

          <div className="mt-4 space-y-3">
            <Link
              href="/familles"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold transition"
              style={{
                backgroundColor: '#DCEFF6',
                color: '#16425B',
              }}
            >
              Voir les familles
            </Link>

            <Link
              href="/modeles"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold transition"
              style={{
                backgroundColor: '#EAF5F9',
                color: '#16425B',
              }}
            >
              Voir les modèles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}