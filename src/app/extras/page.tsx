import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import appConfig from '@/data/app.json';
import extrasData from '@/data/extras.json';

export const metadata: Metadata = {
  title: 'Extras & Resources - ChoristerCorner | Worship & Music Tools',
  description:
    'Discover additional music resources, worship tools, and external links to enhance your worship practice. Including hymn resources, multitracks, and worship materials.',
  keywords: ['music resources', 'worship tools', 'worship resources', 'music links', 'choir resources'],
  openGraph: {
    title: 'Extras & Resources - ChoristerCorner',
    description: 'Explore additional worship and music resources.',
    type: 'website',
    url: 'https://choristercorner.com/extras',
  },
  alternates: {
    canonical: 'https://choristercorner.com/extras',
  },
};

const iconMap: { [key: string]: string } = {
  Music: '♪',
  Hymns: '📖',
  Lyrics: '🎤',
  'Worship Resources': '📄',
  Multitracks: '🎧',
};

export default function ExtrasPage() {
  const config = appConfig as any;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{config.extras.header.title}</h1>
          <p className="text-gray-600">
            {config.extras.header.description}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(extrasData as any).external_tools.map((tool: any, index: number) => (
            <div key={index} className="card-animated bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-4">{iconMap[tool.category] || '🔗'}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Visit Resource →
              </a>
            </div>
          ))}
        </div>

        {/* Featured Resources */}
        <section className="mt-16 bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold mb-8">📚 Recommended Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Learning Resources</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Worship music theory and fundamentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Vocal techniques for singers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Chord progressions and arrangements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Rhythm and timing exercises</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Community Resources</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Connect with other worship leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Share arrangements and ideas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Collaborate on musical projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">▸</span>
                  <span>Access exclusive content and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
