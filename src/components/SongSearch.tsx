'use client';

import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Song } from '@/types';
import Image from 'next/image';
import songs from '@/data/songs.json';

interface SongSearchProps {
  onSelect: (song: Song) => void;
  onClose: () => void;
}

function getYouTubeThumbnail(url: string): string {
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
    if (!videoId) return '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch {
    return '';
  }
}

export default function SongSearch({ onSelect, onClose }: SongSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const allSongs = (songs as Song[]);

  // Get unique channels
  const channels = useMemo(() => {
    const allChannels = new Set(allSongs.map(s => s.channel));
    return ['All Channels', ...Array.from(allChannels).sort()];
  }, []);

  // Filter songs based on search query and channel
  const results = useMemo(() => {
    return allSongs.filter(song => {
      const matchesSearch =
        !query.trim() ||
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.channel.toLowerCase().includes(query.toLowerCase());
      
      const matchesChannel = selectedChannel === 'All Channels' || song.channel === selectedChannel;
      
      return matchesSearch && matchesChannel;
    });
  }, [query, selectedChannel]);

  const handleSongSelect = (song: Song) => {
    onSelect(song);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-3 md:p-4 pointer-events-auto overflow-hidden">
      <div className="bg-gray-900 rounded-t-lg md:rounded-lg shadow-2xl border-t-2 md:border-2 border-purple-500 pointer-events-auto w-[calc(100%-1.5rem)] md:max-w-2xl max-h-[85vh] md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 md:p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 md:w-5 h-4 md:h-5 text-gray-400 flex-shrink-0" />
            <h3 className="text-white font-semibold text-sm md:text-base truncate">Find Next Song</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 rounded transition-colors flex-shrink-0 ml-2"
            aria-label="Close search"
          >
            <X className="w-4 md:w-5 h-4 md:h-5 text-red-400" />
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="p-3 md:p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0 space-y-2 md:space-y-3">
          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search by title or channel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm md:text-base rounded px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>

          {/* Channel Filter and Count - Stack on mobile, grid on desktop */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-3">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-gray-700 text-white text-sm md:text-base rounded px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
            <div className="text-xs md:text-sm text-gray-300 md:text-right">
              Showing <span className="font-semibold text-purple-400">{results.length}</span> of <span className="font-semibold text-purple-400">{allSongs.length}</span> songs
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-1 md:space-y-2 p-3 md:p-4">
              {results.map((song) => (
                <button
                  key={song.serial_number}
                  onClick={() => handleSongSelect(song)}
                  className="w-full flex gap-2 md:gap-3 p-2 md:p-3 bg-gray-800 hover:bg-purple-600 active:bg-purple-700 rounded transition-colors text-left"
                >
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                    <Image
                      src={getYouTubeThumbnail(song.url)}
                      alt={song.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs md:text-sm truncate">{song.title}</p>
                    <p className="text-gray-400 text-xs truncate">{song.channel}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() || selectedChannel !== 'All Channels' ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm md:text-base">
              <p>No songs found</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm md:text-base">
              <p>Start typing to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
