'use client';

import Link from 'next/link';
import { Music, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/songs', label: 'Songs' },
    { href: '/hymns', label: 'Hymns' },
    { href: '/metronome', label: 'Metronome' },
    { href: '/drummer', label: 'Drummer' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/extras', label: 'Extras' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-bold text-lg text-gray-900">ChoristerCorner</div>
              <div className="text-xs text-gray-500">1.1.26</div>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t animate-slide-down">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-2 py-2 rounded hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
