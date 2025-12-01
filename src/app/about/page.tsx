import { Clock, Drum, Wrench, BookOpen, Users, Music, Target, Eye, Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Music className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">About ChoristerCorner</h1>
          <p className="text-xl text-gray-600">A comprehensive platform for choristers and worship leaders</p>
          <p className="text-purple-600 font-semibold mt-2">Version 1.0.0</p>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Target className="w-10 h-10 text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower worship leaders and choristers with easy access to quality worship songs,
              complete with lyrics, multimedia resources, and practice tools. We believe that worship
              is central to Christian life, and having the right tools makes all the difference in
              leading others into God&apos;s presence.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Eye className="w-10 h-10 text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the go-to platform for worship teams worldwide, providing not just songs and
              lyrics, but also professional practice tools, resources for training, community
              building, and spiritual growth in worship ministry.
            </p>
          </div>
        </div>

        {/* Professional Practice Tools */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Wrench className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold">Professional Practice Tools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Metronome */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-8">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">Metronome</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Professional metronome with BPM range from 40-300</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Multiple time signatures for various musical styles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Visual feedback and tap tempo feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Mobile friendly interface</span>
                </li>
              </ul>
            </div>

            {/* Drummer */}
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-8">
              <Drum className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">Drum Machine</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Interactive drum patterns for worship practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Multiple styles and customizable rhythms</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Loop control and volume management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Layer sounds for complex patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Content Library */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold">Content Library</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">48 Worship Songs</h3>
              <p className="text-gray-600 mb-4">
                A carefully curated collection of modern worship songs from renowned artists and
                worship leaders. Each song includes links to official videos, artist information,
                and duration details.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">25 Traditional Hymns</h3>
              <p className="text-gray-600 mb-4">
                Timeless hymns from Christian history, organized by category (Grace, Strength,
                Faith, etc.). Includes lyrics, author information, and categorization for easy
                discovery.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="bg-linear-to-r from-purple-100 to-blue-100 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Music className="w-5 h-5 inline mr-2 text-purple-600" />
              <h3 className="font-bold mb-2 inline">Choir Collaboration</h3>
              <p className="text-gray-700 text-sm">Collaborate with other singers and share arrangements</p>
            </div>
            <div>
              <Music className="w-5 h-5 inline mr-2 text-purple-600" />
              <h3 className="font-bold mb-2 inline">Performance Analytics</h3>
              <p className="text-gray-700 text-sm">Track your practice sessions and progress</p>
            </div>
            <div>
              <Music className="w-5 h-5 inline mr-2 text-purple-600" />
              <h3 className="font-bold mb-2 inline">Learning Resources</h3>
              <p className="text-gray-700 text-sm">Video tutorials and educational content</p>
            </div>
            <div>
              <Users className="w-5 h-5 inline mr-2 text-purple-600" />
              <h3 className="font-bold mb-2 inline">Community Forum</h3>
              <p className="text-gray-700 text-sm">Connect with other worship leaders and choristers</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
