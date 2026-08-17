import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novedades — Bloom',
  description:
    'Todo lo que crece en Bloom. Un jardín digital que mejora despacio.',
  openGraph: {
    title: 'Novedades — Bloom · Tu jardín digital',
    description: 'Todo lo que crece en Bloom.',
    type: 'website',
  },
};

export default function NovedadesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
