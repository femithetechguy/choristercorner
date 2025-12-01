'use client';

import { useState, useMemo } from 'react';
import { Music, Grid3X3, List } from 'lucide-react';
import SongCard from '@/components/SongCard';
import songs from '@/data/songs.json';
import { Song } from '@/types';

export default function SongsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const channels = useMemo(() => {
    const allChannels = new Set((songs as Song[]).map(s => s.channel));
    return ['All Channels', ...Array.from(allChannels)];
  }, []);

  const filteredSongs = useMemo(() => {
    return (songs as Song[]).filter(song => {
      const matchesSearch =
        song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.channel?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChannel = selectedChannel === 'All Channels' || song.channel === selectedChannel;
      return matchesSearch && matchesChannel;
    });
  }, [searchQuery, selectedChannel]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Songs Library</h1>
          </div>
          <p className="text-gray-600">Explore our collection of {songs.length} worship songs</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search songs by title, artist, or lyrics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Showing {filteredSongs.length} of {songs.length} songs</p>
        </div>

        {/* Songs Grid/List */}
        {filteredSongs.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map(song => (
                <SongCard key={song.serial_number} song={song} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSongs.map(song => (
                <SongCard key={song.serial_number} song={song} variant="list" />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No songs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
