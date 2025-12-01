import type { Metadata } from 'next';
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
  title: 'ChoristerCorner - Worship Songs & Hymns Platform',
  description:
    'A comprehensive platform for choristers and worship leaders to discover, learn, and share beautiful worship songs.',
  keywords: ['worship songs', 'hymns', 'choir', 'worship leader', 'music', 'praise'],
  authors: [{ name: 'ChoristerCorner Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://choristercorner.com',
    siteName: 'ChoristerCorner',
    title: 'ChoristerCorner - Worship Songs & Hymns Platform',
    description: 'A comprehensive platform for choristers and worship leaders to discover, learn, and share beautiful worship songs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoristerCorner - Worship Songs & Hymns Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChoristerCorner - Worship Songs & Hymns Platform',
    description: 'A comprehensive platform for choristers and worship leaders to discover, learn, and share beautiful worship songs.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
