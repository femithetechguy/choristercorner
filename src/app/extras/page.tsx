import { Sparkles, Music, BookOpen, Mic, FileText, Headphones } from 'lucide-react';

export default function ExtrasPage() {
  const tools = [
    {
      id: 1,
      title: 'Chosic Playlist Generator',
      description: 'A tool for generating music playlists based on various parameters and preferences.',
      tags: ['playlist', 'music', 'generator', 'tool'],
      icon: Music,
      url: 'https://www.chosic.com/spotify-playlist-generator/',
    },
    {
      id: 2,
      title: 'GCC Hymns Library',
      description: 'A searchable library of hymns from GCC San Antonio.',
      tags: ['hymns', 'library', 'search', 'music'],
      icon: BookOpen,
      url: 'https://www.gcc-sa.org/hymns/',
    },
    {
      id: 3,
      title: 'AZLyrics',
      description: 'Search for song lyrics from a vast database of artists and tracks.',
      tags: ['lyrics', 'search', 'music', 'database'],
      icon: Mic,
      url: 'https://www.azlyrics.com/',
    },
    {
      id: 4,
      title: 'CCLI SongSelect',
      description: 'Licensed song resources, lyrics, chords, and lead sheets for worship teams and churches.',
      tags: ['lyrics', 'chords', 'worship', 'licenses', 'CCLI'],
      icon: FileText,
      url: 'https://www.ccli.com/songselect',
    },
    {
      id: 5,
      title: 'MultiTracks Discovery',
      description: 'Platform for multitrack backing tracks, stems, charts, and rehearsal tools for worship and live performance.',
      tags: ['multitrack', 'stems', 'backing tracks', 'charts', 'worship', 'live'],
      icon: Headphones,
      url: 'https://www.multitracksmusic.com/discover',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Extras & Resources</h1>
          <p className="text-gray-600">
            Discover additional tools and resources to enhance your worship experience
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map(tool => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
                <IconComponent className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map(tag => (
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
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Open Tool
                </a>
              </div>
            );
          })}
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
