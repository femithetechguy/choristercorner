'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

function getYouTubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
  } catch {
    return '';
  }
}

export default function VideoPlayer() {
  const { currentSong, isMinimized, toggleMinimize, close } = usePlayer();
  const [showLyrics, setShowLyrics] = useState(true);

  if (!currentSong) {
    return null;
  }

  const videoId = getYouTubeVideoId(currentSong.url);

  return (
    <>
      {/* Persistent Minimized Bar Container - always in DOM */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
          isMinimized ? 'opacity-100 visible animate-slide-up' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex gap-4 p-2">
          {/* Small video player */}
          <div className="w-32 h-20 rounded overflow-hidden bg-black shrink-0">
            {videoId && (
              <iframe
                key={`minimized-${videoId}`}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={currentSong.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs text-gray-600 truncate">{currentSong.channel}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleMinimize}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Expand"
            >
              <ChevronUp size={18} className="text-purple-600" />
            </button>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Close"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Expanded Player Container - always in DOM */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex flex-col shadow-2xl md:max-h-[65vh] md:bottom-20 md:left-1/2 md:-translate-x-1/2 md:w-11/12 md:max-w-7xl md:rounded-lg md:border-t-0 md:border transition-all duration-300 ${
          isMinimized ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible animate-scale-in'
        } max-h-[70vh] md:max-h-[65vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              Now Playing
            </h2>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <button
              onClick={toggleMinimize}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Minimize"
            >
              <ChevronDown size={20} className="text-purple-600" />
            </button>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Close"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content - Vertical on Mobile, 50/50 Split on Desktop */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Video Section */}
          <div className="flex flex-col items-center justify-center p-4 md:p-8 md:flex-1 md:h-full">
            <div className="w-full max-w-sm md:max-w-lg aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
              {videoId && (
                <iframe
                  key={`video-${videoId}`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={currentSong.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
            </div>

            <h1 className="text-base md:text-xl font-bold text-gray-900 mt-4 md:mt-6 text-center line-clamp-2">
              {currentSong.title}
            </h1>
            <p className="text-xs md:text-base text-gray-600 mt-2 text-center line-clamp-1">{currentSong.channel}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{currentSong.duration}</p>
          </div>

          {/* Lyrics Section - Below Video on Mobile, Right Half on Desktop */}
          <div className="flex-1 border-t md:border-t-0 md:border-l flex flex-col bg-gray-50 overflow-hidden md:h-full">
            {showLyrics ? (
              <>
                <div className="px-4 md:px-6 py-3 md:py-4 border-b bg-white shrink-0">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">Lyrics</h3>
                </div>
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
                  {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
                    currentSong.lyrics.map((verse, idx) => (
                      <div
                        key={idx}
                        className="text-sm md:text-base text-gray-800 mb-6 md:mb-8 whitespace-pre-wrap leading-relaxed font-medium"
                      >
                        {verse}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm md:text-base text-gray-500 text-center mt-12">
                      No lyrics available
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowLyrics(false)}
                  className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-500 hover:text-gray-700 transition border-t bg-white shrink-0"
                >
                  Hide Lyrics
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => setShowLyrics(true)}
                  className="text-sm md:text-base text-purple-600 hover:text-purple-700 transition font-semibold px-4 md:px-6 py-2 md:py-3 bg-white rounded border border-purple-200 hover:border-purple-400"
                >
                  Show Lyrics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
