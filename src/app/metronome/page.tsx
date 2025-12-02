'use client';

import { Metadata } from 'next';
import { Clock } from 'lucide-react';
import appConfig from '@/data/app.json';

export const generateMetadata = (): Metadata => ({
  title: 'Metronome - ChoristerCorner | Free Online Metronome Tool',
  description:
    'Use our free online metronome to practice singing, instrument playing, and improve your tempo control. Perfect for choristers and musicians of all levels.',
  keywords: ['metronome', 'tempo practice', 'music practice tools', 'rhythm training'],
  openGraph: {
    title: 'Metronome - ChoristerCorner',
    description: 'Practice with a free online metronome tool.',
    type: 'website',
    url: 'https://choristercorner.com/metronome',
  },
  alternates: {
    canonical: 'https://choristercorner.com/metronome',
  },
});

export default function MetronomePage() {
  const config = appConfig as any;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <Clock className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-gray-900">{config.metronome.title}</h1>
          <p className="text-xs md:text-base text-gray-600">
            {config.metronome.description}
          </p>
        </div>

        {/* Embedded Metronome */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '800px' }}>
          <iframe
            src="https://4four.io/embed/metronome/1AvAyAXgAAQcAAA"
            className="w-full h-full border-0"
            style={{ minHeight: '800px' }}
            title="4Four Metronome"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
