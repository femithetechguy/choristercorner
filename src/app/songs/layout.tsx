import { Metadata } from 'next';
import songs from '@/data/songs.json';
import { Song } from '@/types';

export const metadata: Metadata = {
  title: 'Worship Songs - ChoristerCorner | Browse & Learn',
  description:
    'Explore our extensive collection of worship songs, contemporary praise music, and Christian hymns. Find lyrics, videos, and learn songs for your choir or worship team.',
  keywords: [
    'worship songs',
    'praise songs',
    'contemporary Christian music',
    'choir songs',
    'song lyrics',
    'worship music library',
  ],
  openGraph: {
    title: 'Worship Songs - ChoristerCorner',
    description: 'Browse and learn from our collection of worship songs and contemporary Christian music.',
    type: 'website',
    url: 'https://choristercorner.com/songs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoristerCorner Songs',
      },
    ],
  },
};

export default function SongsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Worship Songs Collection',
            description: 'A collection of worship songs, praise music, and Christian hymns',
            url: 'https://choristercorner.com/songs',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: (songs as Song[]).slice(0, 50).map((song, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: song.title,
                url: `https://choristercorner.com/lyrics/${song.title.toLowerCase().replace(/\s+/g, '-')}`,
              })),
            },
          }),
        }}
      />
      {children}
    </>
  );
}
