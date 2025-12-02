import { Metadata } from 'next';
import hymns from '@/data/hymns.json';
import { Hymn } from '@/types';

export const metadata: Metadata = {
  title: 'Hymns - ChoristerCorner | Classic & Contemporary',
  description:
    'Discover a rich collection of Christian hymns and sacred music. Browse classical hymns, contemporary spiritual songs, and learn from our hymn library.',
  keywords: [
    'hymns',
    'Christian hymns',
    'sacred music',
    'hymnal',
    'spiritual songs',
    'choir hymns',
    'hymn lyrics',
  ],
  openGraph: {
    title: 'Hymns - ChoristerCorner',
    description: 'Explore our collection of Christian hymns and sacred music.',
    type: 'website',
    url: 'https://choristercorner.com/hymns',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoristerCorner Hymns',
      },
    ],
  },
};

export default function HymnsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Christian Hymns Collection',
            description: 'A collection of classic and contemporary Christian hymns and sacred music',
            url: 'https://choristercorner.com/hymns',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: (hymns as Hymn[]).slice(0, 50).map((hymn, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: hymn.title,
                url: `https://choristercorner.com/lyrics/hymn-${hymn.serial_number}`,
              })),
            },
          }),
        }}
      />
      {children}
    </>
  );
}
