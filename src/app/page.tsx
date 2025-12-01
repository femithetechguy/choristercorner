import Link from 'next/link';
import { Music, BookOpen, Clock, Drum } from 'lucide-react';
import SongCard from '@/components/SongCard';
import HymnCard from '@/components/HymnCard';
import StatBox from '@/components/StatBox';
import songs from '@/data/songs.json';
import hymns from '@/data/hymns.json';

export default function Home() {
  // Show first 3 songs and hymns instead of featured
  const featuredSongs = songs.slice(0, 3);
  const featuredHymns = hymns.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Music className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to ChoristerCorner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A comprehensive platform for choristers and worship leaders to discover, learn, and share
            beautiful worship songs.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox icon={Music} number="48" label="Total Songs" />
          <StatBox icon={BookOpen} number="25" label="Traditional Hymns" />
          <StatBox icon="users" number="43+" label="Featured Artists" />
          <StatBox icon={Clock} number="473+" label="Minutes of Worship" />
        </div>
      </section>

      {/* Featured Songs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-2 mb-8">
          <Music className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Featured Songs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map(song => (
            <SongCard key={song.serial_number} song={song} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/songs"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            View All Songs
          </Link>
        </div>
      </section>

      {/* Featured Hymns Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Featured Traditional Hymns</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHymns.map(hymn => (
            <HymnCard key={hymn.serial_number} hymn={hymn} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/hymns"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            View All Hymns
          </Link>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center">Professional Practice Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Metronome */}
            <Link
              href="/metronome"
              className="block bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-lg hover:shadow-lg transition"
            >
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Metronome</h3>
              <p className="text-gray-600 mb-4">
                Professional metronome with BPM range from 40-300, multiple time signatures, visual
                feedback, and tap tempo feature
              </p>
              <button className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Try Metronome
              </button>
            </Link>

            {/* Drummer */}
            <Link
              href="/drummer"
              className="block bg-linear-to-br from-purple-50 to-purple-100 p-8 rounded-lg hover:shadow-lg transition"
            >
              <Drum className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Drum Machine</h3>
              <p className="text-gray-600 mb-4">
                Interactive drum patterns for worship practice with multiple styles, customizable
                rhythms, loop control, and volume adjustments
              </p>
              <button className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                Try Drummer
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
