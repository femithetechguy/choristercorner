'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Grid3X3, List } from 'lucide-react';
import HymnCard from '@/components/HymnCard';
import hymns from '@/data/hymns.json';
import appConfig from '@/data/app.json';
import { Hymn } from '@/types';

export default function HymnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const config = appConfig as any;

  const authors = useMemo(() => {
    const allAuthors = new Set((hymns as Hymn[]).map(h => h.author));
    return [config.hymns.allAuthorsText, ...Array.from(allAuthors)];
  }, [config.hymns.allAuthorsText]);

  const categories = useMemo(() => {
    const allCategories = new Set((hymns as Hymn[]).map(h => h.category));
    return [config.hymns.allCategoriesText, ...Array.from(allCategories)];
  }, [config.hymns.allCategoriesText]);

  const filteredHymns = useMemo(() => {
    return (hymns as Hymn[]).filter(hymn => {
      const matchesSearch =
        hymn.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hymn.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAuthor = selectedAuthor === config.hymns.allAuthorsText || hymn.author === selectedAuthor;
      const matchesCategory = selectedCategory === config.hymns.allCategoriesText || hymn.category === selectedCategory;
      return matchesSearch && matchesAuthor && matchesCategory;
    });
  }, [searchQuery, selectedAuthor, selectedCategory, config.hymns.allAuthorsText, config.hymns.allCategoriesText]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">{config.hymns.title}</h1>
          </div>
          <p className="text-gray-600">Browse our collection of {hymns.length} {config.hymns.resultsText}</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder={config.hymns.searchPlaceholder}
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
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
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

      {/* Back to Top Button removed - now in LayoutClient */}
    </div>
  );
}
