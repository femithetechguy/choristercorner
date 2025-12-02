'use client';

import { useRef, useState } from 'react';
import { X, Search } from 'lucide-react';
import { Song, Hymn } from '@/types';
import { usePlayer } from '@/context/PlayerContext';

type MediaItem = Song | Hymn;

interface MediaPlayerProps {
  media: MediaItem;
  onClose: () => void;
  SearchComponent: React.ComponentType<{ onSelect: (item: MediaItem) => void; onClose: () => void }>;
}

function getYouTubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
  } catch {
    return '';
  }
}

function getLyricsText(media: MediaItem): string {
  if (!media.lyrics) return '';
  if (Array.isArray(media.lyrics)) {
    return media.lyrics.join('\n');
  }
  return String(media.lyrics);
}

function getMediaTitle(media: MediaItem): string {
  if ('channel' in media) return (media as Song).channel;
  if ('author' in media) return (media as Hymn).author;
  return '';
}

export default function MediaPlayer({ media, onClose, SearchComponent }: MediaPlayerProps) {
  const { play } = usePlayer();
  const [showSearch, setShowSearch] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = getYouTubeVideoId(media.url);
  const lyricsText = getLyricsText(media);
  const mediaCreator = getMediaTitle(media);

  const handleMediaSelect = (newMedia: MediaItem) => {
    play(newMedia);
    setShowSearch(false);
  };

  if (!videoId) {
    return (
      <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg">
          Invalid media URL
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - centered vertically and horizontally */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-none overflow-hidden">
        <div className="bg-gray-900 rounded-lg shadow-2xl border-2 border-purple-500 w-[calc(100vw-1rem)] md:w-full max-w-6xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b-2 border-purple-500 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-sm md:text-lg truncate">{media.title}</h2>
              <p className="text-xs md:text-sm text-gray-400 truncate mt-1">{getMediaTitle(media)}</p>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-purple-500/20 rounded transition-colors flex-shrink-0"
                title="Search"
              >
                <Search className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                title="Close"
              >
                <X className="w-4 md:w-5 h-4 md:h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex min-h-0 flex-col md:flex-row">
            {/* Lyrics */}
              <div className="w-full md:w-2/3 bg-white overflow-y-auto order-2 md:order-1 flex flex-col">
                <div className="p-3 md:p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 flex items-center gap-2">
                    <span className="text-purple-600">🎵</span> Lyrics
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0">
                  <div className="bg-white rounded-lg shadow p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
                    {Array.isArray(media.lyrics) && media.lyrics.length > 0 ? (
                      media.lyrics.map((verse, idx) => {
                        // Detect section tag (e.g., "Verse 1:", "Chorus:", "Pre-chorus:", "Bridge:", etc.)
                        const match = verse.match(/^([A-Za-z0-9\s\-]+:)(.*)$/s);
                        if (match) {
                          return (
                            <div key={idx}>
                              <p className="text-sm md:text-base font-bold text-purple-600 mb-2 md:mb-3 bg-purple-50 px-2 md:px-3 py-1 md:py-2 rounded inline-block">
                                {match[1]}
                              </p>
                              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium text-gray-800">
                                {match[2].trim()}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium text-gray-800">
                            {verse}
                          </p>
                        );
                      })
                    ) : (
                      <div className="text-gray-500 text-lg">No lyrics available</div>
                    )}
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <p className="text-xs text-gray-600">Click search to find next {'channel' in media ? 'song' : 'hymn'}</p>
                </div>
              </div>

            {/* Video Player */}
            <div className="w-full md:w-1/3 bg-black order-1 md:order-2 md:flex-1">
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?fs=0&modestbranding=1&rel=0&iv_load_policy=3&controls=1&autoplay=0`}
                title={media.title}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                className="w-full h-48 md:h-full"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <SearchComponent
          onSelect={handleMediaSelect}
          onClose={() => setShowSearch(false)}
        />
      )}
    </>
  );
}
