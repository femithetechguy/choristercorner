'use client';

import Image from 'next/image';
import { Hymn } from '@/types';
import { Play, Copy, ExternalLink } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

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
  const { play } = usePlayer();
  const thumbnailUrl = getYouTubeThumbnail(hymn.url);

  if (variant === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-white">
        <div className="shrink-0 relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={hymn.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-900">{hymn.title}</h3>
          <p className="text-xs text-gray-600">{hymn.author} ({hymn.year})</p>
          <p className="text-xs text-purple-600 mt-1">{hymn.category} • {hymn.duration}</p>
          <p className="text-xs text-gray-600 mt-1">{hymn.channel}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => play(hymn as any)}
              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition flex items-center gap-1"
            >
              <Play size={12} className="fill-current" /> Play
            </button>
            <a
              href={hymn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition flex items-center gap-1"
            >
              <ExternalLink size={12} /> Watch
            </a>
            <button 
              className="p-1 border rounded hover:bg-gray-50 transition"
              title="Copy URL"
              onClick={() => navigator.clipboard.writeText(hymn.url)}
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full">
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={hymn.title}
            fill
            className="object-cover"
            unoptimized
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
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => play(hymn as any)}
            className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1"
          >
            <Play size={14} className="fill-current" /> Play
          </button>
          <a
            href={hymn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-blue-200 rounded hover:bg-blue-50 transition"
            title="Watch on YouTube"
          >
            <ExternalLink size={14} className="text-blue-600" />
          </a>
          <button 
            className="p-2 border border-purple-200 rounded hover:bg-purple-50 transition"
            title="Copy URL"
            onClick={() => navigator.clipboard.writeText(hymn.url)}
          >
            <Copy size={14} className="text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
