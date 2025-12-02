'use client';

import { Metadata } from 'next';
import { Music } from 'lucide-react';
import appConfig from '@/data/app.json';

export const generateMetadata = (): Metadata => ({
  title: 'Drummer - ChoristerCorner | Practice with Drum Patterns',
  description:
    'Use our embedded drummer tool to practice rhythm patterns and improve your timing. Perfect for choristers and musicians looking to develop better rhythmic sense.',
  keywords: ['drummer', 'drum practice', 'rhythm practice', 'music practice tools'],
  openGraph: {
    title: 'Drummer - ChoristerCorner',
    description: 'Practice with drum patterns and improve your rhythm.',
    type: 'website',
    url: 'https://choristercorner.com/drummer',
  },
  alternates: {
    canonical: 'https://choristercorner.com/drummer',
  },
});

export default function DrummerPage() {
  const config = appConfig as any;

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <Music className="w-12 h-12 md:w-16 md:h-16 text-purple-600 mx-auto mb-2" />
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-gray-900">{config.drummer.title}</h1>
          <p className="text-xs md:text-base text-gray-600">
            {config.drummer.description}
          </p>
        </div>

        {/* Embedded Drummer */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '800px' }}>
          <iframe
            src="https://4four.io/drummer"
            className="w-full h-full border-0"
            style={{ minHeight: '800px' }}
            title="4Four Drummer"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
