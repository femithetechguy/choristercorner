import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ChoristerCorner | Our Mission & Vision',
  description:
    'Learn about ChoristerCorner - a platform dedicated to helping choristers, worship leaders, and musicians discover and share Christian hymns and worship songs.',
  keywords: ['about us', 'ChoristerCorner', 'choir resources', 'worship leader platform'],
  openGraph: {
    title: 'About ChoristerCorner',
    description: 'Learn about our mission to support worship leaders and choristers worldwide.',
    type: 'website',
    url: 'https://choristercorner.com/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About ChoristerCorner',
      },
    ],
  },
  alternates: {
    canonical: 'https://choristercorner.com/about',
  },
};
