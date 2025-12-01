'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { PlayerProvider } from '@/context/PlayerContext';
import VideoPlayer from '@/components/VideoPlayer';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PlayerProvider>
      {children}
      <VideoPlayer />

      {/* Back to Top Button - only render on client after mount */}
      {isMounted && showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 animate-fade-in z-40"
          title="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </PlayerProvider>
  );
}
