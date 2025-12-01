'use client';

import { Drum } from 'lucide-react';

export default function DrummerPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <Drum className="w-12 h-12 md:w-16 md:h-16 text-purple-600 mx-auto mb-2" />
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-gray-900">Drum Machine</h1>
          <p className="text-xs md:text-base text-gray-600">
            Practice with professional drum patterns and rhythms. Perfect for worship teams, choir
            practice, and personal rhythm training.
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
