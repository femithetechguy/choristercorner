'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [playerHeight, setPlayerHeight] = useState(70); // percentage of viewport height
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset height when new song loads
  useEffect(() => {
    if (currentSong) {
      console.log('✅ VideoPlayer: Song loaded -', currentSong.title);
      setPlayerHeight(70); // Default to 70% of screen
    }
  }, [currentSong]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartY.current = clientY;
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const deltaY = clientY - dragStartY.current;
    const newHeight = Math.max(20, Math.min(95, playerHeight + (deltaY / window.innerHeight) * 100));
    setPlayerHeight(newHeight);
    dragStartY.current = clientY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, playerHeight]);

  if (!currentSong) {
    return null;
  }

  const videoId = getYouTubeVideoId(currentSong.url);

  if (!videoId) {
    console.warn('⚠️ VideoPlayer: No video ID found for URL:', currentSong.url);
    return null;
  }

  // Desktop: Modal overlay - NO BLUR, allow scrolling
  const desktopPlayer = (
    <>
      {/* Hidden video iframe - Always playing in background to keep audio going */}
      <div className="hidden md:fixed md:bottom-0 md:right-0 md:-z-50 md:w-0 md:h-0 md:overflow-hidden">
        <iframe
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&fs=0`}
          title={currentSong.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="border-0"
        />
      </div>

      {/* Expanded view - Modal overlay */}
      {!isMinimized && (
        <div className="hidden md:fixed md:inset-0 md:z-50 md:bg-black/30 md:flex md:items-center md:justify-center md:p-4 md:pointer-events-none md:overflow-hidden">
          {/* Modal card - 90% width - pointer-events-auto to enable interaction */}
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col border-2 border-purple-500 pointer-events-auto" style={{ maxHeight: '90vh', width: '90vw' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-white truncate">{currentSong.title}</h2>
                <p className="text-sm md:text-base text-gray-400 truncate">{currentSong.channel}</p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-purple-500/20 rounded transition-colors"
                  aria-label="Minimize player"
                >
                  <ChevronDown className="w-5 h-5 text-purple-400" />
                </button>
                <button
                  onClick={close}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                  aria-label="Close player"
                >
                  <X className="w-6 h-6 text-red-400" />
                </button>
              </div>
            </div>

            {/* Content: Lyrics take priority (left/main) + Video smaller (right) */}
            <div className="flex-1 overflow-hidden flex gap-4 p-4 min-h-0">
              {/* Lyrics section - 2/3 width, BIGGER FONT */}
              <div className="flex-1 bg-white rounded-lg overflow-hidden flex flex-col border border-gray-200 min-h-0">
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                  <h3 className="font-semibold text-base md:text-lg text-gray-900">Lyrics</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
                    currentSong.lyrics.map((verse, idx) => (
                      <div key={idx} className="text-base md:text-lg text-gray-900 mb-6 whitespace-pre-wrap leading-relaxed font-medium">
                        {verse}
                      </div>
                    ))
                  ) : (
                    <p className="text-base md:text-lg text-gray-500 text-center">No lyrics available</p>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <p className="text-xs text-gray-600">Scroll through lyrics while enjoying the music</p>
                </div>
              </div>

              {/* Video section - 1/3 width, smaller */}
              <div className="w-1/3 flex flex-col min-h-0">
                <div className="flex-1 bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&fs=0`}
                    title={currentSong.title}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized bar - Fixed at bottom of page - Keep playing */}
      {isMinimized && (
        <div className="md:fixed md:bottom-0 md:left-0 md:right-0 md:z-50 md:bg-gradient-to-r md:from-purple-900 md:to-purple-800 md:text-white md:shadow-2xl md:border-t-2 md:border-purple-500 hidden md:flex">
          <div className="flex items-center justify-between p-2 max-w-full gap-3 w-full">
            {/* Video player - keeps playing */}
            <div className="w-16 h-10 bg-black rounded flex-shrink-0 overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&fs=0`}
                title={currentSong.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="border-0"
              />
            </div>
            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-300 truncate">{currentSong.channel}</p>
            </div>
            {/* Controls */}
            <div className="flex gap-2 ml-auto flex-shrink-0">
              <button
                onClick={toggleMinimize}
                className="p-2 hover:bg-purple-600 rounded transition-colors"
                aria-label="Expand player"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={close}
                className="p-2 hover:bg-red-500/20 rounded transition-colors"
                aria-label="Close player"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Mobile: Bottom drawer with drag handle
  const mobilePlayer = (
    <div
      ref={containerRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black flex flex-col rounded-t-2xl shadow-2xl overflow-hidden border-t-2 border-purple-500 transition-all duration-200"
      style={{ height: `${playerHeight}vh`, cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Drag Handle */}
      <div
        className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-400 cursor-grab active:cursor-grabbing hover:from-purple-400 hover:to-purple-300"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      />

      {isMinimized ? (
        // Minimized bar
        <div
          className="flex items-center justify-between p-3 bg-purple-900 text-white cursor-grab active:cursor-grabbing hover:bg-purple-800 transition-colors"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-300 truncate">{currentSong.channel}</p>
          </div>
          <button
            onClick={toggleMinimize}
            className="ml-2 p-1.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors flex-shrink-0"
            aria-label="Expand player"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Expanded view
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-purple-800 bg-gray-800 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{currentSong.title}</h2>
              <p className="text-xs text-gray-400 truncate">{currentSong.channel}</p>
            </div>
            <div className="flex gap-1 ml-2 flex-shrink-0">
              <button
                onClick={toggleMinimize}
                className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                aria-label="Minimize player"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                onClick={close}
                className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                aria-label="Close player"
              >
                <X className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>

          {/* Video */}
          <div className="flex-1 bg-black min-h-0 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&fs=0`}
              title={currentSong.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="border-0"
            />
          </div>

          {/* Lyrics */}
          <div className="flex-1 bg-white text-gray-900 overflow-hidden flex flex-col min-h-0">
            <div className="p-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-semibold text-xs">Lyrics</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 min-h-0">
              {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
                currentSong.lyrics.map((verse, idx) => (
                  <div key={idx} className="text-xs mb-2 whitespace-pre-wrap leading-relaxed">
                    {verse}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center">No lyrics available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {desktopPlayer}
      {mobilePlayer}
    </>
  );
}
