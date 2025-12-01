import Link from 'next/link';
import { Music, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-bold text-lg">ChoristerCorner</div>
              <div className="text-xs text-gray-500">1.1.26</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition">
              Home
            </Link>
            <Link href="/songs" className="text-gray-700 hover:text-purple-600 transition">
              Songs
            </Link>
            <Link href="/hymns" className="text-gray-700 hover:text-purple-600 transition">
              Hymns
            </Link>
            <Link href="/metronome" className="text-gray-700 hover:text-purple-600 transition">
              Metronome
            </Link>
            <Link href="/drummer" className="text-gray-700 hover:text-purple-600 transition">
              Drummer
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">
              Contact
            </Link>
            <Link href="/extras" className="text-gray-700 hover:text-purple-600 transition">
              Extras
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}
