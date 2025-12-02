'use client';

import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Hymn } from '@/types';
import Image from 'next/image';
import hymns from '@/data/hymns.json';

interface HymnSearchProps {
  onSelect: (hymn: Hymn) => void;
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

export default function HymnSearch({ onSelect, onClose }: HymnSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const allHymns = (hymns as Hymn[]);

  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = new Set(allHymns.map(h => h.category));
    return ['All Categories', ...Array.from(allCategories).sort()];
  }, []);

  // Filter hymns based on search query and category
  const results = useMemo(() => {
    return allHymns.filter(hymn => {
      const matchesSearch =
        !query.trim() ||
        hymn.title.toLowerCase().includes(query.toLowerCase()) ||
        hymn.author.toLowerCase().includes(query.toLowerCase()) ||
        hymn.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || hymn.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [query, selectedCategory]);

  const handleHymnSelect = (hymn: Hymn) => {
    onSelect(hymn);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-auto">
      <div className="bg-gray-900 rounded-t-lg md:rounded-lg shadow-2xl border-t-2 md:border-2 border-purple-500 pointer-events-auto w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-3 md:p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 md:w-5 h-4 md:h-5 text-gray-400 flex-shrink-0" />
            <h3 className="text-white font-semibold text-sm md:text-base truncate">Find Next Hymn</h3>
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
              placeholder="Search by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm md:text-base rounded px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>

          {/* Category Filter and Count - Stack on mobile, grid on desktop */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white text-sm md:text-base rounded px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="text-xs md:text-sm text-gray-300 md:text-right">
              Showing <span className="font-semibold text-purple-400">{results.length}</span> of <span className="font-semibold text-purple-400">{allHymns.length}</span> hymns
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-1 md:space-y-2 p-3 md:p-4">
              {results.map((hymn) => (
                <button
                  key={hymn.serial_number}
                  onClick={() => handleHymnSelect(hymn)}
                  className="w-full flex gap-2 md:gap-3 p-2 md:p-3 bg-gray-800 hover:bg-purple-600 active:bg-purple-700 rounded transition-colors text-left"
                >
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                    <Image
                      src={getYouTubeThumbnail(hymn.url)}
                      alt={hymn.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs md:text-sm truncate">{hymn.title}</p>
                    <p className="text-gray-400 text-xs truncate">{hymn.author} • {hymn.category}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() || selectedCategory !== 'All Categories' ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm md:text-base">
              <p>No hymns found</p>
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
