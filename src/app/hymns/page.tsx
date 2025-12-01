'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Grid3X3, List } from 'lucide-react';
import HymnCard from '@/components/HymnCard';
import hymns from '@/data/hymns.json';

export default function HymnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const authors = useMemo(() => {
    const allAuthors = new Set(hymns.map(h => h.author));
    return ['All Authors', ...Array.from(allAuthors)];
  }, []);

  const filteredHymns = useMemo(() => {
    return hymns.filter(hymn => {
      const matchesSearch =
        hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hymn.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAuthor = selectedAuthor === 'All Authors' || hymn.author === selectedAuthor;
      return matchesSearch && matchesAuthor;
    });
  }, [searchQuery, selectedAuthor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Hymns Collection</h1>
          </div>
          <p className="text-gray-600">Browse our collection of {hymns.length} traditional hymns</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search hymns by title, author, number, or lyrics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedAuthor}
              onChange={e => setSelectedAuthor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {authors.map(author => (
                <option key={author} value={author}>
                  {author}
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
          <p className="text-sm text-gray-600 mt-4">Showing {filteredHymns.length} of {hymns.length} hymns</p>
        </div>

        {/* Hymns Grid/List */}
        {filteredHymns.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHymns.map(hymn => (
                <HymnCard key={hymn.serial_number} hymn={hymn} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHymns.map(hymn => (
                <HymnCard key={hymn.serial_number} hymn={hymn} variant="list" />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hymns found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
