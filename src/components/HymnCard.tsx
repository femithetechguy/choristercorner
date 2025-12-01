'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Hymn } from '@/types';
import { Play, Copy, ExternalLink, FileText, Heart } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useState } from 'react';
import { createSlug } from '@/utils/slug';

interface HymnCardProps {
  hymn: Hymn;
  variant?: 'grid' | 'list';
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url.split('v=')[1]?.split('&')[0] || '';
  } catch {
    return '';
  }
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function HymnCard({ hymn, variant = 'grid' }: HymnCardProps) {
  const router = useRouter();
  const { play } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const thumbnailUrl = getYouTubeThumbnail(hymn.url);

  const handleCopyLink = async () => {
    const slug = createSlug(hymn.title, hymn.serial_number, 'hymn');
    const lyricsUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/lyrics/${slug}`;
    try {
      await navigator.clipboard.writeText(lyricsUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white animate-fade-in hover:scale-105 duration-300 origin-left">
        <div className="shrink-0 relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={hymn.title || 'Hymn thumbnail'}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <div>
            <h3 className="font-bold text-sm text-gray-900">{hymn.title}</h3>
            <p className="text-xs text-gray-600">{hymn.author} ({hymn.year})</p>
            <p className="text-xs text-purple-600 mt-1">{hymn.category} • {hymn.duration}</p>
            <p className="text-xs text-gray-600 mt-1">{hymn.channel}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => play(hymn as any)}
              className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              title="Play"
            >
              <Play size={14} className="fill-current" />
            </button>
            <button 
              onClick={() => router.push(`/lyrics/${createSlug(hymn.title, hymn.serial_number, 'hymn')}`)}
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Show Lyrics"
            >
              <FileText size={14} className="text-purple-600" />
            </button>
            <button 
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Copy Link"
              onClick={handleCopyLink}
            >
              <Copy size={14} className={`${copyFeedback ? 'text-green-500' : 'text-purple-600'}`} />
            </button>
            <a
              href={hymn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Open in new tab"
            >
              <ExternalLink size={14} className="text-purple-600" />
            </a>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
              title="Add to favorites"
            >
              <Heart size={14} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-purple-600'}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full animate-fade-in hover:scale-105 duration-300">
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={hymn.title || 'Hymn thumbnail'}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <Play className="w-12 h-12 text-blue-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition flex items-center justify-center">
          <button 
            onClick={() => play(hymn as any)}
            className="bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition"
          >
            <Play className="w-6 h-6 text-white fill-white" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-semibold text-purple-600">{hymn.category}</span>
            <span className="text-xs text-gray-500 ml-2">({hymn.year})</span>
          </div>
        </div>
        <h3 className="font-bold text-sm line-clamp-2 text-gray-900">{hymn.title}</h3>
        <p className="text-xs text-gray-700 mt-2">{hymn.author}</p>
        <p className="text-xs text-gray-600 mt-1">{hymn.channel}</p>
        <p className="text-xs text-gray-600 mt-1">{hymn.duration}</p>
        <div className="flex gap-2 mt-4 justify-center">
          <button 
            onClick={() => play(hymn as any)}
            className="p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            title="Play"
          >
            <Play size={16} className="fill-current" />
          </button>
          <button 
            onClick={() => router.push(`/lyrics/${createSlug(hymn.title, hymn.serial_number, 'hymn')}`)}
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Show Lyrics"
          >
            <FileText size={16} className="text-purple-600" />
          </button>
          <button 
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Copy Link"
            onClick={handleCopyLink}
          >
            <Copy size={16} className={`${copyFeedback ? 'text-green-500' : 'text-purple-600'}`} />
          </button>
          <a
            href={hymn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Open in new tab"
          >
            <ExternalLink size={16} className="text-purple-600" />
          </a>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
            title="Add to favorites"
          >
            <Heart size={16} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-purple-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
