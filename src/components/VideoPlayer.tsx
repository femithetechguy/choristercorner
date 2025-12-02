'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/types';
import SongSearch from './SongSearch';

function getYouTubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
  } catch {
    return '';
  }
}

const useSearchSongs = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const allSongs = (songs as Song[]);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    
    const lower = q.toLowerCase();
    const filtered = allSongs.filter(
      song =>
        song.title.toLowerCase().includes(lower) ||
        song.channel.toLowerCase().includes(lower)
    );
    setResults(filtered);
  };

  return { query, results, search, setQuery };
};

export default function VideoPlayer() {
  const { currentSong, close, play } = usePlayer();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (currentSong) {
      console.log('✅ VideoPlayer: Song loaded -', currentSong.title);
    }
  }, [currentSong]);

  if (!currentSong) {
    return null;
  }

  const videoId = getYouTubeVideoId(currentSong.url);

  if (!videoId) {
    console.warn('⚠️ VideoPlayer: No video ID found for URL:', currentSong.url);
    return null;
  }

  const handleSongSelect = (song: Song) => {
    play(song);
    setShowSearch(false);
  };

  return (
    <div className="hidden md:fixed md:inset-0 md:z-50 md:bg-black/30 md:flex md:items-center md:justify-center md:p-4 md:pointer-events-none md:overflow-hidden">
      {/* Modal card - Always open */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col border-2 border-purple-500 pointer-events-auto relative" style={{ maxHeight: '90vh', width: '90vw' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg md:text-2xl font-bold text-white truncate">{currentSong.title}</h2>
            <p className="text-sm md:text-base text-gray-400 truncate">{currentSong.channel}</p>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-purple-500/20 rounded transition-colors"
              aria-label="Search songs"
            >
              <Search className="w-5 h-5 text-white" />
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

        {/* Content: Lyrics (left 2/3) + Video (right 1/3) */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Lyrics section - 2/3 width */}
          <div className="w-2/3 bg-white flex flex-col border-r border-gray-200 min-h-0">
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
              <p className="text-xs text-gray-600">Click search to find next song</p>
            </div>
          </div>

          {/* Video section - 1/3 width - Iframe with YouTube player */}
          <div className="w-1/3 bg-black flex-shrink-0 relative overflow-hidden">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&fs=0`}
              title={currentSong.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="border-0"
            />
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && <SongSearch onSelect={handleSongSelect} onClose={() => setShowSearch(false)} />}
    </div>
  );
}
