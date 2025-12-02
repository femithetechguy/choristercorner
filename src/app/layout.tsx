import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LayoutClient from '@/components/LayoutClient';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://choristercorner.com'),
  title: 'ChoristerCorner - Worship Songs & Hymns Platform',
  description:
    'Discover and learn worship songs, hymns, and contemporary Christian music. Perfect for choristers, worship leaders, and choir members. Browse lyrics, find performance videos, and explore our collection.',
  keywords: [
    'worship songs',
    'hymns',
    'choir music',
    'worship leader',
    'Christian music',
    'praise and worship',
    'song lyrics',
    'choir songs',
    'contemporary worship',
    'sacred music',
  ],
  authors: [{ name: 'ChoristerCorner Team' }],
  creator: 'ChoristerCorner',
  publisher: 'ChoristerCorner',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://choristercorner.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://choristercorner.com',
    siteName: 'ChoristerCorner',
    title: 'ChoristerCorner - Worship Songs & Hymns Platform',
    description:
      'Discover and learn worship songs, hymns, and contemporary Christian music. Perfect for choristers, worship leaders, and choir members.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoristerCorner - Worship Songs & Hymns Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChoristerCorner - Worship Songs & Hymns Platform',
    description:
      'Discover and learn worship songs, hymns, and contemporary Christian music. Perfect for choristers and worship leaders.',
    images: ['/og-image.png'],
    creator: '@choristercorner',
  },
  category: 'Music',
  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ChoristerCorner',
              description:
                'Discover and learn worship songs, hymns, and contemporary Christian music. Perfect for choristers, worship leaders, and choir members.',
              url: 'https://choristercorner.com',
              image: 'https://choristercorner.com/og-image.png',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://choristercorner.com/songs?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ChoristerCorner',
              url: 'https://choristercorner.com',
              logo: 'https://choristercorner.com/og-image.png',
              description: 'A platform for choristers and worship leaders to discover and learn Christian hymns and worship songs.',
              sameAs: ['https://twitter.com/choristercorner'],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        suppressHydrationWarning
      >
        <LayoutClient>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LayoutClient>
      </body>
    </html>
  );
}
